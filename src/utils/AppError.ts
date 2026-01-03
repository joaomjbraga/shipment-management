export class AppError {
  message: string
  statuscode: number

  constructor(message: string, status: number = 400) {
    this.message = message
    this.statuscode = status
  }
}
