# Sofia, un verdadero cuento ecologico

Sitio web educativo en React/Vite con lector del libro, capitulos, Vision Verde y siete rutas dentro de Diviertete Aprendiendo: seis juegos y una clasificacion publica.

## Desarrollo local

```bash
npm install
npm run dev
```

La web funciona sin el servicio de clasificacion. Para guardar nombres y puntajes tambien debe ejecutarse `leaderboard-api` con PostgreSQL.

## Clasificacion

El navegador conserva un pasaporte anonimo. Solo el alias elegido aparece publicamente; no se solicitan correo, contrasena ni nombre real. El servidor firma cada reto, valida tiempos plausibles y calcula los puntos sin confiar en el puntaje enviado por el cliente.

```bash
cd leaderboard-api
cp .env.example .env
pnpm install
pnpm start
```

Variables necesarias:

- `DATABASE_URL`: conexion PostgreSQL.
- `PLAYER_TOKEN_SECRET`: secreto aleatorio de al menos 32 caracteres.
- `ALLOWED_ORIGIN`: origen publico de la web.
- `DATABASE_SSL`: `disable` para la red interna de Dokploy o `require` para un proveedor externo.

## Dokploy

La aplicacion web existente se mantiene independiente. El despliegue recomendado agrega:

1. PostgreSQL `sofia-leaderboard-db` con volumen persistente.
2. Aplicacion `sofia-leaderboard-api` desde este repositorio, ruta de construccion `/leaderboard-api` y Dockerfile `leaderboard-api/Dockerfile`.
3. Dominio `sofiacuentoecologico.com`, ruta `/api`, puerto `3000` y HTTPS.
4. Las variables descritas arriba usando la URL interna de PostgreSQL.

Orden seguro: base de datos, API, verificacion de `/api/health` y finalmente frontend. Para revertir, se restaura el despliegue anterior del frontend y se desactiva la ruta `/api`; los juegos siguen funcionando sin la clasificacion.
