import { sql } from "drizzle-orm";

export async function migrate() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL not set, skipping migrations");
      return;
    }

    const { db } = await import("./db");
    console.log("Running database migrations...");
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        display_name TEXT,
        reputation INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS colleges (
        id VARCHAR PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS departments (
        id VARCHAR PRIMARY KEY,
        college_id VARCHAR NOT NULL REFERENCES colleges(id),
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        department_id VARCHAR NOT NULL REFERENCES departments(id),
        code TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        level INTEGER NOT NULL,
        semester TEXT
      );

      CREATE TABLE IF NOT EXISTS files (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id VARCHAR NOT NULL REFERENCES courses(id),
        user_id VARCHAR NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_size INTEGER,
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        download_count INTEGER NOT NULL DEFAULT 0,
        uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS downloads (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        file_id VARCHAR NOT NULL REFERENCES files(id),
        user_id VARCHAR NOT NULL REFERENCES users(id),
        downloaded_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log("Database migrations completed successfully!");
  } catch (error) {
    console.error("Database migration failed:", error);
    throw error;
  }
}
