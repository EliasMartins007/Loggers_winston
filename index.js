import express from 'express';
//const express = require('express');

import winston from 'winston';

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(express.static('public'));
app.use('/images', express.static('public'));

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

//// exemploo da internet

const logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'grades-control-api.log',
    }),
  ],
  format: combine(
    label({ label: 'grades-control-api' }),
    timestamp(),
    myFormat
  ),
});

logger.error('Erro');
logger.warn('warn log');
logger.info('inf log'); // exemplo logger.info('server.endpoint.get.users.getusersfromdb.format');
logger.verbose('verbose log');
logger.debug('debug log');
logger.silly('Silly log');
logger.log('info', 'elias inf');

//fim logs professor IGTI

//inicio func
const handler = (func) => (req, res) => {
  try {
    logger.info('server.handler.begun');
    func(req, res, logger);
  } catch (e) {
    logger.info('server.handler.failed'); //(e);
    res.send('oh no, somenthing did not go well!');
    //console.log(e);
  }
};

app.get(
  '/sucess',
  handler((req, res) => {
    res.send('YAy!');
  })
);
app.get(
  '/error',
  handler((req, res) => {
    throw new Error('Doh!');
  })
);

app.listen(PORT, () => console.log(`Exasmple app listening on port ${PORT}`));
