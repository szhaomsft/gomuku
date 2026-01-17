import { GameState } from './GameState';
import { Position } from './types';
import { BOARD_SIZE, SEARCH_RANGE } from './constants';

export class MoveGenerator {
  static generateMoves(gameState: GameState): Position[] {
    if (gameState.moveHistory.length === 0) {
      const center = Math.floor(BOARD_SIZE / 2);
      return [{ x: center, y: center }];
    }

    const candidateSet = new Set<string>();

    for (const move of gameState.moveHistory) {
      for (let dx = -SEARCH_RANGE; dx <= SEARCH_RANGE; dx++) {
        for (let dy = -SEARCH_RANGE; dy <= SEARCH_RANGE; dy++) {
          const x = move.x + dx;
          const y = move.y + dy;

          if (gameState.isEmpty(x, y)) {
            candidateSet.add(`${x},${y}`);
          }
        }
      }
    }

    const moves: Position[] = [];
    candidateSet.forEach(key => {
      const [x, y] = key.split(',').map(Number);
      moves.push({ x, y });
    });

    return moves;
  }

  static getEmptyPositions(gameState: GameState): Position[] {
    const positions: Position[] = [];

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (gameState.board[x][y] === 0) {
          positions.push({ x, y });
        }
      }
    }

    return positions;
  }
}
