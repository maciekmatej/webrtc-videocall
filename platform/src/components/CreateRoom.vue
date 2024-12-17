<template>
  <Button @click="createRoom">Start new meeting</Button>
</template>

<script setup lang="ts">
import { socket } from '@/services/socket'
import Button from './ui/button/Button.vue'
import { useSmsMicroservice } from '@/composables/smsMicroservice'
import { useRouter } from 'vue-router'
const { sendSms } = useSmsMicroservice()
const router = useRouter()

const createRoom = () => {
  socket.emit('create-room')
}
socket.on('room-created', async (params) => {
  // await sendSms('516588149', params.roomId)
  router.push({ name: 'room', params: { roomId: params.roomId } })
})
</script>

<style scoped></style>
