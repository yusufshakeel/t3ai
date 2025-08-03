class Configs {
  public get learningRateAlpha(): number {
    return parseFloat(process.env.LEARNING_RATE_ALPHA || '0.1');
  }

  public get discountFactorGamma(): number {
    return parseFloat(process.env.DISCOUNT_FACTOR_GAMMA || '0.99999');
  }

  public get explorationChanceEpsilon(): number {
    return parseFloat(process.env.EXPLORATION_CHANCE_EPSILON || '1.0');
  }

  public get explorationChanceEpsilonDecay(): number {
    return parseFloat(process.env.EXPLORATION_CHANCE_EPSILON_DECAY || '0.99995');
  }

  public get explorationChanceEpsilonMin(): number {
    return parseFloat(process.env.EXPLORATION_CHANCE_EPSILON_MIN || '0.01');
  }

  public get numberOfGames(): number {
    return parseInt(process.env.NUMBER_OF_GAMES || '100000', 10);
  }

  public get winningPoints(): number {
    return parseInt(process.env.WINNING_POINTS || '1', 10);
  }

  public get losingPoints(): number {
    return parseInt(process.env.LOSING_POINTS || '-10', 10);
  }

  public get drawPoints(): number {
    return parseInt(process.env.DRAW_POINTS || '0.5', 10);
  }

  public get gameNotOverYetPoints(): number {
    return parseInt(process.env.GAME_NOT_OVER_YET_POINTS || '0', 10);
  }
}

export default new Configs();