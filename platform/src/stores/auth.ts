import { computed, ref, type Ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import API from '../config/axios'
import { usePeer } from '@/composables/peer'

export const useAuthStore = defineStore('auth', () => {
  const { peer } = usePeer()
  const isCardVerified = ref(false)
  const loggedCardNumber = ref('')
  const isLoadingVerification = ref(false)
  const verifyCardNumber = async ({
    cardNumber,
    pinNumber,
  }: {
    cardNumber: string
    pinNumber: string
  }) => {
    try {
      isLoadingVerification.value = true
      const params = {
        card_no: cardNumber,
        pin_no: pinNumber,
      }
      isCardVerified.value = (await API.get('/api/verifyCardNumber', { params })).data
      if (isCardVerified.value) {
        loggedCardNumber.value = cardNumber
      }
    } catch {
      isCardVerified.value = false
    } finally {
        isLoadingVerification.value = false
    }
  }
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
  }
  return { isCardVerified, loggedCardNumber, isLoadingVerification, verifyCardNumber }
})
