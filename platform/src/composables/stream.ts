import type { Stream } from '@/types/StreamTypes'
import { ref, type Ref } from 'vue'

const localStream: Ref<Stream> = ref({
  isAudioMuted: true,
  isVideoMuted: true,
})

const remoteStreams = ref<Record<string, Stream>>({})
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
        localStream.value.stream = stream
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`)
        localStream.value.stream = new MediaStream()
        localStream.value.isAudioMuted = true
        localStream.value.isVideoMuted = true
      })
  }
  const addRemoteFeed = (user: string, feed: Stream) => {
    removeRemoteFeed(user)
    remoteStreams.value = {
      ...remoteStreams.value,
      [user]: feed,
    }
  }
  const removeRemoteFeed = (user: string) => {
    if (remoteStreams.value[user]) {
      const tracks = remoteStreams.value[user].stream?.getTracks()
      if (tracks) {
        tracks.forEach((track) => {
          track.stop()
        })
      }
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
