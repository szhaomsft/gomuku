import { PatternType, Difficulty, DifficultyConfig } from './types';

export const BOARD_SIZE = 15;

export const WIN_COUNT = 5;

export const SEARCH_RANGE = 2;

export const DEFAULT_SEARCH_DEPTH = 3;

export const MAX_SEARCH_TIME_MS = 2000;

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.EASY]: {
    depth: 2,
    maxMoves: 8,
    timeLimit: 1000,
    useThreatDetection: false,
    evaluationAccuracy: 0.7,
  },
  [Difficulty.MEDIUM]: {
    depth: 3,
    maxMoves: 12,
    timeLimit: 2000,
    useThreatDetection: true,
    evaluationAccuracy: 0.9,
  },
  [Difficulty.HARD]: {
    depth: 6,
    maxMoves: 20,
    timeLimit: 5000,
    useThreatDetection: true,
    evaluationAccuracy: 1.0,
  },
};

export const PATTERN_SCORES: Record<PatternType, number> = {
  [PatternType.NONE]: 0,
  [PatternType.FIVE]: 100000,
  [PatternType.LIVE_FOUR]: 10000,
  [PatternType.DEAD_FOUR]: 1000,
  [PatternType.LIVE_THREE]: 500,
  [PatternType.DEAD_THREE]: 50,
  [PatternType.LIVE_TWO]: 10,
  [PatternType.DEAD_TWO]: 1,
};

export const DIRECTION_OFFSETS = [
  { dx: 1, dy: 0 },   // HORIZONTAL
  { dx: 0, dy: 1 },   // VERTICAL
  { dx: 1, dy: 1 },   // DIAGONAL
  { dx: 1, dy: -1 },  // ANTI_DIAGONAL
];

export const POSITION_WEIGHTS: number[][] = (() => {
  const weights: number[][] = Array(BOARD_SIZE)
    .fill(0)
    .map(() => Array(BOARD_SIZE).fill(0));

  const center = Math.floor(BOARD_SIZE / 2);

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const distanceFromCenter = Math.abs(i - center) + Math.abs(j - center);
      weights[i][j] = Math.max(0, 10 - distanceFromCenter);
    }
  }

  return weights;
})();
