import { FC, useMemo, useEffect, useState } from 'react'

import { io, Socket } from 'socket.io-client'

const Demo: FC = (props) => {
  const [socket, setSocket] = useState<Socket>()
  const [users, setUsers] = useState<string[]>([])

  useEffect(() => {
    // 创建 socket 实例
    setSocket(io('ws://172.26.128.111:5000'))
    return () => {
      socket?.close()
    }
  }, [setSocket])

  useEffect(() => {
    socket?.on('update-users', ({ users }) => {
      setUsers(users)
      console.log('update users: ', users)
    })
    return () => {
      socket?.close()
    }
  }, [socket])

  return (
    <div>
      {users.map((user) => (
        <p key={user}>{user}</p>
      ))}
    </div>
  )
}

export default Demo
