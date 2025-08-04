export enum GameSymbol {
    X = 'X',
    O = 'O'
}

export type Board = GameSymbol.O | GameSymbol.X | null;

export type PlayerName = GameSymbol.O | GameSymbol.X;

export type Winner = GameSymbol.O | GameSymbol.X | null;