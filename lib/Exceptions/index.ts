import { Exception } from '@vyrnn/zeraph-exceptions'

export class EnvironmentNotFoundException extends Exception {
  constructor(
    status: number = 404,
    message: string = 'environment not found'
  ) { super(status, message) }
}
