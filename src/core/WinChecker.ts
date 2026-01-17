import { GameState } from './GameState';
import { Player, Position, Direction } from './types';
import { BOARD_SIZE, WIN_COUNT, DIRECTION_OFFSETS } from './constants';

export class WinChecker {
  static checkWinner(gameState: GameState): { winner: Player | null; winningLine: Position[] | null } {
    if (gameState.moveHistory.length < WIN_COUNT) {
      return { winner: null, winningLine: null };
    }

    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    const player = gameState.board[lastMove.x][lastMove.y];

    for (let dir = 0; dir < 4; dir++) {
      const line = this.checkDirection(gameState, lastMove, player, dir);
      if (line && line.length >= WIN_COUNT) {
        return { winner: player, winningLine: line };
      }
    }

    return { winner: null, winningLine: null };
  }

  private static checkDirection(
    gameState: GameState,
    position: Position,
    player: Player,
    direction: Direction
  ): Position[] | null {
    const { dx, dy } = DIRECTION_OFFSETS[direction];
    const line: Position[] = [position];

    let count = 1;
    count += this.countInDirection(gameState, position, player, dx, dy, line);
    count += this.countInDirection(gameState, position, player, -dx, -dy, line);

    if (count >= WIN_COUNT) {
      line.sort((a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y));
      return line.slice(0, WIN_COUNT);
    }

    return null;
  }

  private static countInDirection(
    gameState: GameState,
    position: Position,
    player: Player,
    dx: number,
    dy: number,
    line: Position[]
  ): number {
    let count = 0;
    let x = position.x + dx;
    let y = position.y + dy;

    while (
      x >= 0 &&
      x < BOARD_SIZE &&
      y >= 0 &&
      y < BOARD_SIZE &&
      gameState.board[x][y] === player
    ) {
      line.push({ x, y });
      count++;
      x += dx;
      y += dy;
    }

    return count;
  }

  static isGameOver(gameState: GameState): boolean {
    return gameState.winner !== null || gameState.isFull();
  }
}
