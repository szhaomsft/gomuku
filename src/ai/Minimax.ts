import { GameState } from '../core/GameState';
import { Player, Position, MoveScore, DifficultyConfig } from '../core/types';
import { MoveGenerator } from '../core/MoveGenerator';
import { WinChecker } from '../core/WinChecker';
import { Evaluator } from './Evaluator';

export class MinimaxAI {
  private aiPlayer: Player;
  private nodesSearched: number = 0;
  private startTime: number = 0;
  private config: DifficultyConfig;
  private topMoves: Position[] = [];

  constructor(aiPlayer: Player, config: DifficultyConfig) {
    this.aiPlayer = aiPlayer;
    this.config = config;
  }

  getBestMove(gameState: GameState): Position | null {
    this.nodesSearched = 0;
    this.startTime = Date.now();
    this.topMoves = [];

    if (gameState.currentPlayer !== this.aiPlayer) {
      return null;
    }

    const moves = MoveGenerator.generateMoves(gameState);

    if (moves.length === 0) return null;
    if (moves.length === 1) return moves[0];

    const sortedMoves = this.quickSortMoves(gameState, moves).slice(0, this.config.maxMoves);

    const scoredMoves: MoveScore[] = [];

    for (const move of sortedMoves) {
      if (Date.now() - this.startTime > this.config.timeLimit) {
        break;
      }

      gameState.makeMove(move);

      const { winner } = WinChecker.checkWinner(gameState);
      if (winner === this.aiPlayer) {
        gameState.undoMove();
        return move;
      }

      const score = this.alphabeta(
        gameState,
        this.config.depth - 1,
        -Infinity,
        Infinity,
        false
      ) * this.config.evaluationAccuracy;

      scoredMoves.push({ position: move, score });

      gameState.undoMove();
    }

    if (scoredMoves.length === 0) {
      return sortedMoves[0];
    }

    scoredMoves.sort((a, b) => b.score - a.score);

    this.topMoves = scoredMoves.slice(0, 5).map(sm => sm.position);

    return scoredMoves[0].position;
  }

  getTopMoves(count: number): Position[] {
    return this.topMoves.slice(0, count);
  }

  quickEvaluate(gameState: GameState): number {
    return Evaluator.evaluate(gameState, this.aiPlayer);
  }

  private alphabeta(
    gameState: GameState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    this.nodesSearched++;

    if (Date.now() - this.startTime > this.config.timeLimit) {
      return Evaluator.evaluate(gameState, this.aiPlayer);
    }

    if (depth === 0 || WinChecker.isGameOver(gameState)) {
      return Evaluator.evaluate(gameState, this.aiPlayer);
    }

    const moves = MoveGenerator.generateMoves(gameState);

    if (moves.length === 0) {
      return Evaluator.evaluate(gameState, this.aiPlayer);
    }

    const maxMovesAtDepth = Math.max(5, Math.floor(this.config.maxMoves / (this.config.depth - depth + 1)));
    const sortedMoves = this.orderMoves(gameState, moves).slice(0, maxMovesAtDepth);

    if (isMaximizing) {
      let maxEval = -Infinity;

      for (const move of sortedMoves) {
        gameState.makeMove(move);
        const evalScore = this.alphabeta(gameState, depth - 1, alpha, beta, false);
        gameState.undoMove();

        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);

        if (beta <= alpha) {
          break;
        }
      }

      return maxEval;
    } else {
      let minEval = Infinity;

      for (const move of sortedMoves) {
        gameState.makeMove(move);
        const evalScore = this.alphabeta(gameState, depth - 1, alpha, beta, true);
        gameState.undoMove();

        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);

        if (beta <= alpha) {
          break;
        }
      }

      return minEval;
    }
  }

  private orderMoves(gameState: GameState, moves: Position[]): Position[] {
    const currentPlayer = gameState.currentPlayer;

    const scoredMoves = moves.map(move => {
      gameState.makeMove(move);
      const score = Evaluator.quickEvaluateMove(gameState, move.x, move.y, currentPlayer);
      gameState.undoMove();
      return { position: move, score };
    });

    scoredMoves.sort((a, b) => b.score - a.score);

    return scoredMoves.map(sm => sm.position);
  }

  private quickSortMoves(gameState: GameState, moves: Position[]): Position[] {
    const currentPlayer = gameState.currentPlayer;

    const scoredMoves = moves.map(move => {
      const score = Evaluator.quickEvaluateMove(gameState, move.x, move.y, currentPlayer);
      return { position: move, score };
    });

    scoredMoves.sort((a, b) => b.score - a.score);

    return scoredMoves.map(sm => sm.position);
  }

  getNodesSearched(): number {
    return this.nodesSearched;
  }
}
