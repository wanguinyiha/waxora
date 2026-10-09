# Waxora

Single-business marketing + booking site built with **Next.js 16 (App Router, standalone output)**, **Supabase** (PostgreSQL + Auth + Storage) and **Tailwind CSS 4**.

- Public site: home, services, gallery, blog, reviews, FAQ, contact
- Booking: request flow, confirmation and management links (email via SMTP)
- Admin app at `/admin` (auth-protected via `middleware.ts`)

---

## 1. Local development (no Docker)

```bash
npm ci
cp .env.example .env.local      # fill in real values
npm run dev                      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint (Next 16 removed `next lint`)
npm run seed:admin # creates/updates the admin user (needs SEED_ADMIN_* env vars)
```

Supabase schema/seed SQL lives in `supabase/`.

### Environment variables

`.env*` files are git-ignored; `.env.example` documents every key.

| Variable | When it is read | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | **build time** | inlined into the JS bundle and `middleware` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **build time** | inlined (safe, publishable by design) |
| `NEXT_PUBLIC_SITE_URL` | **build time** | canonical origin used in booking emails. Set to the real origin for production images, otherwise the request `Host` header is used (host-header injection risk) |
| `NEXT_DEPLOYMENT_ID` | build time | optional build id. Must be alphanumeric, `-` or `_` (**no dots** — `1.0.1` is rejected by Next) |
| `SUPABASE_SERVICE_ROLE_KEY` | **runtime** | server-only secret, never a build arg |
| `SMTP_*`, `ADMIN_NOTIFICATION_EMAIL` | runtime | optional; contact-form emails are skipped if unset |
| `BUSINESS_TIMEZONE` | runtime | fallback timezone for booking policy |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | `npm run seed:admin` only | never present in an image |

Build-time vs runtime matters for containers: `NEXT_PUBLIC_*` must be passed as **Docker build args**, everything else is injected at **run time** (env file / ConfigMap / Secret).

---

## 2. Docker

### Build

`.dockerignore` excludes `.git`, `.next`, `node_modules`, `.env*`, docs and scripts, so secrets can never enter the build context.

```bash
docker build -t waxora:latest \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_... \
  --build-arg NEXT_PUBLIC_SITE_URL=https://waxora.example.com \
  --build-arg NEXT_DEPLOYMENT_ID=$(git rev-parse --short HEAD) \
  .
```

The multi-stage build (`deps` → `builder` → `runner`) produces a `node:24-alpine` image of ~333 MB containing only `next/standalone`, `.next/static` and `public/`. The builder stage fails fast if a required `NEXT_PUBLIC_*` arg is missing.

### Run

```bash
docker run --rm -p 3000:3000 \
  --env-file .env \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  waxora:latest
```

Runtime-only values (`SUPABASE_SERVICE_ROLE_KEY`, `SMTP_*`) come from `--env-file` / `-e`; they are **not** baked into the image (verified: the image contains no secret values).

Container hardening already in the `Dockerfile`:

- `USER node` (uid 1000), no root at runtime
- read-only root filesystem works (validated with `--read-only --tmpfs /tmp --tmpfs /app/.next/cache`)
- `HEALTHCHECK` hits `/api/health` with a Node one-liner (no `curl` in the image)
- graceful `SIGTERM` shutdown (Next standalone responds correctly)

### Docker Compose

```bash
cp .env.example .env        # compose reads build args + runtime env from .env
docker compose up --build -d
docker compose logs -f web
docker compose down
```

`docker-compose.yml` defines a single `web` service (build args from `.env`, `env_file: .env`, port `3000:3000`, `restart: unless-stopped`). It is intentionally **not** a dev loop — use `npm run dev` for development.

### Health check endpoint

`GET /api/health` → `200 {"status":"ok","uptime":<seconds>}` with `cache-control: no-store`. Used by the Docker `HEALTHCHECK` and by the Kubernetes liveness/readiness/startup probes.

---

## 3. Kubernetes

Manifests in `k8s/` (apply order is fixed by the `00-` prefix):

| File | Purpose |
| --- | --- |
| `k8s/00-namespace.yaml` | `waxora` namespace (must be applied first) |
| `k8s/configmap.yaml` | non-secret `NEXT_PUBLIC_*` runtime config |
| `k8s/deployment.yaml` | 2-replica `Deployment`, probes, resource requests/limits, security context |
| `k8s/service.yaml` | `ClusterIP` Service, `80 → 3000` |

**No Secret manifest is committed on purpose.** Create it out-of-band:

```bash
kubectl create secret generic waxora-secrets -n waxora \
  --from-literal=SUPABASE_SERVICE_ROLE_KEY=... \
  --from-literal=SMTP_PASSWORD=...
```

### Local (Docker Desktop) smoke test

