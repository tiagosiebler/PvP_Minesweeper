# Minesweeper

This is a MVP 2-player minesweeper prototype. The game is orchestrated by a WebSocket enabled API service.

## Setup
- `npm i`
- `npm run start`

## Gameplay
- Both players must connect via unique URLs, e.g:
  - Player1: http://example.com:8080/?player1
  - Player2: http://example.com:8080/?player2
- The domain name can be local/ip/remote, depending on server setup.
- Each player has a turn (starting with player 1).
- Game ends when a mine is hit.
