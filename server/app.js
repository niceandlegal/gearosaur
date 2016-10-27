'use strict';

const express = require('express'),
  mongoose = require('mongoose'),
  http = require('http'),
  router = require('./routes/index'),
  logger = require('log4js').getLogger();

// ************************ MongoDB Connection ************************
// Let Mongoose driver to connect to MongoDB
mongoose.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost:27017/gearosaur');

let db = mongoose.connection;

// Connection success
db.once('open', function (callback) {
  logger.info('MongoDB connection success');
});

// ************************ App basic services ************************
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', router);

const port = process.env.PORT || 4000;

const httpServer = http.createServer(app);

httpServer.listen(port);

logger.info('Server: Hello everybody');
logger.info('PORT:', port);
logger.info('process.env.NODE_ENV:', process.env.NODE_ENV);