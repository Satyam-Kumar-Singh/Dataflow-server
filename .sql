CREATE TABLE
  users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW ()
  );

CREATE TABLE
  user_settings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id),
    vector_db_type VARCHAR(50), -- 'pgvector', 'pinecone', etc.
    db_host TEXT,
    db_port INT,
    db_name TEXT,
    db_user TEXT,
    db_pass TEXT,
    model_name TEXT,
    created_at TIMESTAMP DEFAULT NOW ()
  );