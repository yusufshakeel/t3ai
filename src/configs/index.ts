class Configs {
  public get learningRateAlpha(): number {
    return parseFloat(process.env.T3AI_LEARNING_RATE_ALPHA || '0.1');
  }

  public get discountFactorGamma(): number {
    return parseFloat(process.env.T3AI_DISCOUNT_FACTOR_GAMMA || '0.99999');
  }

  public get explorationChanceEpsilon(): number {
    return parseFloat(process.env.T3AI_EXPLORATION_CHANCE_EPSILON || '1.0');
  }

  public get explorationChanceEpsilonDecay(): number {
    return parseFloat(process.env.T3AI_EXPLORATION_CHANCE_EPSILON_DECAY || '0.99995');
  }

  public get explorationChanceEpsilonMin(): number {
    return parseFloat(process.env.T3AI_EXPLORATION_CHANCE_EPSILON_MIN || '0.01');
  }

  public get numberOfGames(): number {
    return parseInt(process.env.T3AI_NUMBER_OF_GAMES || '100000', 10);
  }

  public get winningPoints(): number {
    return parseFloat(process.env.T3AI_WINNING_POINTS || '1');
  }

  public get losingPoints(): number {
    return parseFloat(process.env.T3AI_LOSING_POINTS || '-10');
  }

  public get drawPoints(): number {
    return parseFloat(process.env.T3AI_DRAW_POINTS || '0.5');
  }

  public get gameNotOverYetPoints(): number {
    return parseFloat(process.env.T3AI_GAME_NOT_OVER_YET_POINTS || '0');
  }

  public get agentType(): string {
    return process.env.T3AI_AGENT_TYPE || 'novice';
  }
}

export default new Configs();