import type { CanticleRepositoryPort } from '@/repositories';
import { PAGINATION } from '@/shared/constants';
import type { CanticleListInput } from './canticle-list.dto';

interface Dependencies {
  canticleRepository: CanticleRepositoryPort;
}

export class CanticleListUseCase {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(input: CanticleListInput) {
    const page = input.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = input.limit ?? PAGINATION.DEFAULT_LIMIT;

    const result = await this.dependencies.canticleRepository.findMany({ search: input.search }, { page, limit });
    const totalPages = Math.ceil(result.total / limit);

    return { canticles: result.data, pagination: { total: result.total, page, limit, totalPages } };
  }
}
