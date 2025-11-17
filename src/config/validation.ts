import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(9000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5433),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),

  CORS_ORIGIN: Joi.string().default('*'),
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_MAX: Joi.number().default(20),
  OPENAI_API_KEY: Joi.string().required(),
});
