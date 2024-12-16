import { ref, type Ref } from 'vue'
import API from '../config/axios'

const isSmsSending = ref(false)
const isValidating = ref(false)
const validationResult = ref(undefined)

export const useSmsMicroservice = (): {
  isSmsSending: Ref<boolean>
  isValidating: Ref<boolean>
  validationResult: Ref<boolean | undefined>
  sendSms: (number: string, room: string) => Promise<void>
} => {
  const sendSms = async (number: string, room: string): Promise<void> => {
    isSmsSending.value = true
    await API.post('/sendSms', { recipient: number, room })
    isSmsSending.value = false
  }

  return {
    isSmsSending,
    isValidating,
    validationResult,
    sendSms,
  }
}
