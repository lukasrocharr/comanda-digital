# Deploy backend to Railway

This document explains how to deploy the Spring Boot backend and Postgres database to Railway, and host the frontend on Firebase Hosting.

Prerequisites
- Railway CLI: https://docs.railway.app/develop/cli
- Docker (optional, Railway can build for you)
- A Railway account

Steps (manual)

1. Login to Railway CLI

```bash
railway login
```

2. Initialize or link a project inside the `backend` folder

```bash
cd backend
railway init    # creates a new Railway project interactively
# or link to an existing project: railway link
```

3. Provision a Postgres database (in the Railway project dashboard or via CLI)

Use the Railway web console to add a Postgres plugin and copy the connection string (DATABASE_URL).

4. Set environment variables for your Railway service

In the Railway dashboard (or via CLI `railway variables:set`) set:

- `SPRING_PROFILES_ACTIVE=prod`
- `SPRING_DATASOURCE_URL` — JDBC URL, example:
  `jdbc:postgresql://host:5432/dbname?sslmode=require`
- `SPRING_DATASOURCE_USERNAME` — database username (if not in URL)
- `SPRING_DATASOURCE_PASSWORD` — database password (if not in URL)
- `APP_JWT_SECRET` — a secure 64-hex key

Railway often exposes `DATABASE_URL` in the form `postgres://user:pass@host:port/dbname`. If so, convert it to JDBC:

```bash
# example conversion in bash
export DATABASE_URL=postgres://user:pass@host:5432/dbname
export SPRING_DATASOURCE_URL="jdbc:postgresql://${DATABASE_URL#*://}" # manual adjust may be required
```

5. Deploy the backend

Option A (Railway build):

```bash
# from backend/
railway up
```

This will build (Railway detects Dockerfile) and deploy the service.

Option B (Docker locally):

```bash
docker build -t comanda-digital-backend .
docker push <your-registry>/comanda-digital-backend:tag
# then deploy to Railway by configuring the service to use your image
```

6. Verify migrations

When the service starts, Flyway will run migrations located at `src/main/resources/db/migration`. Check logs in Railway to confirm V1/V2 applied successfully.

7. Update `firebase.json` rewrite

Set the Cloud Run / API endpoint or use the Railway service URL directly in your frontend calls. If you want to keep Firebase rewrites to a cloud service, you can configure the frontend to call the Railway URL for `/api`.

Notes
- Ensure `spring.profiles.active` is set to a production profile if required. Railway sets `NODE_ENV`/environment variables — adapt if needed.
- Migrations rely on `spring-boot-starter-flyway` which was added to the `pom.xml`.
