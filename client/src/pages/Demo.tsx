import { FC, useMemo, useEffect, useState, useCallback } from 'react'

import { io, Socket } from 'socket.io-client'

const Demo: FC = (props) => {
  const socket = useMemo(() => io('ws://172.26.128.111:5000'), [])
  const [users, setUsers] = useState<string[]>([])
  // 过滤出除自身外的所有 user
  const otherUsers = useMemo(() => {
    return users.filter((user) => user !== socket.id)
  }, [socket.id, users])
  // 连接目标
  const [targetUser, setTargetUser] = useState<string>()

  const onIceCandidateSuccess = useCallback(
    (candidate: RTCIceCandidate) => {
      socket.emit('candidate', {
        candidate: candidate,
        to: targetUser,
      })
    },
    [socket, targetUser],
  )

  const { localConnection, remoteConnection, sendChannel, createOffer, createAnswer, receiveAnswer } =
    usePeerConnection({
      onIceCandidateSuccess,
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
      console.log('step-2.1 ---- [B] 接收到信令服务器传递的 offer')
      const answer = await createAnswer(offer)

      console.log('step-2.4 ---- [B] 将 answer 通过信令服务器发送给 [A]')
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
      console.log('step-5.1 ---- [A] 接收到信令服务器传递的 candidate 候选者信息')
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

    console.log('step-1.1 ---- [A] 选择目标 [B]，准备进行连接')
    const offer = await createOffer()

    console.log('step-1.3 ---- [A] 将 offer 通过信令服务器发送给 [B]')
    socket?.emit('call-user', {
      offer,
      to: user,
    })
  }

  return (
    <div>
      {otherUsers.map((user) => (
        <p key={user} onClick={() => handleClick(user)}>
          {user}
        </p>
      ))}
    </div>
  )
}

interface UsePeerConnectionParams {
  onIceCandidateSuccess: (candidate: RTCIceCandidate) => void
}

// peer connection hook
function usePeerConnection({ onIceCandidateSuccess }: UsePeerConnectionParams) {
  console.log('======= userPeerConnection')
  const localConnection = useMemo(() => new RTCPeerConnection(), [])
  const remoteConnection = useMemo(() => new RTCPeerConnection(), [])
  const sendChannel = useMemo(() => localConnection.createDataChannel('file'), [])

  async function createOffer() {
    console.log('step-1.2 ---- [A] 创建 offer 并且设置 localConnection.localDescription')
    const offer = await localConnection.createOffer()
    await localConnection.setLocalDescription(new RTCSessionDescription(offer))

    return offer
  }

  async function createAnswer(offer: RTCSessionDescriptionInit) {
    console.log('step-2.2 ---- [B] 将 remoteConnection.remoteDescription 设置为 offer')
    await remoteConnection.setRemoteDescription(new RTCSessionDescription(offer))
    console.log('step-2.3 ---- [B] 创建 answer，并将 remoteConnection.localDescription 设置为 answer')
    const answer = await remoteConnection.createAnswer()
    await remoteConnection.setLocalDescription(new RTCSessionDescription(answer))

    return answer
  }

  async function receiveAnswer(answer: RTCSessionDescriptionInit) {
    console.log('step-3.2 ---- [A] 将 localConnection.remoteDescription 设置为 answer')
    await localConnection.setRemoteDescription(answer)
  }

  // // 监听当前 connection 事件
  useEffect(() => {
    remoteConnection.onicecandidate = async (event) => {
      // console.log('remoteConnection.onicecandidate', event.candidate, {targetUser})
      console.log('step-4.1 ---- [B] remoteConnection 出现 ICE 协议候选者', event.candidate)
      if (event.candidate) {
        console.log('step-4.2 ---- [B] 将候选者信息通过信令服务器发送给 [A]')
        onIceCandidateSuccess(event.candidate)
      }
    }
    sendChannel.onopen = () => {
      console.log('step-6.1 ---- [A] sendChannel 开启')
      if (sendChannel.readyState === 'open') {
        sendChannel.send('Hello world!~')
      }
    }
    remoteConnection.ondatachannel = (event) => {
      console.log('step-7.1 ---- [B] remoteConnection dataChannel 开启', event)
      const receiveChannel = event.channel
      receiveChannel.onmessage = (ev) => {
        console.log('Receive data by webRTC', ev)
      }
    }
  }, [localConnection, remoteConnection, sendChannel, onIceCandidateSuccess])

  return {
    localConnection,
    remoteConnection,
    sendChannel,
    createOffer,
    createAnswer,
    receiveAnswer,
  }
}

export default Demo
