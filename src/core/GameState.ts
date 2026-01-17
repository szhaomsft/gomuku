import { Player, Position, GameStateData } from './types';
import { BOARD_SIZE } from './constants';

export class GameState {
  board: Player[][];
  currentPlayer: Player;
  winner: Player | null;
  winningLine: Position[] | null;
  moveHistory: Position[];

  constructor(data?: Partial<GameStateData>) {
    if (data) {
      this.board = data.board ? data.board.map(row => [...row]) : this.createEmptyBoard();
      this.currentPlayer = data.currentPlayer ?? Player.BLACK;
      this.winner = data.winner ?? null;
      this.winningLine = data.winningLine ? [...data.winningLine] : null;
      this.moveHistory = data.moveHistory ? [...data.moveHistory] : [];
    } else {
      this.board = this.createEmptyBoard();
      this.currentPlayer = Player.BLACK;
      this.winner = null;
      this.winningLine = null;
      this.moveHistory = [];
    }
  }

  private createEmptyBoard(): Player[][] {
    return Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(Player.NONE));
  }

  makeMove(position: Position): boolean {
    const { x, y } = position;

    if (!this.isValidPosition(x, y)) return false;
    if (this.board[x][y] !== Player.NONE) return false;
    if (this.winner !== null) return false;

    this.board[x][y] = this.currentPlayer;
    this.moveHistory.push(position);
    this.currentPlayer = this.currentPlayer === Player.BLACK ? Player.WHITE : Player.BLACK;

    return true;
  }

  undoMove(): boolean {
    if (this.moveHistory.length === 0) return false;

    const lastMove = this.moveHistory.pop()!;
    this.board[lastMove.x][lastMove.y] = Player.NONE;
    this.currentPlayer = this.currentPlayer === Player.BLACK ? Player.WHITE : Player.BLACK;
    this.winner = null;
    this.winningLine = null;

    return true;
  }

  isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
  }

  getCell(x: number, y: number): Player {
    if (!this.isValidPosition(x, y)) return Player.NONE;
    return this.board[x][y];
  }

  isEmpty(x: number, y: number): boolean {
    return this.isValidPosition(x, y) && this.board[x][y] === Player.NONE;
  }

  isFull(): boolean {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (this.board[i][j] === Player.NONE) return false;
      }
    }
    return true;
  }

  clone(): GameState {
    return new GameState({
      board: this.board.map(row => [...row]),
      currentPlayer: this.currentPlayer,
      winner: this.winner,
      winningLine: this.winningLine ? [...this.winningLine] : null,
      moveHistory: [...this.moveHistory],
    });
  }

  toData(): GameStateData {
    return {
      board: this.board.map(row => [...row]),
      currentPlayer: this.currentPlayer,
      winner: this.winner,
      winningLine: this.winningLine ? [...this.winningLine] : null,
      moveHistory: [...this.moveHistory],
    };
  }
}
