const path = require('path');
const dotenv = require('dotenv');

const result = dotenv.config({
  path: path.join(process.cwd(), '.env'),
  override: true,
});

if (result.error) {
  console.warn('Arquivo .env não encontrado. Usando variáveis de ambiente do sistema.');
} else {
  console.log("Arquivo .env carregado com sucesso.");
}

console.log("JWT_SECRET do processo:", process.env.JWT_SECRET);

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',

  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }, 
  melhorEnvio: {
    token: process.env.MELHOR_ENVIO_TOKEN,
    // apiKey: process.env.MELHOR_ENVIO_API_KEY,
    // apiUrl: process.env.MELHOR_ENVIO_API_URL || 'https://api.melhorenvio.com.br/v2'
  },
  appUrl: process.env.APP_URL || 'http://localhost:3000'
};