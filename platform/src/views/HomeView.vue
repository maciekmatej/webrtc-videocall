<template>
  <div class="CreateCall flex flex-col">
    <h1 class="text-3xl">PEER ID: {{ peer?.id }}</h1>
    <CreateRoom />
  </div>
  <IncomingCallDialog v-model="toggleIncomingCallDialog" @submit="answerCall" />
</template>

<script setup lang="ts">
import IncomingCallDialog from '@/components/IncomingCallDialog.vue'
import CreateRoom from '@/components/CreateRoom.vue'
import { usePeer } from '@/composables/peer'
const { peer } = usePeer()
</script>

<style scoped lang="sass"></style>
