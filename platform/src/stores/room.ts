import { computed, ref, type Ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import API from '../config/axios'
import { usePeer } from '@/composables/peer'

export const useRoomStore = defineStore('room', () => {
  const { peer } = usePeer()
  const participantsList: Ref<string[]> = ref([])
  const recipient: Ref<string> = ref('')
  const participantsListWithoutUser = computed(() =>
    participantsList.value.filter((p) => p !== peer.value?.id),
  )
  const fetchRoomParticipants = async () => {
    try {
      participantsList.value = await API.get('/room/userList')
    } catch (error) {
      console.log(error)
    }
  }
  const checkIfRoomExists = async (roomId: string) => {
    try {
      const params = {
        roomId,
      }
      const result = await API.get('/checkIfRoomExists', { params })
      return result
    } catch (error) {
      console.log(error)
      return false
    }
  }
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useRoomStore, import.meta.hot))
  }
  return {
    participantsList,
    participantsListWithoutUser,
    checkIfRoomExists,
    fetchRoomParticipants,
    recipient,
  }
})
