import { useState, useCallback } from 'react';
import { GameState } from '../core/GameState';
import { WinChecker } from '../core/WinChecker';
import { Position, GameStateData } from '../core/types';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(() => new GameState());

  const makeMove = useCallback((position: Position): boolean => {
    const newState = gameState.clone();
    const success = newState.makeMove(position);

    if (success) {
      const { winner, winningLine } = WinChecker.checkWinner(newState);
      newState.winner = winner;
      newState.winningLine = winningLine;
      setGameState(newState);
    }

    return success;
  }, [gameState]);

  const undoMove = useCallback((): boolean => {
    const newState = gameState.clone();
    const success = newState.undoMove();

    if (success) {
      setGameState(newState);
    }

    return success;
  }, [gameState]);

  const undoMultipleMoves = useCallback((count: number): boolean => {
    const newState = gameState.clone();
    let success = true;

    for (let i = 0; i < count; i++) {
      if (!newState.undoMove()) {
        success = false;
        break;
      }
    }

    if (success) {
      setGameState(newState);
    }

    return success;
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(new GameState());
  }, []);

  const getGameData = useCallback((): GameStateData => {
    return gameState.toData();
  }, [gameState]);

  return {
    gameState: getGameData(),
    makeMove,
    undoMove,
    undoMultipleMoves,
    resetGame,
    gameStateObj: gameState,
  };
}
