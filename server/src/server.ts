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
  const activeSocketIds: string[] = [] // 当前连接的 socket

  io.on('connection', (socket) => {
    // 如果已存在 id
    if (activeSocketIds.some((id) => id === socket.id)) {
      return
    }

    // 记录新的 socket
    activeSocketIds.push(socket.id)
    console.log(`Socket connected. [SocketID: ${socket.id}]`)

    // 连接断开
    socket.on('disconnect', () => {
      // 从记录中移除
      activeSocketIds.filter((id) => id !== socket.id)
      console.log(`Socket disconnected. [SocketID: ${socket.id}]`)
    })
  })
}
