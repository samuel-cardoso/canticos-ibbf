import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createServer } from '@/server';

describe('rotas /canticles', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await createServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('lista com envelope de sucesso e paginação', async () => {
    const response = await server.inject({ method: 'GET', url: '/canticles?limit=3' });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.canticles).toHaveLength(3);
    expect(body.data.pagination).toEqual({ total: 48, page: 1, limit: 3, totalPages: 16 });
  });

  it('busca por trecho e devolve o cântico com letra', async () => {
    const response = await server.inject({ method: 'GET', url: '/canticles?search=soberano' });
    const titles = response.json().data.canticles.map((canticle: { title: string }) => canticle.title);

    expect(titles).toEqual(expect.arrayContaining(['Nosso Deus é Soberano', 'Tu és soberano']));
  });

  it('retorna um cântico pelo número', async () => {
    const response = await server.inject({ method: 'GET', url: '/canticles/1' });

    expect(response.statusCode).toBe(200);
    expect(response.json().data.canticle).toMatchObject({ id: 1, title: 'Deus cuida de mim' });
  });

  it('responde 404 com código estável para número inexistente', async () => {
    const response = await server.inject({ method: 'GET', url: '/canticles/999' });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({ success: false, code: 'NOT_FOUND' });
  });

  it('rejeita limit acima do máximo com erro de validação', async () => {
    const response = await server.inject({ method: 'GET', url: '/canticles?limit=1000' });

    expect(response.statusCode).toBe(400);
    expect(response.json().success).toBe(false);
  });
});
