const express = require('express');
const configureMiddleware = require('./config/middleware');
// const uppercaseChecker = require('./config/uppercase')

const server = express();

configureMiddleware(server);

const projectRoutes = require('./Projects/projectRoutes')
const actionRoutes = require('./Actions/actionRoutes')

server.use(express.json());

server.use('/projects', projectRoutes);

server.use('/actions', actionRoutes);

server.use('/', (req, res) => {
    res.status(200).send('Hello from API Challenge');
})
module.exports = server;