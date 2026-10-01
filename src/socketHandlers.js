const chalk = require('chalk');
const debug = require('debug')('socketHandlers');
const { Reversi } = require('./catalog/reversi');
const TwelveMensMorris = require('./catalog/twelve-mens-morris');
const FiveFieldKono = require('./catalog/five-field-kono');
const Chaturaji = require('./catalog/chaturaji');
const Xiangqi = require('./catalog/xiangqi');
const Janggi = require('./catalog/janggi');
const Sittuyin = require('./catalog/sittuyin');
const Chaturanga = require('./catalog/chaturanga');
const Shatranj = require('./catalog/shatranj');
const Makruk = require('./catalog/makruk');
const Senterej = require('./catalog/senterej');
const Shatar = require('./catalog/shatar');
const Shatra = require('./catalog/shatra');
const Shogi = require('./catalog/shogi');
const Courier = require('./catalog/courier');
const Hnefatafl = require('./catalog/hnefatafl');
const Dara = require('./catalog/dara');
const Morabaraba = require('./catalog/morabaraba');
const Dala = require('./catalog/dala');
const Picaria = require('./catalog/picaria');
const Shax = require('./catalog/shax');
const TantFant = require('./catalog/tant-fant');
const Tapatan = require('./catalog/tapatan');
const TsoroYematatu = require('./catalog/tsoro-yematatu');
const Wali = require('./catalog/wali');
const HuntGame = require('./catalog/hunt-game');
const Alquerque = require('./catalog/alquerque');
const BaghBandi = require('./catalog/bagh-bandi');
const BugaShadara = require('./catalog/buga-shadara');
const SherBakar = require('./catalog/sher-bakar');
const MainTapalEmpat = require('./catalog/main-tapal-empat');
const RimauRimau = require('./catalog/rimau-rimau');
const MainMachan = require('./catalog/main-machan');
const Meurimueng = require('./catalog/meurimueng');
const Komikan = require('./catalog/komikan');
const Rithmomachia = require('./catalog/rithmomachia');
const NineHoles = require('./catalog/nine-holes');
const Wythoff = require('./catalog/wythoff');
const Chopsticks = require('./catalog/chopsticks');
const Jungle = require('./catalog/jungle');
const SquareChess = require('./catalog/square-chess');
const MuTorere = require('./catalog/mu-torere');
const PongHauKi = require('./catalog/pong-hau-ki');
const BearGame = require('./catalog/bear-game');
const FoxAndHounds = require('./catalog/fox-and-hounds');
const HareGames = require('./catalog/hare-games');
const Ugolkij = require('./catalog/ugolkij');
const Fidchell = require('./catalog/fidchell');
const ArmenianCheckers = require('./catalog/armenian-checkers');
const Astar = require('./catalog/astar');
const KotuEllima = require('./catalog/kotu-ellima');
const SixteenSoldiers = require('./catalog/sixteen-soldiers');
const Peralikatuma = require('./catalog/peralikatuma');
const Terhuchu = require('./catalog/terhuchu');
const PermainanTabal = require('./catalog/permainan-tabal');
const AwithlaknannaiMosona = require('./catalog/awithlaknannai-mosona');
const Bizingo = require('./catalog/bizingo');
const Awithlaknakwe = require('./catalog/awithlaknakwe');
const Butterfly = require('./catalog/butterfly');
const LauKataKati = require('./catalog/lau-kata-kati');
const DashGuti = require('./catalog/dash-guti');
const EgaraGuti = require('./catalog/egara-guti');
const Felli = require('./catalog/felli');
const FourFieldKono = require('./catalog/four-field-kono');
const Gala = require('./catalog/gala');
const Yote = require('./catalog/yote');
const Seega = require('./catalog/seega');
const HighJump = require('./catalog/high-jump');
const ItalianDamone = require('./catalog/italian-damone');
const ItalianCheckers = require('./catalog/italian-checkers');
const JulGonu = require('./catalog/jul-gonu');
const Keny = require('./catalog/keny');
const Kharbaga = require('./catalog/kharbaga');
const KolowisAwithlaknannai = require('./catalog/kolowis-awithlaknannai');
const LiberianQueah = require('./catalog/liberian-queah');
const MakYek = require('./catalog/mak-yek');
const MingMang = require('./catalog/ming-mang');
const Pretwa = require('./catalog/pretwa');
const Sahkku = require('./catalog/sahkku');
const TigerForty = require('./catalog/tiger-forty');
const Surakarta = require('./catalog/surakarta');
const Tobit = require('./catalog/tobit');
const Asalto = require('./catalog/asalto');
const CatchTheHare = require('./catalog/catch-the-hare');
const DemalaDiviyanKeliya = require('./catalog/demala-diviyan-keliya');
const Chomp = require('./catalog/chomp');
const Cram = require('./catalog/cram');
const Renju = require('./catalog/renju');
const TurkishDraughts = require('./catalog/turkish-draughts');
const Konane = require('./catalog/konane');
const WatermelonChess = require('./catalog/watermelon-chess');
const Zamma = require('./catalog/zamma');
const AliGuliMane = require('./catalog/ali-guli-mane');
const ChineseCheckers = require('./catalog/chinese-checkers');
const HatDiviyanKeliya = require('./catalog/hat-diviyan-keliya');
const AleaEvangelii = require('./catalog/alea-evangelii');
const Choko = require('./catalog/choko');
const Crossings = require('./catalog/crossings');
const Kaooa = require('./catalog/kaooa');
const CatalogGames = require('./catalog/catalog-games');
const CatalogClassFor = CatalogGames.getClass;
const Pallanguzhi = require('./catalog/pallanguzhi');
const GoGame = require('./catalog/go');
const Fanorona = require('./catalog/fanorona');
const Checkers = require('./catalog/checkers');
const Tamerlane = require('./catalog/tamerlane');
const HeianShogi = require('./catalog/heian-shogi');
const Gomoku = require('./catalog/gomoku');
const TicTacToe = require('./catalog/tic-tac-toe');
const MorrisVariant = require('./catalog/morris-variants');
const Achi = require('./catalog/achi');
const Shisima = require('./catalog/shisima');
const { Room, CountryWin } = require('./database');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const net = require('net');

