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

    console.log('Training mentors...');
    const mentorX = new Agent(GameSymbol.X, AgentType.LEARNER);
    const mentorO = new Agent(GameSymbol.O, AgentType.LEARNER);

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
        `[Learner Mentor - ${phase.name}]`
      );
    });

    console.log('Training learner L1x...');
    const learnerX = new Agent(GameSymbol.X, AgentType.LEARNER);

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
        `[Learner L1x vs MentorO - ${phase.name}]`,
        false
      );
    });

    console.log('Training learner L2o...');
    const learnerO = new Agent(GameSymbol.O, AgentType.LEARNER);

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
        `[Learner L2o vs MentorX - ${phase.name}]`,
        false
      );
    });

    return [learnerX.getQTable(), learnerO.getQTable()];
  }
}

export default LearnerTrainer;