const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // specify the version of OpenAPI Specification
    info: {
      title: 'Campus Quest Back-end API',
      version: '1.0.0',
      description: 'API pour le projet Campus Quest',
    },
  },
  // List of files to be processed
  apis: ['./*.js'], // Replace with the path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
