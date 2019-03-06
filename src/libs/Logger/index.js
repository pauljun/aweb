import moment from 'moment';

const colorEnum = {
  /**
   * 信息日志颜色，默认宝蓝色
   */
  info: 'DodgerBlue',

  /**
   * 警告日志颜色，默认橘黄色
   */
  warn: 'orange',

  /**
   * 错误日志颜色，默认红色
   */
  error: 'red',

  /**
   * debug日志颜色，默认红色
   */
  debug: 'blue',

  /**
   * 日志发送成功颜色，默认绿色
   */
  success: 'green',

  /**
   * 描述文字颜色，默认粉红色
   */
  desc: '#d30775'
};

class Logger {
  colorConfig = {};
  loggerName = null;
  isPreserveLog = null;
  constructor(logName, isPreserveLog, colorConfig) {
    this.loggerName = logName ? logName : null;
    this.colorConfig = Object.assign(colorEnum, colorConfig);
    this.isPreserveLog = !!isPreserveLog;
  }
  destory() {
    this.colorConfig = null;
    this.loggerName = null;
    this.isPreserveLog = null;
  }
  getLogger(name) {
    this.loggerName = name;
  }
  get timeString() {
    return moment().format('HH:mm:ss');
  }
  printConsole(name, level, ...args) {
    if (process.env.NODE_ENV !== 'production') {
      console[name](
        `%c${this.loggerName ? '[' + this.loggerName + '] - ' : ''}[${
          this.timeString
        }] [${level.toUpperCase()}] -`,
        `color: ${this.colorConfig[level]}`,
        ...args
      );
    } else {
      this.isPreserveLog &&
        console[name](
          `%c${this.loggerName ? '[' + this.loggerName + '] - ' : ''}[${
            this.timeString
          }] [${level.toUpperCase()}] -`,
          `color: ${this.colorConfig[level]}`,
          ...args
        );
    }
  }
  info(...args) {
    this.printConsole('info', 'info', ...args);
  }

  warn(...args) {
    this.printConsole('warn', 'warn', ...args);
  }

  error(...args) {
    this.printConsole('error', 'error', ...args);
  }

  success(...args) {
    this.printConsole('info', 'success', ...args);
  }
  debug(...args) {
    this.printConsole('info', 'debug', ...args);
  }
  desc(...args) {
    this.printConsole('info', 'desc', ...args);
  }
}

export default Logger;
