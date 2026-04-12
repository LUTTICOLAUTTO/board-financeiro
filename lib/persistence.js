import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "submissions.json");

let poolPromise;
let postgresReady = false;

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

async function getPool() {
  if (!hasDatabaseUrl()) {
    return null;
  }

  if (!poolPromise) {
    poolPromise = import("pg").then(({ Pool }) => {
      return new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false
      });
    });
  }

  return poolPromise;
}

async function ensurePostgresSchema() {
  if (!hasDatabaseUrl() || postgresReady) {
    return;
  }

  const pool = await getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lampada_submissions (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      session_token TEXT NOT NULL,
      payload JSONB NOT NULL,
      diagnosis JSONB NOT NULL
    );
  `);

  postgresReady = true;
}

async function readLocalSubmissions() {
  try {
    const raw = await readFile(dataFile, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function getAllLocalSubmissions() {
  return readLocalSubmissions();
}

async function getLocalSubmissionById(id) {
  const items = await readLocalSubmissions();
  return items.find((item) => item.id === id) || null;
}

async function persistLocalSubmission(entry) {
  await mkdir(dataDir, { recursive: true });

  const items = await readLocalSubmissions();
  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry
  };

  items.unshift(record);
  await writeFile(dataFile, JSON.stringify(items, null, 2));

  return {
    saved: true,
    id: record.id,
    sessionToken: entry.payload?.sessionToken || "public",
    path: dataFile,
    storage: "local"
  };
}

async function getAllPostgresSubmissions() {
  await ensurePostgresSchema();
  const pool = await getPool();
  const result = await pool.query(`
    SELECT id, created_at, session_token, payload, diagnosis
    FROM lampada_submissions
    ORDER BY created_at DESC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    payload: row.payload,
    diagnosis: row.diagnosis,
    sessionToken: row.session_token
  }));
}

async function getPostgresSubmissionById(id) {
  await ensurePostgresSchema();
  const pool = await getPool();
  const result = await pool.query(
    `
      SELECT id, created_at, session_token, payload, diagnosis
      FROM lampada_submissions
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    createdAt: row.created_at,
    payload: row.payload,
    diagnosis: row.diagnosis,
    sessionToken: row.session_token
  };
}

async function persistPostgresSubmission(entry) {
  await ensurePostgresSchema();
  const pool = await getPool();

  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry
  };

  await pool.query(
    `
      INSERT INTO lampada_submissions (id, created_at, session_token, payload, diagnosis)
      VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)
    `,
    [
      record.id,
      record.createdAt,
      record.payload?.sessionToken || "public",
      JSON.stringify(record.payload),
      JSON.stringify(record.diagnosis)
    ]
  );

  return {
    saved: true,
    id: record.id,
    sessionToken: record.payload?.sessionToken || "public",
    storage: "postgres"
  };
}

export async function getAllSubmissions() {
  if (hasDatabaseUrl()) {
    return getAllPostgresSubmissions();
  }

  return getAllLocalSubmissions();
}

export async function getSubmissionById(id) {
  if (hasDatabaseUrl()) {
    return getPostgresSubmissionById(id);
  }

  return getLocalSubmissionById(id);
}

export async function persistSubmission(entry) {
  if (hasDatabaseUrl()) {
    return persistPostgresSubmission(entry);
  }

  return persistLocalSubmission(entry);
}
