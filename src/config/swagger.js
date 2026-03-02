const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');

// Carregar base
const baseSwagger = YAML.parse(
  fs.readFileSync(path.join(__dirname, '../../swagger.base.yaml'), 'utf8')
);

// Carregar módulos
const healthSwagger = YAML.parse(
  fs.readFileSync(path.join(__dirname, '../modules/health/health.swagger.yaml'), 'utf8')
);

const productSwagger = YAML.parse(
  fs.readFileSync(path.join(__dirname, '../modules/products/product.swagger.yaml'), 'utf8')
);

const couponSwagger = YAML.parse(
  fs.readFileSync(path.join(__dirname, '../modules/coupons/coupon.swagger.yaml'), 'utf8')
);

const orderSwagger = YAML.parse(
  fs.readFileSync(path.join(__dirname, '../modules/orders/order.swagger.yaml'), 'utf8')
);

const userSwagger = YAML.parse(
  fs.readFileSync(path.join(__dirname, '../modules/users/users.swagger.yaml'), 'utf8')
);

// Mesclar tudo
const swaggerDocument = {
  ...baseSwagger,
  paths: {
    ...healthSwagger.paths,
    ...productSwagger.paths,
    ...couponSwagger.paths,
    ...orderSwagger.paths,
    ...userSwagger.paths,
  },
  components: {
    ...baseSwagger.components,
    schemas: {
      ...productSwagger.components?.schemas,
      ...couponSwagger.components?.schemas,
      ...orderSwagger.components?.schemas,
      ...userSwagger.components?.schemas,
    }
  }
};

// Configurações customizadas do Swagger UI
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-commerce API Documentation',
  customfavIcon: '/favicon.ico',
};

module.exports = {
  swaggerUi,
  swaggerDocument,
  swaggerOptions,
};