const supportedGames = ['reversi', 'twelvemorris', 'fivefieldkono', 'chaturaji', 'xiangqi', 'janggi', 'sittuyin', 'chaturanga', 'shatranj', 'makruk', 'senterej', 'shatar', 'shatra', 'shogi', 'courier', 'hnefatafl', 'tamerlane', 'heianshogi', 'gomoku', 'tictactoe', 'threemorris', 'sixmorris', 'ninemorris', 'achi', 'shisima', 'dara', 'morabaraba', 'dala', 'picaria', 'shax', 'tantfant', 'tapatan', 'tsoro', 'wali', 'baghchal', 'adugo', 'aadupuli', 'alquerque', 'baghbandi', 'bugashadara', 'sherbakar', 'main-tapal-empat', 'rimau-rimau', 'mainmachan', 'meurimueng', 'komikan', 'rithmomachia', 'nineholes', 'wythoff', 'chopsticks', 'jungle', 'squarechess', 'mutorere', 'ponghauki', 'beargames', 'foxandhounds', 'haregames', 'ugolkij', 'fidchell', 'armeniancheckers', 'astar', 'kotuell', 'sixteensoldiers', 'peralikatuma', 'terhuchu', 'permainantabal', 'awithlaknannai', 'bizingo', 'awithlaknakwe', 'butterfly', 'laukata', 'dashguti', 'egaraguti', 'felli', 'fourfieldkono', 'gala', 'yote', 'seega', 'highjump', 'italiandamone', 'italiancheckers', 'julgonu', 'keny', 'kharbaga', 'kolowisawithlaknannai', 'liberianqueah', 'makyek', 'mingmang', 'pretwa', 'sahkku', 'tigerforty', 'surakarta', 'tobit', 'asalto', 'catchthehare', 'demaladiviyankeliya', 'chomp', 'cram', 'renju', 'turkishdraughts', 'konane', 'watermelonchess', 'zamma', 'aligulimane', 'chinesecheckers', 'hatdiviyankeliya', 'aleaevangelii', 'choko', 'crossings', 'kaooa', 'cinc-camins', 'dablot-prejjesne', 'daldos', 'fanorona', 'go', 'grundys-game', 'five-lines', 'bul', 'circular-chess', 'frisian-draughts', 'gonu', 'ko-shogi', 'lambs-and-tigers', 'leap-frog', 'luzhanqi', 'mojo', 'polis', 'backgammon', 'senet', 'mehen'];
supportedGames.push(...CatalogGames);
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

    socket.on('sahkkuRoll', async (data) => {
      await handleSahkkuRoll(socket, data);
    });

    socket.on('getValidMoves', async (data) => {
      await handleGetValidMoves(socket, data);
    });

    socket.on('chaturajiMove', async (data) => {
      await handleChaturajiMove(socket, data);
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
     return; // Early return if player is already queued or in a room
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

  const requiredPlayers = gameType === 'chaturaji' ? 4 : 2;
  while (matchmakingQueue[gameType].length >= requiredPlayers) {
    const playerIds = matchmakingQueue[gameType].splice(0, requiredPlayers);
    playerIds.forEach((playerId) => queuedPlayers.delete(playerId));
    const player1 = playerIds[0];
    const player2 = playerIds[1];

    const playerSockets = playerIds.map((playerId) => io.sockets.sockets.get(playerId));
    const player1Socket = playerSockets[0];
    const player2Socket = playerSockets[1];

    if (playerSockets.some((playerSocket) => !playerSocket)) {
      for (const playerSocket of playerSockets) {
        if (playerSocket) {
          await enqueuePlayer(io, playerSocket, gameType);
        }
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
      case 'chaturaji':
        game = new Chaturaji();
        break;
      case 'xiangqi':
        game = new Xiangqi();
        break;
      case 'janggi':
        game = new Janggi();
        break;
      case 'sittuyin':
        game = new Sittuyin();
        break;
      case 'chaturanga':
        game = new Chaturanga();
        break;
      case 'shatranj':
        game = new Shatranj();
        break;
      case 'makruk':
        game = new Makruk();
        break;
      case 'senterej':
        game = new Senterej();
        break;
      case 'shatar':
        game = new Shatar();
        break;
      case 'shatra':
        game = new Shatra();
        break;
      case 'shogi':
        game = new Shogi();
        break;
      case 'courier':
        game = new Courier();
        break;
      case 'hnefatafl':
        game = new Hnefatafl();
        break;
      case 'tamerlane':
        game = new Tamerlane();
        break;
      case 'heianshogi':
        game = new HeianShogi();
        break;
      case 'gomoku':
        game = new Gomoku();
        break;
      case 'tictactoe':
        game = new TicTacToe();
        break;
      case 'threemorris':
        game = new MorrisVariant(null, 'three');
        break;
      case 'sixmorris':
        game = new MorrisVariant(null, 'six');
        break;
      case 'ninemorris':
        game = new MorrisVariant(null, 'nine');
        break;
      case 'achi':
        game = new Achi();
        break;
      case 'shisima':
        game = new Shisima();
        break;
      case 'dara':
        game = new Dara();
        break;
      case 'morabaraba':
        game = new Morabaraba();
        break;
      case 'dala':
        game = new Dala();
        break;
      case 'picaria':
        game = new Picaria();
        break;
      case 'shax':
        game = new Shax();
        break;
      case 'tantfant':
        game = new TantFant();
        break;
      case 'tapatan':
        game = new Tapatan();
        break;
      case 'tsoro':
        game = new TsoroYematatu();
        break;
      case 'wali':
        game = new Wali();
        break;
      case 'baghchal': case 'adugo': case 'aadupuli':
        game = new HuntGame(null, gameType === 'baghchal' ? 'baghchal' : gameType === 'adugo' ? 'adugo' : 'aadupuli');
        break;
      case 'alquerque':
        game = new Alquerque();
        break;
      case 'baghbandi':
        game = new BaghBandi();
        break;
      case 'bugashadara':
        game = new BugaShadara();
        break;
      case 'sherbakar':
        game = new SherBakar();
        break;
      case 'main-tapal-empat':
        game = new MainTapalEmpat();
        break;
      case 'rimau-rimau':
        game = new RimauRimau();
        break;
      case 'mainmachan':
        game = new MainMachan();
        break;
      case 'meurimueng':
        game = new Meurimueng();
        break;
      case 'komikan':
        game = new Komikan();
        break;
      case 'rithmomachia':
        game = new Rithmomachia();
        break;
      case 'nineholes':
        game = new NineHoles();
        break;
      case 'wythoff':
        game = new Wythoff();
        break;
      case 'chopsticks':
        game = new Chopsticks();
        break;
      case 'jungle':
        game = new Jungle();
        break;
      case 'squarechess':
        game = new SquareChess();
        break;
      case 'mutorere':
        game = new MuTorere();
        break;
      case 'ponghauki':
        game = new PongHauKi();
        break;
      case 'beargames':
        game = new BearGame();
        break;
      case 'foxandhounds':
        game = new FoxAndHounds();
        break;
      case 'haregames':
        game = new HareGames();
        break;
      case 'ugolkij':
        game = new Ugolkij();
        break;
      case 'fidchell':
        game = new Fidchell();
        break;
      case 'armeniancheckers':
        game = new ArmenianCheckers();
        break;
      case 'astar':
        game = new Astar();
        break;
      case 'kotuellima':
        game = new KotuEllima();
        break;
      case 'sixteensoldiers':
        game = new SixteenSoldiers();
        break;
      case 'peralikatuma':
        game = new Peralikatuma();
        break;
      case 'terhuchu':
        game = new Terhuchu();
        break;
      case 'permainantabal':
        game = new PermainanTabal();
        break;
      case 'awithlaknannai':
        game = new AwithlaknannaiMosona();
        break;
      case 'bizingo':
        game = new Bizingo();
        break;
      case 'awithlaknakwe':
        game = new Awithlaknakwe();
        break;
      case 'butterfly':
        game = new Butterfly();
        break;
      case 'laukata':
        game = new LauKataKati();
        break;
      case 'dashguti':
        game = new DashGuti();
        break;
      case 'egaraguti':
        game = new EgaraGuti();
        break;
      case 'felli':
        game = new Felli();
        break;
      case 'fourfieldkono':
        game = new FourFieldKono();
        break;
      case 'gala':
        game = new Gala();
        break;
      case 'yote':
        game = new Yote();
        break;
      case 'seega':
        game = new Seega();
        break;
      case 'highjump':
        game = new HighJump();
        break;
      case 'italiandamone':
        game = new ItalianDamone();
        break;
      case 'italiancheckers':
        game = new ItalianCheckers();
        break;
      case 'julgonu':
        game = new JulGonu();
        break;
      case 'keny':
        game = new Keny();
        break;
      case 'kharbaga':
        game = new Kharbaga();
        break;
      case 'kolowisawithlaknannai':
        game = new KolowisAwithlaknannai();
        break;
      case 'liberianqueah':
        game = new LiberianQueah();
        break;
      case 'makyek':
        game = new MakYek();
        break;
      case 'mingmang':
        game = new MingMang();
        break;
      case 'pretwa':
        game = new Pretwa();
        break;
      case 'sahkku':
        game = new Sahkku();
        break;
      case 'tigerforty':
        game = new TigerForty();
        break;
      case 'surakarta':
        game = new Surakarta();
        break;
      case 'tobit':
        game = new Tobit();
        break;
      case 'asalto':
        game = new Asalto();
        break;
      case 'catchthehare':
        game = new CatchTheHare();
        break;
      case 'demaladiviyankeliya':
        game = new DemalaDiviyanKeliya();
        break;
      case 'chomp':
        game = new Chomp();
        break;
      case 'cram':
        game = new Cram();
        break;
      case 'renju':
        game = new Renju();
        break;
      case 'turkishdraughts':
        game = new TurkishDraughts();
        break;
      case 'konane':
        game = new Konane();
        break;
      case 'watermelonchess':
        game = new WatermelonChess();
        break;
      case 'zamma':
        game = new Zamma();
        break;
      case 'aligulimane':
        game = new AliGuliMane();
        break;
      case 'chinesecheckers':
        game = new ChineseCheckers();
        break;
      case 'hatdiviyankeliya':
        game = new HatDiviyanKeliya();
        break;
      case 'aleaevangelii':
        game = new AleaEvangelii();
        break;
      case 'choko':
        game = new Choko();
        break;
      case 'crossings':
        game = new Crossings();
        break;
      case 'kaooa':
        game = new Kaooa();
        break;
      case 'pallanguzhi':
        game = new Pallanguzhi();
        break;
      case 'go':
        game = new GoGame();
        break;
      case 'fanorona':
        game = new Fanorona();
        break;
      case 'checkers':
        game = new Checkers();
        break;
      default:
        if (CatalogGames.includes(gameType)) {
          const GameClass = CatalogClassFor(gameType);
          if (!GameClass) {
            debug(chalk.red(`Missing engine for catalog game: ${gameType}`));
            return;
          }
          game = new GameClass();
          break;
        }
        debug(chalk.red(`Unsupported game type: ${gameType}`));
        return;
    }

    const room = new Room({
      room_uuid: roomUuid,
      black_player: player1,
      white_player: player2,
      status: 'active',
      game_type: gameType,
      game_state: game.toState(),
      players: gameType === 'chaturaji'
        ? playerIds.map((socketId, index) => ({ socket_id: socketId, color: ['red', 'blue', 'yellow', 'green'][index] }))
        : []
    });
    await room.save();

    playerSockets.forEach((playerSocket, index) => {
      playerSocket.join(roomUuid);
      playerSocket.data.roomUuid = roomUuid;
      playerSocket.data.color = gameType === 'chaturaji'
        ? ['red', 'blue', 'yellow', 'green'][index]
        : gameType === 'xiangqi' ? (index === 0 ? 'red' : 'black')
          : gameType === 'janggi' ? (index === 0 ? 'blue' : 'red')
          : gameType === 'sittuyin' ? (index === 0 ? 'red' : 'black')
          : ['chaturanga', 'shatranj'].includes(gameType) ? (index === 0 ? 'white' : 'black')
          : gameType === 'makruk' ? (index === 0 ? 'white' : 'black')
          : gameType === 'senterej' ? (index === 0 ? 'white' : 'black')
          : gameType === 'shatar' ? (index === 0 ? 'white' : 'black')
          : gameType === 'shatra' ? (index === 0 ? 'white' : 'black')
          : gameType === 'shogi' ? (index === 0 ? 'black' : 'white')
          : gameType === 'courier' ? (index === 0 ? 'white' : 'black')
          : gameType === 'hnefatafl' ? (index === 0 ? 'attackers' : 'defenders')
          : gameType === 'tamerlane' ? (index === 0 ? 'white' : 'black')
          : gameType === 'heianshogi' ? (index === 0 ? 'black' : 'white')
          : gameType === 'gomoku' ? (index === 0 ? 'black' : 'white')
          : gameType === 'tictactoe' ? (index === 0 ? 'x' : 'o')
          : ['threemorris', 'sixmorris', 'ninemorris'].includes(gameType) ? (index === 0 ? 'black' : 'white')
          : ['achi', 'shisima'].includes(gameType) ? (index === 0 ? 'black' : 'white')
          : gameType === 'dara' ? (index === 0 ? 'black' : 'white')
          : gameType === 'morabaraba' ? (index === 0 ? 'black' : 'white')
          : gameType === 'dala' ? (index === 0 ? 'black' : 'white')
          : gameType === 'picaria' ? (index === 0 ? 'black' : 'white')
          : gameType === 'shax' ? (index === 0 ? 'black' : 'white')
          : gameType === 'tantfant' ? (index === 0 ? 'black' : 'white')
          : gameType === 'tapatan' ? (index === 0 ? 'black' : 'white')
          : gameType === 'tsoro' ? (index === 0 ? 'black' : 'white')
          : gameType === 'wali' ? (index === 0 ? 'black' : 'white')
          : ['baghchal', 'adugo', 'aadupuli'].includes(gameType) ? (index === 0 ? 'goats' : 'tigers')
          : gameType === 'alquerque' ? (index === 0 ? 'black' : 'white')
          : gameType === 'baghbandi' ? (index === 0 ? 'goats' : 'tigers')
          : gameType === 'bugashadara' ? (index === 0 ? 'dogs' : 'deer')
          : gameType === 'sherbakar' ? (index === 0 ? 'goats' : 'tigers')
          : gameType === 'main-tapal-empat' ? (index === 0 ? 'goats' : 'tigers')
          : gameType === 'rimau-rimau' ? (index === 0 ? 'men' : 'tigers')
          : gameType === 'mainmachan' ? (index === 0 ? 'children' : 'women')
          : gameType === 'meurimueng' ? (index === 0 ? 'sheep' : 'tigers')
          : gameType === 'komikan' ? (index === 0 ? 'sheep' : 'puma')
          : gameType === 'rithmomachia' ? (index === 0 ? 'white' : 'black')
          : gameType === 'nineholes' ? (index === 0 ? 'black' : 'white')
          : gameType === 'wythoff' ? (index === 0 ? 'black' : 'white')
          : gameType === 'chopsticks' ? (index === 0 ? 'black' : 'white')
          : gameType === 'jungle' ? (index === 0 ? 'black' : 'white')
          : gameType === 'squarechess' ? (index === 0 ? 'black' : 'white')
          : gameType === 'mutorere' ? (index === 0 ? 'black' : 'white')
          : gameType === 'ponghauki' ? (index === 0 ? 'black' : 'white')
          : gameType === 'beargames' ? (index === 0 ? 'hunters' : 'bear')
          : gameType === 'foxandhounds' ? (index === 0 ? 'fox' : 'hounds')
          : gameType === 'haregames' ? (index === 0 ? 'hounds' : 'hare')
          : gameType === 'ugolkij' ? (index === 0 ? 'black' : 'white')
          : gameType === 'fidchell' ? (index === 0 ? 'black' : 'white')
          : gameType === 'armeniancheckers' ? (index === 0 ? 'black' : 'white')
          : gameType === 'astar' ? (index === 0 ? 'black' : 'white')
          : gameType === 'kotuellima' ? (index === 0 ? 'black' : 'white')
          : gameType === 'sixteensoldiers' ? (index === 0 ? 'black' : 'white')
          : gameType === 'peralikatuma' ? (index === 0 ? 'black' : 'white')
          : gameType === 'terhuchu' ? (index === 0 ? 'black' : 'white')
          : gameType === 'permainantabal' ? (index === 0 ? 'black' : 'white')
          : gameType === 'awithlaknannai' ? (index === 0 ? 'black' : 'white')
          : gameType === 'bizingo' ? (index === 0 ? 'black' : 'white')
          : gameType === 'awithlaknakwe' ? (index === 0 ? 'black' : 'white')
          : gameType === 'butterfly' ? (index === 0 ? 'black' : 'white')
          : gameType === 'laukata' ? (index === 0 ? 'black' : 'white')
          : gameType === 'dashguti' ? (index === 0 ? 'black' : 'white')
          : gameType === 'egaraguti' ? (index === 0 ? 'black' : 'white')
          : gameType === 'felli' ? (index === 0 ? 'black' : 'white')
          : gameType === 'fourfieldkono' ? (index === 0 ? 'black' : 'white')
          : gameType === 'gala' ? (index === 0 ? 'black' : 'white')
          : gameType === 'yote' ? (index === 0 ? 'black' : 'white')
          : gameType === 'seega' ? (index === 0 ? 'black' : 'white')
          : gameType === 'highjump' ? (index === 0 ? 'black' : 'white')
          : gameType === 'italiandamone' ? (index === 0 ? 'black' : 'white')
          : gameType === 'italiancheckers' ? (index === 0 ? 'black' : 'white')
          : gameType === 'julgonu' ? (index === 0 ? 'black' : 'white')
          : gameType === 'keny' ? (index === 0 ? 'black' : 'white')
          : gameType === 'kharbaga' ? (index === 0 ? 'black' : 'white')
          : gameType === 'kolowisawithlaknannai' ? (index === 0 ? 'black' : 'white')
          : gameType === 'liberianqueah' ? (index === 0 ? 'black' : 'white')
          : gameType === 'makyek' ? (index === 0 ? 'black' : 'white')
          : gameType === 'mingmang' ? (index === 0 ? 'black' : 'white')
          : gameType === 'pretwa' ? (index === 0 ? 'black' : 'white')
          : gameType === 'sahkku' ? (index === 0 ? 'black' : 'white')
          : gameType === 'tigerforty' ? (index === 0 ? 'black' : 'white')
          : gameType === 'surakarta' ? (index === 0 ? 'black' : 'white')
          : gameType === 'tobit' ? (index === 0 ? 'black' : 'white')
          : gameType === 'asalto' ? (index === 0 ? 'rebels' : 'officers')
          : gameType === 'catchthehare' ? (index === 0 ? 'hunters' : 'hare')
          : gameType === 'demaladiviyankeliya' ? (index === 0 ? 'dogs' : 'leopards')
          : ['chomp', 'cram', 'renju', 'turkishdraughts', 'konane', 'watermelonchess', 'zamma', 'aligulimane', 'chinesecheckers', 'hatdiviyankeliya'].includes(gameType) ? (index === 0 ? 'black' : 'white')
          : index === 0 ? 'black' : 'white';
      playerSocket.data.gameType = gameType;
    });

    const gameState = game.toState();
    playerSockets.forEach((playerSocket, index) => {
      playerSocket.emit('roomFound', {
        roomUuid,
        color: gameType === 'chaturaji' ? ['red', 'blue', 'yellow', 'green'][index]
          : gameType === 'xiangqi' ? (index === 0 ? 'red' : 'black')
            : gameType === 'janggi' ? (index === 0 ? 'blue' : 'red')
            : gameType === 'sittuyin' ? (index === 0 ? 'red' : 'black')
            : ['chaturanga', 'shatranj'].includes(gameType) ? (index === 0 ? 'white' : 'black')
            : gameType === 'makruk' ? (index === 0 ? 'white' : 'black')
            : gameType === 'senterej' ? (index === 0 ? 'white' : 'black')
            : gameType === 'shatar' ? (index === 0 ? 'white' : 'black')
            : gameType === 'shatra' ? (index === 0 ? 'white' : 'black')
            : gameType === 'shogi' ? (index === 0 ? 'black' : 'white')
            : gameType === 'courier' ? (index === 0 ? 'white' : 'black')
            : gameType === 'hnefatafl' ? (index === 0 ? 'attackers' : 'defenders')
            : gameType === 'tamerlane' ? (index === 0 ? 'white' : 'black')
            : gameType === 'heianshogi' ? (index === 0 ? 'black' : 'white')
            : gameType === 'gomoku' ? (index === 0 ? 'black' : 'white')
            : gameType === 'tictactoe' ? (index === 0 ? 'x' : 'o')
            : ['threemorris', 'sixmorris', 'ninemorris'].includes(gameType) ? (index === 0 ? 'black' : 'white')
            : ['achi', 'shisima'].includes(gameType) ? (index === 0 ? 'black' : 'white')
            : gameType === 'dara' ? (index === 0 ? 'black' : 'white')
            : gameType === 'morabaraba' ? (index === 0 ? 'black' : 'white')
            : gameType === 'dala' ? (index === 0 ? 'black' : 'white')
            : gameType === 'picaria' ? (index === 0 ? 'black' : 'white')
            : gameType === 'shax' ? (index === 0 ? 'black' : 'white')
            : gameType === 'tantfant' ? (index === 0 ? 'black' : 'white')
            : gameType === 'tapatan' ? (index === 0 ? 'black' : 'white')
            : gameType === 'tsoro' ? (index === 0 ? 'black' : 'white')
            : gameType === 'wali' ? (index === 0 ? 'black' : 'white')
            : ['baghchal', 'adugo', 'aadupuli'].includes(gameType) ? (index === 0 ? 'goats' : 'tigers')
            : gameType === 'alquerque' ? (index === 0 ? 'black' : 'white')
            : gameType === 'baghbandi' ? (index === 0 ? 'goats' : 'tigers')
            : gameType === 'bugashadara' ? (index === 0 ? 'dogs' : 'deer')
            : gameType === 'sherbakar' ? (index === 0 ? 'goats' : 'tigers')
            : gameType === 'main-tapal-empat' ? (index === 0 ? 'goats' : 'tigers')
            : gameType === 'rimau-rimau' ? (index === 0 ? 'men' : 'tigers')
            : gameType === 'mainmachan' ? (index === 0 ? 'children' : 'women')
            : gameType === 'meurimueng' ? (index === 0 ? 'sheep' : 'tigers')
            : gameType === 'komikan' ? (index === 0 ? 'sheep' : 'puma')
            : gameType === 'rithmomachia' ? (index === 0 ? 'white' : 'black')
            : gameType === 'nineholes' ? (index === 0 ? 'black' : 'white')
            : gameType === 'wythoff' ? (index === 0 ? 'black' : 'white')
            : gameType === 'chopsticks' ? (index === 0 ? 'black' : 'white')
            : gameType === 'jungle' ? (index === 0 ? 'black' : 'white')
            : gameType === 'squarechess' ? (index === 0 ? 'black' : 'white')
            : gameType === 'mutorere' ? (index === 0 ? 'black' : 'white')
            : gameType === 'ponghauki' ? (index === 0 ? 'black' : 'white')
            : gameType === 'beargames' ? (index === 0 ? 'hunters' : 'bear')
            : gameType === 'foxandhounds' ? (index === 0 ? 'fox' : 'hounds')
            : gameType === 'haregames' ? (index === 0 ? 'hounds' : 'hare')
            : gameType === 'ugolkij' ? (index === 0 ? 'black' : 'white')
            : gameType === 'fidchell' ? (index === 0 ? 'black' : 'white')
            : gameType === 'armeniancheckers' ? (index === 0 ? 'black' : 'white')
            : gameType === 'astar' ? (index === 0 ? 'black' : 'white')
            : gameType === 'kotuellima' ? (index === 0 ? 'black' : 'white')
            : gameType === 'sixteensoldiers' ? (index === 0 ? 'black' : 'white')
            : gameType === 'peralikatuma' ? (index === 0 ? 'black' : 'white')
            : gameType === 'terhuchu' ? (index === 0 ? 'black' : 'white')
            : gameType === 'permainantabal' ? (index === 0 ? 'black' : 'white')
            : gameType === 'awithlaknannai' ? (index === 0 ? 'black' : 'white')
            : gameType === 'bizingo' ? (index === 0 ? 'black' : 'white')
            : gameType === 'awithlaknakwe' ? (index === 0 ? 'black' : 'white')
            : gameType === 'butterfly' ? (index === 0 ? 'black' : 'white')
            : gameType === 'laukata' ? (index === 0 ? 'black' : 'white')
            : gameType === 'dashguti' ? (index === 0 ? 'black' : 'white')
            : gameType === 'egaraguti' ? (index === 0 ? 'black' : 'white')
            : gameType === 'felli' ? (index === 0 ? 'black' : 'white')
            : gameType === 'fourfieldkono' ? (index === 0 ? 'black' : 'white')
            : gameType === 'gala' ? (index === 0 ? 'black' : 'white')
            : gameType === 'yote' ? (index === 0 ? 'black' : 'white')
            : gameType === 'seega' ? (index === 0 ? 'black' : 'white')
            : gameType === 'highjump' ? (index === 0 ? 'black' : 'white')
            : gameType === 'italiandamone' ? (index === 0 ? 'black' : 'white')
            : gameType === 'italiancheckers' ? (index === 0 ? 'black' : 'white')
            : gameType === 'julgonu' ? (index === 0 ? 'black' : 'white')
            : gameType === 'keny' ? (index === 0 ? 'black' : 'white')
            : gameType === 'kharbaga' ? (index === 0 ? 'black' : 'white')
            : gameType === 'kolowisawithlaknannai' ? (index === 0 ? 'black' : 'white')
            : gameType === 'liberianqueah' ? (index === 0 ? 'black' : 'white')
            : gameType === 'makyek' ? (index === 0 ? 'black' : 'white')
            : gameType === 'mingmang' ? (index === 0 ? 'black' : 'white')
            : gameType === 'pretwa' ? (index === 0 ? 'black' : 'white')
            : gameType === 'sahkku' ? (index === 0 ? 'black' : 'white')
            : gameType === 'tigerforty' ? (index === 0 ? 'black' : 'white')
            : gameType === 'surakarta' ? (index === 0 ? 'black' : 'white')
            : gameType === 'tobit' ? (index === 0 ? 'black' : 'white')
            : gameType === 'asalto' ? (index === 0 ? 'rebels' : 'officers')
            : gameType === 'catchthehare' ? (index === 0 ? 'hunters' : 'hare')
            : gameType === 'demaladiviyankeliya' ? (index === 0 ? 'dogs' : 'leopards')
            : ['chomp', 'cram', 'renju', 'turkishdraughts', 'konane', 'watermelonchess', 'zamma', 'aligulimane', 'chinesecheckers', 'hatdiviyankeliya'].includes(gameType) ? (index === 0 ? 'black' : 'white')
            : index === 0 ? 'black' : 'white',
        board: gameType === 'reversi' ? game.mat : gameState.board,
        currentPlayer: gameState.currentPlayer,
        gameState
      });
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
  } else if (gameType === 'chaturaji') {
    return await handleChaturajiMove(socket, data);
  } else if (gameType === 'xiangqi') {
    return await handleXiangqiMove(socket, data);
  } else if (gameType === 'janggi') {
    return await handleJanggiMove(socket, data);
  } else if (gameType === 'sittuyin') {
    return await handleSittuyinMove(socket, data);
  } else if (gameType === 'chaturanga') {
    return await handleAncientChessMove(socket, data, Chaturanga);
  } else if (gameType === 'shatranj') {
    return await handleAncientChessMove(socket, data, Shatranj);
  } else if (gameType === 'makruk') {
    return await handleAncientChessMove(socket, data, Makruk);
  } else if (gameType === 'senterej') {
    return await handleAncientChessMove(socket, data, Senterej);
  } else if (gameType === 'shatar') {
    return await handleAncientChessMove(socket, data, Shatar);
  } else if (gameType === 'shatra') {
    return await handleShatraMove(socket, data);
  } else if (gameType === 'shogi') {
    return await handleShogiMove(socket, data);
  } else if (gameType === 'courier') {
    return await handleAncientChessMove(socket, data, Courier);
  } else if (gameType === 'hnefatafl') {
    return await handleHnefataflMove(socket, data);
  } else if (gameType === 'tamerlane') {
    return await handleAncientChessMove(socket, data, Tamerlane);
  } else if (gameType === 'heianshogi') {
    return await handleAncientChessMove(socket, data, HeianShogi);
  } else if (gameType === 'gomoku') {
    return await handleGomokuMove(socket, data);
  } else if (gameType === 'tictactoe') {
    return await handleTicTacToeMove(socket, data);
  } else if (['threemorris', 'sixmorris', 'ninemorris'].includes(gameType)) {
    return await handleMorrisVariantMove(socket, data, gameType === 'threemorris' ? 'three' : gameType === 'sixmorris' ? 'six' : 'nine');
  } else if (gameType === 'achi') {
    return await handleAlignmentMove(socket, data, Achi);
  } else if (gameType === 'shisima') {
    return await handleAlignmentMove(socket, data, Shisima);
  } else if (gameType === 'dara') {
    return await handleAlignmentMove(socket, data, Dara);
  } else if (gameType === 'morabaraba') {
    return await handleTwelveMorrisMove(socket, data);
  } else if (gameType === 'dala') {
    return await handleAlignmentMove(socket, data, Dala);
  } else if (gameType === 'picaria') {
    return await handleAlignmentMove(socket, data, Picaria);
  } else if (gameType === 'shax') {
    return await handleTwelveMorrisMove(socket, data);
  } else if (gameType === 'tantfant') {
    return await handleAlignmentMove(socket, data, TantFant);
  } else if (gameType === 'tapatan') {
    return await handleMorrisVariantMove(socket, data, 'three');
  } else if (gameType === 'tsoro') {
    return await handleAlignmentMove(socket, data, TsoroYematatu);
  } else if (gameType === 'wali') {
    return await handleAlignmentMove(socket, data, Wali);
  } else if (['baghchal', 'adugo', 'aadupuli'].includes(gameType)) {
    return await handleHuntMove(socket, data, gameType);
  } else if (gameType === 'alquerque') {
    return await handleAlignmentMove(socket, data, Alquerque);
  } else if (gameType === 'baghbandi') {
    return await handleAlignmentMove(socket, data, BaghBandi);
  } else if (gameType === 'bugashadara') {
    return await handleAlignmentMove(socket, data, BugaShadara);
  } else if (gameType === 'sherbakar') {
    return await handleAlignmentMove(socket, data, SherBakar);
  } else if (gameType === 'main-tapal-empat') {
    return await handleAlignmentMove(socket, data, MainTapalEmpat);
  } else if (gameType === 'rimau-rimau') {
    return await handleAlignmentMove(socket, data, RimauRimau);
  } else if (gameType === 'mainmachan') {
    return await handleAlignmentMove(socket, data, MainMachan);
  } else if (gameType === 'meurimueng') {
    return await handleAlignmentMove(socket, data, Meurimueng);
  } else if (gameType === 'komikan') {
    return await handleHuntMove(socket, data, 'adugo');
  } else if (gameType === 'rithmomachia') {
    return await handleAncientChessMove(socket, data, Rithmomachia);
  } else if (gameType === 'nineholes') {
    return await handleMorrisVariantMove(socket, data, 'three');
  } else if (gameType === 'wythoff') {
    return await handleWythoffMove(socket, data);
  } else if (gameType === 'chopsticks') {
    return await handleChopsticksMove(socket, data);
  } else if (gameType === 'jungle') {
    return await handleJungleMove(socket, data);
  } else if (gameType === 'squarechess') {
    return await handleSquareChessMove(socket, data);
  } else if (gameType === 'mutorere') {
    return await handleMuTorereMove(socket, data);
  } else if (gameType === 'ponghauki') {
    return await handlePongHauKiMove(socket, data);
  } else if (gameType === 'beargames') {
    return await handleBearGameMove(socket, data);
  } else if (gameType === 'foxandhounds') {
    return await handleFoxAndHoundsMove(socket, data);
  } else if (gameType === 'haregames') {
    return await handleHareGamesMove(socket, data);
  } else if (gameType === 'ugolkij') {
    return await handleUgolkijMove(socket, data);
  } else if (gameType === 'fidchell') {
    return await handleFidchellMove(socket, data);
  } else if (gameType === 'armeniancheckers') {
    return await handleArmenianCheckersMove(socket, data);
  } else if (gameType === 'astar') {
    return await handleAstarMove(socket, data);
  } else if (gameType === 'kotuellima') {
    return await handleKotuEllimaMove(socket, data);
  } else if (gameType === 'sixteensoldiers') {
    return await handleSixteenSoldiersMove(socket, data);
  } else if (gameType === 'peralikatuma') {
    return await handlePeralikatumaMove(socket, data);
  } else if (gameType === 'terhuchu') {
    return await handleTerhuchuMove(socket, data);
  } else if (gameType === 'permainantabal') {
    return await handlePermainanTabalMove(socket, data);
  } else if (gameType === 'awithlaknannai') {
    return await handleAwithlaknannaiMove(socket, data);
  } else if (gameType === 'bizingo') {
    return await handleBizingoMove(socket, data);
  } else if (gameType === 'awithlaknakwe') {
    return await handleAwithlaknakweMove(socket, data);
  } else if (gameType === 'butterfly') {
    return await handleButterflyMove(socket, data);
  } else if (gameType === 'laukata') {
    return await handleLauKataKatiMove(socket, data);
  } else if (gameType === 'dashguti') {
    return await handleDashGutiMove(socket, data);
  } else if (gameType === 'egaraguti') {
    return await handleEgaraGutiMove(socket, data);
  } else if (gameType === 'felli') {
    return await handleFelliMove(socket, data);
  } else if (gameType === 'fourfieldkono') {
    return await handleFourFieldKonoMove(socket, data);
  } else if (gameType === 'gala') {
    return await handleGalaMove(socket, data);
  } else if (gameType === 'yote') {
    return await handleYoteMove(socket, data);
  } else if (gameType === 'seega') {
    return await handleSeegaMove(socket, data);
  } else if (gameType === 'highjump') {
    return await handleHighJumpMove(socket, data);
  } else if (gameType === 'italiandamone') {
    return await handleItalianDamoneMove(socket, data);
  } else if (gameType === 'italiancheckers') {
    return await handleItalianCheckersMove(socket, data);
  } else if (gameType === 'julgonu') {
    return await handleJulGonuMove(socket, data);
  } else if (gameType === 'keny') {
    return await handleKenyMove(socket, data);
  } else if (gameType === 'kharbaga') {
    return await handleKharbagaMove(socket, data);
  } else if (gameType === 'kolowisawithlaknannai') {
    return await handleKolowisAwithlaknannaiMove(socket, data);
  } else if (gameType === 'liberianqueah') {
    return await handleLiberianQueahMove(socket, data);
  } else if (gameType === 'makyek') {
    return await handleMakYekMove(socket, data);
  } else if (gameType === 'mingmang') {
    return await handleMingMangMove(socket, data);
  } else if (gameType === 'pretwa') {
    return await handlePretwaMove(socket, data);
  } else if (gameType === 'sahkku') {
    return await handleSahkkuMove(socket, data);
  } else if (gameType === 'tigerforty') {
    return await handleTigerFortyMove(socket, data);
  } else if (gameType === 'surakarta') {
    return await handleSurakartaMove(socket, data);
  } else if (gameType === 'tobit') {
    return await handleTobitMove(socket, data);
  } else if (gameType === 'asalto') {
    return await handleAsaltoMove(socket, data);
  } else if (gameType === 'catchthehare') {
    return await handleCatchTheHareMove(socket, data);
  } else if (gameType === 'demaladiviyankeliya') {
    return await handleDemalaDiviyanKeliyaMove(socket, data);
  } else if (gameType === 'chomp') {
    return await handleSimpleGameMove(socket, data, Chomp);
  } else if (gameType === 'cram') {
    return await handleSimpleGameMove(socket, data, Cram);
  } else if (gameType === 'renju') {
    return await handleSimpleGameMove(socket, data, Renju);
  } else if (gameType === 'turkishdraughts') {
    return await handleSimpleGameMove(socket, data, TurkishDraughts);
  } else if (gameType === 'konane') {
    return await handleSimpleGameMove(socket, data, Konane);
  } else if (['watermelonchess', 'zamma', 'aligulimane', 'chinesecheckers', 'hatdiviyankeliya', 'aleaevangelii', 'choko', 'crossings', 'kaooa'].includes(gameType)) {
    return await handleSimpleGameMove(socket, data, gameType === 'watermelonchess' ? WatermelonChess : gameType === 'zamma' ? Zamma : gameType === 'aligulimane' ? AliGuliMane : gameType === 'chinesecheckers' ? ChineseCheckers : gameType === 'hatdiviyankeliya' ? HatDiviyanKeliya : gameType === 'aleaevangelii' ? AleaEvangelii : gameType === 'choko' ? Choko : gameType === 'crossings' ? Crossings : Kaooa);
  } else if (gameType === 'go') {
    return await handleSimpleGameMove(socket, data, GoGame);
  } else if (gameType === 'fanorona') {
    return await handleSimpleGameMove(socket, data, Fanorona);
  } else if (gameType === 'checkers') {
    return await handleSimpleGameMove(socket, data, Checkers);
  } else if (gameType === 'pallanguzhi') {
    return await handleSimpleGameMove(socket, data, Pallanguzhi);
  } else if (CatalogGames.includes(gameType)) {
    const GameClass = CatalogClassFor(gameType);
    if (!GameClass) {
      socket.emit('errorMessage', `No engine is registered for ${gameType}.`);
      return;
    }
    return await handleSimpleGameMove(socket, data, GameClass);
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

async function handleXiangqiMove(socket, data) {
  const roomUuid = socket.data.roomUuid;
  const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) {
    socket.emit('errorMessage', 'Game room not found.');
    return;
  }
  const game = Xiangqi.fromState(room.game_state);
  if (game.currentPlayer !== socket.data.color) {
    socket.emit('errorMessage', 'It is not your turn.');
    return;
  }
  const result = game.move(data.from.row, data.from.col, data.to.row, data.to.col);
  if (!result.success) {
    socket.emit('errorMessage', result.error);
    return;
  }
  room.game_state = game.toState();
  if (game.isGameOver) await room.deleteOne();
  else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
  if (game.isGameOver) {
    const winnerId = game.winner === 'red' ? room.black_player : room.white_player;
    await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country);
    socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
  }
}

async function handleJanggiMove(socket, data) {
  const roomUuid = socket.data.roomUuid;
  const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) {
    socket.emit('errorMessage', 'Game room not found.');
    return;
  }
  const game = Janggi.fromState(room.game_state);
  if (game.currentPlayer !== socket.data.color) {
    socket.emit('errorMessage', 'It is not your turn.');
    return;
  }
  const result = game.move(data.from.row, data.from.col, data.to.row, data.to.col);
  if (!result.success) {
    socket.emit('errorMessage', result.error);
    return;
  }
  room.game_state = game.toState();
  if (game.isGameOver) await room.deleteOne();
  else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
  if (game.isGameOver) {
    const winnerId = game.winner === 'blue' ? room.black_player : room.white_player;
    await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country);
    socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
  }
}

async function handleSittuyinMove(socket, data) {
  const roomUuid = socket.data.roomUuid;
  const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Sittuyin.fromState(room.game_state);
  if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.phase === 'deployment'
    ? game.deploy(data.type, data.to.row, data.to.col)
    : game.move(data.from.row, data.from.col, data.to.row, data.to.col);
  if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState();
  if (game.isGameOver) await room.deleteOne();
  else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
  if (game.isGameOver) {
    const winnerId = game.winner === 'red' ? room.black_player : room.white_player;
    await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country);
    socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
  }
}

async function handleAncientChessMove(socket, data, GameClass) {
  const roomUuid = socket.data.roomUuid;
  const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = GameClass.fromState(room.game_state);
  if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from.row, data.from.col, data.to.row, data.to.col);
  if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState();
  if (game.isGameOver) await room.deleteOne();
  else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
  if (game.isGameOver) {
    const winnerId = game.winner === 'white' ? room.black_player : room.white_player;
    await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country);
    socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
  }
}

