// 为 import.meta.env 提供类型定义

interface ImportMetaEnv extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_API_BASE_URL: string
}
