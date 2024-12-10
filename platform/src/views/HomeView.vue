<template>
  <div v-if="!authStore.isCardVerified" class="flex flex-col">
    <VerifyCardNumber />
  </div>
  <div v-else class="CreateCall flex flex-col">
    <h1>{{ authStore.loggedCardNumber }}</h1>
    <h1 class="text-3xl">PEER ID: {{ peer?.id }}</h1>
    <CreateRoom />
  </div>
</template>

<script setup lang="ts">
import IncomingCallDialog from '@/components/IncomingCallDialog.vue'
import CreateRoom from '@/components/CreateRoom.vue'
import { usePeer } from '@/composables/peer'
import { onMounted } from 'vue'
import Card from '@/components/ui/card/Card.vue';
import VerifyCardNumber from '@/components/VerifyCardNumber.vue';
import { useAuthStore } from '@/stores/auth';
const { peer } = usePeer()
const authStore = useAuthStore()
</script>

<style scoped lang="sass"></style>
