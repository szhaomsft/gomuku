import { Position, Player } from '../../core/types';
import { BOARD_SIZE } from '../../core/constants';
import { Cell } from './Cell';
import styles from './Board.module.css';

interface BoardProps {
  board: Player[][];
  winningLine: Position[] | null;
  onCellClick: (position: Position) => void;
  disabled: boolean;
}

export function Board({ board, winningLine, onCellClick, disabled }: BoardProps) {
  const isWinningCell = (x: number, y: number): boolean => {
    if (!winningLine) return false;
    return winningLine.some(pos => pos.x === x && pos.y === y);
  };

  return (
    <div className={styles.board}>
      {Array.from({ length: BOARD_SIZE }, (_, i) => (
        <div key={i} className={styles.row}>
          {Array.from({ length: BOARD_SIZE }, (_, j) => (
            <Cell
              key={`${i}-${j}`}
              player={board[i][j]}
              isWinning={isWinningCell(i, j)}
              onClick={() => !disabled && onCellClick({ x: i, y: j })}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
