<template>
  <h1 class="text-3xl">PEER ID: {{ peer?.id }}</h1>
  <div class="HomeView h-full w-full flex">
    <div v-if="!authStore.isCardVerified" class="flex flex-col">
      <VerifyCardNumber />
    </div>
    <div v-else class="CreateCall flex justify-center items-center w-full">
      <div class="flex flex-col p-10 gap-2 rounded-md">
        <h1>Zalogowana karta {{ authStore.loggedCardNumber }}</h1>
        <div>
          <h1>srodki na koncie</h1>
          <h1></h1>
          <h1></h1>
        </div>
      </div>
      <div class="flex flex-col p-10 border-2 border-blue-800 gap-2 rounded-md">
        <h1 class="text-xl">Wpisz numer telefonu</h1>
        <Input v-model="roomStore.recipient" type="text" />
        <CreateRoom />
      </div>
    </div>
  </div>
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
