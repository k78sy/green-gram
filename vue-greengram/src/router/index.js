import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenticationStore } from '@/stores/authentication';
import Feed from '../views/Feed.vue'
import SignUp from '@/views/SignUp.vue'
import SignIn from '@/views/SignIn.vue'
import Profile from '@/views/Profile.vue'

// <3가지 경우>
// 무조건 접근 가능한 path
// 로그인되면 접근 불가능한 path (비로그인 시 접근 가능한 path)
// 비로그인이면 접근 불가능한 path (로그인 시 접근 가능한 path)

// route 객체가 meta 속성이 없으면 무조건 접근 가능한 path
// meta 속성에 requiresAuth: true 면 로그인 시 접근 가능한 path
// meta 속성에 requiresGuest: true 면 비로그인 시 접근 가능한 path
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: { requiresAuth: true },
      component: Feed,
    },
    {
      path: '/sign-up',
      meta: { requiresGuest: true },
      component: SignUp,
    },
    {
      path: '/sign-in',
      meta: { requiresGuest: true },
      component: SignIn,
    },
    {
      path: '/profile/:userId',
      meta: { requiresAuth: true },
      component: Profile,
    }
  ],
});

router.beforeEach( (to, from, next) => {
  const authentication = useAuthenticationStore();
  const isSigned = authentication.state.isSigned; //true: 로그인 상태, false: 비로그인 상태
  
  //비로그인 상태에서 로그인이 필요한 path로 가려고 할 때 
  if( to.meta.requiresAuth && !isSigned ) {
    return next('/sign-in');
  }

  //로그인 상태에서 비 로그인이 필요 한 path로 가려고 할 때
  if( to.meta.requiresGuest && isSigned ) {
    return next('/');
  }

  next(); //원래 처리대로
} );

export default router
