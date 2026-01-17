import { useEffect, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useAI } from '../hooks/useAI';
import { useBingBackground } from '../hooks/useBingBackground';
import { Board } from './Board/Board';
import { GameInfo } from './GameInfo/GameInfo';
import { Controls } from './Controls/Controls';
import { Player, Position, Difficulty, GameMode } from '../core/types';
import './App.css';

function App() {
  const { gameState, makeMove, undoMultipleMoves, resetGame, gameStateObj } = useGame();
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PVE);
  const backgroundUrl = useBingBackground();

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
    // Prevent undo while AI is thinking
    if (isThinking) return;

    // Prevent undo if there's a winner
    if (gameState.winner) return;

    console.log('Before undo - moveCount:', gameState.moveHistory.length, 'currentPlayer:', gameState.currentPlayer);

    if (gameMode === GameMode.PVE) {
      // In PVE mode, player is always BLACK (first player)
      // moveHistory[0] = BLACK, moveHistory[1] = WHITE, moveHistory[2] = BLACK, ...

      const moveCount = gameState.moveHistory.length;

      if (moveCount === 0) {
        // No moves to undo
        return;
      } else if (moveCount === 1) {
        // Only player's first move, undo it
        console.log('Undoing 1 move (first move only)');
        undoMultipleMoves(1);
      } else if (moveCount % 2 === 0) {
        // Even number of moves: last move was AI (WHITE)
        // Current player should be BLACK
        // Undo AI's move + player's previous move (2 moves total)
        console.log('Undoing 2 moves (AI + player)');
        undoMultipleMoves(2);
      } else {
        // Odd number of moves: last move was player (BLACK)
        // This means AI hasn't moved yet
        // Just undo player's last move (1 move)
        console.log('Undoing 1 move (player only, AI not moved yet)');
        undoMultipleMoves(1);
      }
    } else {
      // In EVE mode, undo only 1 move
      if (gameState.moveHistory.length >= 1) {
        undoMultipleMoves(1);
      }
    }

    console.log('After undo - moveCount:', gameState.moveHistory.length, 'currentPlayer:', gameState.currentPlayer);
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
    <div
      className="app"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined
      }}
    >
      <h1 className="title">五子棋</h1>
      <div className="gameContainer">
        <div className="leftSection">
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
        </div>
        <div className="rightSection">
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
      </div>
    </div>
  );
}

export default App;
