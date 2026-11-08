import type { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CanticleListUseCase } from './canticle-list.usecase';
import type { canticleListQuerySchema } from './canticle-list.schema';

interface Dependencies {
  canticleListUseCase: CanticleListUseCase;
}

export class CanticleListController {
  constructor(private readonly dependencies: Dependencies) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as z.infer<typeof canticleListQuerySchema>;

    const result = await this.dependencies.canticleListUseCase.execute(query);

    return reply.status(200).send({
      success: true,
      data: { canticles: result.canticles.map((canticle) => canticle.toJSON()), pagination: result.pagination },
    });
  }
}
