<template>
  <div class="CreateCall flex flex-col">
    <h1 class="text-3xl">PEER ID: {{ userId }}</h1>
    <Button @click="createRoom" class="h-8"> Stwórz nowy pokój </Button>
    <input type="text" v-model="callee" />
    <Button @click="callPeer" class="h-8"> Zadzwon </Button>
  </div>
  <div class="flex flex-col">
    <div>to ja</div>
    <div id="local-audio"></div>
    <Button @click="changeInputTest">ZAMKNIJ MORDE</Button>
    <div id="remote-audio"></div>
  </div>
  <IncomingCallDialog v-model="toggleIncomingCallDialog" @submit="answerCall" />
</template>

<script setup lang="ts">
import IncomingCallDialog from '@/components/IncomingCallDialog.vue'
import { Button } from '@/components/ui/button'
import type { DataConnection, MediaConnection } from 'peerjs'
import Peer from 'peerjs'
import { onBeforeMount, ref } from 'vue'

const peer = ref<Peer | null>()
const userId = ref('')
const conn = ref<DataConnection>()
const callee = ref<string | null>()

const constraints = ref({
  audio: false,
  video: false,
})
const localStream = ref()
const remoteStream = ref()
const incomingCall = ref<MediaConnection>()
const toggleIncomingCallDialog = ref(false)

onBeforeMount(() => {
  peer.value = new Peer(
    `${Math.floor(Math.random() * 2 ** 18)
      .toString(36)
      .padStart(4, 0)}`,
    {
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
    },
  )
  peer.value.on('open', (pc) => {
    userId.value = pc
    console.log(pc)
  })
  peer.value.on('connection', (connection: DataConnection) => {
    console.log('peer on connection', connection)
    conn.value = connection
    console.log(conn.value.connectionId)
  })
  peer.value.on('call', (call: MediaConnection) => {
    console.log('peer.on.call')
    call.answer(localStream.value)
    call.on('stream', (remoteStream) => {
      addVideoStream(remoteStream)
    })
    // toggleIncomingCallDialog.value = true
  })
})
function addVideoStream(stream: MediaStream) {
  const video = document.createElement('video')
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  document.getElementById('remote-audio')!.append(video)
}
// const answerCall = () => {
//   console.log('hit answer')
//   incomingCall.value?.answer(localStream.value)
//   incomingCall.value!.on('stream', (stream) => {
//     console.log(stream.id)
//     getRemoteStream(stream)
//   })
// }
const changeInputTest = () => {}
const createRoom = () => {
  getLocalStream()
  connectPeers()
}
function connectPeers() {
  conn.value = peer.value!.connect(callee.value!)
}
const callPeer = () => {
  const call = peer.value!.call(callee.value!, localStream.value) // A
  console.log(call)
  console.log('peer.call')
  call.on('stream', (stream) => {
    console.log(stream)
    console.log(stream.id)
    getRemoteStream(stream)
  })
}
async function getPluggedDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const video = !!devices.find((device) => device.kind == 'videoinput')
  const audio = !!devices.find((device) => device.kind == 'audioinput')
  constraints.value = {
    audio,
    video,
  }
}
async function getLocalStream() {
  await getPluggedDevices()
  console.log(constraints.value)
  navigator.mediaDevices
    .getUserMedia(constraints.value)
    .then((stream) => {
      const audioElement = document.createElement('video')
      localStream.value = stream // A
      audioElement.srcObject = stream // B
      audioElement.autoplay = true // C
      audioElement.muted = true // C
      const localStreamContainer = document.querySelector('#local-audio')
      localStreamContainer?.append(audioElement)
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`)
    })
}
function getRemoteStream(stream: MediaStream) {
  console.log(stream.id)
  console.log(conn.value?.peerConnection.getSenders, ' tracvk')
  console.log(stream.getTracks(), ' tracvk')
  console.log(stream.getAudioTracks(), ' audio')
  console.log(stream.getVideoTracks(), ' vide')
  const audioElement = document.createElement('video')
  audioElement.srcObject = stream // C
  audioElement.autoplay = true // D
  remoteStream.value = stream //E
  const remoteStreamContainer = document.querySelector('#remote-audio')
  remoteStreamContainer?.append(audioElement)
}
</script>

<style scoped lang="sass"></style>
