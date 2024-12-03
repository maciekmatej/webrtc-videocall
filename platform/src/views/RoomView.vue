<template>
  <div class="flex justify-center items-center">
    <h1>{{ $route.params.roomId }}</h1>
    <div>
      <video ref="videoRef"></video>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePeer } from '@/composables/peer'
import { socket } from '@/services/socket'
import { useRoomStore } from '@/stores/room'
import type { DataConnection, MediaConnection, Peer } from 'peerjs'
import { onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const { peer } = usePeer()
const store = useRoomStore()
const { constraints, getPluggedDevices } = usePeer()

const videoRef = ref<HTMLVideoElement>()
const userId = ref('')
const conn = ref<DataConnection>()
const callee = ref<string | null>()

const localStream = ref()
const remoteStream = ref()
const incomingCall = ref<MediaConnection>()
const toggleIncomingCallDialog = ref(false)

const fetchRoomParticipantsList = ({ roomId, users }: { roomId: string; users: string[] }) => {
  store.userList = users
}
async function getLocalStream() {
  await getPluggedDevices()
  navigator.mediaDevices
    .getUserMedia(constraints.value)
    .then((stream) => {
      videoRef.value!.autoplay = true
      videoRef.value!.srcObject = stream
      videoRef.value!.muted = false
      console.log(stream.getTracks())
      localStream.value = stream
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`)
    })
}
const handlePeerEvents = (peer: Peer) => {
  peer.on('open', (pc) => {
    userId.value = pc
    console.log(pc)
  })
  peer.on('connection', (connection: DataConnection) => {
    console.log('peer on connection', connection)
    conn.value = connection
    console.log(conn.value.connectionId)
  })
  peer.on('call', (call: MediaConnection) => {
    console.log('peer.on.call')
    call.answer(localStream.value)
    call.on('stream', (remoteStream) => {
      addVideoStream(remoteStream)
    })
    // toggleIncomingCallDialog.value = true
  })
}
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
function connectPeers() {
  conn.value = peer.value!.connect(callee.value!)
}
const callPeer = () => {
  //@ts-expect-error option has a wrond type;
  const call = peer.value!.call(callee.value!, localStream.value, options) // A
  console.log(call)
  console.log('peer.call')
  call.on('stream', (stream) => {
    console.log(stream)
    console.log(stream.id)
    getRemoteStream(stream)
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
onMounted(async () => {
  await getPluggedDevices()
  await getLocalStream()
})
watchEffect(() => {
  if (peer.value) {
    socket.emit('join-room', { roomId: route.params.roomId, peerId: peer.value.id })
    socket.on('get-users', fetchRoomParticipantsList)
    handlePeerEvents(peer.value as Peer)
    // socket.on('joined-room', async () => getLocalStream)
  }
})
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
