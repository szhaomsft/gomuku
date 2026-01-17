export enum Player {
  NONE = 0,
  BLACK = 1,
  WHITE = 2,
}

export interface Position {
  x: number;
  y: number;
}

export interface GameStateData {
  board: Player[][];
  currentPlayer: Player;
  winner: Player | null;
  winningLine: Position[] | null;
  moveHistory: Position[];
}

export enum Direction {
  HORIZONTAL = 0,
  VERTICAL = 1,
  DIAGONAL = 2,
  ANTI_DIAGONAL = 3,
}

export enum PatternType {
  NONE = 'NONE',
  FIVE = 'FIVE',
  LIVE_FOUR = 'LIVE_FOUR',
  DEAD_FOUR = 'DEAD_FOUR',
  LIVE_THREE = 'LIVE_THREE',
  DEAD_THREE = 'DEAD_THREE',
  LIVE_TWO = 'LIVE_TWO',
  DEAD_TWO = 'DEAD_TWO',
}

export interface Pattern {
  type: PatternType;
  score: number;
  positions: Position[];
}

export interface Threat {
  position: Position;
  type: PatternType;
  level: number;
  direction: Direction;
}

export interface MoveScore {
  position: Position;
  score: number;
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface DifficultyConfig {
  depth: number;
  maxMoves: number;
  timeLimit: number;
  useThreatDetection: boolean;
  evaluationAccuracy: number;
}

export enum GameMode {
  PVE = 'PVE',
  EVE = 'EVE',
}
