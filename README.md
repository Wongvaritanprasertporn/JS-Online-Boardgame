# JS Online Reversi

## Overview
JS Online Reversi is a web-based implementation of the classic board game Reversi (also known as Othello). This project allows players to connect online, play against each other in real-time, and enjoy the strategic gameplay of Reversi.

## Features
- Real-time multiplayer gameplay using WebSockets.
- Matchmaking system to pair players.
- Game state management with the ability to handle player turns and game over conditions.
- MongoDB integration for persistent storage of game rooms and matchmaking queues.

## Project Structure
```
JS-Online-Reversi
├── src
│   ├── app.js                # Main entry point of the application
│   ├── database
│   │   ├── connection.js     # MongoDB connection handling
│   │   └── models
│   │       └── Room.js       # Mongoose model for game rooms
│   ├── reversi.js            # Game logic for Reversi
│   ├── sockets
│   │   └── socketHandlers.js  # Socket event handlers
│   └── utils
│       └── helpers.js        # Utility functions
├── public
│   ├── index.html            # Main HTML file for the client-side application
│   └── style.css             # CSS styles for the application
├── package.json              # npm configuration file
└── package-lock.json         # Dependency lock file
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
4. Set up your MongoDB database and update the connection settings in `src/database/connection.js`.

## Usage
1. Start the server:
   ```
   npm start
   ```
2. Open your web browser and navigate to `http://localhost:3000` to access the game lobby.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.