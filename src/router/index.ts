import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import InstanceListView from '@/views/InstanceListView.vue'
import InstanceCreateView from '@/views/InstanceCreateView.vue'
import InstanceDetailView from '@/views/InstanceDetailView.vue'

const router = createRouter({
  history: createWebHistory('/mission-2/'),
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
    {
      path: '/instances/:id',
      name: 'instanceDetail',
      component: InstanceDetailView,
    },
  ],
})

export default router
