import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import InstanceListView from '@/views/InstanceListView.vue'
import InstanceCreateView from '@/views/InstanceCreateView.vue'
import InstanceDetailView from '@/views/InstanceDetailView.vue'

// Vue Router 설정
const router = createRouter({
  history: createWebHistory('/mission-2/'),
  routes: [
    {
      // 홈
      path: '/',
      redirect: '/instances',
    },
    {
      // 목록
      path: '/instances',
      name: 'instanceList',
      component: InstanceListView,
    },
    {
      // 생성
      path: '/instances/create',
      name: 'instanceCreate',
      component: InstanceCreateView,
    },
    {
      // 상세
      path: '/instances/:id',
      name: 'instanceDetail',
      component: InstanceDetailView,
    },
  ],
})

export default router
