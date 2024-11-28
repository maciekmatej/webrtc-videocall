<script setup lang="ts">
import { usePeerStore } from '@/stores/peer'
import Peer, { DataConnection } from 'peerjs'
import { socket } from "@/services/socket";
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
onBeforeMount(() => {
  peer.value = new Peer(
    `${Math.floor(Math.random() * 2 ** 18)
      .toString(36)
      .padStart(4, 0)}`,
    {
      port: 9000,
      host: location.hostname,
      debug: 1,
      path: '/server',
    },
  )
  peer.value.on('open', (pc) => {
    userId.value = pc
    console.log('huh?')
  })
  peer.value.on('connection', (connection: DataConnection) => {
    conn.value = connection
  })
  peer.value.on('call', (call) => {
    const answerCall = confirm('Do you want to answer?')
  })
})
onMounted(async () => {
  console.log(import.meta.env.VITE_API_URL)
  getLocalStream()
})

function getLocalStream() {
  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
      const audioElement = document.createElement('audio')
      localStream.value = stream // A
      audioElement.srcObject = stream // B
      audioElement.autoplay = true // C
      const localStreamContainer = document.querySelector('#local-audio')
      localStreamContainer?.append(audioElement)
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`)
    })
}
const getStreamCode = () => {
  callee.value = window.prompt('Please enter the sharing code')
}
function connectPeers() {
  conn.value = peer.value!.connect(callee.value!)
}
function socketConnect() {
  socket.connect();
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
    const audioElement = document.createElement('audio')
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
