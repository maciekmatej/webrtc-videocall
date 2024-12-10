<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PinInputGroup, PinInputInput, PinInput } from './ui/pin-input'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from '@vue/reactivity'
const authStore = useAuthStore()
const form = ref<{ cardNumber: string; pinNumber: string[] }>({
  cardNumber: '',
  pinNumber: [],
})
const formatedPinNumber = computed(() => form.value.pinNumber.join(''))

const handleSubmit = () => {
  authStore.verifyCardNumber({
    cardNumber: form.value.cardNumber,
    pinNumber: formatedPinNumber.value,
  })
}
</script>

<template>
  <Card class="w-[300px] card">
    <CardHeader>
      <CardTitle>Weryfikacja karty Whitephone</CardTitle>
      <!-- <CardDescription>Deploy your new project in one-click.</CardDescription> -->
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Numer karty</Label>
            <Input v-model="form.cardNumber" id="name" placeholder="Wpisz numer karty" />
          </div>
          <div class="flex flex-col w-full space-y-1.5">
            <Label for="name">Kod pin</Label>
            <PinInput v-model="form.pinNumber" id="name" :mask="true" class="justify-between">
                <PinInputInput
                  class="w-10 h-10 bg-white rounded text-center shadow-lg text-green10 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white"
                  v-for="(id, index) in 4"
                  :key="id"
                  :index="index"
                />
            </PinInput>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button @click="handleSubmit">Zweryfikuj</Button>
    </CardFooter>
  </Card>
</template>
<style lang="sass">
.card
    background-image: linear-gradient(to bottom right, hsl(173, 80.0%, 36.0%) 0%, hsl(151, 55.0%, 41.5%) 100%)
</style>
