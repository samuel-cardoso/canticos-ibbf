import { z } from 'zod';

export const canticleResponseItemSchema = z
  .object({
    id: z.number().int().positive().describe('Número sequencial do cântico no catálogo. Também serve como identificador único.'),
    title: z.string().describe('Título do cântico.'),
    lyrics: z.string().describe('Letra completa do cântico, com estrofes/refrão separados por linhas em branco, na ordem em que são cantados (o refrão se repete onde é cantado).'),
  })
  .describe('Um cântico.');

export const canticleErrorSchema = z.object({
  success: z.literal(false),
  code: z.string().describe('Código estável do erro, para tratamento programático pelo cliente.'),
  message: z.string().describe('Mensagem legível por humanos, não deve ser usada para lógica no cliente.'),
});
