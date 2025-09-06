#!/usr/bin/env node

#############################################
# Set the env variables
#############################################
export T3AI_GENERATE_SINGLE_MODEL=yes

#############################################
# Server
#############################################

ts-node src/benchmark.ts

#############################################
# Unset the env variables
#############################################
unset T3AI_GENERATE_SINGLE_MODEL
