const path = require('path');

// Isso garante que ele busque o .env na Raiz de "npm run dev"
require("dotenv").config({
  path: path.join(process.cwd(), '.env'),
  override: true,
});

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL
};