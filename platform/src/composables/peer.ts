import { Peer, type Peer as PeerType } from 'peerjs'
import { v4 as UUIDv4 } from 'uuid'
import { ref } from 'vue'

const peer = ref<PeerType | null>(null)
const options = {
  constraints: {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    },
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  },
}
const constraints = ref({
  audio: false,
  video: false,
})
export const usePeer = () => {
  const createNewPeer = () => {
    peer.value = new Peer(UUIDv4(), {
      port: 9000,
      host: location.hostname,
      debug: 1,
      path: '/',
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun.l.google.com:5349' },
        ],
      },
    })
  }
  const getPluggedDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const video = !!devices.find((device) => device.kind == 'videoinput')
    const audio = !!devices.find((device) => device.kind == 'audioinput')
    constraints.value = {
      audio,
      video,
    }
  }

  return { createNewPeer, peer, options, constraints, getPluggedDevices }
}