async function handleShatraMove(socket, data) {
  const roomUuid = socket.data.roomUuid;
  const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Shatra.fromState(room.game_state);
  if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from.index, data.to.index);
  if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState();
  if (game.isGameOver) await room.deleteOne();
  else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
  if (game.isGameOver) {
    const winnerId = game.winner === 'white' ? room.black_player : room.white_player;
    await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country);
    socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
  }
}

async function handleShogiMove(socket, data) {
  const roomUuid = socket.data.roomUuid;
  const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Shogi.fromState(room.game_state);
  if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = data.drop ? game.drop(data.type, data.to.row, data.to.col) : game.move(data.from.row, data.from.col, data.to.row, data.to.col, data.promote);
  if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState();
  if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
  if (game.isGameOver) { const winnerId = game.winner === 'black' ? room.black_player : room.white_player; await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country); socket.server.to(roomUuid).emit('gameover', { winner: game.winner }); }
}

async function handleHnefataflMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Hnefatafl.fromState(room.game_state); const result = game.move(data.from.row, data.from.col, data.to.row, data.to.col);
  if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
  if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleGomokuMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Gomoku.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.row, data.col); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
  if (game.isGameOver) { if (game.winner !== 'draw') { const winnerId = game.winner === 'black' ? room.black_player : room.white_player; await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country); } socket.server.to(roomUuid).emit('gameover', { winner: game.winner }); }
}

