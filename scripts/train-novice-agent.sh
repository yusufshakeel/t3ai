#!/usr/bin/env node

#############################################
# Set the env variables
#############################################
export T3AI_AGENT_TYPE=novice
export T3AI_NUMBER_OF_GAMES=100000
export T3AI_WINNING_POINTS=1
export T3AI_LOSING_POINTS=-5
export T3AI_DRAW_POINTS=0.5
export T3AI_GAME_NOT_OVER_YET_POINTS=0
export T3AI_LEARNING_RATE_ALPHA=0.1
export T3AI_DISCOUNT_FACTOR_GAMMA=0.9
export T3AI_EXPLORATION_CHANCE_EPSILON=1.0
export T3AI_EXPLORATION_CHANCE_EPSILON_DECAY=0.999
export T3AI_EXPLORATION_CHANCE_EPSILON_MIN=0.01

#############################################
# Train
#############################################

npm run bootstrap
ts-node src/train.ts

#############################################
# Unset the env variables
#############################################

unset T3AI_AGENT_TYPE
unset T3AI_NUMBER_OF_GAMES
unset T3AI_WINNING_POINTS
unset T3AI_LOSING_POINTS
unset T3AI_DRAW_POINTS
unset T3AI_GAME_NOT_OVER_YET_POINTS
unset T3AI_LEARNING_RATE_ALPHA
unset T3AI_DISCOUNT_FACTOR_GAMMA
unset T3AI_EXPLORATION_CHANCE_EPSILON
unset T3AI_EXPLORATION_CHANCE_EPSILON_DECAY
unset T3AI_EXPLORATION_CHANCE_EPSILON_MIN
