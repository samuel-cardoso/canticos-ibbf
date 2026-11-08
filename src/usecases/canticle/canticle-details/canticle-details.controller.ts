import type { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CanticleDetailsUseCase } from './canticle-details.usecase';
import type { canticleDetailsParamsSchema } from './canticle-details.schema';

interface Dependencies {
  canticleDetailsUseCase: CanticleDetailsUseCase;
}

export class CanticleDetailsController {
  constructor(private readonly dependencies: Dependencies) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as z.infer<typeof canticleDetailsParamsSchema>;

    const canticle = await this.dependencies.canticleDetailsUseCase.execute(params);

    return reply.status(200).send({ success: true, data: { canticle: canticle.toJSON() } });
  }
}
