<template>
  <div class="flex justify-center items-center relative h-full">
    <h1>{{ $route.params.roomId }}</h1>
    <div :class="{ 'absolute bottom-1 right-1': store.participantsListWithoutUser.length > 0 }">
      <UserFeedPlayer :stream="localStream" :is-local-feed="true" />
    </div>
    <div v-for="(data, user) in remoteStreams" :key="user">
      <h1>{{ user }}</h1>
      <UserFeedPlayer :stream="data.stream" :is-local-feed="false" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePeer } from '@/composables/peer'
import UserFeedPlayer from '@/components/UserFeedPlayer.vue'
import { socket } from '@/services/socket'
import Button from '@/components/ui/button/Button.vue'
import { useRoomStore } from '@/stores/room'
import type { CallOption, DataConnection, MediaConnection, Peer } from 'peerjs'
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStream } from '@/composables/stream'
const route = useRoute()
const { peer } = usePeer()
const store = useRoomStore()
const {
  getUserFeed,
  getPluggedDevices,
  remoteStreams,
  localStream,
  options,
  addRemoteFeed,
  removeRemoteFeed,
} = useStream()

const roomId = ref('')

// const incomingCall = ref<MediaConnection>()
// const toggleIncomingCallDialog = ref(false)

const fetchRoomParticipantsList = ({ roomId, users }: { roomId: string; users: string[] }) => {
  console.log(roomId)
  store.participantsList = users
}
async function getLocalStream() {
  await getPluggedDevices()
  await getUserFeed()
}

// const answerCall = () => {
//   console.log('hit answer')
//   incomingCall.value?.answer(localStream.value)
//   incomingCall.value!.on('stream', (stream) => {
//     console.log(stream.id)
//     getRemoteStream(stream)
//   })
// }
// function connectPeers(user: string) {
//   conn.value = peer.value!.connect(user)
// }
// const callPeer = (user: string) => {
//   connectPeers(user)

//   const call = peer.value!.call(user, localStream.value, options) // A
//   call.on('stream', (stream) => {
//     addRemoteStream(stream, user)
//   })
// }

onMounted(async () => {
  roomId.value = route.params.roomId as string
  await getPluggedDevices()
  await getLocalStream()
})
watchEffect(() => {
  if (peer.value) {
    socket.emit('join-room', { roomId: route.params.roomId, peerId: peer.value.id })
    socket.on('get-users', fetchRoomParticipantsList)
    // socket.on('joined-room', async () => getLocalStream)
  }
})
onBeforeUnmount(() => {
  if (peer.value) {
    console.log(roomId.value, 'room from route')
    socket.emit('leave-room', { roomId: roomId.value, peerId: peer.value.id })
  }
})
watchEffect(() => {
  if (!peer.value || !localStream.value) {
    // socket.off('user-joined-room')
    return
  }
  socket.on('user-joined-room', ({ peerId }: { peerId: string }) => {
    //@ts-expect-error wrong type for peerjs otption
    const call = peer.value!.call(peerId, localStream.value!, options)
    console.log('call new peer that joined the room', peerId)
    call.on('stream', (stream) => {
      if (remoteStreams.value[peerId]) {
        return
      }
      addRemoteFeed(peerId, { stream, call })
    })
    call.on('close', () => {
      removeRemoteFeed(peerId)
    })
  })
  socket.on('user-left-room', ({ peerId }: { peerId: string }) => {
    removeRemoteFeed(peerId)
  })

  peer.value.on('call', (call) => {
    console.log('receiving a call from room')
    call.answer(localStream.value)
    call.on('stream', (stream) => {
      if (remoteStreams.value[call.peer]) {
        return
      }
      addRemoteFeed(call.peer, { stream, call })
    })
  })
  socket.emit('ready')
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
