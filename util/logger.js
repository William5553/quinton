import chalk from 'chalk';

export const log = (content, type = 'log') => {
  switch (type) {
    case 'log': 
      return console.log(`${chalk.bgBlue(type.toUpperCase())} ${content}`);
    case 'warn': 
      return console.log(`${chalk.black.bgYellow(type.toUpperCase())} ${content}`);
    case 'error':
      return console.log(`${chalk.bgRed(type.toUpperCase())} ${content}`);
    case 'debug':
      return console.log(`${chalk.green(type.toUpperCase())} ${content}`);
    case 'ready':
      return console.log(`${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
    default:
      throw new TypeError('Logger type must be either warn, debug, log, ready, or error.');
  }
};

export const error = (...args) => log(...args, 'error');

export const warn = (...args) => log(...args, 'warn');

export const debug = (...args) => log(...args, 'debug');