#!/usr/bin/env node

#############################################
# Set the env variables
#############################################
export T3AI_AGENT_TYPE=learner
export T3AI_WINNING_POINTS=3
export T3AI_LOSING_POINTS=-5
export T3AI_DRAW_POINTS=2
export T3AI_GAME_NOT_OVER_YET_POINTS=0
export T3AI_GENERATE_SINGLE_MODEL=yes

#############################################
# Server
#############################################

ts-node src/server.ts

#############################################
# Unset the env variables
#############################################

unset T3AI_AGENT_TYPE
unset T3AI_WINNING_POINTS
unset T3AI_LOSING_POINTS
unset T3AI_DRAW_POINTS
unset T3AI_GAME_NOT_OVER_YET_POINTS
unset T3AI_GENERATE_SINGLE_MODEL
