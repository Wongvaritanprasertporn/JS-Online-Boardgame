const chalk = require('chalk');
const debug = require('debug')('app');
const events = require('events');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { createServer } = require('http');
const express = require('express');
const { Server } = require('socket.io');
const { setupRoutes } = require('./routes.js');
const { setupSocketHandlers } = require('./src/socketHandlers.js');

dotenv.config();
events.setMaxListeners(20);

try {
  const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/reversi';
  mongoose.connect(mongoUri);
  debug(chalk.green('MongoDB connected successfully'));
  debug('Connected to MongoDB');

  const app = express();
  setupRoutes(app);

  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  setupSocketHandlers(io);
  debug(chalk.yellow('Socket handlers have been set up'));

  const port = process.env.PORT || process.env.HTTPS_PORT || 3000;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
} catch (error) {
  debug(chalk.red('Error connecting to MongoDB:', error.message));
  process.exit(1);
}
