CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(3072), -- dimension for text-embedding-3-large
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
