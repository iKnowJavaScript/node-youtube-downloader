let dotenv = require("dotenv");

// Set default to "development"
const nodeEnv = process.env.NODE_ENV || "development";

const env = dotenv.config({
  path: `./env/${nodeEnv}.env`,
});

if (env.error) {
  throw env.error;
}
