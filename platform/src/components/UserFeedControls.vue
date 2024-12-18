<template>
  <div class="UserFeedControls">
    <div class="flex justify-around bg-zinc-800 p-2">
      <div class="flex gap-2">
        <Button
          class="rounded-lg"
          @click="toggleMute('audio')"
          :class="{
            'bg-blue-600': !localStream.isAudioMuted,
            'bg-red-500': localStream.isAudioMuted,
          }"
        >
          <template v-if="localStream.isAudioMuted">
            <IconMicOff />
          </template>
          <template v-else>
            <IconMicOn />
          </template>
        </Button>

        <Button
          class="rounded-lg"
          @click="toggleMute('video')"
          :class="{
            'bg-blue-600': localStream.isVideoMuted,
            'bg-red-500': localStream.isVideoMuted,
          }"
        >
          <template v-if="localStream.isVideoMuted">
            <IconCamOff />
          </template>
          <template v-else>
            <IconCamOn />
          </template>
        </Button>

        <Button @click="switchCamera" class="bg-blue-600 rounded-lg">
          <IconSwitchCamera />
        </Button>
        <Button @click="hangupCall" class="bg-red-700 rounded-lg">
          <IconHangup />
        </Button>
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
import { useStream } from '@/composables/stream'
import type { Stream } from '@/types/StreamTypes'
import { socket } from '@/services/socket'
import IconSwitchCamera from './icons/IconSwitchCamera.vue'

const { localStream, switchCamera } = useStream()
const emits = defineEmits(['hangup'])
const props = defineProps<{
  stream?: MediaStream
}>()

watchEffect(() => {
  if (props.stream) {
    console.log('zmieniam sciezki controle')
    localStream.value.isAudioMuted = props.stream.getAudioTracks()[0]?.enabled ? false : true
    localStream.value.isVideoMuted = props.stream.getVideoTracks()[0]?.enabled ? false : true
  }
})

const hangupCall = () => {
  emits('hangup')
}

const toggleMute = (type: 'audio' | 'video') => {
  if (props.stream) {
    switch (type) {
      case 'audio':
        if (props.stream.getAudioTracks()[0]) {
          props.stream.getAudioTracks()[0].enabled = localStream.value.isAudioMuted
          localStream.value.isAudioMuted = !localStream.value.isAudioMuted
          socket.emit('mute', { type, value: localStream.value.isAudioMuted })
        } else {
          console.log('brak mini majka')
        }
        break
      case 'video':
        if (props.stream.getVideoTracks()[0]) {
          props.stream.getVideoTracks()[0].enabled = localStream.value.isVideoMuted
          localStream.value.isVideoMuted = !localStream.value.isVideoMuted
          socket.emit('mute', { type, value: localStream.value.isVideoMuted })
        } else {
          console.log('brak kamerki')
        }
        break

      default:
        break
    }
  }
}
</script>

<style scoped></style>
