import { describe, expect, it } from 'vitest';
import { InMemoryCanticleRepository } from '@/infrastructure/in-memory/in-memory-canticle.repository';
import { NotFoundError } from '@/shared/errors';
import { CanticleDetailsUseCase } from '../canticle-details.usecase';

describe('CanticleDetailsUseCase', () => {
  const canticleRepository = new InMemoryCanticleRepository();
  const useCase = new CanticleDetailsUseCase({ canticleRepository });

  it('retorna o cântico pelo número', async () => {
    const canticle = await useCase.execute({ id: 1 });

    expect(canticle.id).toBe(1);
    expect(canticle.title).toBe('Deus cuida de mim');
  });

  it('lança NotFoundError quando o número não existe', async () => {
    await expect(useCase.execute({ id: 999999 })).rejects.toThrow(NotFoundError);
  });
});
