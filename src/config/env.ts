import Joi from "@hapi/joi";
require("../../env");

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .required()
    .default("development"),
  APP_PORT: Joi.number(),
  APP_HOST: Joi.string()
    .required()
    .description("App host address"),
  APP_NAME: Joi.string()
    .required()
    .description("App name."),
  DATABASE_CONNECTION: Joi.string()
    .required()
    .description("DBMS name require"),
  DATABASE_HOST: Joi.string()
    .required()
    .description("DB host url"),
  DATABASE_PORT: Joi.number().description("DB Port."),
  DATABASE_USERNAME: Joi.string()
    .required()
    .description("Database username"),
  DATABASE_PASSWORD: Joi.any()
    .default("")
    .optional(),
  DATABASE_NAME: Joi.string()
    .required()
    .description("Database to connect"),
  TYPEORM_SYNCHRONIZE: Joi.boolean().default(false),
  TYPEORM_LOGGING: Joi.string().description("ORM logging"),
  TYPEORM_DROPSCHEMA: Joi.boolean().default(false),
  TYPEORM_MIGRATION: Joi.array()
    .items(Joi.string())
    .default(["src/migration/*{.ts,.js}"])
    .optional(),
  TYPEORM_CLI: Joi.object()
    .default({ migrationsDir: "src/migration" })
    .optional(),
  REDIS_HOST: Joi.string()
    .required()
    .description("REDIS host required"),
  REDIS_PORT: Joi.number().description("Redis Port."),
  REDIS_AUTH_EXPIRATION: Joi.number().description("Redis Auth expiraion"),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  NODE_ENV: envVars.NODE_ENV,
  APP_PORT: envVars.APP_PORT,
  APP_HOST: envVars.APP_HOST,
  APP_NAME: envVars.APP_NAME,
  TYPEORM_CONFIG: {
    name: envVars.NODE_ENV,
    type: envVars.DATABASE_CONNECTION,
    host: envVars.DATABASE_HOST,
    port: envVars.DATABASE_PORT,
    username: envVars.DATABASE_USERNAME,
    password: envVars.DATABASE_PASSWORD,
    database: envVars.DATABASE_NAME,
    synchronize: envVars.TYPEORM_SYNCHRONIZE,
    logging: envVars.TYPEORM_LOGGING,
    migration: envVars.TYPEORM_MIGRATION,
    cli: envVars.TYPEORM_CLI,
  },
  REDIS_CONFIG: {
    REDIS_HOST: envVars.REDIS_HOST,
    REDIS_PORT: envVars.REDIS_PORT,
    REDIS_EXPR: envVars.REDIS_AUTH_EXPIRATION,
  },
};

export default config;
