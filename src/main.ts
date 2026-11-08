import 'dotenv/config';
import { createServer } from './server';

async function bootstrap() {
  const server = await createServer();
  const port = Number(process.env.PORT) || 3013;
  await server.listen({ port, host: '0.0.0.0' });

  const baseUrl = `http://localhost:${port}`;
  server.log.info(`🎶 Cânticos IBBF API rodando em ${baseUrl}`);
  server.log.info(`📖 Swagger UI disponível em ${baseUrl}/docs`);
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to start API:', error);
  process.exit(1);
});
