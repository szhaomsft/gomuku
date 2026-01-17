import { PatternType } from '../core/types';

export interface PatternDefinition {
  type: PatternType;
  patterns: string[];
  score: number;
}

export const PATTERN_DEFINITIONS: PatternDefinition[] = [
  {
    type: PatternType.FIVE,
    patterns: ['11111'],
    score: 100000,
  },
  {
    type: PatternType.LIVE_FOUR,
    patterns: ['011110'],
    score: 10000,
  },
  {
    type: PatternType.DEAD_FOUR,
    patterns: [
      '211110',
      '011112',
      '11011',
      '10111',
      '11101',
    ],
    score: 1000,
  },
  {
    type: PatternType.LIVE_THREE,
    patterns: [
      '01110',
      '011010',
      '010110',
    ],
    score: 500,
  },
  {
    type: PatternType.DEAD_THREE,
    patterns: [
      '211100',
      '001112',
      '11001',
      '10011',
      '10101',
      '211010',
      '010112',
    ],
    score: 50,
  },
  {
    type: PatternType.LIVE_TWO,
    patterns: [
      '00110',
      '01010',
      '01100',
    ],
    score: 10,
  },
  {
    type: PatternType.DEAD_TWO,
    patterns: [
      '211000',
      '000112',
      '10001',
      '10010',
      '01001',
    ],
    score: 1,
  },
];

export function getPatternScore(patternType: PatternType): number {
  const pattern = PATTERN_DEFINITIONS.find(p => p.type === patternType);
  return pattern ? pattern.score : 0;
}
