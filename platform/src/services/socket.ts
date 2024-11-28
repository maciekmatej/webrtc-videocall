import { ref, type Ref } from "vue";
import { io, Socket } from "socket.io-client";

export const state: Ref<{
  connected: boolean;
  socket: Socket | null
}> = ref({
  connected: false,
  socket: null
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

export const socket = io('http://localhost:5000');

socket.on("connect", () => {
  console.log('elo321 soket')
  state.value.socket = socket;
  state.value.connected = true;
});

socket.on("disconnect", () => {
  console.log('disconekt')
  state.value.connected = false;
});

// socket.on("foo", (...args) => {
//   state.value.fooEvents.push(args);
// });

// socket.on("bar", (...args) => {
//   state.value.barEvents.push(args);
// });