```bash
kubectl apply -f k8s/                 # image ghcr.io/wanguinyiha/waxora:latest pulls anonymously (package is Public)
kubectl create secret generic waxora-secrets -n waxora \
  --from-literal=SUPABASE_SERVICE_ROLE_KEY=... --from-literal=SMTP_PASSWORD=...
kubectl rollout status deployment/waxora -n waxora
kubectl port-forward svc/waxora 8080:80 -n waxora
```

To iterate on a local build instead, point the Deployment at it — Docker Desktop shares its image store with the cluster, so `waxora:latest` is pullable with `imagePullPolicy: IfNotPresent`:

```bash
kubectl set image deployment/waxora waxora=waxora:latest -n waxora
```

### Production notes

- **Registry**: CI publishes to `ghcr.io/<owner>/<repo>` (see §4), then `kubectl set image deployment/waxora waxora=ghcr.io/<owner>/<repo>:<tag> -n waxora`. This package is currently **Public** (anonymous pull verified from the cluster); if you make it private, add an `imagePullSecret` — a commented example is in `deployment.yaml`.
- **Ingress/TLS**: no Ingress manifest is shipped — add one for your controller (`nginx-ingress`, `traefik`, cloud LB) terminating TLS and forwarding to `svc/waxora`. Set `NEXT_PUBLIC_SITE_URL` to the public `https://` origin at **build** time so booking links are canonical.
- **Secrets**: use your platform's secret store (Sealed Secrets, External Secrets, cloud KMS) — never commit `waxora-secrets`.
- **HPA**: not enabled. The cluster used for testing has no `metrics-server`, and CPU-based autoscaling is not yet justified at this scale.
- **Rolling updates**: `maxUnavailable: 0` / `maxSurge: 1` — verified zero-downtime (Service never dropped below 2 ready endpoints during an image update).

### Manifest/security characteristics (verified)

- 2 replicas, `maxUnavailable: 0` → rolling update with no dropped requests
- probes: `startupProbe` 5s×30, `readinessProbe` 10s×3, `livenessProbe` 20s×3 on `/api/health`
- `securityContext`: `runAsNonRoot`, `runAsUser/Group: 1000`, `fsGroup: 1000`, `seccompProfile: RuntimeDefault`
- container: `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`, `capabilities.drop: [ALL]`
- writable paths are `emptyDir` volumes at `/app/.next/cache` (256Mi) and `/tmp` (64Mi)
- resources: requests `100m/192Mi`, limits `500m/512Mi`
- failure modes behave as expected: missing Secret → `CreateContainerConfigError`; unknown image tag → `ErrImagePull`; deleted pods are replaced automatically (~6s)

### Operational commands

```bash
kubectl logs -n waxora -l app=waxora --tail=100
kubectl get endpoints waxora -n waxora
kubectl rollout history deployment/waxora -n waxora
kubectl delete ns waxora       # full teardown
```

---

## 4. CI: build & publish (GitHub Actions)

`.github/workflows/docker.yml` runs on every push to `main`, on `v*` tags, and on pull requests:

1. `verify` — `npm ci` → `npm run lint` → `npx tsc --noEmit`
2. `image` — multi-stage Docker build, pushed to `ghcr.io/<owner>/<repo>` (build cache in the Actions cache)

Tags produced by `docker/metadata-action`:

| Trigger | Tags |
| --- | --- |
| push to `main` | `latest`, `sha-<short>` |
| tag `v1.2.3` | `v1.2.3`, `latest`, `sha-<short>` |
| pull request | *(built, not pushed — validates the Dockerfile)* |

### One-time setup (required)

The `NEXT_PUBLIC_*` values are inlined into the bundle, so they must exist as **Actions variables** —
GitHub → *Settings → Secrets and variables → Actions → Variables* → add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL` — **the real production origin** (e.g. `https://waxora.example.com`); release images bake this into booking links

Until they are set, the `image` job fails fast with a message naming the missing variables
(`verify` still passes — release builds must never publish with empty public config).
Auth uses the built-in `GITHUB_TOKEN` (`packages: write`); no PAT is needed.

### Release

```bash
git tag v1.0.0 && git push origin v1.0.0     # -> ghcr.io/<owner>/waxora:v1.0.0
kubectl set image deployment/waxora \
  waxora=ghcr.io/<owner>/waxora:v1.0.0 -n waxora
kubectl rollout status deployment/waxora -n waxora
```

---

## 5. Known follow-ups

- **Dependencies**: `npm audit` still reports the `next` advisory affecting `next/og` (Waxora does not import `next/og`; fix requires a `next` bump past the current pin) and a `nodemailer` advisory requiring a major upgrade. Both need deliberate testing, not an automatic bump.
- **Admin seed credentials**: `scripts/seed-admin.ts` now reads `SEED_ADMIN_*` from the environment; rotate any credentials that were ever committed historically.
- **Runtime images**: gallery/hero images are remote Unsplash URLs optimized on the fly by `next/image`. In constrained clusters slow egress can exceed Next's ~7s upstream timeout (observed as `504` on `/_next/image`); prefer serving them from Supabase Storage/CDN in production.
