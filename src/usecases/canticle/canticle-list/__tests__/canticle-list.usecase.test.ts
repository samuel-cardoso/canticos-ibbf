import { describe, expect, it } from 'vitest';
import { InMemoryCanticleRepository } from '@/infrastructure/in-memory/in-memory-canticle.repository';
import { CanticleListUseCase } from '../canticle-list.usecase';

describe('CanticleListUseCase', () => {
  const canticleRepository = new InMemoryCanticleRepository();
  const useCase = new CanticleListUseCase({ canticleRepository });

  it('lista cânticos paginados com os defaults', async () => {
    const result = await useCase.execute({});

    expect(result.canticles).toHaveLength(20);
    expect(result.pagination).toMatchObject({ page: 1, limit: 20, total: 48, totalPages: 3 });
  });

  it('ordena por título em ordem alfabética', async () => {
    const result = await useCase.execute({ limit: 100 });
    const titles = result.canticles.map((canticle) => canticle.title);

    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'pt-BR')));
  });

  it('busca por trecho do título ignorando acento e caixa', async () => {
    const result = await useCase.execute({ search: 'LEAO DE JUDA' });

    expect(result.canticles.map((canticle) => canticle.title)).toContain('Leão de Judá');
  });

  it('busca por trecho da letra', async () => {
    const result = await useCase.execute({ search: 'posso crer no amanha' });

    expect(result.canticles.map((canticle) => canticle.title)).toContain('Porque ele vive');
  });

  it('retorna vazio quando nada casa com a busca', async () => {
    const result = await useCase.execute({ search: 'xyzxyzxyz-inexistente' });

    expect(result.canticles).toHaveLength(0);
    expect(result.pagination.total).toBe(0);
  });
});
