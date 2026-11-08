import type { FastifyInstance } from 'fastify';
import { container } from '@/container';
import { healthCheckResponseSchema } from '@/usecases/system/health-check/health-check.schema';

export async function systemRoutes(server: FastifyInstance) {
  server.get(
    '/health',
    {
      schema: {
        tags: ['System'],
        summary: 'Verifica a disponibilidade da API',
        description: 'Endpoint público, sem autenticação. Útil para health checks de infraestrutura (load balancer, orquestrador, uptime monitor).',
        response: { 200: healthCheckResponseSchema },
      },
    },
    async (request, reply) => container.healthCheckController.handle(reply)
  );
}
