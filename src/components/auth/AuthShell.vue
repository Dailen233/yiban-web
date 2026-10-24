<script setup lang="ts">
import { RouterLink } from 'vue-router'

/**
 * 登录/注册共用的分屏外壳。
 * 左侧艺术区按页面区分（v4 中登录用 login.css、注册用 pages.css 的 .auth .art）：
 * - login：墨蓝网格底纹 + 暖金标题 + 线描装帧（纸张书脊/金色框线/红章）
 * - register：纯墨蓝渐变 + 同心圆环 + 左对齐文案 + 底部引语
 * 右侧为表单标题与内容插槽。
 */
withDefaults(
  defineProps<{
    /** 右侧表单标题。 */
    title: string
    /** 右侧表单副标题。 */
    subtitle: string
    /** 页面变体，决定左侧艺术区与分栏比例。 */
    variant?: 'login' | 'register'
    /** 左侧艺术区主标题第一行。 */
    artLine1: string
    /** 左侧艺术区主标题第二行。 */
    artLine2: string
    /** 注册页艺术区正文。 */
    artBody?: string
    /** 注册页艺术区底部引语。 */
    quote?: string
  }>(),
  { variant: 'login' },
)
</script>

<template>
  <main class="auth" :class="variant">
    <div class="art" :class="variant">
      <template v-if="variant === 'register'">
        <h2 class="art-title">{{ artLine1 }}<br>{{ artLine2 }}</h2>
        <p class="art-body">{{ artBody }}</p>
        <p v-if="quote" class="quote">{{ quote }}</p>
      </template>
      <template v-else>
        <span class="kicker">双语阅读伴侣</span>
        <h2 class="art-title">{{ artLine1 }}<br>{{ artLine2 }}</h2>
        <div class="bind-art" aria-hidden="true">
          <span class="paper"></span>
          <span class="frame"></span>
          <span class="seal"><i class="s1"></i><i class="s2"></i><i class="s3"></i></span>
        </div>
      </template>
    </div>

    <div class="form-side">
      <div class="form-card">
        <RouterLink v-if="variant === 'register'" class="back" :to="{ name: 'home' }">
          ← 返回首页
        </RouterLink>
        <h1>{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
        <slot></slot>
      </div>
    </div>
  </main>
</template>

<style scoped>
.auth {
  flex: 1;
  min-height: calc(100vh - 64px);
  display: grid;
}
.auth.login {
  grid-template-columns: 42fr 58fr;
  background: radial-gradient(900px 420px at 50% -10%, #fff 0%, transparent 70%), var(--paper);
}
.auth.register {
  grid-template-columns: 1fr 1fr;
}

.art {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.art.login {
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #eef0e9;
  padding: 52px 46px;
  background:
    radial-gradient(620px 400px at 50% 112%, rgba(47, 122, 99, 0.14), transparent 60%),
    linear-gradient(168deg, #17293a 0%, #1e3a4f 100%);
}
.art.login::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(245, 240, 230, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245, 240, 230, 0.04) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(80% 90% at 50% 30%, #000 30%, transparent 100%);
  mask-image: radial-gradient(80% 90% at 50% 30%, #000 30%, transparent 100%);
}
.art.register {
  justify-content: center;
  color: #e9eef2;
  padding: 56px;
  background: linear-gradient(160deg, var(--ink) 0%, var(--ink-3) 100%);
}
.art.register::before {
  content: '';
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  border: 1px solid rgba(199, 154, 69, 0.25);
  right: -90px;
  bottom: -90px;
}
.art.register::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 1px solid rgba(199, 154, 69, 0.18);
  right: -30px;
  bottom: -30px;
}

/* 艺术区标题（登录居中、注册左对齐，均使用霞鹜文楷点睛） */
.art.login .art-title {
  color: #f5f0e6;
  font-size: clamp(1.6rem, 2.2vw, 2.05rem);
  margin: 0;
}
.art.register .art-title {
  color: #fff;
  font-size: 1.9rem;
  margin-bottom: 14px;
}
.art-title {
  font-family: "LXGW Login", var(--serif);
  font-weight: 400;
  line-height: 1.62;
  letter-spacing: 0.02em;
  position: relative;
}

.art.login .kicker {
  display: block;
  margin-bottom: 16px;
  position: relative;
  font-family: "LXGW Login", var(--serif);
  font-size: 13px;
  letter-spacing: 0.5em;
  padding-left: 0.5em;
  color: var(--gold-2);
}

.art.register .art-body {
  margin: 0;
  color: #b9c6d1;
  font-size: 15px;
  max-width: 400px;
  line-height: 1.8;
}
.quote {
  margin: auto 0 0;
  font-family: var(--serif);
  font-style: italic;
  color: #cdd9e2;
  font-size: 15px;
  border-left: 2px solid var(--gold-2);
  padding-left: 14px;
  text-align: left;
  max-width: 24em;
}

/* 线描装帧：书页堆叠（书口纸线 + 金书脊 + 书签带）· 回纹角 · 朱印 */
.bind-art {
  position: relative;
  width: 320px;
  height: 260px;
  margin-top: 30px;
}
.paper {
  position: absolute;
  left: 8px;
  top: 44px;
  width: 240px;
  height: 168px;
  border-radius: 4px 18px 18px 4px;
  transform: rotate(-3deg);
  background:
    repeating-linear-gradient(
      180deg,
      rgba(245, 240, 230, 0.34) 0 1px,
      rgba(245, 240, 230, 0) 1px 5px
    ),
    linear-gradient(160deg, rgba(245, 240, 230, 0.1), rgba(245, 240, 230, 0.02));
  border: 1px solid rgba(245, 240, 230, 0.2);
  box-shadow: 0 20px 40px rgba(5, 14, 22, 0.42);
}
.paper::before {
  content: '';
  position: absolute;
  left: -10px;
  top: -6px;
  bottom: -6px;
  width: 13px;
  background: linear-gradient(90deg, rgba(201, 160, 74, 0.55), rgba(201, 160, 74, 0.08));
  border-radius: 6px 0 0 6px;
}
.paper::after {
  content: '';
  position: absolute;
  right: 40px;
  top: -9px;
  width: 26px;
  height: 10px;
  background: rgba(201, 160, 74, 0.85);
  border-radius: 2px 2px 0 0;
}
.frame {
  position: absolute;
  right: 2px;
  top: 2px;
  width: 80px;
  height: 80px;
  border-top: 1px solid rgba(201, 160, 74, 0.5);
  border-right: 1px solid rgba(201, 160, 74, 0.5);
}
.frame::before {
  content: '';
  position: absolute;
  right: 10px;
  top: 10px;
  width: 30px;
  height: 30px;
  border-top: 1px solid rgba(201, 160, 74, 0.4);
  border-right: 1px solid rgba(201, 160, 74, 0.4);
}
.seal {
  position: absolute;
  right: 14px;
  bottom: 8px;
  width: 54px;
  height: 54px;
  border: 1.5px solid rgba(176, 74, 58, 0.9);
  border-radius: 6px;
  transform: rotate(-5deg);
}
.seal::before {
  content: '';
  position: absolute;
  inset: 5px;
  border: 1px solid rgba(176, 74, 58, 0.5);
  border-radius: 3px;
}
.seal i {
  position: absolute;
  background: rgba(176, 74, 58, 0.9);
}
.seal .s1 {
  left: 50%;
  top: 9px;
  bottom: 9px;
  width: 2.5px;
  transform: translateX(-50%);
}
.seal .s2 {
  left: 12px;
  top: 50%;
  width: 15px;
  height: 2.5px;
  transform: translateY(-50%);
}
.seal .s3 {
  right: 12px;
  top: 50%;
  width: 13px;
  height: 2.5px;
  transform: translateY(-50%);
}

.form-side {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.form-card {
  width: 100%;
  max-width: 400px;
}
.form-card .back {
  font-size: 13px;
  color: var(--muted);
  display: inline-flex;
  gap: 6px;
  margin-bottom: 22px;
}
.form-card h1 {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: 0.06em;
  color: var(--ink);
  position: relative;
  padding-bottom: 12px;
  margin-bottom: 8px;
}
.form-card h1::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 36px;
  height: 3px;
  background: var(--gold-2);
  border-radius: 2px;
}
.subtitle {
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 22px;
}

@media (max-width: 900px) {
  .auth,
  .auth.login,
  .auth.register {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .art {
    display: none;
  }
  .form-side {
    align-items: flex-start;
    padding: 28px 18px 48px;
  }
}
</style>
