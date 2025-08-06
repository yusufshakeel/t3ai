import Configs from './configs';
import { getBoardFromState, getRandomIndex } from './helpers';
import { GameSymbol, PlayerGameSymbol } from './types/game.type';
import { Action, QTable, QValue, State } from './types/qtable.type';
import Game from './Game';
import { AgentType } from './types/agent.type';

class Agent {
  private gameSymbol: PlayerGameSymbol;
  private qTable: QTable;
  private alpha: number;
  private gamma: number;
  private epsilon: number;
  private epsilonDecay: number;
  private epsilonMin: number;
  private gameInstanceForAgent: Game;
  private gameInstanceForOpponent: Game;
  private isTraining: boolean;
  private agentType: AgentType;

  constructor(
    gameSymbol: PlayerGameSymbol,
    alpha = Configs.learningRateAlpha,
    gamma = Configs.discountFactorGamma,
    epsilon = Configs.explorationChanceEpsilon,
    epsilonDecay = Configs.explorationChanceEpsilonDecay,
    epsilonMin = Configs.explorationChanceEpsilonMin,
    isTraining = false,
    agentType = AgentType.NOVICE
  ) {
    this.gameSymbol = gameSymbol;
    this.qTable = {};
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.epsilonDecay = epsilonDecay;
    this.epsilonMin = epsilonMin;

    this.isTraining = isTraining;
    this.agentType = agentType;

    this.gameInstanceForAgent = new Game();
    this.gameInstanceForOpponent = new Game();
  }

  printConfig(): void {
    console.log('Agent configuration:');
    console.log('==============================');
    console.log({
      agentType: this.agentType,
      gameSymbol: this.gameSymbol,
      isTraining: this.isTraining,
      alpha: this.alpha,
      gamma: this.gamma,
      epsilon: this.epsilon,
      epsilonDecay: this.epsilonDecay,
      epsilonMin: this.epsilonMin
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
  }

  getQTable(): QTable {
    return this.qTable;
  }

  setAgentType(agentType: AgentType): void {
    this.agentType = agentType;
  }

  setIsTraining(isTraining: boolean): void {
    this.isTraining = isTraining;
  }

  setQTable(qTable: QTable): void {
    this.qTable = qTable;
  }

  setGameSymbol(gameSymbol: PlayerGameSymbol): void {
    this.gameSymbol = gameSymbol;
  }

  getGameSymbol(): PlayerGameSymbol {
    return this.gameSymbol;
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

  immediateNextActionToPreventOpponentFromWinning(
    state: State,
    availableActions: Action[],
    opponentPlayerGameSymbol: PlayerGameSymbol
  ): Action | null {
    for (const action of availableActions) {
      this.gameInstanceForAgent.reset();
      this.gameInstanceForAgent.setCurrentPlayerGameSymbol(this.gameSymbol);
      this.gameInstanceForAgent.setBoard(getBoardFromState(state));
      this.gameInstanceForAgent.makeMove(action);

      const nextAvailableActionsForOpponent = this.gameInstanceForAgent.getAvailableActions();
      for (const nextActionForOpponent of nextAvailableActionsForOpponent) {
        this.gameInstanceForOpponent.reset();
        this.gameInstanceForOpponent.setCurrentPlayerGameSymbol(opponentPlayerGameSymbol);
        this.gameInstanceForOpponent.setBoard([...this.gameInstanceForAgent.getBoard()]);
        this.gameInstanceForOpponent.makeMove(nextActionForOpponent);
        if (this.gameInstanceForOpponent.isPlayerWinning(opponentPlayerGameSymbol)) {
          return nextActionForOpponent;
        }
      }
    }
    return null;
  }

  chooseAction(state: State, availableActions: Action[]): Action {
    const qValues = this.getQValues(state, availableActions);

    if (!this.isTraining && ![AgentType.NOVICE, AgentType.BEGINNER].includes(this.agentType)) {
      const opponentPlayerGameSymbol = this.gameSymbol === GameSymbol.X
        ? GameSymbol.O
        : GameSymbol.X;
      const immediateNextAction = this.immediateNextActionToPreventOpponentFromWinning(
        state,
        availableActions,
        opponentPlayerGameSymbol
      );
      if (immediateNextAction !== null) {
        return immediateNextAction;
      }
    }

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