import { useMemo, useEffect } from 'react'
import { downloadFile } from '@/utils/download'

export interface UsePeerConnectionParams {
  onIceCandidateSuccess: (candidate: RTCIceCandidate) => void
  onSendChannelOpen: (sendFn: Function) => void
}

// peer connection hook
export function usePeerConnection({ onIceCandidateSuccess, onSendChannelOpen }: UsePeerConnectionParams) {
  const localConnection = useMemo(() => new RTCPeerConnection(), [])
  const remoteConnection = useMemo(() => new RTCPeerConnection(), [])
  const sendChannel = useMemo(() => localConnection.createDataChannel('file'), [])
  sendChannel.binaryType = 'arraybuffer'

  async function createOffer() {
    // console.log('step-1.2 ---- [A] 创建 offer 并且设置 localConnection.localDescription')
    const offer = await localConnection.createOffer()
    await localConnection.setLocalDescription(new RTCSessionDescription(offer))

    return offer
  }

  async function createAnswer(offer: RTCSessionDescriptionInit) {
    // console.log('step-2.2 ---- [B] 将 remoteConnection.remoteDescription 设置为 offer')
    await remoteConnection.setRemoteDescription(new RTCSessionDescription(offer))
    // console.log('step-2.3 ---- [B] 创建 answer，并将 remoteConnection.localDescription 设置为 answer')
    const answer = await remoteConnection.createAnswer()
    await remoteConnection.setLocalDescription(new RTCSessionDescription(answer))

    return answer
  }

  async function receiveAnswer(answer: RTCSessionDescriptionInit) {
    // console.log('step-3.2 ---- [A] 将 localConnection.remoteDescription 设置为 answer')
    await localConnection.setRemoteDescription(answer)
  }

  // // 监听当前 connection 事件
  useEffect(() => {
    remoteConnection.onicecandidate = async (event) => {
      console.log('step-4.1 ---- [B] remoteConnection 出现 ICE 协议候选者', event.candidate)
      if (event.candidate) {
        // console.log('step-4.2 ---- [B] 将候选者信息通过信令服务器发送给 [A]')
        onIceCandidateSuccess(event.candidate)
      }
    }
    sendChannel.onopen = () => {
      // console.log('step-6.1 ---- [A] sendChannel 开启')
      if (sendChannel.readyState === 'open') {
        sendChannel.send('Hello world!~')
        onSendChannelOpen(sendChannel.send.bind(sendChannel))
      }
    }
    remoteConnection.ondatachannel = (event) => {
      // console.log('step-7.1 ---- [B] remoteConnection dataChannel 开启', event)
      const receiveChannel = event.channel
      receiveChannel.onmessage = (ev) => {
        console.log('onmessage', ev)
        if (typeof ev.data === 'string') {
          console.log('Receive data by webRTC', ev)
        } else if (ev.data instanceof Blob || ev.data instanceof ArrayBuffer) {
          console.log('接收到 blob 类型')

          const newFile = new File([ev.data], 'test_receive_file', { type: 'arraybuffer' })
          downloadFile(newFile, 'test_receive_file')
        }
      }
    }
  }, [localConnection, remoteConnection, sendChannel, onIceCandidateSuccess, onSendChannelOpen])

  return {
    localConnection,
    remoteConnection,
    sendChannel,
    createOffer,
    createAnswer,
    receiveAnswer,
  }
}
