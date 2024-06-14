/*
 * This is log.service.ts
 */
import {Injectable} from '@angular/core'

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}
@Injectable()
export class LogService {
  level: LogLevel
  log(msg: string, ...optionalParams: Object[]): Object {
    return JSON.stringify(msg), optionalParams
  }
  debug(msg: string, ...optionalParams: Object[]): void {
    this.writeToLog(msg, LogLevel.Debug, optionalParams)
  }

  //   info(msg: string, ...optionalParams: Object[]) {
  //     this.writeToLog(msg, LogLevel.Info, optionalParams)
  //   }

  warn(msg: string, ...optionalParams: Object[]): void {
    this.writeToLog(msg, LogLevel.Warn, optionalParams)
  }

  error(msg: string, ...optionalParams: Object[]): void {
    this.writeToLog(msg, LogLevel.Error, optionalParams)
  }

  fatal(msg: string, ...optionalParams: Object[]): void {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams)
  }

  //   log(msg: string, ...optionalParams: Object[]) {
  //     this.writeToLog(msg, LogLevel.All, optionalParams)
  //   }
  private writeToLog(msg: string, level: LogLevel, params: Object[]): void {
    if (this.shouldLog(level)) {
      let value = ''

      //Build log string
      // if (this.logWithDate) {
      //   value = new Date() + ' - '
      // }

      value += `Type: ${LogLevel[this.level]}`
      value += ` - Message: ${msg}`
      if (params.length) {
        value += ` - Extra Info: ${this.formatParams(params)}`
      }

      // Log the value
    }
  }
  private shouldLog(level: LogLevel): boolean {
    let ret = false
    if (
      (level >= this.level && level !== LogLevel.Off) ||
      this.level === LogLevel.All
    ) {
      ret = true
    }
    return ret
  }
  private formatParams(params: Object[]): string {
    let ret: string = params.join(',')

    // Is there at least one object in the array?
    if (params.some(p => typeof p == 'object')) {
      ret = ''

      // Build comma-delimited string
      for (const item of params) {
        ret += `${JSON.stringify(item)},`
      }
    }
    return ret
  }
}
