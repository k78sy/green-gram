import { createRouter, createWebHistory } from 'vue-router'
import Feed from '../views/Feed.vue'
import SignUp from '@/views/SignUp.vue'
import SignIn from '@/views/SignIn.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Feed,
    },
    {
      path: '/sign-up',
      component: SignUp,
    },
    {
      path: '/sign-in',
      component: SignIn,
    },
  ],
})

export default router
