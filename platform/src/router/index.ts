import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RoomView from '@/views/RoomView.vue'
import CallEndView from '@/views/CallEndView.vue'
import { useRoomStore } from '@/stores/room'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/room/:roomId',
      name: 'room',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: RoomView,
      beforeEnter: async (to, from) => {
        const roomStore = useRoomStore()
        const roomId = to.params.roomId.toString()
        const roomExists = await roomStore.checkIfRoomExists(roomId)
        return roomExists ? true : false
      },
    },
    {
      path: '/callend',
      name: 'callend',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: CallEndView,
    },
  ],
})

export default router
