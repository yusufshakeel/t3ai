#!/usr/bin/env node

#############################################
# Set the env variables
#############################################
export T3AI_AGENT_TYPE=expert
read -r -d '' T3AI_TRAINING_PHASES <<'EOF'
[
  { "name": "explore", "numberOfGames": 300000, "alpha": 0.1, "gamma": 0.999999999, "epsilon": 1.0, "epsilonDecay": 1.0, "epsilonMin": 0.5 },
  { "name": "learn", "numberOfGames": 2000000, "alpha": 0.1, "gamma": 0.999999999, "epsilon": 1.0, "epsilonDecay": 0.999999999, "epsilonMin": 0.1 },
  { "name": "fine-tune", "numberOfGames": 500000, "alpha": 0.1, "gamma": 0.999999999, "epsilon": 1.0, "epsilonDecay": 1.0, "epsilonMin": 0.1 }
]
EOF
export T3AI_TRAINING_PHASES
export T3AI_WINNING_POINTS=1
export T3AI_LOSING_POINTS=-5
export T3AI_DRAW_POINTS=0.5
export T3AI_GAME_NOT_OVER_YET_POINTS=0

#############################################
# Train
#############################################

npm run bootstrap
ts-node src/train.ts

#############################################
# Unset the env variables
#############################################

unset T3AI_AGENT_TYPE
unset T3AI_TRAINING_PHASES
unset T3AI_WINNING_POINTS
unset T3AI_LOSING_POINTS
unset T3AI_DRAW_POINTS
unset T3AI_GAME_NOT_OVER_YET_POINTS
