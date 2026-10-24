// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'

const Stub = { template: '<div />' }

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response
}

const user = { id: 'u-1', email: 'reader@example.com', display_name: '林一舟', role: 'user' }

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
  return mount(AppHeader, { attachTo: document.body, global: { plugins: [pinia, router] } })
}

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('AppHeader 顶栏', () => {
  it('未登录显示登录与注册入口', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    auth.status = 'unauthenticated'

    wrapper = mountHeader(pinia)
    expect(wrapper.text()).toContain('登录')
    expect(wrapper.text()).toContain('注册')
    expect(wrapper.text()).toContain('译伴')
  })

  it('已登录显示昵称与邮箱，并可打开账号菜单', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    auth.user = user
    auth.status = 'authenticated'

    wrapper = mountHeader(pinia)
    expect(wrapper.text()).toContain('林一舟')
    expect(wrapper.text()).toContain('reader@example.com')

    await wrapper.get('.acct-btn').trigger('click')
    expect(wrapper.text()).toContain('退出登录')
  })

  it('退出失败时在菜单内显示错误、保持已登录并可重试', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(503, { message: '服务不可用' })))
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    auth.user = user
    auth.status = 'authenticated'

    wrapper = mountHeader(pinia)
    await wrapper.get('.acct-btn').trigger('click')
    await flushPromises()
    await wrapper.get('.acct-item').trigger('click')
    await flushPromises()

    // 错误实际渲染在 DOM 中，且菜单保持打开供重试
    expect(wrapper.find('.logout-error').exists()).toBe(true)
    expect(wrapper.find('.logout-error').text()).toContain('服务暂时不可用')
    expect(wrapper.find('.acct-menu').exists()).toBe(true)
    expect(wrapper.get('.acct-item').text()).toBe('退出登录')
    // 保留已登录身份
    expect(auth.status).toBe('authenticated')
    expect(auth.user).toEqual(user)
  })

  it('ArrowDown 展开账号菜单并将焦点移到首个可操作项', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    auth.user = user
    auth.status = 'authenticated'

    wrapper = mountHeader(pinia)
    await wrapper.get('.acct-btn').trigger('keydown', { key: 'ArrowDown' })
    await flushPromises()

    expect(wrapper.find('.acct-menu').exists()).toBe(true)
    expect(document.activeElement).toBe(wrapper.find('.acct-item').element)
  })

  it('Esc 关闭账号菜单并返回焦点到触发按钮', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    auth.user = user
    auth.status = 'authenticated'

    wrapper = mountHeader(pinia)
    await wrapper.get('.acct-btn').trigger('keydown', { key: 'ArrowDown' })
    await flushPromises()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()

    expect(wrapper.find('.acct-menu').exists()).toBe(false)
    expect(document.activeElement).toBe(wrapper.get('.acct-btn').element)
  })

  it('移动抽屉点击当前页链接也会关闭（无路由变化）', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    auth.status = 'unauthenticated'

    wrapper = mountHeader(pinia)
    await wrapper.get('.menu-btn').trigger('click')
    expect(wrapper.get('#mobile-nav').classes()).toContain('open')

    // 首页是当前路由（/），点击它不会产生路由变化，仍应关闭抽屉
    await wrapper.get('#mobile-nav a[href="/"]').trigger('click')
    await flushPromises()

    expect(wrapper.get('#mobile-nav').classes()).not.toContain('open')
  })
})
