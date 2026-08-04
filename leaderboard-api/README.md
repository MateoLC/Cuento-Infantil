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
- `GET /api/analytics/summary`
- `POST /api/analytics/visit`
- `POST /api/analytics/forget`

El esquema se crea de forma idempotente al iniciar. Los puntajes conservan solo la mejor marca de cada actividad, dificultad y capitulo.
La medicion anonima guarda hashes de visitante y sesion solo cuando existe autorizacion en el navegador. El contador publico es acumulado y los identificadores inactivos se eliminan despues de 12 meses.

## Pruebas

```bash
pnpm test
```
