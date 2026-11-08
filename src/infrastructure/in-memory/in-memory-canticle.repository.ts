import canticosData from '@/data/canticos.json';
import { Canticle } from '@/models';
import { normalizeText } from '@/shared/normalize-text';
import type { CanticleFilter, CanticleRepositoryPort, Pagination, PaginatedResult } from '@/repositories/canticle-repository.port';

interface IndexedCanticle {
  canticle: Canticle;
  normalizedTitle: string;
  normalizedLyrics: string;
}

/**
 * O catálogo de cânticos é fechado (não muda em runtime), então os cânticos
 * são carregados uma vez, com um índice normalizado (sem acento/caixa) pré-computado
 * para a busca — evita normalizar a letra inteira a cada request.
 */
export class InMemoryCanticleRepository implements CanticleRepositoryPort {
  private readonly index: IndexedCanticle[];

  constructor() {
    this.index = (canticosData as { id: number; title: string; lyrics: string }[])
      .map((raw) => {
        const canticle = new Canticle(raw);
        return { canticle, normalizedTitle: normalizeText(canticle.title), normalizedLyrics: normalizeText(canticle.lyrics) };
      })
      // Cânticos não têm numeração impressa: a ordem natural de consulta é a alfabética.
      .sort((a, b) => a.canticle.title.localeCompare(b.canticle.title, 'pt-BR'));
  }

  async findMany(filter: CanticleFilter, pagination: Pagination): Promise<PaginatedResult<Canticle>> {
    const term = filter.search ? normalizeText(filter.search) : undefined;

    const filtered = term
      ? this.index.filter((entry) => entry.normalizedTitle.includes(term) || entry.normalizedLyrics.includes(term))
      : this.index;

    const start = (pagination.page - 1) * pagination.limit;
    const page = filtered.slice(start, start + pagination.limit).map((entry) => entry.canticle);

    return { data: page, total: filtered.length };
  }

  async findById(id: number): Promise<Canticle | null> {
    return this.index.find((entry) => entry.canticle.id === id)?.canticle ?? null;
  }
}
