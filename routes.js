const express = require('express');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const debug = require('debug')('routes');
const morgan = require('morgan');
const { CountryWin } = require('./src/database');
const CatalogGames = require('./src/catalog/catalog-games');
const { supportedGames } = require('./src/socketHandlers');

const gamePathAliases = {
  twelvemorris: 'twelve-mens-morris', fivefieldkono: 'five-field-kono', heianshogi: 'heian-shogi',
  tictactoe: 'tic-tac-toe', threemorris: 'three-mens-morris', sixmorris: 'six-mens-morris',
  ninemorris: 'nine-mens-morris', tantfant: 'tant-fant', tsoro: 'tsoro-yematatu', baghchal: 'bagh-chal',
  baghbandi: 'bagh-bandi', bugashadara: 'buga-shadara', sherbakar: 'sher-bakar', mingmang: 'ming-mang',
  aadupuli: 'aadu-puli-attam', mainmachan: 'main-machan', nineholes: 'nine-holes', squarechess: 'square-chess',
  mutorere: 'mu-torere', ponghauki: 'pong-hau-ki', beargames: 'bear-games', foxandhounds: 'fox-and-hounds',
  haregames: 'hare-games', armeniancheckers: 'armenian-checkers', kotuell: 'kotu-ellima',
  sixteensoldiers: 'sixteen-soldiers', permainantabal: 'permainan-tabal', awithlaknannai: 'awithlaknannai-mosona',
  laukata: 'lau-kata-kati', dashguti: 'dash-guti', egaraguti: 'egara-guti', fourfieldkono: 'four-field-kono',
  highjump: 'high-jump', italiandamone: 'italian-damone', italiancheckers: 'italian-checkers', julgonu: 'jul-gonu',
  kolowisawithlaknannai: 'kolowis-awithlaknannai', liberianqueah: 'liberian-queah', makyek: 'mak-yek',
  tigerforty: 'tiger-forty', catchthehare: 'catch-the-hare', demaladiviyankeliya: 'demala-diviyan-keliya',
  turkishdraughts: 'turkish-draughts', watermelonchess: 'watermelon-chess', aligulimane: 'ali-guli-mane',
  chinesecheckers: 'chinese-checkers', hatdiviyankeliya: 'hat-diviyan-keliya', aleaevangelii: 'alea-evangelii'
};

