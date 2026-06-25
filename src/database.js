const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_uuid: { type: String, required: true, unique: true },
  black_player: { type: String, default: '' },
  white_player: { type: String, default: '' },
  status: { type: String, enum: ['waiting', 'active'], default: 'waiting' },
  game_type: { type: String, enum: ['reversi', 'twelvemorris', 'fivefieldkono'], default: 'reversi' },
  game_state: { type: Object, default: {} }
});

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

const matchmakingSchema = new mongoose.Schema({
  player_id: { type: String, required: true, unique: true },
  joinedAt: { type: Date, default: Date.now }
});

const MatchmakingQueue = mongoose.models.MatchmakingQueue || mongoose.model('MatchmakingQueue', matchmakingSchema);

module.exports = { roomSchema, Room, matchmakingSchema, MatchmakingQueue };