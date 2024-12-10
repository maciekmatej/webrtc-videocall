<template>
  <div class="relative">
    <video
      ref="videoElRef"
      class="border-zinc-400 border-2 rounded-md"
      :style="{ width: '100%', height: 'auto' }"
      :muted="isLocalFeed"
      autoplay
    ></video>
    <div class="absolute bottom-0">
      <Button @click="toggleMute('audio')">
        <template v-if="isAudioMuted">
          <IconMicOff />
        </template>
        <template v-else>
          <IconMicOn />
        </template>
      </Button>
      <div v-if="isLocalFeed">
        <div>
          <Button @click="toggleMute('video')">
            <template v-if="isVideoMuted">
              <IconCamOff />
            </template>
            <template v-else>
              <IconCamOn />
            </template>
          </Button>
        </div>
        <div>
          <Button @click="hangupCall">
            <IconHangup />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Button from './ui/button/Button.vue'
import IconCamOff from './icons/IconCamOff.vue'
import IconCamOn from './icons/IconCamOn.vue'
import IconMicOff from './icons/IconMicOff.vue'
import IconMicOn from './icons/IconMicOn.vue'
import IconHangup from './icons/IconHangup.vue'

const emits = defineEmits(['hangup'])
const props = defineProps<{
  stream?: MediaStream
  isLocalFeed: boolean
}>()
const videoElRef = ref<HTMLVideoElement>()
const isAudioMuted = ref(true)
const isVideoMuted = ref(true)

watchEffect(() => {
  if (videoElRef.value && props.stream) {
    videoElRef.value.srcObject = props.stream
    isAudioMuted.value = props.stream.getAudioTracks()[0]?.enabled ? false : true
    isVideoMuted.value = props.stream.getVideoTracks()[0]?.enabled ? false : true
  }
})

const hangupCall = () => {
  emits('hangup')
}
const toggleMute = (type: 'audio' | 'video') => {
  if (props.stream) {
    switch (type) {
      case 'audio':
        props.stream.getAudioTracks()[0].enabled = isAudioMuted.value
        isAudioMuted.value = !isAudioMuted.value
        break
      case 'video':
        props.stream.getVideoTracks()[0].enabled = isVideoMuted.value
        isVideoMuted.value = !isVideoMuted.value
        break

      default:
        break
    }
  }
}
</script>

<style scoped></style>
