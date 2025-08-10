import Agent from '../Agent';
import Configs from '../configs';
import { GameSymbol } from '../types/game.type';
import { playGames } from './common';
import { AgentType } from '../types/agent.type';

class LearnerTrainer {
  static train() {
    console.log('Points', {
      win: Configs.winningPoints,
      loss: Configs.losingPoints,
      draw: Configs.drawPoints,
      gameNotOverYet: Configs.gameNotOverYetPoints
    });

    const phases = Configs.trainingPhases;

    const REPEAT_COUNT = 3;

    const mentorX = new Agent(GameSymbol.X, AgentType.LEARNER);
    const mentorO = new Agent(GameSymbol.O, AgentType.LEARNER);

    for (let round = 1; round <= REPEAT_COUNT; round++) {
      console.log(`Training mentors... Round ${round} of ${REPEAT_COUNT}`);
      phases.forEach(phase => {
        console.log('Training phase', phase);
        mentorX.reconfigure(
          phase.alpha,
          phase.gamma,
          phase.epsilon,
          phase.epsilonDecay,
          phase.epsilonMin
        );
        mentorO.reconfigure(
          phase.alpha,
          phase.gamma,
          phase.epsilon,
          phase.epsilonDecay,
          phase.epsilonMin
        );

        mentorX.printConfig();
        mentorO.printConfig();

        playGames(
          phase.numberOfGames,
          mentorX,
          mentorO,
          `[Learner Mentor - ${phase.name} - Round ${round} of ${REPEAT_COUNT}]`
        );
      });
    }

    const learnerX = new Agent(GameSymbol.X, AgentType.LEARNER);
    const learnerO = new Agent(GameSymbol.O, AgentType.LEARNER);

    for (let round = 1; round <= REPEAT_COUNT; round++) {
      console.log(`Training learner L1x... Round ${round} of ${REPEAT_COUNT}`);
      phases.forEach(phase => {
        console.log('Training phase', phase);
        learnerX.reconfigure(
          phase.alpha,
          phase.gamma,
          phase.epsilon,
          phase.epsilonDecay,
          phase.epsilonMin
        );
        mentorO.reconfigure(
          phase.alpha,
          phase.gamma,
          0,
          0,
          0
        );

        learnerX.printConfig();
        mentorO.printConfig();

        playGames(
          phase.numberOfGames,
          learnerX,
          mentorO,
          `[Learner L1x vs MentorO - ${phase.name} - Round ${round} of ${REPEAT_COUNT}]`
        );
      });

      console.log(`Training learner L2o... Round ${round} of ${REPEAT_COUNT}`);
      phases.forEach(phase => {
        console.log('Training phase', phase);
        learnerO.reconfigure(
          phase.alpha,
          phase.gamma,
          phase.epsilon,
          phase.epsilonDecay,
          phase.epsilonMin
        );
        mentorX.reconfigure(
          phase.alpha,
          phase.gamma,
          0,
          0,
          0
        );

        learnerO.printConfig();
        mentorX.printConfig();

        playGames(
          phase.numberOfGames,
          learnerO,
          mentorX,
          `[Learner L2o vs MentorX - ${phase.name} - Round ${round} of ${REPEAT_COUNT}]`
        );
      });
    }

    return [learnerX.getQTable(), learnerO.getQTable()];
  }
}

export default LearnerTrainer;