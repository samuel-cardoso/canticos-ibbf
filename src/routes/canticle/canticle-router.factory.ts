import type { FastifyInstance } from 'fastify';
import { container } from '@/container';
import { canticleListQuerySchema, canticleListResponseSchema } from '@/usecases/canticle/canticle-list/canticle-list.schema';
import { canticleDetailsParamsSchema, canticleDetailsResponseSchema, canticleDetailsErrorSchema } from '@/usecases/canticle/canticle-details/canticle-details.schema';

export async function canticleRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      schema: {
        tags: ['Canticles'],
        summary: 'Lista e busca cânticos',
        description:
          'Retorna os cânticos em ordem alfabética de título. Sem `search`, lista o catálogo inteiro paginado. ' +
          'Com `search`, filtra por substring (case/acento-insensível) no título OU na letra — ' +
          'útil tanto para "achar o cântico que fala sobre X" quanto para autocomplete por título.',
        querystring: canticleListQuerySchema,
        response: { 200: canticleListResponseSchema },
      },
    },
    async (request, reply) => container.canticleListController.handle(request, reply)
  );

  server.get(
    '/:id',
    {
      schema: {
        tags: ['Canticles'],
        summary: 'Busca um cântico pelo número',
        description: '`id` é o número do cântico no catálogo (ex.: 1 = "Deus cuida de mim"), não um UUID nem um índice de array.',
        params: canticleDetailsParamsSchema,
        response: { 200: canticleDetailsResponseSchema, 404: canticleDetailsErrorSchema },
      },
    },
    async (request, reply) => container.canticleDetailsController.handle(request, reply)
  );
}
