const chalk = require('chalk');
const debug = require('debug')('socketHandlers');
const { Reversi } = require('./reversi');
const TwelveMensMorris = require('./twelve-mens-morris');
const FiveFieldKono = require('./five-field-kono');
const { Room, CountryWin } = require('./database');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const net = require('net');

const supportedGames = ['reversi', 'twelvemorris', 'fivefieldkono'];
const matchmakingQueue = supportedGames.reduce((queues, game) => {
  queues[game] = [];
  return queues;
}, {});
const queuedPlayers = new Map(); // Maps socket.id to game_type

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    debug(chalk.green(`Client connected: ${socket.id}`));

    socket.on('queue', async (queueData = 'reversi') => {
      const gameType = typeof queueData === 'string' ? queueData : queueData.gameType;
      await enqueuePlayer(io, socket, gameType);
    });

    socket.on('leaveQueue', () => {
      removeFromQueue(socket);
    });

    socket.on('button_pressed', async (row, col) => {
      await handleMove(socket, row, col);
    });

    socket.on('move', async (data) => {
      await handleGameMove(socket, data);
    });

    socket.on('getValidMoves', async (data) => {
      await handleGetValidMoves(socket, data);
    });

    socket.on('capture', async (captureData) => {
      await handleCapture(io, socket, captureData);
    });

    socket.on('disconnect', async () => {
      await handleDisconnect(io, socket);
    });
  });
}

async function enqueuePlayer(io, socket, gameType = 'reversi') {
  if (queuedPlayers.has(socket.id) || socket.data.roomUuid) {
    return;
  }

  socket.data.country = await detectCountry(socket);
  queuedPlayers.set(socket.id, gameType);
  matchmakingQueue[gameType].push(socket.id);
  socket.emit('queueWaiting', { message: 'Searching for opponent...' });
  debug(chalk.yellow(`Queued player for ${gameType}: ${socket.id}`));
  await pairPlayers(io, gameType);
}

function removeFromQueue(socket) {
  if (!queuedPlayers.has(socket.id)) {
    return;
  }

  const gameType = queuedPlayers.get(socket.id);
  queuedPlayers.delete(socket.id);
  const index = matchmakingQueue[gameType].indexOf(socket.id);
  if (index !== -1) {
    matchmakingQueue[gameType].splice(index, 1);
  }
  socket.emit('queueLeft', { message: 'Left matchmaking queue' });
  debug(chalk.yellow(`Removed player from queue: ${socket.id}`));
}

function cleanQueue(io, gameType) {
  for (let i = matchmakingQueue[gameType].length - 1; i >= 0; i--) {
    const playerId = matchmakingQueue[gameType][i];
    if (!io.sockets.sockets.has(playerId)) {
      queuedPlayers.delete(playerId);
      matchmakingQueue[gameType].splice(i, 1);
    }
  }
}

async function pairPlayers(io, gameType = 'reversi') {
  cleanQueue(io, gameType);

  while (matchmakingQueue[gameType].length >= 2) {
    const player1 = matchmakingQueue[gameType].shift();
    const player2 = matchmakingQueue[gameType].shift();
    queuedPlayers.delete(player1);
    queuedPlayers.delete(player2);

    const player1Socket = io.sockets.sockets.get(player1);
    const player2Socket = io.sockets.sockets.get(player2);

    if (!player1Socket || !player2Socket) {
      if (player1Socket) {
        await enqueuePlayer(io, player1Socket, gameType);
      }
      if (player2Socket) {
        await enqueuePlayer(io, player2Socket, gameType);
      }
      break;
    }

    const roomUuid = uuidv4();
    let game;
    switch (gameType) {
      case 'reversi':
        game = new Reversi();
        break;
      case 'twelvemorris':
        game = new TwelveMensMorris();
        break;
      case 'fivefieldkono':
        game = new FiveFieldKono();
        break;
      default:
        debug(chalk.red(`Unsupported game type: ${gameType}`));
        return;
    }

    const room = new Room({
      room_uuid: roomUuid,
      black_player: player1,
      white_player: player2,
      status: 'active',
      game_type: gameType,
      game_state: game.toState()
    });
    await room.save();

    player1Socket.join(roomUuid);
    player1Socket.data.roomUuid = roomUuid;
    player1Socket.data.color = 'black';
    player1Socket.data.gameType = gameType;

    player2Socket.join(roomUuid);
    player2Socket.data.roomUuid = roomUuid;
    player2Socket.data.color = 'white';
    player2Socket.data.gameType = gameType;

    const gameState = game.toState();
    player1Socket.emit('roomFound', {
      roomUuid,
      color: 'black',
      board: gameType === 'reversi' ? game.mat : gameState.board,
      currentPlayer: gameState.currentPlayer,
      gameState
    });

    player2Socket.emit('roomFound', {
      roomUuid,
      color: 'white',
      board: gameType === 'reversi' ? game.mat : gameState.board,
      currentPlayer: gameState.currentPlayer,
      gameState
    });

    debug(chalk.green(`Matched players for ${gameType}: ${player1} and ${player2} in room ${roomUuid}`));
  }
}

