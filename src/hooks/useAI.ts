import { useState, useCallback, useRef } from 'react';
import { GameState } from '../core/GameState';
import { Player, Position, Difficulty } from '../core/types';
import { AIEngine } from '../ai/AIEngine';

export function useAI(aiPlayer: Player = Player.WHITE, initialDifficulty: Difficulty = Difficulty.MEDIUM) {
  const [isThinking, setIsThinking] = useState(false);
  const [difficulty, setDifficultyState] = useState<Difficulty>(initialDifficulty);
  const aiEngineRef = useRef<AIEngine>(new AIEngine(aiPlayer, initialDifficulty));

  const calculateAIMove = useCallback(async (
    gameState: GameState
  ): Promise<Position | null> => {
    setIsThinking(true);

    try {
      const move = await aiEngineRef.current.calculateBestMoveAsync(gameState);
      return move;
    } finally {
      setIsThinking(false);
    }
  }, []);

  const setDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficultyState(newDifficulty);
    aiEngineRef.current.setDifficulty(newDifficulty);
  }, []);

  const getNodesSearched = useCallback((): number => {
    return aiEngineRef.current.getNodesSearched();
  }, []);

  return {
    isThinking,
    difficulty,
    setDifficulty,
    calculateAIMove,
    getNodesSearched,
  };
}
