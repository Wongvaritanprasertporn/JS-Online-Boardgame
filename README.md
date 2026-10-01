# JS Online Boardgame Platform

## Overview
This project is a real-time multiplayer board-game platform. Dedicated game engines live under `src/catalog/engines/`; the broader catalog registry and fallback engines live under `src/catalog/`.

## Features
- Real-time multiplayer gameplay using WebSockets.
- Matchmaking system to pair players.
- Game state management with the ability to handle player turns and game over conditions.
- MongoDB integration for persistent storage of game rooms and matchmaking queues.
- A lobby containing the catalog games and country win statistics.
- Standalone catalog game pages and shared SPA assets live under `public/catalog/`.

## Implementation status

Games with a dedicated engine have game-specific rules and state handling. Entries routed through the catalog fallback are playable two-player grid games with generic placement and orthogonal movement; they are catalog placeholders until their historical rules are implemented individually. The lobby and server registry make this distinction possible without blocking matchmaking for the full list.

## Project Structure
```
JS-Online-Boardgame
├── app.js
├── routes.js
├── src
│   ├── database.js
│   ├── socketHandlers.js
│   └── catalog
│       ├── catalog-game.js
│       ├── catalog-games.js
│       └── engines            # Dedicated board-game engines
├── public
│   ├── lobby.html
│   └── catalog               # Individual game pages and shared SPA assets
├── package.json
└── package-lock.json
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd JS-Online-Reversi
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Set up MongoDB and configure `MONGO_URI` in `.env` if the default connection is not suitable.
5. Set `SITE_URL` to the public HTTPS origin (for example, `https://games.example.com`) so canonical links, `robots.txt`, and the sitemap use the production domain.

## Usage
1. Start the server:
   ```
   npm start
   ```
2. Open your web browser and navigate to `http://localhost:3000` to access the game lobby.

The Docker setup starts the Node server and MongoDB together with `docker compose up --build`.

Search crawlers can discover the complete game catalog through `/sitemap.xml`; `/robots.txt` points crawlers to that sitemap. SEO metadata is rendered per game URL. Search ranking is not guaranteed and also depends on site authority, content quality, performance, and indexing.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.