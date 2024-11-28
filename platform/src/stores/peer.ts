import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import API from '../config/axios'

export const usePeerStore = defineStore('peer', () => {
  const count = ref(0)
  const testResponse = ref([])
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  const callApi = async () => {
    console.log('store')
    testResponse.value = (await API.get('/test')).data
    console.log(testResponse.value)
  }
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePeerStore, import.meta.hot))
  }
  return { count, doubleCount, increment, callApi, testResponse }
})
