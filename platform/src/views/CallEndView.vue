<template>
  <div>Użytkownik zakończył rozmowę</div>
  <div>THX ZA POLACZENIE :></div>
</template>

<script setup lang="ts">
import IncomingCallDialog from '@/components/IncomingCallDialog.vue'
import CreateRoom from '@/components/CreateRoom.vue'
import { usePeer } from '@/composables/peer'
import { onMounted, ref } from 'vue'
import Card from '@/components/ui/card/Card.vue'
import VerifyCardNumber from '@/components/VerifyCardNumber.vue'
import { useAuthStore } from '@/stores/auth'
import { Input } from '@/components/ui/input'
import { useRoomStore } from '@/stores/room'
const { peer } = usePeer()
const authStore = useAuthStore()
const roomStore = useRoomStore()
</script>

<style scoped lang="sass"></style>
