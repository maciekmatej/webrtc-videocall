<template>
  <div
    v-if="userStream && userStream.isVideoMuted"
    class="absolute inset-0 bg-black flex justify-center items-center z-10"
  >
    <div class="rounded-full w-6 h-6 bg-zinc-800 text-white flex justify-center items-center">
      <IconCamOff />
    </div>
  </div>
  <div
    v-if="userStream && userStream.isAudioMuted"
    class="absolute top-2 right-2 p-1 rounded-full bg-zinc-800 text-white z-20"
  >
    <IconMicOff />
  </div>
  <video ref="videoElRef" :style="{ width: '100%', height: '100%' }" :muted autoplay></video>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import Button from './ui/button/Button.vue'
import IconCamOff from './icons/IconCamOff.vue'
import IconCamOn from './icons/IconCamOn.vue'
import IconMicOff from './icons/IconMicOff.vue'
import { useStream } from '@/composables/stream'
import type { Stream } from '@/types/StreamTypes'
import { socket } from '@/services/socket'

const props = defineProps<{
  muted?: boolean
  userStream: Stream
}>()
const videoElRef = ref<HTMLVideoElement>()

watchEffect(() => {
  if (videoElRef.value && props.userStream.stream) {
    videoElRef.value.srcObject = props.userStream.stream
  }
})
</script>

<style scoped lang="sass">
video
  position: absolute
  right: 0
  bottom: 0
  width: 100%
  height: 100%
  background: #000
  border-radius: 10px
  overflow: hidden
  left: 0
  top: 0
  background-size: cover
  overflow: hidden
</style>
