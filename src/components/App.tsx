import { useEffect, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useAI } from '../hooks/useAI';
import { Board } from './Board/Board';
import { GameInfo } from './GameInfo/GameInfo';
import { Controls } from './Controls/Controls';
import { Player, Position, Difficulty, GameMode } from '../core/types';
import './App.css';

function App() {
  const { gameState, makeMove, undoMove, resetGame, gameStateObj } = useGame();
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PVE);

  // PVE mode: single white AI
  const { isThinking: isWhiteThinking, difficulty: whiteDifficulty, setDifficulty: setWhiteDifficulty, calculateAIMove: calculateWhiteMove } = useAI(Player.WHITE, Difficulty.EASY);

  // EVE mode: black AI
  const { isThinking: isBlackThinking, difficulty: blackDifficulty, setDifficulty: setBlackDifficulty, calculateAIMove: calculateBlackMove } = useAI(Player.BLACK, Difficulty.MEDIUM);

  const isThinking = gameMode === GameMode.EVE
    ? (gameState.currentPlayer === Player.BLACK ? isBlackThinking : isWhiteThinking)
    : isWhiteThinking;

  useEffect(() => {
    const makeAIMove = async () => {
      if (gameState.winner || isThinking) return;

      if (gameMode === GameMode.PVE) {
        // Human vs AI mode
        if (gameState.currentPlayer === Player.WHITE) {
          const aiMove = await calculateWhiteMove(gameStateObj);
          if (aiMove) {
            makeMove(aiMove);
          }
        }
      } else if (gameMode === GameMode.EVE) {
        // AI vs AI mode
        if (gameState.currentPlayer === Player.BLACK) {
          const aiMove = await calculateBlackMove(gameStateObj);
          if (aiMove) {
            makeMove(aiMove);
          }
        } else {
          const aiMove = await calculateWhiteMove(gameStateObj);
          if (aiMove) {
            makeMove(aiMove);
          }
        }
      }
    };

    makeAIMove();
  }, [gameState.currentPlayer, gameState.winner, gameStateObj, calculateWhiteMove, calculateBlackMove, makeMove, isThinking, gameMode]);

  const handleCellClick = (position: Position) => {
    if (gameMode === GameMode.EVE) return; // No manual moves in AI vs AI mode
    if (gameState.winner || isThinking) return;
    if (gameState.currentPlayer !== Player.BLACK) return;

    makeMove(position);
  };

  const handleUndo = () => {
    if (gameMode === GameMode.PVE) {
      undoMove();
      undoMove();
    } else {
      undoMove();
    }
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setWhiteDifficulty(newDifficulty);
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  const handleBlackDifficultyChange = (difficulty: Difficulty) => {
    setBlackDifficulty(difficulty);
  };

  const handleWhiteDifficultyChange = (difficulty: Difficulty) => {
    setWhiteDifficulty(difficulty);
  };

  return (
    <div className="app">
      <h1 className="title">五子棋</h1>
      <GameInfo
        currentPlayer={gameState.currentPlayer}
        winner={gameState.winner}
        isAIThinking={isThinking}
      />
      <Board
        board={gameState.board}
        winningLine={gameState.winningLine}
        onCellClick={handleCellClick}
        disabled={isThinking || !!gameState.winner || gameMode === GameMode.EVE}
      />
      <Controls
        onUndo={handleUndo}
        onReset={resetGame}
        canUndo={gameState.moveHistory.length >= (gameMode === GameMode.PVE ? 2 : 1)}
        disabled={isThinking}
        difficulty={whiteDifficulty}
        onDifficultyChange={handleDifficultyChange}
        gameMode={gameMode}
        onGameModeChange={handleGameModeChange}
        blackDifficulty={blackDifficulty}
        whiteDifficulty={whiteDifficulty}
        onBlackDifficultyChange={handleBlackDifficultyChange}
        onWhiteDifficultyChange={handleWhiteDifficultyChange}
      />
    </div>
  );
}

export default App;