function normalizeCountry(country) {
  const value = typeof country === 'string' ? country.trim() : '';
  return value ? value.slice(0, 80) : 'Unknown';
}

async function detectCountry(socket) {
  const headers = socket.handshake.headers;
  const headerCountry = headers['cf-ipcountry'] || headers['x-vercel-ip-country'] || headers['x-country-code'];
  if (headerCountry) return normalizeCountry(headerCountry.toUpperCase());

  let ip = headers['x-forwarded-for']?.split(',')[0].trim() || socket.handshake.address || '';
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);
  if (!net.isIP(ip) || ip === '127.0.0.1' || ip === '::1') return 'Unknown';

  return new Promise((resolve) => {
    const request = https.get(`https://ipapi.co/${encodeURIComponent(ip)}/country/`, { timeout: 2000 }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        const country = body.trim().toUpperCase();
        resolve(response.statusCode === 200 && /^[A-Z]{2}$/.test(country) ? country : 'Unknown');
      });
    });
    request.on('error', () => resolve('Unknown'));
    request.on('timeout', () => request.destroy());
  });
}

async function recordWin(country) {
  if (!country || country === 'Unknown') return;
  await CountryWin.updateOne(
    { country },
    { $inc: { wins: 1 }, $setOnInsert: { country } },
    { upsert: true }
  );
}

async function handleMove(socket, row, col) {
  const roomUuid = socket.data.roomUuid;
  if (!roomUuid) {
    socket.emit('errorMessage', 'You are not in a game room yet.');
    return;
  }

  const room = await Room.findOne({ room_uuid: roomUuid });
  if (!room) {
    socket.emit('errorMessage', 'Game room not found.');
    return;
  }

  const game = Reversi.fromState(room.game_state);
  if (game.isGameOver) {
    socket.emit('errorMessage', 'The game has already ended.');
    return;
  }

  if (game.currentPlayer !== socket.data.color) {
    socket.emit('errorMessage', 'It is not your turn.');
    return;
  }

  const validMoves = game.isValidMove(row, col, game.currentPlayer);
  if (!validMoves.length) {
    socket.emit('errorMessage', 'Invalid move.');
    return;
  }

  game.handleMove(row, col);
  room.game_state = game.toState();

  if (game.isGameOver) {
    await room.deleteOne();
  } else {
    room.markModified('game_state');
    await room.save();
  }

  socket.server.to(roomUuid).emit('updateGame', {
    board: game.mat,
    currentPlayer: game.currentPlayer
  });

  if (game.isGameOver) {
    const pcs = calculateScore(game.mat);
    const winningColor = pcs.black > pcs.white ? 'black' : pcs.white > pcs.black ? 'white' : null;
    if (winningColor) {
      const winnerId = winningColor === 'black' ? room.black_player : room.white_player;
      await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country);
    }
    socket.server.to(roomUuid).emit('gameover', pcs);
    debug(chalk.yellow(`Game over in room ${roomUuid}`));
  }
}

async function handleTwelveMorrisMove(socket, data) {
  const roomUuid = socket.data.roomUuid;
  if (!roomUuid) {
    socket.emit('errorMessage', 'You are not in a game room yet.');
    return;
  }

  const room = await Room.findOne({ room_uuid: roomUuid });
  if (!room) {
    socket.emit('errorMessage', 'Game room not found.');
    return;
  }

  const game = TwelveMensMorris.fromState(room.game_state);
  if (game.isGameOver) {
    socket.emit('errorMessage', 'The game has already ended.');
    return;
  }

  if (game.currentPlayer !== socket.data.color) {
    socket.emit('errorMessage', 'It is not your turn.');
    return;
  }

  let moveResult;
  if (game.phase === 'placement') {
    moveResult = game.placePiece(data.position);
  } else {
    moveResult = game.movePiece(data.from, data.to);
  }

  if (!moveResult.success) {
    socket.emit('errorMessage', moveResult.error);
    return;
  }

  // If a mill was made, ask for capture
  if (moveResult.madeMill) {
    const captureTargets = game.getValidCaptureTargets();
    socket.emit('selectCapture', { targets: captureTargets });
    room.game_state = game.toState();
    room.markModified('game_state');
    await room.save();
    return;
  }

  room.game_state = game.toState();

  if (game.isGameOver) {
    await room.deleteOne();
  } else {
    room.markModified('game_state');
    await room.save();
  }

  socket.server.to(roomUuid).emit('updateGame', {
    gameState: game.toState()
  });

  if (game.isGameOver) {
    const winnerId = game.winner === 'black' ? room.black_player : room.white_player;
    await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country);
    socket.server.to(roomUuid).emit('gameover', {
      message: `${game.winner} wins!`
    });
    debug(chalk.yellow(`Game over in room ${roomUuid}`));
  }
}

