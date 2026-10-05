const chalk = require('chalk');
const debug = require('debug')('app');
const events = require('events');
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { createServer: createHttpsServer } = require('https');
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

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  setupSocketHandlers(io);
  debug(chalk.yellow('Socket handlers have been set up'));

  const httpPort = process.env.PORT || 3000;
  httpServer.listen(httpPort, () => {
    console.log(`HTTP server listening on port ${httpPort}`);
  });

  const sslKeyPath = process.env.SSL_KEY_PATH;
  const sslCertPath = process.env.SSL_CERT_PATH;
  if (sslKeyPath && sslCertPath && fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    const httpsServer = createHttpsServer({
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath)
    }, app);
    io.attach(httpsServer);

    const httpsPort = process.env.HTTPS_PORT || 3443;
    httpsServer.listen(httpsPort, () => {
      console.log(`HTTPS server listening on port ${httpsPort}`);
    });
  } else {
    debug(chalk.yellow('SSL_KEY_PATH/SSL_CERT_PATH not set or not found; HTTPS server disabled'));
  }
} catch (error) {
  debug(chalk.red('Error connecting to MongoDB:', error.message));
  process.exit(1);
}
