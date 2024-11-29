<script setup lang="ts">
import { usePeerStore } from '@/stores/peer'
import Peer, { DataConnection } from 'peerjs'
import { socket } from '@/services/socket'
import { computed, onBeforeMount, onMounted, ref, type Ref } from 'vue'
const store = usePeerStore()
const peer = ref<Peer | null>(null)
const userId = ref('')
const conn: Ref<DataConnection | null> = ref(null)
const callee: Ref<string | null> = ref('')
const localStream = ref()
const remoteStream = ref()
const id = computed(() => {
  return userId.value
})

onMounted(async () => {
  console.log(import.meta.env.VITE_API_URL)
  getLocalStream()
})

const getStreamCode = () => {
  callee.value = window.prompt('Please enter the sharing code')
}
function connectPeers() {
  conn.value = peer.value!.connect(callee.value!)
}
function socketConnect() {
  socket.connect()
}
function socketDIsConnect() {
  socket.emit('signal', 'essssssssssssssssssssssssssssssa')
}
const call = () => {
  store.callApi()
  getStreamCode()
  connectPeers()
  const call = peer.value!.call(callee.value!, localStream.value) // A

  call.on('stream', (stream) => {
    console.log(stream, ' remote')
    const audioElement = document.createElement('video')
    audioElement.srcObject = stream // C
    audioElement.autoplay = true // D
    remoteStream.value = stream //E
    const remoteStreamContainer = document.querySelector('#remote-audio')
    remoteStreamContainer?.append(audioElement)
  })
}
// peer.value!.call()
</script>

<template>
  <div class="greetings">
    <h1 class="green">Peer id:{{ id }}</h1>
    <div id="local-audio"></div>
    <div id="remote-audio"></div>
  </div>
  <button @click="socketConnect">socket</button>
  <button @click="socketDIsConnect">socket rozlacz</button>
  <button @click="call">ZADZWON :></button>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

#local-audio,
#remote-audio {
  text-align: center;
  background-color: blueviolet;
  border: 1px solid black;
  height: 100px;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
