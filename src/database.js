const mongoose = require('mongoose');
const CatalogGames = require('./catalog/catalog-games');

const roomSchema = new mongoose.Schema({
  room_uuid: { type: String, required: true, unique: true },
  black_player: { type: String, default: '' },
  white_player: { type: String, default: '' },
  status: { type: String, enum: ['waiting', 'active'], default: 'waiting' },
  game_type: { type: String, enum: ['reversi', 'twelvemorris', 'fivefieldkono', 'chaturaji', 'xiangqi', 'janggi', 'sittuyin', 'chaturanga', 'shatranj', 'makruk', 'senterej', 'shatar', 'shatra', 'shogi', 'courier', 'hnefatafl', 'tamerlane', 'heianshogi', 'gomoku', 'tictactoe', 'threemorris', 'sixmorris', 'ninemorris', 'achi', 'shisima', 'dara', 'morabaraba', 'dala', 'picaria', 'shax', 'tantfant', 'tapatan', 'tsoro', 'wali', 'baghchal', 'adugo', 'aadupuli', 'alquerque', 'baghbandi', 'bugashadara', 'sherbakar', 'main-tapal-empat', 'rimau-rimau', 'mainmachan', 'meurimueng', 'komikan', 'rithmomachia', 'nineholes', 'wythoff', 'chopsticks', 'jungle', 'squarechess', 'mutorere', 'ponghauki', 'beargames', 'foxandhounds', 'haregames', 'ugolkij', 'fidchell', 'armeniancheckers', 'astar', 'kotuell', 'sixteensoldiers', 'peralikatuma', 'terhuchu', 'permainantabal', 'awithlaknannai', 'bizingo', 'awithlaknakwe', 'butterfly', 'laukata', 'dashguti', 'egaraguti', 'felli', 'fourfieldkono', 'gala', 'yote', 'seega', 'highjump', 'italiandamone', 'italiancheckers', 'julgonu', 'keny', 'kharbaga', 'kolowisawithlaknannai', 'liberianqueah', 'makyek', 'mingmang', 'pretwa', 'sahkku', 'tigerforty', 'surakarta', 'tobit', 'asalto', 'catchthehare', 'demaladiviyankeliya', 'chomp', 'cram', 'renju', 'turkishdraughts', 'konane', 'watermelonchess', 'zamma', 'aligulimane', 'chinesecheckers', 'hatdiviyankeliya', 'aleaevangelii', 'choko', 'crossings', 'kaooa', 'cinc-camins', 'dablot-prejjesne', 'daldos', 'fanorona', 'go', 'grundys-game', 'five-lines', 'bul', 'circular-chess', 'frisian-draughts', 'gonu', 'ko-shogi', 'lambs-and-tigers', 'leap-frog', 'luzhanqi', 'mojo', 'polis', 'backgammon', 'senet', 'mehen'], default: 'reversi' },
  game_state: { type: Object, default: {} },
  players: { type: [{ socket_id: String, color: String }], default: [] }
});
roomSchema.path('game_type').enum(...CatalogGames);

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

const matchmakingSchema = new mongoose.Schema({
  player_id: { type: String, required: true, unique: true },
  joinedAt: { type: Date, default: Date.now }
});

const MatchmakingQueue = mongoose.models.MatchmakingQueue || mongoose.model('MatchmakingQueue', matchmakingSchema);

const countryWinSchema = new mongoose.Schema({
  country: { type: String, required: true, unique: true, trim: true },
  wins: { type: Number, default: 0, min: 0 }
});

const CountryWin = mongoose.models.CountryWin || mongoose.model('CountryWin', countryWinSchema);

module.exports = { roomSchema, Room, matchmakingSchema, MatchmakingQueue, CountryWin };