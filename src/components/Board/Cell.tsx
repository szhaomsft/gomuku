import { Player } from '../../core/types';
import styles from './Board.module.css';

interface CellProps {
  player: Player;
  isWinning: boolean;
  onClick: () => void;
}

export function Cell({ player, isWinning, onClick }: CellProps) {
  return (
    <div className={styles.cell} onClick={onClick}>
      {player !== Player.NONE && (
        <div
          className={`${styles.stone} ${player === Player.BLACK ? styles.black : styles.white} ${
            isWinning ? styles.winning : ''
          }`}
        />
      )}
    </div>
  );
}
