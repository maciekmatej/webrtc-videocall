import type { MediaConnection } from 'peerjs'
import { ref } from 'vue'
interface RemoteStream {
  call: MediaConnection
  stream: MediaStream
}
const localStream = ref<MediaStream>()
const remoteStreams = ref<Record<string, RemoteStream>>({})
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
export const useStream = () => {
  const getPluggedDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const video = !!devices.find((device) => device.kind == 'videoinput')
    const audio = !!devices.find((device) => device.kind == 'audioinput')
    constraints.value = {
      audio,
      video,
    }
  }
  const getUserFeed = async () => {
    navigator.mediaDevices
      .getUserMedia(constraints.value)
      .then((stream) => {
        localStream.value = stream
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`)
      })
  }
  const addRemoteFeed = (user: string, feed: RemoteStream) => {
    remoteStreams.value = { ...remoteStreams.value, [user]: feed }
  }
  const removeRemoteFeed = (user: string) => {
    if (remoteStreams.value[user]) {
      const tracks = remoteStreams.value[user].stream.getTracks()
      tracks.forEach((track) => {
        track.stop()
      })
    }
    delete remoteStreams.value[user]
  }
  return {
    getPluggedDevices,
    getUserFeed,
    localStream,
    remoteStreams,
    options,
    addRemoteFeed,
    removeRemoteFeed,
  }
}
