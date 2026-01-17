import { Player } from '../../core/types';
import styles from './GameInfo.module.css';

interface GameInfoProps {
  currentPlayer: Player;
  winner: Player | null;
  isAIThinking: boolean;
}

export function GameInfo({ currentPlayer, winner, isAIThinking }: GameInfoProps) {
  const getPlayerName = (player: Player): string => {
    return player === Player.BLACK ? '黑棋' : '白棋';
  };

  return (
    <div className={styles.gameInfo}>
      {winner ? (
        <div className={styles.winner}>
          {getPlayerName(winner)} 获胜！
        </div>
      ) : isAIThinking ? (
        <div className={styles.thinking}>
          AI 正在思考...
        </div>
      ) : (
        <div className={styles.currentPlayer}>
          当前玩家: {getPlayerName(currentPlayer)}
        </div>
      )}
    </div>
  );
}
