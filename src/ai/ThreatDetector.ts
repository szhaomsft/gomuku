import { GameState } from '../core/GameState';
import { Player, Threat, Position, PatternType } from '../core/types';
import { MoveGenerator } from '../core/MoveGenerator';
import { PatternRecognizer } from './PatternRecognizer';

export class ThreatDetector {
  static detectThreats(gameState: GameState, player: Player): Threat[] {
    const threats: Threat[] = [];
    const moves = MoveGenerator.generateMoves(gameState);

    for (const move of moves) {
      const tempState = gameState.clone();

      if (tempState.currentPlayer !== player) {
        tempState.currentPlayer = player;
      }

      tempState.makeMove(move);

      for (let dir = 0; dir < 4; dir++) {
        const pattern = PatternRecognizer.recognizePattern(
          tempState,
          move.x,
          move.y,
          dir,
          player
        );

        if (pattern !== PatternType.NONE) {
          const level = this.getThreatLevel(pattern);
          if (level > 0) {
            threats.push({
              position: move,
              type: pattern,
              level,
              direction: dir,
            });
          }
        }
      }
    }

    threats.sort((a, b) => b.level - a.level);

    return threats;
  }

  private static getThreatLevel(patternType: PatternType): number {
    switch (patternType) {
      case PatternType.FIVE:
        return 5;
      case PatternType.LIVE_FOUR:
        return 4;
      case PatternType.DEAD_FOUR:
        return 3;
      case PatternType.LIVE_THREE:
        return 2;
      case PatternType.DEAD_THREE:
        return 1;
      default:
        return 0;
    }
  }

  static getDefensiveMoves(gameState: GameState, aiPlayer: Player): Position[] {
    const opponent = aiPlayer === Player.BLACK ? Player.WHITE : Player.BLACK;
    const threats = this.detectThreats(gameState, opponent);

    if (threats.length === 0) return [];

    const highestThreatLevel = threats[0].level;

    // Must defend against level 5 (winning move) and level 4 (live four)
    if (highestThreatLevel >= 4) {
      return threats.filter(t => t.level >= 4).map(t => t.position);
    }

    // Also defend against level 3 (dead four) in hard mode
    if (highestThreatLevel >= 3) {
      return threats.filter(t => t.level >= 3).map(t => t.position);
    }

    return [];
  }

  static hasWinningMove(gameState: GameState, player: Player): Position | null {
    const threats = this.detectThreats(gameState, player);

    for (const threat of threats) {
      if (threat.type === PatternType.FIVE) {
        return threat.position;
      }
    }

    return null;
  }

  static getAttackingMoves(gameState: GameState, player: Player): Position[] {
    const threats = this.detectThreats(gameState, player);

    if (threats.length === 0) return [];

    // Return positions that create live four or dead four
    return threats
      .filter(t => t.level >= 3)
      .slice(0, 5)
      .map(t => t.position);
  }
}
