import { Difficulty, GameMode } from '../../core/types';
import styles from './Controls.module.css';

interface ControlsProps {
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
  disabled: boolean;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
  blackDifficulty?: Difficulty;
  whiteDifficulty?: Difficulty;
  onBlackDifficultyChange?: (difficulty: Difficulty) => void;
  onWhiteDifficultyChange?: (difficulty: Difficulty) => void;
}

export function Controls({
  onUndo,
  onReset,
  canUndo,
  disabled,
  difficulty,
  onDifficultyChange,
  gameMode,
  onGameModeChange,
  blackDifficulty,
  whiteDifficulty,
  onBlackDifficultyChange,
  onWhiteDifficultyChange,
}: ControlsProps) {
  const getDifficultyLabel = (diff: Difficulty): string => {
    switch (diff) {
      case Difficulty.EASY:
        return '简单';
      case Difficulty.MEDIUM:
        return '中等';
      case Difficulty.HARD:
        return '困难';
    }
  };

  const getGameModeLabel = (mode: GameMode): string => {
    switch (mode) {
      case GameMode.PVE:
        return '人机对战';
      case GameMode.EVE:
        return 'AI对战';
    }
  };

  return (
    <div className={styles.controls}>
      <div className={styles.buttonGroup}>
        <button
          className={styles.button}
          onClick={onUndo}
          disabled={!canUndo || disabled}
        >
          悔棋
        </button>
        <button
          className={styles.button}
          onClick={onReset}
        >
          重新开始
        </button>
      </div>

      <div className={styles.modeGroup}>
        <label className={styles.modeLabel}>模式：</label>
        <div className={styles.modeButtons}>
          {[GameMode.PVE, GameMode.EVE].map((mode) => (
            <button
              key={mode}
              className={`${styles.modeButton} ${gameMode === mode ? styles.active : ''}`}
              onClick={() => onGameModeChange(mode)}
              disabled={disabled}
            >
              {getGameModeLabel(mode)}
            </button>
          ))}
        </div>
      </div>

      {gameMode === GameMode.PVE ? (
        <div className={styles.difficultyGroup}>
          <label className={styles.difficultyLabel}>AI难度：</label>
          <div className={styles.difficultyButtons}>
            {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((diff) => (
              <button
                key={diff}
                className={`${styles.difficultyButton} ${difficulty === diff ? styles.active : ''}`}
                onClick={() => onDifficultyChange(diff)}
                disabled={disabled}
              >
                {getDifficultyLabel(diff)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.aiVsAiGroup}>
          <div className={styles.aiDifficultyRow}>
            <label className={styles.aiLabel}>黑棋AI：</label>
            <div className={styles.difficultyButtons}>
              {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((diff) => (
                <button
                  key={diff}
                  className={`${styles.difficultyButton} ${styles.smallButton} ${blackDifficulty === diff ? styles.active : ''}`}
                  onClick={() => onBlackDifficultyChange?.(diff)}
                  disabled={disabled}
                >
                  {getDifficultyLabel(diff)}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.aiDifficultyRow}>
            <label className={styles.aiLabel}>白棋AI：</label>
            <div className={styles.difficultyButtons}>
              {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((diff) => (
                <button
                  key={diff}
                  className={`${styles.difficultyButton} ${styles.smallButton} ${whiteDifficulty === diff ? styles.active : ''}`}
                  onClick={() => onWhiteDifficultyChange?.(diff)}
                  disabled={disabled}
                >
                  {getDifficultyLabel(diff)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
