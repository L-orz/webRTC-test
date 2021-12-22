/** 高级类型 */
type Nullable<T> = T | null | undefined
type PartialNull<T> = {
  [P in keyof T]?: T[P] | null
}

/** 全局类型 */
type Timestamp = number
type JSONString<T> = string
