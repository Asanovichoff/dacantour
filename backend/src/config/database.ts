/**
 * Builds the Postgres connection URL.
 *
 * Order of preference:
 *   1. POSTGRES_USER + POSTGRES_PASSWORD + POSTGRES_DB — the vars infra/.env gives
 *      the Docker Postgres. These win locally so the API can never drift from the
 *      credentials the database was actually created with (a duplicated, stale
 *      DATABASE_URL in the same file was exactly that bug).
 *   2. DATABASE_URL — used in production (e.g. Neon), where POSTGRES_* aren't set.
 *   3. local defaults
 *
 * Host fix: inside Docker the DB host is the compose service name `postgres`, but
 * when you run the API on your machine that name doesn't resolve — so unless we're
 * running in a container we rewrite it (and `localhost`, which Node's fetch/pg can
 * resolve to IPv6) to 127.0.0.1.
 */
export function buildDatabaseUrl(): string {
  const inDocker = process.env.RUNNING_IN_DOCKER === "true";

  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const db = process.env.POSTGRES_DB;

  let url: string;

  if (user && password && db) {
    const host = inDocker ? "postgres" : "127.0.0.1";
    const port = process.env.POSTGRES_PORT || "5432";
    url = `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}/${db}`;
  } else {
    url =
      process.env.DATABASE_URL?.trim() ||
      "postgres://dacan:dacan@127.0.0.1:5432/dacantour";
  }

  if (!inDocker) {
    url = url.replace("@postgres:", "@127.0.0.1:").replace("@localhost:", "@127.0.0.1:");
  }

  return url;
}

/** Redacts the password so the URL is safe to log. */
export function redactUrl(url: string): string {
  return url.replace(/:\/\/([^:]+):[^@]*@/, "://$1:****@");
}
