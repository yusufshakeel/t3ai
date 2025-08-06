import Agent from '../Agent';
import Configs from '../configs';
import { GameSymbol } from '../types/game.type';
import { playGames } from './common';

class ExpertTrainer {
  static train() {
    console.log('Points', {
      win: Configs.winningPoints,
      loss: Configs.losingPoints,
      draw: Configs.drawPoints,
      gameNotOverYet: Configs.gameNotOverYetPoints
    });

    const phases = Configs.trainingPhases;

    console.log('Training mentors...');
    const mentorX = new Agent(GameSymbol.X);
    const mentorO = new Agent(GameSymbol.O);

    mentorX.setIsTraining(true);
    mentorO.setIsTraining(true);

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
        `[Expert Mentor - ${phase.name}]`
      );
    });

    console.log('Training expert E1x...');
    const expertX = new Agent(GameSymbol.X);

    expertX.setIsTraining(true);

    phases.forEach(phase => {
      console.log('Training phase', phase);
      expertX.reconfigure(
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

      expertX.printConfig();
      mentorO.printConfig();

      playGames(
        phase.numberOfGames,
        expertX,
        mentorO,
        `[Expert E1x vs MentorO - ${phase.name}]`,
        false
      );
    });

    console.log('Training expert E2o...');
    const expertO = new Agent(GameSymbol.O);

    expertO.setIsTraining(true);

    phases.forEach(phase => {
      console.log('Training phase', phase);
      expertO.reconfigure(
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

      expertO.printConfig();
      mentorX.printConfig();

      playGames(
        phase.numberOfGames,
        expertO,
        mentorX,
        `[Expert E2o vs MentorX - ${phase.name}]`,
        false
      );
    });

    return [expertX.getQTable(), expertO.getQTable()];
  }
}

export default ExpertTrainer;