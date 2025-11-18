CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(3072), -- dimension for text-embedding-3-large
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_embedding_hnsw
ON knowledge USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 200);
