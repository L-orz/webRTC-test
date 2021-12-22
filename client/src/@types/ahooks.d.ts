import 'ahooks'

declare module 'ahooks' {
  export interface PaginatedFormatReturn<Item> {
    total: number
    list: Item[]
    [key: string]: any
  }
}
