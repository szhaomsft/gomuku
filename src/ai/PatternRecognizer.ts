import { GameState } from '../core/GameState';
import { Player, Direction, PatternType } from '../core/types';
import { DIRECTION_OFFSETS } from '../core/constants';
import { PATTERN_DEFINITIONS } from './patterns';

export class PatternRecognizer {
  static recognizePattern(
    gameState: GameState,
    x: number,
    y: number,
    direction: Direction,
    player: Player
  ): PatternType {
    if (gameState.board[x][y] !== player) {
      return PatternType.NONE;
    }

    const line = this.extractLine(gameState, x, y, direction, player);

    for (const patternDef of PATTERN_DEFINITIONS) {
      for (const pattern of patternDef.patterns) {
        if (line.includes(pattern)) {
          return patternDef.type;
        }
      }
    }

    return PatternType.NONE;
  }

  static extractLine(
    gameState: GameState,
    x: number,
    y: number,
    direction: Direction,
    player: Player,
    length: number = 9
  ): string {
    const { dx, dy } = DIRECTION_OFFSETS[direction];
    const halfLength = Math.floor(length / 2);
    const line: string[] = [];

    for (let i = -halfLength; i <= halfLength; i++) {
      const nx = x + i * dx;
      const ny = y + i * dy;

      if (!gameState.isValidPosition(nx, ny)) {
        line.push('2');
      } else {
        const cell = gameState.board[nx][ny];
        if (cell === Player.NONE) {
          line.push('0');
        } else if (cell === player) {
          line.push('1');
        } else {
          line.push('2');
        }
      }
    }

    return line.join('');
  }

  static findAllPatterns(gameState: GameState, player: Player): Map<PatternType, number> {
    const patternCounts = new Map<PatternType, number>();

    for (let x = 0; x < gameState.board.length; x++) {
      for (let y = 0; y < gameState.board[x].length; y++) {
        if (gameState.board[x][y] === player) {
          for (let dir = 0; dir < 4; dir++) {
            const pattern = this.recognizePattern(gameState, x, y, dir, player);
            if (pattern !== PatternType.NONE) {
              patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
            }
          }
        }
      }
    }

    return patternCounts;
  }
}
