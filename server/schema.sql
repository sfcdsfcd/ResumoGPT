DO $$ BEGIN
  CREATE TYPE api_key_type_enum AS ENUM ('openai', 'deepseek');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  api_key TEXT,
  api_key_type api_key_type_enum DEFAULT 'openai' NOT NULL
);