function gameTitle(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function siteOrigin(req) {
  return (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
}

function sendSeoPage(req, res, filePath, title, description, canonicalPath) {
  fs.readFile(filePath, 'utf8', (error, html) => {
    if (error) {
      debug(chalk.red(`Unable to read SEO page ${filePath}: ${error.message}`));
      res.sendStatus(404);
      return;
    }
    const canonical = `${siteOrigin(req)}${canonicalPath}`;
    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const metadata = [
      `<title>${safeTitle} | JS Online Boardgames</title>`,
      `<meta name="description" content="${safeDescription}">`,
      '<meta name="robots" content="index,follow,max-image-preview:large">',
      `<link rel="canonical" href="${escapeHtml(canonical)}">`,
      '<meta property="og:type" content="website">',
      `<meta property="og:title" content="${safeTitle} | JS Online Boardgames">`,
      `<meta property="og:description" content="${safeDescription}">`,
      `<meta property="og:url" content="${escapeHtml(canonical)}">`,
      '<meta name="twitter:card" content="summary">',
      `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: title,
        description,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Web',
        url: canonical
      }).replace(/</g, '\\u003c')}</script>`
    ].join('\n');
    html = html.replace(/<title>[\s\S]*?<\/title>/i, '').replace('</head>', `${metadata}\n</head>`);
    res.type('html').send(html);
  });
}

function setupRoutes(app) {
  app.use(morgan('combined'));
  app.use(express.static(path.join(__dirname, '/public')));

  app.get('/', (req, res) => {
    sendSeoPage(
      req,
      res,
      path.join(__dirname, 'public', 'lobby.html'),
      'JS Online Boardgames',
      'Browse and play 224 classic, historical, and strategy board games online. Find chess variants, draughts, Morris, hunt games, mancala, and more.',
      '/'
    );
    debug(chalk.green('GET / - Lobby page accessed'));
  });

  app.get('/api/games', (req, res) => {
    const games = [...new Set(supportedGames)].map((id) => {
      const slug = gamePathAliases[id] || id;
      return { id, title: gameTitle(slug), href: `/${slug}` };
    });
    res.json(games);
  });

  const gamesByPath = new Map([...new Set(supportedGames)].map((id) => [gamePathAliases[id] || id, id]));
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${siteOrigin(req)}/sitemap.xml\n`);
  });

  app.get('/sitemap.xml', (req, res) => {
    const slugs = ['/', ...gamesByPath.keys()];
    const urls = slugs.map((slug) => `<url><loc>${escapeHtml(`${siteOrigin(req)}${slug === '/' ? '/' : `/${slug}`}`)}</loc></url>`).join('');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  });

  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    const gameId = gamesByPath.get(req.path.replace(/^\/+|\/+$/g, ''));
    if (!gameId) return next();
    const slug = gamePathAliases[gameId] || gameId;
    const title = gameTitle(slug);
    const description = `Play ${title} online in a real-time multiplayer match. Explore this classic board game, start a game, and challenge another player.`;
    return sendSeoPage(req, res, path.join(__dirname, 'public', 'catalog', `${slug}.html`), title, description, `/${slug}`);
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

  app.get('/chaturaji', (req, res) => {
    debug(chalk.green('GET /chaturaji - Chaturaji game accessed'));
    res.sendFile(path.join(__dirname, '/public/chaturaji.html'));
  });

  app.get('/xiangqi', (req, res) => {
    debug(chalk.green('GET /xiangqi - Xiangqi game accessed'));
    res.sendFile(path.join(__dirname, '/public/xiangqi.html'));
  });

  app.get('/janggi', (req, res) => {
    debug(chalk.green('GET /janggi - Janggi game accessed'));
    res.sendFile(path.join(__dirname, '/public/janggi.html'));
  });

  app.get('/sittuyin', (req, res) => {
    debug(chalk.green('GET /sittuyin - Sittuyin game accessed'));
    res.sendFile(path.join(__dirname, '/public/sittuyin.html'));
  });

  app.get('/chaturanga', (req, res) => {
    debug(chalk.green('GET /chaturanga - Chaturanga game accessed'));
    res.sendFile(path.join(__dirname, '/public/chaturanga.html'));
  });

  app.get('/shatranj', (req, res) => {
    debug(chalk.green('GET /shatranj - Shatranj game accessed'));
    res.sendFile(path.join(__dirname, '/public/shatranj.html'));
  });

  app.get('/makruk', (req, res) => {
    debug(chalk.green('GET /makruk - Makruk game accessed'));
    res.sendFile(path.join(__dirname, '/public/makruk.html'));
  });

  app.get('/senterej', (req, res) => {
    debug(chalk.green('GET /senterej - Senterej game accessed'));
    res.sendFile(path.join(__dirname, '/public/senterej.html'));
  });

  app.get('/shatar', (req, res) => {
    debug(chalk.green('GET /shatar - Shatar game accessed'));
    res.sendFile(path.join(__dirname, '/public/shatar.html'));
  });

  app.get('/shatra', (req, res) => {
    debug(chalk.green('GET /shatra - Shatra game accessed'));
    res.sendFile(path.join(__dirname, '/public/shatra.html'));
  });

  app.get('/shogi', (req, res) => {
    debug(chalk.green('GET /shogi - Shogi game accessed'));
    res.sendFile(path.join(__dirname, '/public/shogi.html'));
  });

  app.get('/courier', (req, res) => {
    debug(chalk.green('GET /courier - Courier chess accessed'));
    res.sendFile(path.join(__dirname, '/public/courier.html'));
  });

  app.get('/hnefatafl', (req, res) => {
    debug(chalk.green('GET /hnefatafl - Hnefatafl game accessed'));
    res.sendFile(path.join(__dirname, '/public/hnefatafl.html'));
  });

  app.get('/tamerlane', (req, res) => {
    debug(chalk.green('GET /tamerlane - Tamerlane chess accessed'));
    res.sendFile(path.join(__dirname, '/public/tamerlane.html'));
  });

  app.get('/heian-shogi', (req, res) => {
    debug(chalk.green('GET /heian-shogi - Heian shogi accessed'));
    res.sendFile(path.join(__dirname, '/public/heian-shogi.html'));
  });

  app.get('/gomoku', (req, res) => {
    debug(chalk.green('GET /gomoku - Gomoku game accessed'));
    res.sendFile(path.join(__dirname, '/public/gomoku.html'));
  });

  app.get('/tic-tac-toe', (req, res) => {
    debug(chalk.green('GET /tic-tac-toe - Tic-tac-toe accessed'));
    res.sendFile(path.join(__dirname, '/public/tic-tac-toe.html'));
  });

  app.get('/three-mens-morris', (req, res) => res.sendFile(path.join(__dirname, '/public/three-mens-morris.html')));
  app.get('/six-mens-morris', (req, res) => res.sendFile(path.join(__dirname, '/public/six-mens-morris.html')));
  app.get('/nine-mens-morris', (req, res) => res.sendFile(path.join(__dirname, '/public/nine-mens-morris.html')));
  app.get('/achi', (req, res) => res.sendFile(path.join(__dirname, '/public/achi.html')));
  app.get('/dara', (req, res) => res.sendFile(path.join(__dirname, '/public/dara.html')));
  app.get('/picaria', (req, res) => res.sendFile(path.join(__dirname, '/public/picaria.html')));
  app.get('/shax', (req, res) => res.sendFile(path.join(__dirname, '/public/shax.html')));
  app.get('/tant-fant', (req, res) => res.sendFile(path.join(__dirname, '/public/tant-fant.html')));
  app.get('/tapatan', (req, res) => res.sendFile(path.join(__dirname, '/public/tapatan.html')));
  app.get('/tsoro-yematatu', (req, res) => res.sendFile(path.join(__dirname, '/public/tsoro-yematatu.html')));
  app.get('/wali', (req, res) => res.sendFile(path.join(__dirname, '/public/wali.html')));
  app.get('/bagh-chal', (req, res) => res.sendFile(path.join(__dirname, '/public/bagh-chal.html')));
  app.get('/adugo', (req, res) => res.sendFile(path.join(__dirname, '/public/adugo.html')));
  app.get('/aadu-puli-attam', (req, res) => res.sendFile(path.join(__dirname, '/public/aadu-puli-attam.html')));
  app.get('/alquerque', (req, res) => res.sendFile(path.join(__dirname, '/public/alquerque.html')));
  app.get('/bagh-bandi', (req, res) => res.sendFile(path.join(__dirname, '/public/bagh-bandi.html')));
  app.get('/buga-shadara', (req, res) => res.sendFile(path.join(__dirname, '/public/buga-shadara.html')));
  app.get('/sher-bakar', (req, res) => res.sendFile(path.join(__dirname, '/public/sher-bakar.html')));
  app.get('/main-tapal-empat', (req, res) => res.sendFile(path.join(__dirname, '/public/main-tapal-empat.html')));
  app.get('/rimau-rimau', (req, res) => res.sendFile(path.join(__dirname, '/public/rimau-rimau.html')));
  app.get('/main-machan', (req, res) => res.sendFile(path.join(__dirname, '/public/main-machan.html')));
  app.get('/meurimueng', (req, res) => res.sendFile(path.join(__dirname, '/public/meurimueng.html')));
  app.get('/komikan', (req, res) => res.sendFile(path.join(__dirname, '/public/komikan.html')));
  app.get('/rithmomachia', (req, res) => res.sendFile(path.join(__dirname, '/public/rithmomachia.html')));
  app.get('/nine-holes', (req, res) => res.sendFile(path.join(__dirname, '/public/nine-holes.html')));
  app.get('/wythoff', (req, res) => res.sendFile(path.join(__dirname, '/public/wythoff.html')));
  app.get('/chopsticks', (req, res) => res.sendFile(path.join(__dirname, '/public/chopsticks.html')));
  app.get('/jungle', (req, res) => res.sendFile(path.join(__dirname, '/public/jungle.html')));
  app.get('/square-chess', (req, res) => res.sendFile(path.join(__dirname, '/public/square-chess.html')));
  app.get('/mu-torere', (req, res) => res.sendFile(path.join(__dirname, '/public/mu-torere.html')));
  app.get('/pong-hau-ki', (req, res) => res.sendFile(path.join(__dirname, '/public/pong-hau-ki.html')));
  app.get('/bear-games', (req, res) => res.sendFile(path.join(__dirname, '/public/bear-games.html')));
  app.get('/fox-and-hounds', (req, res) => res.sendFile(path.join(__dirname, '/public/fox-and-hounds.html')));
  app.get('/hare-games', (req, res) => res.sendFile(path.join(__dirname, '/public/hare-games.html')));
  app.get('/ugolkij', (req, res) => res.sendFile(path.join(__dirname, '/public/ugolkij.html')));
  app.get('/fidchell', (req, res) => res.sendFile(path.join(__dirname, '/public/fidchell.html')));
  app.get('/armenian-checkers', (req, res) => res.sendFile(path.join(__dirname, '/public/armenian-checkers.html')));
  app.get('/astar', (req, res) => res.sendFile(path.join(__dirname, '/public/astar.html')));
  app.get('/kotu-ellima', (req, res) => res.sendFile(path.join(__dirname, '/public/kotu-ellima.html')));
  app.get('/sixteen-soldiers', (req, res) => res.sendFile(path.join(__dirname, '/public/sixteen-soldiers.html')));
  app.get('/peralikatuma', (req, res) => res.sendFile(path.join(__dirname, '/public/peralikatuma.html')));
  app.get('/terhuchu', (req, res) => res.sendFile(path.join(__dirname, '/public/terhuchu.html')));
  app.get('/permainan-tabal', (req, res) => res.sendFile(path.join(__dirname, '/public/permainan-tabal.html')));
  app.get('/awithlaknannai-mosona', (req, res) => res.sendFile(path.join(__dirname, '/public/awithlaknannai-mosona.html')));
  app.get('/bizingo', (req, res) => res.sendFile(path.join(__dirname, '/public/bizingo.html')));
  app.get('/awithlaknakwe', (req, res) => res.sendFile(path.join(__dirname, '/public/awithlaknakwe.html')));
  app.get('/butterfly', (req, res) => res.sendFile(path.join(__dirname, '/public/butterfly.html')));
  app.get('/lau-kata-kati', (req, res) => res.sendFile(path.join(__dirname, '/public/lau-kata-kati.html')));
  app.get('/dash-guti', (req, res) => res.sendFile(path.join(__dirname, '/public/dash-guti.html')));
  app.get('/egara-guti', (req, res) => res.sendFile(path.join(__dirname, '/public/egara-guti.html')));
  app.get('/felli', (req, res) => res.sendFile(path.join(__dirname, '/public/felli.html')));
  app.get('/four-field-kono', (req, res) => res.sendFile(path.join(__dirname, '/public/four-field-kono.html')));
  app.get('/gala', (req, res) => res.sendFile(path.join(__dirname, '/public/gala.html')));
  app.get('/yote', (req, res) => res.sendFile(path.join(__dirname, '/public/yote.html')));
  app.get('/seega', (req, res) => res.sendFile(path.join(__dirname, '/public/seega.html')));
  app.get('/high-jump', (req, res) => res.sendFile(path.join(__dirname, '/public/high-jump.html')));
  app.get('/italian-damone', (req, res) => res.sendFile(path.join(__dirname, '/public/italian-damone.html')));
  app.get('/italian-checkers', (req, res) => res.sendFile(path.join(__dirname, '/public/italian-checkers.html')));
  app.get('/jul-gonu', (req, res) => res.sendFile(path.join(__dirname, '/public/jul-gonu.html')));
  app.get('/keny', (req, res) => res.sendFile(path.join(__dirname, '/public/keny.html')));
  app.get('/kharbaga', (req, res) => res.sendFile(path.join(__dirname, '/public/kharbaga.html')));
  app.get('/kolowis-awithlaknannai', (req, res) => res.sendFile(path.join(__dirname, '/public/kolowis-awithlaknannai.html')));
  app.get('/liberian-queah', (req, res) => res.sendFile(path.join(__dirname, '/public/liberian-queah.html')));
  app.get('/mak-yek', (req, res) => res.sendFile(path.join(__dirname, '/public/mak-yek.html')));
  app.get('/ming-mang', (req, res) => res.sendFile(path.join(__dirname, '/public/ming-mang.html')));
  app.get('/pretwa', (req, res) => res.sendFile(path.join(__dirname, '/public/pretwa.html')));
  app.get('/sahkku', (req, res) => res.sendFile(path.join(__dirname, '/public/sahkku.html')));
  app.get('/tiger-forty', (req, res) => res.sendFile(path.join(__dirname, '/public/tiger-forty.html')));
  app.get('/surakarta', (req, res) => res.sendFile(path.join(__dirname, '/public/surakarta.html')));
  app.get('/tobit', (req, res) => res.sendFile(path.join(__dirname, '/public/tobit.html')));
  app.get('/asalto', (req, res) => res.sendFile(path.join(__dirname, '/public/asalto.html')));
    app.get('/catch-the-hare', (req, res) => res.sendFile(path.join(__dirname, '/public/catch-the-hare.html')));
    app.get('/demala-diviyan-keliya', (req, res) => res.sendFile(path.join(__dirname, '/public/demala-diviyan-keliya.html')));
    app.get('/chomp', (req, res) => res.sendFile(path.join(__dirname, '/public/chomp.html')));
    app.get('/cram', (req, res) => res.sendFile(path.join(__dirname, '/public/cram.html')));
    app.get('/renju', (req, res) => res.sendFile(path.join(__dirname, '/public/renju.html')));
    app.get('/turkish-draughts', (req, res) => res.sendFile(path.join(__dirname, '/public/turkish-draughts.html')));
    app.get('/konane', (req, res) => res.sendFile(path.join(__dirname, '/public/konane.html')));
    app.get('/watermelon-chess', (req, res) => res.sendFile(path.join(__dirname, '/public/watermelon-chess.html')));
    app.get('/zamma', (req, res) => res.sendFile(path.join(__dirname, '/public/zamma.html')));
    app.get('/ali-guli-mane', (req, res) => res.sendFile(path.join(__dirname, '/public/ali-guli-mane.html')));
    app.get('/chinese-checkers', (req, res) => res.sendFile(path.join(__dirname, '/public/chinese-checkers.html')));
    app.get('/hat-diviyan-keliya', (req, res) => res.sendFile(path.join(__dirname, '/public/hat-diviyan-keliya.html')));
    app.get('/alea-evangelii', (req, res) => res.sendFile(path.join(__dirname, '/public/alea-evangelii.html')));
    app.get('/choko', (req, res) => res.sendFile(path.join(__dirname, '/public/choko.html')));
    app.get('/crossings', (req, res) => res.sendFile(path.join(__dirname, '/public/crossings.html')));
    app.get('/kaooa', (req, res) => res.sendFile(path.join(__dirname, '/public/kaooa.html')));
      const gameAliases = {
        'achi-game': 'achi',
        'astar-game': 'astar',
        'bagha-chall': 'bagh-chal',
        'br-de': 'braede',
        'bul-game': 'bul',
        'butterfly-game': 'butterfly',
        'choko-game': 'choko',
        'chopsticks-hand-game': 'chopsticks',
        'courier-chess': 'courier',
        'cram-game': 'cram',
        'crossings-game': 'crossings',
        'dala-game': 'dala',
        'dara-game': 'dara',
        'dald-s': 'daldos',
        'en-geh': 'en-gehe',
        'go-board-game': 'go',
        'high-jump-game': 'high-jump',
        'indian-chess': 'chaturanga',
        'jungle-board-game': 'jungle',
        'keny-game': 'keny',
        'khorol-game': 'khorol',
        'leap-frog-board-game': 'leap-frog',
        'malaysian-singaporean-checkers': 'malaysian-checkers',
        'mehen-game': 'mehen',
        'ming-mang-game': 'ming-mang',
        'mojo-board-game': 'mojo',
        'morra-game': 'morra',
        'm-t-rere': 'mu-torere',
        'm-ynek-nine-mens-morris': 'mlynek-nine-mens-morris',
        'nard-game': 'nard',
        'odds-and-evens-hand-game': 'odds-and-evens',
        'polis-board-game': 'polis',
        'seega-game': 'seega',
        's-hkku': 'sahkku',
        'shatra-game': 'shatra',
        'shax-board-game': 'shax',
        'sho-board-game': 'sho',
        'surakarta-game': 'surakarta',
        'tamerlane-chess': 'tamerlane',
        't-b': 'tab',
        'three-player-chess': 'chaturaji',
        'tobit-game': 'tobit',
        'ugolki': 'ugolkij',
        'wali-game': 'wali',
        'wythoffs-game': 'wythoff',
        'yot': 'yote'
      };
      Object.entries(gameAliases).forEach(([alias, canonical]) => {
        app.get(`/${alias}`, (req, res) => res.redirect(`/${canonical}`));
      });
    const catalogGames = ['cinc-camins', 'dablot-prejjesne', 'daldos', 'fanorona', 'go', 'grundys-game', 'five-lines', 'bul', 'circular-chess', 'frisian-draughts', 'gonu', 'ko-shogi', 'lambs-and-tigers', 'leap-frog', 'luzhanqi', 'mojo', 'polis', 'backgammon', 'senet', 'mehen', ...CatalogGames];
    catalogGames.forEach((game) => {
      app.get(`/${game}`, (req, res) => res.sendFile(path.join(__dirname, `/public/catalog/${game}.html`)));
    });
  app.get('/morabaraba', (req, res) => res.sendFile(path.join(__dirname, '/public/morabaraba.html')));
  app.get('/dala', (req, res) => res.sendFile(path.join(__dirname, '/public/dala.html')));
  app.get('/shisima', (req, res) => res.sendFile(path.join(__dirname, '/public/shisima.html')));

  app.get('/api/statistics/wins-by-country', async (req, res) => {
    try {
      const statistics = await CountryWin.find({}, { _id: 0, country: 1, wins: 1 })
        .sort({ wins: -1, country: 1 })
        .lean();
      res.json(statistics);
    } catch (error) {
      debug(chalk.red(`GET /api/statistics/wins-by-country failed: ${error.message}`));
      res.status(500).json({ error: 'Unable to load statistics.' });
    }
  });
}

module.exports = { setupRoutes };