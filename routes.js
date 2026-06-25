const express = require('express');
const path = require('path');
const chalk = require('chalk');
const debug = require('debug')('routes');
const morgan = require('morgan');

function setupRoutes(app) {
  app.use(morgan('combined'));
  app.use(express.static(path.join(__dirname, '/public')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/lobby.html'));
    debug(chalk.green('GET / - Lobby page accessed'));
  });

  app.get('/reversi', (req, res) => {
    debug(chalk.green('GET /reversi - Reversi game accessed'));
    res.sendFile(path.join(__dirname, '/public/reversi.html'));
  });

  app.get('/twelve-mens-morris', (req, res) => {
    debug(chalk.green('GET /twelve-mens-morris - Twelve Men\'s Morris game accessed'));
    res.sendFile(path.join(__dirname, '/public/twelve-mens-morris.html'));
  });

  app.get('/five-field-kono', (req, res) => {
    debug(chalk.green('GET /five-field-kono - Five-Field Kono game accessed'));
    res.sendFile(path.join(__dirname, '/public/five-field-kono.html'));
  });
}

module.exports = { setupRoutes };