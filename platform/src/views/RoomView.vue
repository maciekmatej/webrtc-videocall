<template>
  <div class="flex justify-center items-center relative h-full flex-col">
    <h1>{{ $route.params.roomId }}</h1>
    <div v-for="(data, user) in remoteStreams" :key="user">
      <h1>{{ user }}</h1>
      <UserFeedPlayer :user-stream="data" />
    </div>
    <div
      v-if="store.participantsListWithoutUser.length > 0"
      ref="draggableVideo"
      :style="computedStyle"
      style="position: fixed"
      class="draggable"
      :class="{ 'draggable--move': isAutoAlignElement }"
    >
      <UserFeedPlayer :user-stream="localStream" muted @hangup="handleHangup" />
    </div>
    <div v-else>
      <UserFeedPlayer :user-stream="localStream" muted @hangup="handleHangup" />
    </div>
    <div>inbound {{ viedeoElementIsVisible }}</div>
    <UserFeedControls :stream="localStream.stream" />
  </div>
</template>
<script setup lang="ts">
import { usePeer } from '@/composables/peer'
import UserFeedPlayer from '@/components/UserFeedPlayer.vue'
import { socket } from '@/services/socket'
import Button from '@/components/ui/button/Button.vue'
import { useRoomStore } from '@/stores/room'
import type { CallOption, DataConnection, MediaConnection, Peer } from 'peerjs'
import {
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from 'vue'
import { useRoute } from 'vue-router'
import { useStream } from '@/composables/stream'
import UserFeedControls from '@/components/UserFeedControls.vue'
import { useDraggable, useElementBounding } from '@vueuse/core'

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
onBeforeMount(() => {
  window.addEventListener('resize', moveVideoToNearestCorner)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', moveVideoToNearestCorner)
})
const isAutoAlignElement = ref(false)
const viedeoElementIsVisible = ref(false)
const draggableVideo = ref<HTMLElement | null>(null)
// const incomingCall = ref<MediaConnection>()
// useIntersectionObserver(
//   draggableVideo,
//   async ([entry]) => {
//     viedeoElementIsVisible.value = entry?.isIntersecting || false
//     if (!viedeoElementIsVisible.value) {
//       await nextTick()
//       moveVideoToNearestCorner()
//     }
//   },
//   {
//     immediate: true,
//     threshold: 1,
//   },
// )

const { top, left, width, height } = useElementBounding(draggableVideo)

const { x, y, style, isDragging } = useDraggable(draggableVideo, {
  initialValue: {
    x: window.innerWidth - 300 - 10,
    y: window.innerHeight - 200 - 10,
  },
  onEnd: () => moveVideoToNearestCorner(),
})
const computedStyle = computed(() => {
  return {
    '--left': x.value + 'px',
    '--top': y.value + 'px',
  }
})
const moveVideoToNearestCorner = async () => {
  const elCenter = {
    x: left.value + width.value / 2,
    y: top.value + height.value / 2,
  }
  isAutoAlignElement.value = true
  x.value = window.innerWidth / 2 <= elCenter.x ? window.innerWidth - width.value - 10 : 10
  y.value = window.innerHeight / 2 <= elCenter.y ? window.innerHeight - height.value - 10 : 10
  await nextTick()
  isAutoAlignElement.value = false
}
const fetchRoomParticipantsList = ({ roomId, users }: { roomId: string; users: string[] }) => {
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
const handleHangup = () => {
  if (peer.value) {
    console.log(roomId.value, 'room from route')
    socket.emit('leave-room', { roomId: roomId.value, peerId: peer.value.id })
  }
}
watch(
  () => [peer.value, localStream.value.stream],
  ([newPeer, newStream], [oldPeer, oldStream]) => {
    console.log([newPeer, newStream], [oldPeer, oldStream])
    if (!peer.value || !localStream.value.stream) {
      // socket.off('user-joined-room')
      return
    }
    // check if stream already existed. True means it's input switch, no action needed
    if (oldStream?.id) {
      return
    }
    console.log(peer.value, localStream.value.stream)
    console.log('watch efekt')
    socket.on('user-joined-room', ({ peerId }: { peerId: string }) => {
      //@ts-expect-error wrong type for peerjs otption
      const call = peer.value!.call(peerId, localStream.value.stream, options)
      console.log('call new peer that joined the room', peerId)
      remoteStreams.value = {
        ...remoteStreams.value,
        [peerId]: { stream: undefined, call: undefined, isAudioMuted: true, isVideoMuted: true },
      }
      call.on('stream', (stream) => {
        console.log('stream z eventu ja dzwonilem', stream)
        addRemoteFeed(peerId, {
          stream,
          call,
          isAudioMuted: !stream.getAudioTracks()[0]?.enabled,
          isVideoMuted: !stream.getVideoTracks()[0]?.enabled,
        })
      })
      call.on('close', () => {
        removeRemoteFeed(peerId)
      })
    })
    socket.on('user-left-room', ({ peerId }: { peerId: string }) => {
      removeRemoteFeed(peerId)
    })
    socket.on(
      'user-muted',
      ({ peerId, type, value }: { peerId: string; type: string; value: boolean }) => {
        if (remoteStreams.value[peerId]) {
          switch (type) {
            case 'audio':
              remoteStreams.value[peerId].isAudioMuted = value
              break
            case 'video':
              remoteStreams.value[peerId].isVideoMuted = value
              break

            default:
              break
          }
        }
      },
    )

    peer.value.on('call', (call) => {
      console.log('receiving a call from room')
      call.answer(localStream.value.stream)
      remoteStreams.value = {
        ...remoteStreams.value,
        [call.peer]: { stream: undefined, call: undefined, isAudioMuted: true, isVideoMuted: true },
      }
      call.on('stream', (stream) => {
        console.log(
          'stream z eventu on call',
          stream,
          !stream.getAudioTracks()[0]?.enabled,
          !stream.getVideoTracks()[0]?.enabled,
        )
        addRemoteFeed(call.peer, {
          stream,
          call,
          isAudioMuted: !stream.getAudioTracks()[0]?.enabled,
          isVideoMuted: !stream.getVideoTracks()[0]?.enabled,
        })
      })
    })
    socket.emit('ready')
  },
)
</script>
<style lang="sass">
.draggable
  left: var(--left)
  top: var(--top)
  width: 300px
  height: 200px
  &--move
    transition: all 0.1s linear
@media (min-width: 1024px)
  .about
    min-height: 100vh
    display: flex
    align-items: center
</style>
