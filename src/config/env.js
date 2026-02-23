const path = require('path');
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  override: true,
});
module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL || ''
};