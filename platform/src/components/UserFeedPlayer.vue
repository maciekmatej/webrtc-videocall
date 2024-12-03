<template>
  <video ref="videoElRef" :src="src" autoplay></video>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
const videoElRef = ref<HTMLVideoElement>()
onMounted( async() => {

console.log(videoElRef.value);
    await navigator.mediaDevices
      .getUserMedia({constraints.value})
      .then((stream) => {
        localStream.value = stream // A
        videoElRef.value!.srcObject = stream // B
        audioElement.autoplay = true // C
        audioElement.muted = true // C
        const localStreamContainer = document.querySelector('#local-audio')
        localStreamContainer?.append(audioElement)
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`)
      })
  }
)
watch(videoElRef, () => {
  if (videoElRef.value) {

  }
})
</script>

<style scoped></style>
