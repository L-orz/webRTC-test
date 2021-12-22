declare namespace Api {
  interface Response<T = any> {
    code: number
    message: string
    data: T
  }
}
