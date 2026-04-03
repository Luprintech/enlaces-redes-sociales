# Deploy En Synology

## 1. Preparar archivos

Copiá el proyecto al NAS y creá el archivo `.env.docker` a partir de `.env.docker.example`.

Variables importantes:

- `NEXTAUTH_URL`: dominio publico final
- `NEXTAUTH_SECRET`: secreto fuerte
- `AUTH_TRUST_HOST=true`: importante detras del reverse proxy
- `ADMIN_USERNAME` / `ADMIN_PASSWORD`: solo para crear el admin la primera vez

## 2. Estructura persistente

`docker-compose.yml` ya monta estos volúmenes:

- `./docker-data/data` → SQLite (`/app/data`)
- `./docker-data/uploads` → imágenes subidas (`/app/public/uploads`)
- `./docker-data/backups` → backups manuales (`/app/backups`)

No borres `docker-data/data` ni `docker-data/uploads` si querés conservar contenido.

## 3. Levantar contenedor

```bash
docker compose up -d --build
```

## 4. Reverse Proxy en Synology

En Synology, apuntá tu dominio al NAS y configurá el reverse proxy hacia:

- destino: `http://<IP_DEL_NAS>:3000`

Recomendado:

- habilitar HTTPS
- forzar redirección HTTP → HTTPS
- poner límites de request y rate limiting en el proxy si podés

## 5. Primer acceso

Entrá a:

- sitio público: `/`
- panel admin: `/redes`

Usá el usuario y contraseña iniciales del `.env.docker`.
Después podés cambiarlos desde el CMS.

## 6. Backup manual

Dentro del proyecto:

```bash
docker compose exec luprintech-rrss npm run backup
```

Se genera en:

```bash
/app/backups/<timestamp>
```

Como `/app/backups` está montado, lo vas a ver en `./docker-data/backups`.

## 7. Actualizar despliegue

```bash
docker compose down
docker compose up -d --build
```

Mientras mantengas `docker-data/data` y `docker-data/uploads`, no perdés datos.

## 8. Recomendaciones reales antes de abrirlo

- usá una contraseña admin fuerte
- no expongas el puerto 3000 directo a internet; pasá por reverse proxy
- hacé backup regular de `docker-data/data` y `docker-data/uploads`
- si usás dominio, revisá que `NEXTAUTH_URL` coincida exactamente con la URL pública
