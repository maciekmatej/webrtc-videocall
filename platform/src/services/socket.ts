import { ref, type Ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { usePeer } from '@/composables/peer'
const { createNewPeer } = usePeer()
export const state: Ref<{
  connected: boolean
  socket: Socket | null
}> = ref({
  connected: false,
  socket: null,
})

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000'

export const socket = io({ path: '/socket.io/' })
socket.on('connect', () => {
  createNewPeer()
  state.value.socket = socket
  state.value.connected = true
})

socket.on('disconnect', () => {
  console.log('disconekt')
  state.value.connected = false
})

// socket.emit("bar", (...args) => {
//   state.value.barEvents.push(args);
// });
