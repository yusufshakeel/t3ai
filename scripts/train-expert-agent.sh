#!/usr/bin/env node

#############################################
# Set the env variables
#############################################
export T3AI_AGENT_TYPE=expert
read -r -d '' T3AI_TRAINING_PHASES <<'EOF'
[
  { "name": "explore", "numberOfGames": 300000, "alpha": 0.1, "gamma": 0.95, "epsilon": 1.0, "epsilonDecay": 0.9995, "epsilonMin": 0.2 },
  { "name": "learn", "numberOfGames": 500000, "alpha": 0.1, "gamma": 0.95, "epsilon": 0.2, "epsilonDecay": 0.999, "epsilonMin": 0.05 },
  { "name": "fine-tune", "numberOfGames": 200000, "alpha": 0.1, "gamma": 0.95, "epsilon": 0.05, "epsilonDecay": 1.0, "epsilonMin": 0.05 }
]
EOF
export T3AI_TRAINING_PHASES
export T3AI_WINNING_POINTS=3
export T3AI_LOSING_POINTS=-5
export T3AI_DRAW_POINTS=2
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
