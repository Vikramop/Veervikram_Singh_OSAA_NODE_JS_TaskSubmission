const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Secure Auth API',
      version: '1.0.0',
      description: 'Telegram‑integrated authentication & admin system',
    },
    servers: [{ url: 'http://localhost:5000/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Scan all route & controller files for Swagger JSDoc annotations
  apis: ['./routes/*.js', './controller/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📘 Swagger docs →  http://localhost:5000/api-docs');
};
