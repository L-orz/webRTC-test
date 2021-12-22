import { FC, useMemo, useEffect } from 'react'

import { io, Socket } from 'socket.io-client'

const Demo: FC = (props) => {
  // 创建 socket 实例
  let socket: Socket

  useEffect(() => {
    socket = io('http://172.26.128.111:5000')
    return () => {
      socket.close()
    }
  }, [])

  return <div>Demo Page</div>
}

export default Demo
