import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import InstanceListView from '@/views/InstanceListView.vue'
import InstanceCreateView from '@/views/InstanceCreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/instances',
      name: 'instanceList',
      component: InstanceListView,
    },
    {
      path: '/instances/create',
      name: 'instanceCreate',
      component: InstanceCreateView,
    },
  ],
})

export default router
