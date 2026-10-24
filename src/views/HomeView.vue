<script setup lang="ts">
const steps = [
  { n: '壹', title: '上传外文书', text: '上传 TXT 电子书，系统提取正文并识别语言。' },
  { n: '贰', title: '自动双语翻译', text: '按所选翻译服务生成中文译文，保留原文结构。' },
  { n: '叁', title: '原译对照阅读', text: '逐段配对阅读，导出电子书并随时回到个人书库。' },
]
</script>

<template>
  <main>
    <section class="hero">
      <div class="wrap hero-inner">
        <span class="eyebrow">双语阅读伴侣 · BilingualPress</span>
        <h1>让每一页，<br /><span class="em">都有另一门语言陪伴。</span></h1>
        <p class="lead">
          上传外文电子书，译伴为你生成中英对照的阅读体验。从上传、翻译到双语阅读与导出，一条链路轻松完成。
        </p>
        <div class="cta">
          <RouterLink class="btn btn-gold" :to="{ name: 'register' }">创建账号</RouterLink>
          <RouterLink class="btn btn-ghost" :to="{ name: 'login' }">登录</RouterLink>
        </div>
      </div>
    </section>

    <section class="steps-section">
      <div class="wrap">
        <div class="flow">
          <div v-for="step in steps" :key="step.n" class="f-card card">
            <span class="num">{{ step.n }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero {
  padding: 72px 0 48px;
}

.hero-inner {
  text-align: center;
  max-width: 720px;
}

.eyebrow {
  display: inline-block;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 3px;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 18px;
}

.hero h1 {
  font-size: clamp(2.1rem, 4.6vw, 3.2rem);
  margin-bottom: 18px;
  line-height: 1.24;
}

.hero h1 .em {
  color: var(--jade);
}

.lead {
  font-size: 1.12rem;
  color: var(--ink-soft);
  max-width: 560px;
  margin: 0 auto 28px;
}

.cta {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.steps-section {
  padding: 24px 0 72px;
}

.flow {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.f-card {
  padding: 28px 24px 26px;
  text-align: center;
}

.num {
  width: 44px;
  height: 44px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: linear-gradient(160deg, var(--ink) 0%, var(--ink-3) 100%);
  display: grid;
  place-items: center;
  color: var(--gold-2);
  font-family: var(--serif);
  font-weight: 700;
  font-size: 19px;
}

.f-card h3 {
  font-size: 17px;
  margin-bottom: 6px;
}

.f-card p {
  font-size: 13.5px;
  color: var(--muted);
  margin: 0;
}

@media (max-width: 900px) {
  .flow {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .hero {
    padding: 40px 0 32px;
  }

  .lead {
    font-size: 1rem;
  }
}
</style>
