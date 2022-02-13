import { readFileSync, existsSync } from 'fs'

import { FileNotFoundException } from '@vyrnn/zeraph-exceptions'

import { EnvironmentNotFoundException } from './Exceptions'

export class Env {
  private static ENVIRONMENT: { [key: string]: any } = {}

  static prepare = (environmentFilePath: string = '.env') => {
    Env.readEnvironmentFile(environmentFilePath)
  }

  private static readEnvironmentFile = (environmentFilePath: string) => {
    if (!existsSync(environmentFilePath)) {
      throw new FileNotFoundException(
        404,
        'environment file not found'
      )
    }

    const lines = String(
      readFileSync(environmentFilePath),
    ).split(/\n/)

    Env.ENVIRONMENT = {}

    for (const line of lines) {
      if (/^$/.test(line)) {
        continue
      }

      var [ key, value ] = line.split(/=/)

      const regex = /\$\{(.*?)\}/g

      value.match(regex)?.forEach((match) => {
        const environment = match.split(/\{/)[1].split(/\}/)[0]

        value = value.replace(match, Env.ENVIRONMENT[environment])
      })

      Env.ENVIRONMENT[key] = value.replace(
        /("|\n)/g,
        '',
      )
    }
  }

  private static get = (key: string): any | undefined => {
    return Env.ENVIRONMENT[key]
  }

  public static getString = (key: string): string => {
    const value = Env.getStringOrNull(key)

    if (!value) {
      throw new EnvironmentNotFoundException()
    }

    return value
  }

  public static getStringOrNull = (key: string): string | null => {
    const value = Env.get(key)

    if (!value) {
      return null
    }

    return String(value)
  }

  public static getInt = (key: string): number => {
    const value = Env.getIntOrNull(key)

    if (!value) {
      throw new EnvironmentNotFoundException()
    }

    return value
  }

  public static getIntOrNull = (key: string): number | null => {
    const value = Env.get(key)

    if (!value) {
      return null
    }

    return Number(value)
  }
}
