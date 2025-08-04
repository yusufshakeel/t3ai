export type TrainingPhase = {
    name: string;
    numberOfGames: number;
    alpha: number;
    gamma: number;
    epsilon: number;
    epsilonDecay: number;
    epsilonMin: number;
}