async function handleTicTacToeMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = TicTacToe.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.position); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
  if (game.isGameOver) { if (game.winner !== 'draw') { const winnerId = game.winner === 'x' ? room.black_player : room.white_player; await recordWin(socket.server.sockets.sockets.get(winnerId)?.data.country); } socket.server.to(roomUuid).emit('gameover', { winner: game.winner }); }
}

async function handleWythoffMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Wythoff.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.removeA, data.removeB); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleChopsticksMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Chopsticks.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.type, data.from, data.to, data.amount); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleJungleMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Jungle.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleSquareChessMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = SquareChess.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleMuTorereMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = MuTorere.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handlePongHauKiMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = PongHauKi.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleBearGameMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = BearGame.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleFoxAndHoundsMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = FoxAndHounds.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleHareGamesMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = HareGames.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleUgolkijMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Ugolkij.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleFidchellMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Fidchell.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleArmenianCheckersMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = ArmenianCheckers.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleAstarMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Astar.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleKotuEllimaMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = KotuEllima.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleSixteenSoldiersMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = SixteenSoldiers.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handlePeralikatumaMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Peralikatuma.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleTerhuchuMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Terhuchu.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handlePermainanTabalMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = PermainanTabal.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleAwithlaknannaiMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = AwithlaknannaiMosona.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleBizingoMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Bizingo.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleAwithlaknakweMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Awithlaknakwe.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleButterflyMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Butterfly.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleLauKataKatiMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = LauKataKati.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleDashGutiMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = DashGuti.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleEgaraGutiMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = EgaraGuti.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleFelliMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Felli.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleFourFieldKonoMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = FourFieldKono.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleGalaMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Gala.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleYoteMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Yote.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to, data.remove); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleSeegaMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Seega.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleHighJumpMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = HighJump.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleItalianDamoneMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = ItalianDamone.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleItalianCheckersMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = ItalianCheckers.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleJulGonuMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = JulGonu.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleKenyMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Keny.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleKharbagaMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Kharbaga.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleKolowisAwithlaknannaiMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = KolowisAwithlaknannai.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleLiberianQueahMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = LiberianQueah.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleMakYekMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = MakYek.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleMingMangMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = MingMang.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handlePretwaMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Pretwa.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleSahkkuRoll(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Sahkku.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.rollDice(data?.value); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); room.markModified('game_state'); await room.save(); socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
}

