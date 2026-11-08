# canticos-ibbf

Serviço que expõe os cânticos cantados nos cultos da IBBF (48 cânticos) para o
front da Plataforma IBBF. Fastify + TypeScript + Zod, seguindo a arquitetura descrita em
[ARCHITECTURE.md](./ARCHITECTURE.md) (mesmo padrão do `hinario-ibbf` e do
`back-plataforma-ibbf`, mas sem Prisma/Postgres — o catálogo é estático e vive em memória).

## Rodando localmente

```bash
cp .env.example .env

npm install
npm run dev    # http://localhost:3013
```

`GET /health` deve responder 200. Docs em `/docs` (Swagger UI, com todos os
endpoints, schemas, parâmetros de busca/paginação e formato de erro
documentados).

## Endpoints

- `GET /health` — health check.
- `GET /canticles` — lista paginada em ordem alfabética. Aceita `page`, `limit` e
  `search` (busca por título ou letra, case/acento-insensível).
- `GET /canticles/:id` — retorna um cântico pelo número no catálogo.

## Scripts

- `npm run dev` — servidor em modo watch
- `npm run build` / `npm start` — build de produção
- `npm run typecheck` — checagem de tipos
- `npm test` — testes (vitest)

## Atualizando o catálogo

Os cânticos vivem em `src/data/canticos.json` (`id`, `title`, `lyrics`). Diferente
dos hinos, cânticos não têm numeração impressa: o `id` foi atribuído em ordem
alfabética na primeira carga e, a partir daí, é fixo — cânticos novos recebem o
próximo número livre.

O JSON é gerado a partir dos `.pptx` de projeção (um slide de título e um slide
por estrofe, com cabeçalho "Título n/N"):

```bash
python3 scripts/extract-canticles.py "~/Desktop/Cânticos refeitos"
```

O script preserva os `id`s existentes (casando pelo título) e só usa a biblioteca
padrão do Python. Também dá para editar o JSON à mão, mantendo o mesmo formato.
