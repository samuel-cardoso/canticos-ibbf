import { z } from 'zod';
import { canticleResponseItemSchema, canticleErrorSchema } from '../canticle.schema';

export const canticleDetailsParamsSchema = z.object({
  id: z.coerce.number().int().positive().describe('Número do cântico no catálogo.'),
});

export const canticleDetailsResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({ canticle: canticleResponseItemSchema }),
});

export { canticleErrorSchema as canticleDetailsErrorSchema };
