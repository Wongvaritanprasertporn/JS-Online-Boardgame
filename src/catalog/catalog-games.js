const catalogGames = [
  'en-gehe', 'fetaix', 'fitchneal', 'gol-skuish', 'indian-and-jackrabbits', 'irensei', 'len-choa',
  'ludus-latrunculorum', 'makonn', 'paddles', 'pasang', 'ringo', 'szkwa', 'odds-and-evens', 'morra',
  'domino', 'chinese-dominoes', 'khorol', 'mahjong', 'okey', 'chaupar', 'dayakattai', 'ashte-kashte',
  'sho', 'edris-a-jin', 'zohn-ahl', 'yut', 'pachisi', 'patolli', 'yunnori', 'chopat', 'sugoroku',
  'chadarangam', 'banqi', 'braede', 'ashtapada', 'grant-acedrex', 'international-draughts',
  'malaysian-checkers', 'manchu-chess', 'great-chess', 'tibetan-weiqi', 'rock-paper-scissors',
  'fetaix', 'fitchneal', 'leopard-hunt-game', 'tuknanavuhpi', 'tukvnanawopi', 'pulijudam', 'rimau',
  'sua-ghin-gnua', 'tiger-game', 'abacus-checkers', 'cinc-camins-variant', 'five-lines-variant',
  'circular-chess-variant', 'paddles-game', 'pasang-game', 'ringo-game', 'szkwa-game',
  'gyan-chauper', 'pallanguzhi', 'vai-lung-thlan', 'liubo', 'alkkagi', 'dominoes',
  'chasing-the-girls', 'chowka-bhara', 'hounds-and-jackals', 'hyena-chase', 'knossos-board-game',
  'lambs-and-tigers-game', 'lourche', 'nard', 'royal-game-of-ur', 'shengguan-tu', 'tab',
  'toccategli', 'trictrac', 'verquere', 'chess', 'fortress-chess', 'four-handed-chess',
  'grande-acedrex', 'jeson-mor', 'fangqi', 'canadian-checkers', 'checkers', 'fox-games',
  'mlynek-nine-mens-morris', 'meurimueng-rimueng-do', 'meurimueng-rimueng-peuet-ploh',
  'mak-yek-gala', 'aadu-puli-attam', 'tiger-and-buffaloes', 'tiger-game-played-with-forty',
  'cinc-camins', 'dablot-prejjesne', 'daldos', 'grundys-game', 'five-lines', 'bul',
  'circular-chess', 'frisian-draughts', 'gonu', 'ko-shogi', 'lambs-and-tigers',
  'leap-frog', 'luzhanqi', 'mojo', 'polis', 'backgammon', 'senet', 'mehen'
];

const catalogClasses = Object.fromEntries(
  catalogGames.map((game) => [game, require(`./${game}`)])
);

catalogGames.getClass = (game) => catalogClasses[game];

module.exports = catalogGames;