async function handleSahkkuMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Sahkku.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = data.activate ? game.activate(data.index) : game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleTigerFortyMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = TigerForty.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleSurakartaMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Surakarta.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleTobitMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Tobit.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleAsaltoMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = Asalto.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleCatchTheHareMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = CatchTheHare.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleDemalaDiviyanKeliyaMove(socket, data) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = DemalaDiviyanKeliya.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleSimpleGameMove(socket, data, GameClass) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = GameClass.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.row ?? data.from, data.col ?? data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleMorrisVariantMove(socket, data, variant) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = MorrisVariant.fromState(room.game_state, variant); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.phase === 'placement' ? game.place(data.position) : game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
}

async function handleAlignmentMove(socket, data, GameClass) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = GameClass.fromState(room.game_state); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleHuntMove(socket, data, gameType) {
  const roomUuid = socket.data.roomUuid; const room = roomUuid && await Room.findOne({ room_uuid: roomUuid });
  if (!room) { socket.emit('errorMessage', 'Game room not found.'); return; }
  const game = HuntGame.fromState(room.game_state, gameType); if (game.currentPlayer !== socket.data.color) { socket.emit('errorMessage', 'It is not your turn.'); return; }
  const result = game.move(data.from, data.to); if (!result.success) { socket.emit('errorMessage', result.error); return; }
  room.game_state = game.toState(); if (game.isGameOver) await room.deleteOne(); else { room.markModified('game_state'); await room.save(); }
  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() }); if (game.isGameOver) socket.server.to(roomUuid).emit('gameover', { winner: game.winner });
}

