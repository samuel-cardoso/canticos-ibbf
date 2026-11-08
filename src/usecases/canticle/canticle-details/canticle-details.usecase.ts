import { NotFoundError } from '@/shared/errors';
import type { CanticleRepositoryPort } from '@/repositories';
import type { CanticleDetailsInput } from './canticle-details.dto';

interface Dependencies {
  canticleRepository: CanticleRepositoryPort;
}

export class CanticleDetailsUseCase {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(input: CanticleDetailsInput) {
    const canticle = await this.dependencies.canticleRepository.findById(input.id);

    if (!canticle) {
      throw new NotFoundError('Cântico');
    }

    return canticle;
  }
}
