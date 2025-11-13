CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding VECTOR(768), -- for Gemini text-embedding-004
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
