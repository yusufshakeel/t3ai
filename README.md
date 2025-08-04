# t3ai
AI agent that plays Tic Tac Toe.

## Getting started

* Bootstrap

```shell
npm run bootstrap
```

* Install packages

```shell
npm i
```

* Train models

```shell
npm run train:all
```

## Train

There are different types of models available, and you can train them using the
following commands.

### Train all the models

```shell
npm run train:all
```

### Novice model

Configurations inside the [train-novice-agent.sh](scripts/train-novice-agent.sh) file.

```shell
npm run train:novice-agent
```

### Beginner model

Configurations inside the [train-beginner-agent.sh](scripts/train-beginner-agent.sh) file.

```shell
npm run train:beginner-agent
```

## Models

The models will be generated inside the **models** folder after you run the
training scripts.

## Benchmark

Run the following command to benchmark the models.

```shell
npm run benchmark
```

## Play

You can play with the AI agent by running the following command.

```shell
npm run play
```

## License

It's free :smiley:

[MIT License](https://github.com/yusufshakeel/t3ai/blob/main/LICENSE) Copyright (c) 2025 Yusuf Shakeel