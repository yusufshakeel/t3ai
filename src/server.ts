import { createServer } from 'http';
import { existsSync, readFile } from 'fs';
import { join } from 'path';
import { URL } from 'url';
import { GameSymbol } from './types/game.type';
import Agent from './Agent';
import { AgentType } from './types/agent.type';
import {
  T3AI_LEARNER_MODEL_O_FILE_NAME,
  T3AI_LEARNER_MODEL_X_FILE_NAME
} from './constants';
import fs from 'fs';
import { Action, QTable, State } from './types/qtable.type';
import Game from './Game';
import { getBoardFromState, getReward } from './helpers';

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = join(process.cwd(), 'public');

const modelsDir = process.cwd() + '/models';
const models = {
  [GameSymbol.X]: T3AI_LEARNER_MODEL_X_FILE_NAME,
  [GameSymbol.O]: T3AI_LEARNER_MODEL_O_FILE_NAME
};
let modelFilePath = '';

const agent = new Agent(
  GameSymbol.X,
  AgentType.LEARNER,
  0.01,
  0.95,
  0,
  0,
  0
);

const game = new Game();

let userSymbol: GameSymbol;
let aiSymbol: GameSymbol;
let userScore = 0;
let aiScore = 0;
let history: { state: State, action: Action }[] = [];

const logger = (message: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

const gameResponse = () => {
  let gameStatus = 'On';
  if (game.getWinner() === userSymbol) {
    gameStatus = '🎉 You win!';
    userScore++;
  } else if (game.getWinner() === aiSymbol) {
    gameStatus = '🤖 AI wins!';
    aiScore++;
  } else if (game.getWinner() === null && game.isGameOver()) {
    gameStatus = "🤝 It's a draw!";
    aiScore++;
    userScore++;
  }
  return JSON.stringify({
    userSymbol,
    aiSymbol,
    gameStatus,
    aiScore,
    userScore,
    isGameOver: game.isGameOver(),
    currentPlayerGameSymbol: game.getCurrentPlayerGameSymbol(),
    board: getBoardFromState(game.getState())
  });
};

const updateQTable = (state: State, isGameOver: boolean) => {
  if (!isGameOver) {
    const nextState = game.getState();
    const nextAvailableActions = game.getAvailableActions();
    const reward = getReward(
      game.getWinner(),
      agent.getGameSymbol(),
      nextAvailableActions.length,
      game.isGameOver()
    );

    if (history.length) {
      const lastMove = history[history.length - 1];
      logger(`Update Q Table: isGameOver: ${isGameOver} lastState: ${lastMove.state} lastAction: ${lastMove.action} nextState: ${nextState} nextAvailableActions: ${nextAvailableActions} reward: ${reward}`);
      agent.updateQTable(
        lastMove.state,
        lastMove.action,
        reward,
        nextState,
        nextAvailableActions
      );
    }
  } else {
    const reward = getReward(
      game.getWinner(),
      agent.getGameSymbol(),
      game.getAvailableActions().length,
      game.isGameOver()
    );
    for (const move of history) {
      logger(`Update Q Table: isGameOver: ${isGameOver} state: ${move.state} action: ${move.action} reward: ${reward}`);
      agent.updateQTable(
        move.state,
        move.action,
        reward,
        state,
        []
      );
    }
  }
};

const aiTurn = () => {
  if (!game.isGameOver()) {
    const state = game.getState();
    const available = game.getAvailableActions();
    const action = agent.chooseAction(state, available);
    logger(`AI action: ${action} state: ${state} available: ${available}`);
    game.makeMove(action);
    history.push({ state, action });
    updateQTable(state, false);
  }
};

const userTurn = (action: Action) => {
  if (!game.isGameOver()) {
    const state = game.getState();
    const available: Action[] = game.getAvailableActions();
    if (!available.includes(action)) {
      return { error: 'Invalid move. Try again.' };
    }
    logger(`User action: ${action} state: ${state} available: ${available}`);
    game.makeMove(action);
    updateQTable(state, false);
    aiTurn();
    return { success: true };
  }
  return { error: 'Game Over' };
};

const isValidGameSymbol = (gameSymbol: GameSymbol) =>
  [GameSymbol.X, GameSymbol.O].includes(gameSymbol);

const apiStartHandler = (res: any, queryParams: URLSearchParams) => {
  userSymbol = queryParams.get('userSymbol') as GameSymbol;

  res.writeHead(200, { 'Content-Type': 'application/json' });

  if (!isValidGameSymbol(userSymbol)) {
    res.end(JSON.stringify({ error: 'Invalid user symbol' }));
    return;
  }

  aiSymbol = userSymbol === GameSymbol.X
    ? GameSymbol.O
    : GameSymbol.X;
  agent.setGameSymbol(aiSymbol);

  modelFilePath = modelsDir + '/' + models[aiSymbol];
  const qTable: QTable = JSON.parse(fs.readFileSync(modelFilePath, 'utf-8'));
  logger(`Loading Q-Table: ${modelFilePath}`);

  agent.setQTable(qTable);
  game.reset();
  history = [];

  if (aiSymbol === GameSymbol.X) {
    aiTurn();
  }

  res.end(gameResponse());
  return;
};

const apiUserMoveHandler = (res: any, queryParams: URLSearchParams) => {
  const move = queryParams.get('move');

  res.writeHead(200, { 'Content-Type': 'application/json' });

  if (!isValidGameSymbol(userSymbol)) {
    res.end(JSON.stringify({ error: 'Invalid user symbol' }));
    return;
  }
  if (move === null) {
    res.end(JSON.stringify({ error: 'Invalid move' }));
    return;
  }
  if (game.getCurrentPlayerGameSymbol() !== userSymbol) {
    res.end(JSON.stringify({ error: 'It is not your turn' }));
    return;
  }

  const state = game.getState();

  const result = userTurn(parseInt(move, 10) as Action);
  if (result.error) {
    res.end(JSON.stringify({ error: result.error }));
    return;
  }

  if (game.isGameOver()) {
    updateQTable(state, true);
    logger(`Updating Q-Table: ${modelFilePath}`);
    fs.writeFileSync(modelFilePath, JSON.stringify(agent.getQTable(), null, 2));
  }

  res.end(gameResponse());
  return;
};

const indexPageHandler = (res: any, pathname: string) => {
  const filePath = pathname === '/' ? '/index.html' : pathname;
  const fullPath = join(PUBLIC_DIR, filePath);

  if (existsSync(fullPath)) {
    const ext = filePath.split('.').pop();
    const contentType = ext === 'html' ? 'text/html' : 'text/plain';

    readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
};

const server = createServer((req: any, res: any) => {
  if (!req.url) return;

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const queryParams = parsedUrl.searchParams;

  if (pathname === '/api/start') {
    return apiStartHandler(res, queryParams);
  } else if (pathname === '/api/move') {
    return apiUserMoveHandler(res, queryParams);
  }

  indexPageHandler(res, pathname);
});

server.listen(PORT, () => {
  logger(`Server running at http://localhost:${PORT}`);
});
