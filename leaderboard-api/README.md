# API de clasificacion

Servicio HTTP pequeno para los pasaportes anonimos y la tabla publica de Sofia.

## Rutas

- `GET /api/health`
- `POST /api/players`
- `GET /api/players/me`
- `PATCH /api/players/me`
- `POST /api/challenges`
- `POST /api/scores`
- `GET /api/leaderboard?period=all|week&limit=50`

El esquema se crea de forma idempotente al iniciar. Los puntajes conservan solo la mejor marca de cada actividad, dificultad y capitulo.

## Pruebas

```bash
pnpm test
```
