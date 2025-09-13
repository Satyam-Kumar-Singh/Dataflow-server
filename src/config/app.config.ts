export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    name: process.env.DB_NAME || 'bamboo_audio_agent',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
  },

  corsOrigin: process.env.CORS_ORIGIN || '*',
  RATE_LIMIT_TTL: parseInt(process.env.RATE_LIMIT_TTL || '60', 10), // in seconds
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '20', 10), // max requests per TTL
});
