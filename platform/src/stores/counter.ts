import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import API from '../config/axios'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const testResponse = ref([])
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  const callApi = async () => {
    console.log('store')
    testResponse.value = (await API.get('http://localhost:8080/api/test')).data
    console.log(testResponse.value)
  }

  return { count, doubleCount, increment, callApi, testResponse }
})
