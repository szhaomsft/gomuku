import { GameState } from '../core/GameState';
import { Player, PatternType } from '../core/types';
import { BOARD_SIZE, POSITION_WEIGHTS } from '../core/constants';
import { PatternRecognizer } from './PatternRecognizer';
import { getPatternScore } from './patterns';

export class Evaluator {
  static evaluate(gameState: GameState, aiPlayer: Player): number {
    if (gameState.winner === aiPlayer) {
      return 100000;
    } else if (gameState.winner !== null && gameState.winner !== aiPlayer) {
      return -100000;
    }

    const opponent = aiPlayer === Player.BLACK ? Player.WHITE : Player.BLACK;

    let score = 0;

    // Pattern evaluation with higher weight
    score += this.evaluatePatterns(gameState, aiPlayer) * 1.2;
    score -= this.evaluatePatterns(gameState, opponent) * 1.3;

    // Position evaluation
    score += this.evaluatePositions(gameState, aiPlayer);
    score -= this.evaluatePositions(gameState, opponent);

    // Combo bonus: multiple threats at once
    score += this.evaluateCombos(gameState, aiPlayer) * 2;
    score -= this.evaluateCombos(gameState, opponent) * 2.5;

    return score;
  }

  private static evaluateCombos(gameState: GameState, player: Player): number {
    const patterns = PatternRecognizer.findAllPatterns(gameState, player);
    let comboScore = 0;

    const liveFours = patterns.get(PatternType.LIVE_FOUR) || 0;
    const deadFours = patterns.get(PatternType.DEAD_FOUR) || 0;
    const liveThrees = patterns.get(PatternType.LIVE_THREE) || 0;

    // Multiple live fours or dead fours is very strong
    if (liveFours >= 2) comboScore += 5000;
    if (deadFours >= 2) comboScore += 2000;

    // Live four + live three combo
    if (liveFours >= 1 && liveThrees >= 1) comboScore += 3000;

    // Multiple live threes
    if (liveThrees >= 2) comboScore += 1000;
    if (liveThrees >= 3) comboScore += 2000;

    return comboScore;
  }

  private static evaluatePatterns(gameState: GameState, player: Player): number {
    const patterns = PatternRecognizer.findAllPatterns(gameState, player);
    let score = 0;

    patterns.forEach((count, patternType) => {
      const patternScore = getPatternScore(patternType);
      score += patternScore * count;
    });

    return score;
  }

  private static evaluatePositions(gameState: GameState, player: Player): number {
    let score = 0;

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (gameState.board[x][y] === player) {
          score += POSITION_WEIGHTS[x][y];
        }
      }
    }

    return score;
  }

  static quickEvaluateMove(gameState: GameState, x: number, y: number, player: Player): number {
    let score = POSITION_WEIGHTS[x][y];

    for (let dir = 0; dir < 4; dir++) {
      const pattern = PatternRecognizer.recognizePattern(gameState, x, y, dir, player);
      score += getPatternScore(pattern);
    }

    return score;
  }
}
