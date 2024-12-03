<template>
  <Button @click="createRoom">Start new meeting</Button>
</template>

<script setup lang="ts">
import { socket } from '@/services/socket'
import Button from './ui/button/Button.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const createRoom = () => {
  socket.emit('create-room')
}
socket.on('room-created', (params) => {
  router.push({ name: 'room', params: { roomId: params.roomId } })
})
</script>

<style scoped></style>