async function handleChaturajiMove(socket, data) {
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

  const game = Chaturaji.fromState(room.game_state);
  if (game.currentPlayer !== socket.data.color) {
    socket.emit('errorMessage', 'It is not your turn.');
    return;
  }

  const result = game.move(data.from.row, data.from.col, data.to.row, data.to.col);
  if (!result.success) {
    socket.emit('errorMessage', result.error);
    return;
  }

  room.game_state = game.toState();
  if (game.isGameOver) {
    await room.deleteOne();
  } else {
    room.markModified('game_state');
    await room.save();
  }

  socket.server.to(roomUuid).emit('updateGame', { gameState: game.toState() });
  if (game.isGameOver) {
    const winner = room.players.find((player) => player.color === game.winner);
    const winnerSocket = winner && socket.server.sockets.sockets.get(winner.socket_id);
    await recordWin(winnerSocket?.data.country);
    socket.server.to(roomUuid).emit('gameover', { winner: game.winner, scores: game.players });
  }
}

async function handleGetValidMoves(socket, data) {
  const roomUuid = socket.data.roomUuid;
  const gameType = socket.data.gameType;

  if (!roomUuid || !['fivefieldkono', 'chaturaji', 'xiangqi', 'janggi', 'sittuyin', 'chaturanga', 'shatranj', 'makruk', 'senterej', 'shatar', 'shatra', 'shogi', 'courier', 'hnefatafl', 'tamerlane', 'heianshogi', 'gomoku', 'tictactoe', 'threemorris', 'sixmorris', 'ninemorris', 'achi', 'shisima', 'dara', 'morabaraba', 'dala', 'picaria', 'shax', 'tantfant', 'tapatan', 'tsoro', 'wali', 'baghchal', 'adugo', 'aadupuli', 'alquerque', 'baghbandi', 'bugashadara', 'sherbakar', 'main-tapal-empat', 'rimau-rimau', 'mainmachan', 'meurimueng', 'komikan', 'rithmomachia', 'nineholes', 'wythoff', 'chopsticks', 'jungle', 'squarechess', 'mutorere', 'ponghauki', 'beargames', 'foxandhounds', 'haregames', 'ugolkij', 'fidchell', 'armeniancheckers', 'astar', 'kotuellima', 'sixteensoldiers', 'peralikatuma', 'terhuchu', 'permainantabal', 'awithlaknannai', 'bizingo', 'awithlaknakwe', 'butterfly', 'laukata', 'dashguti', 'egaraguti', 'felli', 'fourfieldkono', 'gala', 'yote', 'seega', 'highjump', 'italiandamone', 'italiancheckers', 'julgonu', 'keny', 'kharbaga', 'kolowisawithlaknannai', 'liberianqueah', 'makyek', 'mingmang', 'pretwa', 'sahkku', 'tigerforty', 'surakarta', 'tobit', 'asalto', 'chomp', 'cram', 'renju', 'turkishdraughts', 'konane', 'watermelonchess', 'zamma', 'aligulimane', 'chinesecheckers', 'hatdiviyankeliya', 'aleaevangelii'].includes(gameType)) {
    return;
  }

  const room = await Room.findOne({ room_uuid: roomUuid });
  if (!room) return;

  const moves = gameType === 'chaturaji'
    ? Chaturaji.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
    : gameType === 'xiangqi'
      ? Xiangqi.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
      : gameType === 'janggi'
        ? Janggi.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
        : gameType === 'sittuyin'
          ? Sittuyin.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
          : ['chaturanga', 'shatranj'].includes(gameType)
            ? (gameType === 'chaturanga' ? Chaturanga.fromState(room.game_state) : Shatranj.fromState(room.game_state)).getValidMoves(data.from.row, data.from.col)
            : gameType === 'makruk'
              ? Makruk.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
              : gameType === 'senterej'
                ? Senterej.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
                : gameType === 'shatar'
                  ? Shatar.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
                : gameType === 'shatra'
                  ? Shatra.fromState(room.game_state).getValidMoves(data.from.index)
                : gameType === 'shogi'
                  ? Shogi.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
                : gameType === 'courier'
                  ? Courier.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
                : gameType === 'hnefatafl'
                  ? Hnefatafl.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
                : gameType === 'tamerlane'
                  ? Tamerlane.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
                : gameType === 'heianshogi'
                  ? HeianShogi.fromState(room.game_state).getValidMoves(data.from.row, data.from.col)
                : gameType === 'gomoku'
                  ? Gomoku.fromState(room.game_state).getValidMoves()
                : gameType === 'tictactoe'
                  ? []
      : FiveFieldKono.fromState(room.game_state).getValidMoves(data.from);
  
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

  if (room.game_type === 'chaturaji') {
    for (const player of room.players || []) {
      if (player.socket_id === socket.id) continue;
      const remainingSocket = io.sockets.sockets.get(player.socket_id);
      if (remainingSocket) {
        remainingSocket.emit('player_leave', { message: 'A Chaturaji player disconnected.' });
        remainingSocket.leave(roomUuid);
        remainingSocket.data.roomUuid = null;
        remainingSocket.data.color = null;
        remainingSocket.data.gameType = null;
      }
    }
    await room.deleteOne();
    debug(chalk.yellow(`Chaturaji room ${roomUuid} closed after disconnect.`));
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

module.exports = { setupSocketHandlers, supportedGames };