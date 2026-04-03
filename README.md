# Enlaces Redes Sociales

Landing tipo Linktree para creadores y marcas, con CMS privado en `/redes`, tracking de clicks, presets visuales, uploads locales y despliegue self-hosted.

<p align="left">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

<p align="left">
  <img src="https://skillicons.dev/icons?i=vite,react,ts,express,sqlite,tailwind,docker,github" alt="Tech stack icons" />
</p>

## Features

- landing pública con tema claro/oscuro
- enlaces sociales + enlaces de contenido
- CMS privado en `/redes`
- fondos, presets y personalización visual
- tracking de clicks
- CTA principal, prueba social y bloques destacados
- uploads locales para avatar y fondos
- auth admin con cambio de contraseña
- SQLite persistente
- despliegue self-hosted con Docker

## Stack

- Frontend: `React + Vite`
- Backend: `Express + SQLite`
- Estilos: `Tailwind CSS 4`
- Runtime: `Node.js`

## Desarrollo local

1. Instalá dependencias:

```bash
npm install
```

2. Creá tu archivo `.env` desde `.env.example`.

3. Ejecutá el entorno de desarrollo:

```bash
npm run dev
```

4. Abrí:

- frontend: `http://localhost:5173`
- panel: `http://localhost:5173/redes`
- backend: `http://localhost:4000`

## Variables de entorno

Usá `.env.example` como base.

Variables principales:

- `PORT`
- `SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Notas:

- `ADMIN_USERNAME` y `ADMIN_PASSWORD` solo se usan para crear el admin inicial si la tabla `users` está vacía.
- después podés cambiar la contraseña desde el CMS.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run test
npm run backup
```

## Estructura

```text
src/
  pages/
server/
components/
app/redes/
lib/
scripts/
tests/
docker-compose.yml
Dockerfile
```

## Producción con Docker

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

El contenedor expone el puerto `4000`, así que tu proxy tiene que apuntar a:

```text
http://<IP_DEL_SERVIDOR>:4000
```

## Deploy automático a Synology

El repo incluye:

```text
.github/workflows/deploy-synology.yml
```

Se ejecuta en cada push a `main` y despliega por SSH en tu Synology.

Secrets necesarios en GitHub:

- `SYNOLOGY_SSH_HOST`
- `SYNOLOGY_SSH_PORT`
- `SYNOLOGY_SSH_USER`
- `SYNOLOGY_SSH_KEY`
- `SYNOLOGY_PROJECT_DIR`

Ejemplo:

```text
SYNOLOGY_PROJECT_DIR=/volume1/docker/Proyectos-web/enlaces-redes-sociales
```

Si esos secrets no están configurados, el workflow ahora **omite el deploy sin fallar**.

## Seguridad

- rate limiting en login y cambio de contraseña
- validación de URLs
- validación de uploads por tamaño y firma real
- tests mínimos de utilidades críticas

## Backup

```bash
npm run backup
```

En Docker, los backups quedan persistidos en `/app/backups`.

## Notas

- la ruta del panel no se muestra en la landing pública
- los datos viven en `data/app.db`
- las imágenes subidas viven en `public/uploads`
