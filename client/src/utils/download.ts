export function downloadFile(blob: Blob, fileName: string) {
  let link = document.createElement('a')
  link.style.display = 'none'

  link.href = URL.createObjectURL(blob) // 创建一个指向该参数对象的URL
  link.download = fileName
  link.click() // 触发下载
  URL.revokeObjectURL(link.href) // 释放通过 URL.createObjectURL() 创建的 URL
}
