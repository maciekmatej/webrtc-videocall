<template>
  <div class="relative">
    <div v-if="userStream">
      <div v-if="userStream.isVideoMuted" class="absolute inset-0 bg-black">
        <div class="rounded-full w-4 h-4 bg-zinc-400 text-white">
          <IconCamOff />
        </div>
      </div>
      <div
        v-if="userStream.isAudioMuted"
        class="absolute top-2 right-2 p-1 rounded-full bg-zinc-400 text-white"
      >
        <IconMicOff />
      </div>
    </div>
    <video
      ref="videoElRef"
      class="border-zinc-400 border rounded-md relative"
      :style="{ width: '100%', height: '100%' }"
      :muted="isLocalFeed"
      autoplay
    ></video>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import Button from './ui/button/Button.vue'
import IconCamOff from './icons/IconCamOff.vue'
import IconCamOn from './icons/IconCamOn.vue'
import IconMicOff from './icons/IconMicOff.vue'
import { useStream } from '@/composables/stream'
import type { Stream } from '@/types/StreamTypes'

const emits = defineEmits(['hangup'])
const props = defineProps<{
  isLocalFeed?: boolean
  userStream: Stream
}>()
const videoElRef = ref<HTMLVideoElement>()

watchEffect(() => {
  if (videoElRef.value && props.userStream.stream) {
    videoElRef.value.srcObject = props.userStream.stream
  }
})

const hangupCall = () => {
  emits('hangup')
}
</script>

<style scoped></style>
