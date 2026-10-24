// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import { useAuthStore } from '@/stores/auth'

const Stub = { template: '<div />' }

function mountDashboard(role: string) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore()
  auth.user = { id: 'u-1', email: 'reader@example.com', display_name: '林一舟', role }
  auth.status = 'authenticated'

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Stub },
      { path: '/login', name: 'login', component: Stub },
    ],
  })

  return mount(DashboardView, {
    global: { plugins: [pinia, router] },
  })
}

// 断言实际渲染文本，而非直接调用角色映射函数，避免测试重复实现。
describe('DashboardView 角色展示', () => {
  it('user 角色渲染为「普通用户」', () => {
    const wrapper = mountDashboard('user')
    expect(wrapper.text()).toContain('普通用户')
  })

  it('admin 角色渲染为「管理员」，且不再显示「普通用户」', () => {
    const wrapper = mountDashboard('admin')
    expect(wrapper.text()).toContain('管理员')
    expect(wrapper.text()).not.toContain('普通用户')
  })

  it('未知角色按后端原始值展示', () => {
    const wrapper = mountDashboard('editor')
    expect(wrapper.text()).toContain('editor')
  })
})
