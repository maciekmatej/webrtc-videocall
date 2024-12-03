<template>
  <div class="CreateCall flex flex-col">
    <h1 class="text-3xl">PEER ID: {{ userId }}</h1>
    <CreateRoom />
    <Button @click="createRoom" class="h-8"> Stwórz nowy pokój </Button>
    <input type="text" v-model="callee" />
    <Button @click="callPeer" class="h-8"> Zadzwon </Button>
  </div>
  <div class="flex flex-col">
    <div>to ja</div>
    <div id="local-audio"></div>
    <Button @click="changeInputTest">mute</Button>
    <div id="remote-audio"></div>
  </div>
  <IncomingCallDialog v-model="toggleIncomingCallDialog" @submit="answerCall" />
</template>

<script setup lang="ts">
import IncomingCallDialog from '@/components/IncomingCallDialog.vue'
import CreateRoom from '@/components/CreateRoom.vue'
import { Button } from '@/components/ui/button'
</script>

<style scoped lang="sass"></style>
