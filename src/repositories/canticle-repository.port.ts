import type { Canticle } from '@/models';

export interface CanticleFilter {
  /** Busca case/acento-insensível por substring no título ou na letra. */
  search?: string;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface CanticleRepositoryPort {
  findMany(filter: CanticleFilter, pagination: Pagination): Promise<PaginatedResult<Canticle>>;
  findById(id: number): Promise<Canticle | null>;
}
