<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

// 阅读器预览：逐段对照示例（示例内容，非真实翻译处理进度）
const pairs = [
  { n: '1', idx: '01', src: 'The fog rolled in from the harbor at dusk.', tgt: '黄昏时分，雾从港口漫了进来。' },
  { n: '2', idx: '02', src: 'She locked the door and waited.', tgt: '她锁上门，静静地等待。' },
  { n: '3', idx: '03', src: 'The lighthouse blinked twice, then went dark.', tgt: '灯塔闪了两下，随后归于黑暗。' },
]

// 预览卡：点击/回车突出某一组；手动选择期间暂停自动循环
const activePair = ref<string | null>(null)
const manual = ref(false)
function togglePair(n: string): void {
  if (activePair.value === n) {
    activePair.value = null
    manual.value = false
  } else {
    activePair.value = n
    manual.value = true
  }
}

// 三步叙事：滚动驱动当前步骤强调（不劫持滚轮）
const hwRef = ref<HTMLElement | null>(null)
const activeStep = ref('1')
let observer: IntersectionObserver | null = null

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !hwRef.value || !('IntersectionObserver' in window)) {
    activeStep.value = '1'
    return
  }
  const items = hwRef.value.querySelectorAll<HTMLElement>('.hw-item')
  if (!items.length) return
  const ratios: Record<string, number> = {}
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const step = (e.target as HTMLElement).dataset.step
        if (step) ratios[step] = e.intersectionRatio
      })
      let best = '1'
      let bestR = -1
      for (const k in ratios) {
        const ratio = ratios[k] ?? 0
        if (ratio > bestR) {
          bestR = ratio
          best = k
        }
      }
      activeStep.value = best
    },
    { threshold: [0, 0.1, 0.3, 0.5, 0.7, 1], rootMargin: '-24% 0px -24% 0px' },
  )
  items.forEach((el) => observer?.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <main>
    <section class="hero">
      <div class="wrap">
        <span class="eyebrow">Bilingual Ebook Studio</span>
        <h1>
          <span class="t-line">一纸书文</span>
          <span class="t-line t-line-2">两境言说</span>
        </h1>
        <p class="lead">
          让一本外文书拥有原文与译文逐段对照的双语阅读体验。当前已开放账号功能；整书处理正在接入，首版计划 TXT、英语→中文与 EPUB 导出，EPUB/PDF 输入与 PDF 导出为后续扩展。
        </p>
        <div class="cta">
          <RouterLink class="btn btn-primary" :to="{ name: 'login' }">开始使用</RouterLink>
          <a class="btn btn-ghost" href="#how">看看怎么做</a>
        </div>

        <div class="reader" :class="{ 'is-manual': manual }">
          <div class="reader-bar">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="title">港口雾 · The Harbor Fog</span>
            <span class="prog">逐段对照 · 示例</span>
          </div>
          <div class="reader-head"><span class="idx"></span><span>原 文</span><span>译 文</span></div>
          <div
            v-for="p in pairs"
            :key="p.n"
            class="pair"
            :data-pair="p.n"
            :class="{ 'is-active': activePair === p.n }"
            tabindex="0"
            role="group"
            :aria-label="`第 ${p.n} 组：原文与对应译文`"
            @click="togglePair(p.n)"
            @keydown.enter.prevent="togglePair(p.n)"
            @keydown.space.prevent="togglePair(p.n)"
          >
            <span class="idx">{{ p.idx }}</span>
            <p class="src">{{ p.src }}</p>
            <p class="tgt">{{ p.tgt }}</p>
          </div>
          <p class="reader-cap">示例内容 · 逐段对照示意，非真实翻译处理进度 · 点击任意一组可突出该组</p>
        </div>
      </div>
    </section>

    <section class="section hw-section js" id="how" ref="hwRef">
      <div class="wrap">
        <div class="sec-head">
          <span class="eyebrow">How it works</span>
          <h2>三步拿到你的双语书</h2>
          <p>整书处理正在接入，以下三步为产品规划示意。上线后可上传、选择语言并等待后台处理。</p>
        </div>

        <div class="hw">
          <div class="hw-item" data-step="1" :class="{ 'is-active': activeStep === '1' }">
            <span class="hw-n">01</span>
            <h3>上传一本书</h3>
            <p>首版计划支持 TXT 输入，系统自动提取正文与章节、过滤页眉页脚等噪音；EPUB / 文本型 PDF 输入为后续扩展。</p>
          </div>
          <div class="hw-scene" data-step="1" :class="{ 'is-on': activeStep === '1' }">
            <div class="hwv">
              <div class="hwv-bar">
                <span class="hwv-title">上传电子书</span>
                <span class="hwv-steps"><i class="on"></i><i></i><i></i></span>
                <span class="hwv-tag">示意</span>
              </div>
              <div class="hwv-drop"><span class="up-ic">⇧</span>点击或拖入文件<span class="up-sub">支持 TXT / EPUB / 文本型 PDF</span></div>
              <div class="hwv-file d0"><span class="f-badge">TXT</span><span class="f-name">english-novel.txt</span><span class="f-conf ok">高置信</span></div>
              <div class="hwv-file d1"><span class="f-badge">EPUB</span><span class="f-name">story.epub</span><span class="f-conf ok">高置信</span></div>
              <div class="hwv-file d2"><span class="f-badge">PDF</span><span class="f-name">mixed-sample.pdf</span><span class="f-conf warn">低置信</span></div>
              <div class="hwv-foot">提取正文与章节 · 过滤页眉页脚等噪音</div>
            </div>
          </div>

          <div class="hw-item" data-step="2" :class="{ 'is-active': activeStep === '2' }">
            <span class="hw-n">02</span>
            <h3>确认原文与目标语言</h3>
            <p>原文语言自动识别、可手动修正；首版计划英语 → 中文。提交后任务在后台处理并显示进度。</p>
          </div>
          <div class="hw-scene" data-step="2" :class="{ 'is-on': activeStep === '2' }">
            <div class="hwv">
              <div class="hwv-bar">
                <span class="hwv-title">语言设置</span>
                <span class="hwv-steps"><i></i><i class="on"></i><i></i></span>
                <span class="hwv-tag">示意</span>
              </div>
              <div class="hwv-field"><label>原文语言 · 自动识别</label><div class="hwv-detect"><span class="det">英语</span><span class="f-conf ok">高置信</span><span class="det-ok">已确认</span></div></div>
              <div class="hwv-field"><label>目标语言</label><div class="hwv-select">中文<span class="chev">▾</span><span class="sel-ok">✓</span></div></div>
              <div class="hwv-pairchip"><span class="pc-src">英语</span><span class="pc-arrow">→</span><span class="pc-tgt">中文</span><span class="pc-note">即将按此语言对生成对照</span></div>
              <div class="hwv-prev">
                <div class="hwv-prev-label">对齐预览（示意）</div>
                <div class="hwv-pair d0"><p class="s">She locked the door and waited.</p><p class="t">她锁上门，静静地等待。</p></div>
              </div>
              <div class="hwv-note">语言对将按所选翻译服务的能力核对</div>
            </div>
          </div>

          <div class="hw-item" data-step="3" :class="{ 'is-active': activeStep === '3' }">
            <span class="hw-n">03</span>
            <h3>逐段对照并导出</h3>
            <p>原文与译文逐段对齐、在线对照阅读；首版计划 EPUB 导出，PDF 导出为后续扩展。</p>
          </div>
          <div class="hw-scene" data-step="3" :class="{ 'is-on': activeStep === '3' }">
            <div class="hwv">
              <div class="hwv-bar">
                <span class="hwv-title">双语成品</span>
                <span class="hwv-steps"><i></i><i></i><i class="on"></i></span>
                <span class="hwv-tag">示意</span>
              </div>
              <div class="hwv-pair d0"><p class="s">The fog rolled in from the harbor at dusk.</p><p class="t">黄昏时分，雾从港口漫了进来。</p></div>
              <div class="hwv-pair d1"><p class="s">She locked the door and waited.</p><p class="t">她锁上门，静静地等待。</p></div>
              <div class="hwv-pair d2"><p class="s">The lighthouse blinked twice, then went dark.</p><p class="t">灯塔闪了两下，随后熄灭。</p></div>
              <div class="hwv-btns"><span class="hwv-btn">EPUB</span><span class="hwv-btn">PDF</span></div>
              <div class="hwv-foot">逐段对齐 · 保留原书段落结构 · 示意内容</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top: 0">
      <div class="wrap">
        <div class="features">
          <div class="feature">
            <h3>逐段对照</h3>
            <p>按句或段切分对齐，并排 / 上下两种视图，不让整段译文与原文错位。</p>
          </div>
          <div class="feature">
            <h3>长书也稳</h3>
            <p>任务后台处理、进度可见；中途关掉页面，回来仍可查看状态与结果。</p>
          </div>
          <div class="feature">
            <h3>随身阅读</h3>
            <p>响应式网页与可安装应用，手机端完成上传、阅读与下载。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section final">
      <div class="wrap">
        <span class="eyebrow">Ready when you are</span>
        <h2>开始把你的书，变成双语书</h2>
        <p>登录即可创建账号；整书处理上线后，几步得到可下载的双语电子书。</p>
        <RouterLink class="btn btn-gold" :to="{ name: 'login' }">登录 / 注册</RouterLink>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="wrap">
      <span>译伴 — 让一本书同时说两种语言</span>
    </div>
  </footer>
</template>
