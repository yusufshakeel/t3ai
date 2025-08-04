import Configs from './configs';
import { getRandomIndex } from './helpers';
import { PlayerName } from './types/game.type';
import { Action, QTable, QValue, State } from './types/qtable.type';

class Agent {
  private name: PlayerName;
  private qTable: QTable;
  private alpha: number;
  private gamma: number;
  private epsilon: number;
  private epsilonDecay: number;
  private epsilonMin: number;

  constructor(
    name: PlayerName,
    alpha = Configs.learningRateAlpha,
    gamma = Configs.discountFactorGamma,
    epsilon = Configs.explorationChanceEpsilon,
    epsilonDecay = Configs.explorationChanceEpsilonDecay,
    epsilonMin = Configs.explorationChanceEpsilonMin
  ) {
    this.name = name;
    this.qTable = {};
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.epsilonDecay = epsilonDecay;
    this.epsilonMin = epsilonMin;

    console.log('Agent created.', {
      name,
      alpha,
      gamma,
      epsilon,
      epsilonDecay,
      epsilonMin
    });
  }

  reconfigure(
    alpha = Configs.learningRateAlpha,
    gamma = Configs.discountFactorGamma,
    epsilon = Configs.explorationChanceEpsilon,
    epsilonDecay = Configs.explorationChanceEpsilonDecay,
    epsilonMin = Configs.explorationChanceEpsilonMin
  ): void {
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.epsilonDecay = epsilonDecay;
    this.epsilonMin = epsilonMin;

    console.log('Agent reconfigured.', {
      name: this.name,
      alpha,
      gamma,
      epsilon,
      epsilonDecay,
      epsilonMin
    });
  }

  getQTable(): QTable {
    return this.qTable;
  }

  getName(): PlayerName {
    return this.name;
  }

  getQValues(state: State, availableActions: Action[]): QValue {
    if (!this.qTable[state]) {
      this.qTable[state] = {};
    }
    for (const action of availableActions) {
      if (!(action in this.qTable[state])) {
        this.qTable[state][action] = 0;
      }
    }
    return this.qTable[state];
  }

  chooseAction(state: State, availableActions: Action[]): Action {
    const qValues = this.getQValues(state, availableActions);

    if (Math.random() < this.epsilon) {
      const randomIndex = getRandomIndex(availableActions);
      return availableActions[randomIndex];
    } else {
      let maxQ = -Infinity;
      let bestActions: Action[] = [];
      for (const action of availableActions) {
        const q = qValues[action] ?? 0;
        if (q > maxQ) {
          maxQ = q;
          bestActions = [action];
        } else if (q === maxQ) {
          bestActions.push(action);
        }
      }
      return bestActions[getRandomIndex(bestActions)];
    }
  }

  updateQTable(
    state: State,
    action: Action,
    reward: number,
    nextState: State,
    nextAvailableActions: Action[]
  ): void {
    const qValues = this.getQValues(state, [action]);
    const currentQ = qValues[action] ?? 0;

    const nextQValues = this.getQValues(nextState, nextAvailableActions);
    const maxNextQ =
        nextAvailableActions.length > 0
          ? Math.max(
            ...nextAvailableActions.map(availableAction => nextQValues[availableAction] ?? 0)
          )
          : 0;

    qValues[action] = currentQ + this.alpha * (reward + this.gamma * maxNextQ - currentQ);
  }

  decayEpsilon(): void {
    this.epsilon *= this.epsilonDecay;
    if (this.epsilon < this.epsilonMin) {
      this.epsilon = this.epsilonMin;
    }
  }
}

export default Agent;