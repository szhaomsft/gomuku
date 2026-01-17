import { GameState } from '../core/GameState';
import { Player, Position, Difficulty, DifficultyConfig } from '../core/types';
import { MinimaxAI } from './Minimax';
import { ThreatDetector } from './ThreatDetector';
import { DIFFICULTY_CONFIGS } from '../core/constants';

export class AIEngine {
  private aiPlayer: Player;
  private minimax: MinimaxAI;
  private difficulty: Difficulty;
  private config: DifficultyConfig;

  constructor(aiPlayer: Player = Player.WHITE, difficulty: Difficulty = Difficulty.MEDIUM) {
    this.aiPlayer = aiPlayer;
    this.difficulty = difficulty;
    this.config = DIFFICULTY_CONFIGS[difficulty];
    this.minimax = new MinimaxAI(aiPlayer, this.config);
  }

  setDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty;
    this.config = DIFFICULTY_CONFIGS[difficulty];
    this.minimax = new MinimaxAI(this.aiPlayer, this.config);
  }

  getDifficulty(): Difficulty {
    return this.difficulty;
  }

  calculateBestMove(gameState: GameState): Position | null {
    // Easy mode: random selection from top moves
    if (this.difficulty === Difficulty.EASY) {
      return this.calculateEasyMove(gameState);
    }

    // All modes: check for winning move first
    const winningMove = ThreatDetector.hasWinningMove(gameState, this.aiPlayer);
    if (winningMove) {
      return winningMove;
    }

    // All modes with threat detection: defend against threats
    if (this.config.useThreatDetection) {
      const defensiveMoves = ThreatDetector.getDefensiveMoves(gameState, this.aiPlayer);
      if (defensiveMoves.length > 0) {
        // Hard mode: if multiple defensive moves, evaluate them
        if (this.difficulty === Difficulty.HARD && defensiveMoves.length > 1) {
          return this.evaluateMultipleMoves(gameState, defensiveMoves);
        }
        return defensiveMoves[0];
      }
    }

    // Hard mode: also consider attacking moves
    if (this.difficulty === Difficulty.HARD) {
      const attackingMoves = ThreatDetector.getAttackingMoves(gameState, this.aiPlayer);
      if (attackingMoves.length > 0) {
        const combinedMoves = [...attackingMoves];
        return this.evaluateMultipleMoves(gameState, combinedMoves);
      }
    }

    const bestMove = this.minimax.getBestMove(gameState);
    return bestMove;
  }

  private evaluateMultipleMoves(gameState: GameState, moves: Position[]): Position | null {
    if (moves.length === 0) return null;
    if (moves.length === 1) return moves[0];

    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves.slice(0, 5)) {
      gameState.makeMove(move);
      const score = this.minimax.quickEvaluate(gameState);
      gameState.undoMove();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private calculateEasyMove(gameState: GameState): Position | null {
    const winningMove = ThreatDetector.hasWinningMove(gameState, this.aiPlayer);
    if (winningMove) {
      return winningMove;
    }

    const move = this.minimax.getBestMove(gameState);

    // Add some randomness for easy mode
    if (move && Math.random() < 0.3) {
      const moves = this.minimax.getTopMoves(3);
      if (moves.length > 1) {
        return moves[Math.floor(Math.random() * moves.length)];
      }
    }

    return move;
  }

  async calculateBestMoveAsync(gameState: GameState): Promise<Position | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const move = this.calculateBestMove(gameState);
          resolve(move);
        } catch (error) {
          console.error('AI calculation error:', error);
          const moves = gameState.moveHistory.length === 0
            ? [{ x: 7, y: 7 }]
            : ThreatDetector.getDefensiveMoves(gameState, this.aiPlayer);
          resolve(moves.length > 0 ? moves[0] : null);
        }
      }, 100);
    });
  }

  getNodesSearched(): number {
    return this.minimax.getNodesSearched();
  }
}
