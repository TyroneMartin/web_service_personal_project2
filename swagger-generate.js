const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API Project for a School\'s bd', 
    description: 'Is a RESTful API for my contacts created as part of my class assignment for CSE 341.',
  },
  host: ['localhost:8080', 'cse-341-webservices-personal-project.onrender.com']
};

const outputFile = './swagger-output.json';
// const outputFile = './swagger.json';


const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc);