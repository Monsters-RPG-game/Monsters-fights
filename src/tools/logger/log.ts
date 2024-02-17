import chalk from 'chalk';
import errLogger from './logger';
import * as enums from '../../enums';

/**
 * Log passed data and save it in local files
 */
export default class Log {
  static error(target: string, ...messages: unknown[]): void {
    console.info(chalk.red(target));
    messages.forEach((m) => {
      console.info(chalk.red(m));
      Log.saveLog(m, enums.ELogTypes.Error);
    });
  }

  static warn(target: string, ...messages: unknown[]): void {
    console.info(chalk.yellow(target));
    messages.forEach((m) => {
      console.info(chalk.yellow(m));
      Log.saveLog(m, enums.ELogTypes.Warn);
    });
  }

  static log(target: string, ...messages: unknown[]): void {
    console.info(chalk.blue(target));
    messages.forEach((m) => {
      console.info(chalk.blue(m));
      Log.saveLog(m, enums.ELogTypes.Log);
    });
  }

  static trace(target: string, ...messages: unknown[]): void {
    console.trace(chalk.yellowBright(target));
    messages.forEach((m) => {
      console.info(chalk.yellowBright(m));
      Log.saveLog(m, enums.ELogTypes.Log);
    });
  }

  private static saveLog(message: unknown, type: enums.ELogTypes): void {
    const mess = typeof message !== 'string' ? JSON.stringify(message) : message;

    if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_PROD) {
      return;
    }

    switch (type) {
      case enums.ELogTypes.Warn:
        errLogger.warn(mess);
        return;
      case enums.ELogTypes.Error:
        errLogger.error(mess);
        return;
      case enums.ELogTypes.Log:
      default:
        errLogger.info(mess);
    }
  }
}
