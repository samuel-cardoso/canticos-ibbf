import { InMemoryCanticleRepository } from './infrastructure/in-memory/in-memory-canticle.repository';

import { HealthCheckUseCase } from './usecases/system/health-check/health-check.usecase';
import { HealthCheckController } from './usecases/system/health-check/health-check.controller';

import { CanticleListUseCase } from './usecases/canticle/canticle-list/canticle-list.usecase';
import { CanticleListController } from './usecases/canticle/canticle-list/canticle-list.controller';
import { CanticleDetailsUseCase } from './usecases/canticle/canticle-details/canticle-details.usecase';
import { CanticleDetailsController } from './usecases/canticle/canticle-details/canticle-details.controller';

/**
 * Sem Awilix/Prisma aqui: o único "repositório" é o catálogo de cânticos em memória,
 * então a composição manual de dependências é mais simples que um container de DI.
 */
const canticleRepository = new InMemoryCanticleRepository();

const healthCheckUseCase = new HealthCheckUseCase();
const canticleListUseCase = new CanticleListUseCase({ canticleRepository });
const canticleDetailsUseCase = new CanticleDetailsUseCase({ canticleRepository });

export const container = {
  healthCheckController: new HealthCheckController({ healthCheckUseCase }),
  canticleListController: new CanticleListController({ canticleListUseCase }),
  canticleDetailsController: new CanticleDetailsController({ canticleDetailsUseCase }),
};
