import { Peer, type Peer as PeerType } from 'peerjs'
import { v4 as UUIDv4 } from 'uuid'
import { ref } from 'vue'

const peer = ref<PeerType | null>(null)

export const usePeer = () => {
  console.log(location.hostname, 'hostname')
  const createNewPeer = () => {
    peer.value = new Peer(UUIDv4(), {
      port: 9000,
      host: location.hostname,
      debug: 3,
      secure: true,
      path: '/peer',
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun.l.google.com:5349' },
        ],
      },
    })
  }

  return { createNewPeer, peer }
}
