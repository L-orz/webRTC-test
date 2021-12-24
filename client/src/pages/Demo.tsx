import { FC, useMemo, useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { usePeerConnection } from './usePeerConnection'
import Send from './Send'

const Demo: FC = (props) => {
  const socket = useMemo(() => io('ws://172.26.128.111:5000'), [])
  const [users, setUsers] = useState<string[]>([])
  // 过滤出除自身外的所有 user
  const otherUsers = useMemo(() => {
    return users.filter((user) => user !== socket.id)
  }, [socket.id, users])
  // 连接目标
  const [targetUser, setTargetUser] = useState<string>()
  // sendChannel.send
  const [send, setSend] = useState<Function>()

  const onIceCandidateSuccess = useCallback(
    (candidate: RTCIceCandidate) => {
      socket.emit('candidate', {
        candidate: candidate,
        to: targetUser,
      })
    },
    [socket, targetUser],
  )
  const onSendChannelOpen = useCallback(
    (sendFn: Function) => {
      console.log('onSendChannelOpen inner', sendFn)
      setSend(() => sendFn)
    },
    [setSend],
  )

  const { localConnection, createOffer, createAnswer, receiveAnswer } = usePeerConnection({
    onIceCandidateSuccess,
    onSendChannelOpen,
  })

  // 关闭 socket 连接
  function closeSocket() {
    socket.disconnect()
    setUsers([])
  }

  // 进入页面时 socket 连接，离开时断开
  useEffect(() => {
    socket.connect()
    socket.on('update-users', ({ users }) => {
      setUsers(users)
    })
    return () => {
      closeSocket()
    }
  }, [socket, setUsers])

  // 监听 socket 信令服务器
  useEffect(() => {
    socket.on('call', async ({ offer, user }) => {
      // console.log('step-2.1 ---- [B] 接收到信令服务器传递的 offer')
      const answer = await createAnswer(offer)

      // console.log('step-2.4 ---- [B] 将 answer 通过信令服务器发送给 [A]')
      socket.emit('answer', {
        answer,
        to: user,
      })
    })
    socket.on('answer', async ({ answer, user }) => {
      console.log('step-3.1 ---- [A] 接收到信令服务器传递的 answer')
      await receiveAnswer(answer)
    })
    socket.on('candidate', async ({ candidate, user }) => {
      console.log('step-5.1 ---- [A] 接收到信令服务器传递的 candidate 候选者信息', candidate)
      // TODO: setTargetUser 异步操作导致 undefined 待解决
      if (socket.id === user) return
      console.log('step-5.2 ---- [A] 将 candidate 添加进 localConnection')
      await localConnection.addIceCandidate(candidate)
    })

    return () => {
      socket.off('call')
      socket.off('answer')
      socket.off('candidate')
    }
  }, [socket, createAnswer, receiveAnswer, localConnection])

  // 点击用户，创建 RTCPeerConnection
  async function handleClick(user: string) {
    setTargetUser(user)

    // console.log('step-1.1 ---- [A] 选择目标 [B]，准备进行连接')
    const offer = await createOffer()

    // console.log('step-1.3 ---- [A] 将 offer 通过信令服务器发送给 [B]')
    socket?.emit('call-user', {
      offer,
      to: user,
    })
  }

  function handleSend(file: File) {
    console.log('-------- file', file)

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (evt) => {
      send?.(evt.target?.result)
    }
  }

  return (
    <div className="flex pt-24">
      <div className="flex-1">
        {otherUsers.map((user) => (
          <p key={user} className="m-16" onClick={() => handleClick(user)}>
            {user}
          </p>
        ))}
      </div>
      <div>{send ? <Send handleSend={handleSend}></Send> : null}</div>
      <div className="w-1/3">
        Locale device socket id: <span className=" text-primary">{socket.id}</span>
      </div>
    </div>
  )
}

export default Demo
