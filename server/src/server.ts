import express, { Application } from 'express'
import { Server as SocketioServer } from 'socket.io'
import { createServer, Server as HTTPServer } from 'http'

import { DEFAULT_PORT } from './config'

export class Server {
  private io: SocketioServer
  private httpServer: HTTPServer
  private app: Application

  constructor() {
    this.initialize()
    this.handleSocketConnection()
  }

  private initialize(): void {
    this.app = express()
    this.httpServer = createServer(this.app)
    // https://socket.io/docs/v4/server-initialization/
    this.io = new SocketioServer(this.httpServer, { cors: { origin: '*' } })
  }

  private handleSocketConnection() {
    handleSocketConnection(this.io)
  }

  public listen(port?: number) {
    const _port = port || DEFAULT_PORT
    this.httpServer.listen(_port, () => {
      console.log(`Server is listening on [Port: ${_port}]`)
    })
  }
}

function handleSocketConnection(io: SocketioServer) {
  let activeSocketIds: string[] = [] // 当前连接的 socket

  io.on('connection', (socket) => {
    // 如果已存在 id
    if (activeSocketIds.some((id) => id === socket.id)) {
      return
    }

    // 记录新的 socket
    activeSocketIds.push(socket.id)
    console.log(`Socket connected. [SocketID: ${socket.id}]`)

    // 推送用户列表
    io.emit('update-users', {
      users: activeSocketIds,
    })

    // 连接断开
    socket.on('disconnect', () => {
      // 从记录中移除
      activeSocketIds = activeSocketIds.filter((id) => id !== socket.id)
      console.log(`Socket disconnected. [SocketID: ${socket.id}]`)

      // 推送用户列表
      socket.broadcast.emit('update-users', { users: activeSocketIds })
    })

    // 监听 call-user 并通知对应用户，将 offer 及 id 发送给用户
    socket.on('call-user', ({ offer, to }) => {
      console.log('call-user', to)
      socket.to(to).emit('call', {
        offer,
        user: socket.id,
      })
    })

    socket.on('answer', ({ answer, to }) => {
      console.log('answer', to)
      socket.to(to).emit('answer', {
        answer,
        user: socket.id,
      })
    })

    socket.on('candidate', ({ candidate, to }) => {
      console.log('candidate to', to)
      socket.to(to).emit('candidate', {
        candidate,
        user: socket.id,
      })
    })
  })
}
