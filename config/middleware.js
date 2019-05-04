const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');


module.exports = server => {
    server.use(morgan('dev')); //3rd party logging  yarn add morgan
    server.use(helmet()); //3rd party security yarn add helmet
    server.use(express.json()); //built-in 
};