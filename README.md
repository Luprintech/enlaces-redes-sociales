# Enlaces Redes Sociales

Landing page tipo Linktree para redes sociales con mini CMS privado en `/redes`.

Incluye:

- landing publica con tema claro/oscuro
- links sociales + links de contenido
- CMS para editar perfil, links, estilos, fondos y presets
- autenticacion admin con cambio de contraseña
- tracking de clicks
- uploads locales
- SQLite persistente
- despliegue listo para Docker y Synology

## Stack

- Next.js 16
- React 19
- TypeScript
- NextAuth v5 beta
- better-sqlite3
- Tailwind CSS 4

## Desarrollo local

1. Instalá dependencias:

```bash
npm install
```

2. Creá tu archivo `.env.local` a partir de `.env.example`.

3. Ejecutá el proyecto:

```bash
npm run dev
```

4. Abrí:

- landing: `http://localhost:3000`
- panel: `http://localhost:3000/redes`

## Variables de entorno

Usá `.env.example` para desarrollo local y `.env.docker.example` para despliegue Docker.

Variables principales:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `AUTH_TRUST_HOST`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Importante:

- `ADMIN_USERNAME` y `ADMIN_PASSWORD` se usan para crear el admin inicial si la tabla `users` está vacía.
- después podés cambiar la contraseña desde el CMS.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run test
npm run backup
```

## Estructura importante

```text
app/
  page.tsx
  redes/
  api/
  out/[id]/route.ts
components/
lib/
scripts/
tests/
docker-compose.yml
Dockerfile
DEPLOY-SYNOLOGY.md
```

## Producción

El proyecto ya está preparado para:

- Docker multi-stage
- salida `standalone` de Next.js
- persistencia de SQLite y uploads
- backup manual
- despliegue detrás de reverse proxy

Para Synology, seguí:

- `DEPLOY-SYNOLOGY.md`

## Seguridad ya incluida

- rate limiting en login y cambio de contraseña
- validación de URLs
- validación de uploads por tamaño y firma real de archivo
- tests mínimos de utilidades críticas

## Backup

```bash
npm run backup
```

En Docker/Synology, los backups quedan persistidos en el volumen montado para `/app/backups`.

## Notas

- la ruta del panel no se muestra en la landing pública
- los datos quedan en `data/app.db`
- las imágenes subidas quedan en `public/uploads`
