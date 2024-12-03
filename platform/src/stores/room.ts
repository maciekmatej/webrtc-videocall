import { ref, type Ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import API from '../config/axios'

export const useRoomStore = defineStore('room', () => {
  const userList: Ref<string[]> = ref([])
  const fetchRoomParticipants = async () => {
    try {
      userList.value = await API.get('/room/userList')
    } catch (error) {
      console.log(error)
    }
  }
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useRoomStore, import.meta.hot))
  }
  return { userList, fetchRoomParticipants }
})