async function handleGameMove(socket, data) {
  const roomUuid = socket.data.roomUuid;
  const gameType = socket.data.gameType;

  if (!roomUuid) {
    socket.emit('errorMessage', 'You are not in a game room yet.');
    return;
  }

  const room = await Room.findOne({ room_uuid: roomUuid });
  if (!room) {
    socket.emit('errorMessage', 'Game room not found.');
    return;
  }

  let game;
  
  // Handle based on game type
  if (gameType === 'twelvemorris') {
    return await handleTwelveMorrisMove(socket, data);
  } else if (gameType === 'fivefieldkono') {
    game = FiveFieldKono.fromState(room.game_state);
    
    if (game.isGameOver) {
      socket.emit('errorMessage', 'The game has already ended.');
      return;
    }

    if (game.currentPlayer !== socket.data.color) {
      socket.emit('errorMessage', 'It is not your turn.');
      return;
    }

    const moveResult = game.handleMove(data.from, data.to);
    
    if (!moveResult.success) {
      socket.emit('errorMessage', moveResult.error);
      return;
    }

    room.game_state = game.toState();

    if (game.isGameOver) {
      await room.deleteOne();
    } else {
      room.markModified('game_state');
      await room.save();
    }

    socket.server.to(roomUuid).emit('updateGame', {
      gameState: game.toState()
    });

    if (game.isGameOver) {
      const message = game.winner 
        ? `${game.winner} wins!`
        : 'Draw!';
      const winnerId = game.winner === 'black' ? room.black_player : room.white_player;
      await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country);
      socket.server.to(roomUuid).emit('gameover', { message });
      debug(chalk.yellow(`Game over in room ${roomUuid}`));
    }
  }
}

async function handleGetValidMoves(socket, data) {
  const roomUuid = socket.data.roomUuid;
  const gameType = socket.data.gameType;

  if (!roomUuid || gameType !== 'fivefieldkono') {
    return;
  }

  const room = await Room.findOne({ room_uuid: roomUuid });
  if (!room) return;

  const game = FiveFieldKono.fromState(room.game_state);
  const moves = game.getValidMoves(data.from);
  
  socket.emit('validMoves', { moves });
}


async function handleCapture(io, socket, captureData) {
  const roomUuid = socket.data.roomUuid;
  if (!roomUuid) {
    socket.emit('errorMessage', 'You are not in a game room yet.');
    return;
  }

  const room = await Room.findOne({ room_uuid: roomUuid });
  if (!room) {
    socket.emit('errorMessage', 'Game room not found.');
    return;
  }

  const game = TwelveMensMorris.fromState(room.game_state);
  const captureResult = game.capturePiece(captureData.position);

  if (!captureResult.success) {
    socket.emit('errorMessage', captureResult.error);
    return;
  }

  room.game_state = game.toState();

  if (game.isGameOver) {
    await room.deleteOne();
  } else {
    room.markModified('game_state');
    await room.save();
  }

  socket.server.to(roomUuid).emit('updateGame', {
    gameState: game.toState()
  });

  if (game.isGameOver) {
    const winnerId = game.winner === 'black' ? room.black_player : room.white_player;
    await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country);
    socket.server.to(roomUuid).emit('gameover', {
      message: `${game.winner} wins!`
    });
    debug(chalk.yellow(`Game over in room ${roomUuid}`));
  }
}

function calculateScore(board) {
  let white = 0;
  let black = 0;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === 'white') {
        white += 1;
      } else if (board[i][j] === 'black') {
        black += 1;
      }
    }
  }

  return { white, black };
}

async function handleDisconnect(io, socket) {
  removeFromQueue(socket);

  const roomUuid = socket.data.roomUuid;
  if (!roomUuid) {
    return;
  }

  const room = await Room.findOne({ room_uuid: roomUuid });
  if (!room) {
    return;
  }

  const opponentId = room.black_player === socket.id ? room.white_player : room.black_player;
  const opponentSocket = io.sockets.sockets.get(opponentId);

  if (opponentSocket) {
    opponentSocket.emit('player_leave', { message: 'Opponent disconnected.' });
    opponentSocket.leave(roomUuid);
    opponentSocket.data.roomUuid = null;
    opponentSocket.data.color = null;
  }

  if (!room.black_player || !room.white_player) {
    await room.deleteOne();
  } else {
    if (room.black_player === socket.id) {
      room.black_player = '';
    } else if (room.white_player === socket.id) {
      room.white_player = '';
    }
    room.status = 'waiting';
    room.markModified('game_state');
    await room.save();
  }

  debug(chalk.yellow(`Client disconnected: ${socket.id}. Room ${roomUuid} updated.`));
}

module.exports = { setupSocketHandlers };