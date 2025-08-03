export type State = string;

export type Action = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type QValue = {
  [action in Action]?: number;
};

export type QTable = {
  [state: State]: QValue
}