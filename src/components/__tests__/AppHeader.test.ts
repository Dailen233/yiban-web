// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'

const Stub = { template: '<div />' }

function mountHeader(pinia: Pinia) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Stub },
      { path: '/login', name: 'login', component: Stub },
      { path: '/register', name: 'register', component: Stub },
      { path: '/dashboard', name: 'dashboard', component: Stub },
    ],
  })
  return mount(AppHeader, { global: { plugins: [pinia, router] } })
}

describe('AppHeader 顶栏', () => {
  it('未登录显示登录与注册入口', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    auth.status = 'unauthenticated'

    const wrapper = mountHeader(pinia)
    expect(wrapper.text()).toContain('登录')
    expect(wrapper.text()).toContain('注册')
    expect(wrapper.text()).toContain('译伴')
  })

  it('已登录显示昵称与邮箱，并可打开账号菜单', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    auth.user = { id: 'u-1', email: 'reader@example.com', display_name: '林一舟', role: 'user' }
    auth.status = 'authenticated'

    const wrapper = mountHeader(pinia)
    expect(wrapper.text()).toContain('林一舟')
    expect(wrapper.text()).toContain('reader@example.com')

    await wrapper.get('.acct-btn').trigger('click')
    expect(wrapper.text()).toContain('退出登录')
  })
})
