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
- despliegue listo para Docker

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

Usá `.env.example` como plantilla y creá tu `.env` real para Docker/producción.

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
```

## Producción

El proyecto ya está preparado para:

- Docker multi-stage
- salida `standalone` de Next.js
- persistencia de SQLite y uploads
- backup manual
- despliegue detrás de reverse proxy

Antes de levantar el contenedor, creá estas carpetas en la raíz del proyecto:

```bash
mkdir -p docker-data/data docker-data/uploads docker-data/backups
```

En Windows o Synology File Station, asegurate de que existan exactamente estas rutas:

```text
docker-data/data
docker-data/uploads
docker-data/backups
```

Esas carpetas son obligatorias porque `docker-compose.yml` monta:

- `./docker-data/data:/app/data`
- `./docker-data/uploads:/app/public/uploads`
- `./docker-data/backups:/app/backups`

Luego levantá el proyecto con:

```bash
docker compose up -d --build
```

El contenedor expone el puerto `4000`, así que en tu proxy tenés que apuntar a:

```text
http://<IP_DEL_SERVIDOR>:4000
```

## Seguridad ya incluida

- rate limiting en login y cambio de contraseña
- validación de URLs
- validación de uploads por tamaño y firma real de archivo
- tests mínimos de utilidades críticas

## Backup

```bash
npm run backup
```

En Docker, los backups quedan persistidos en el volumen montado para `/app/backups`.

## Notas

- la ruta del panel no se muestra en la landing pública
- los datos quedan en `data/app.db`
- las imágenes subidas quedan en `public/uploads`
