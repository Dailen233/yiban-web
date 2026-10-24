<script setup lang="ts">
defineProps<{
  /** 左侧装帧区小字（英文/点缀）。 */
  kicker: string
  /** 左侧装帧区主标题。 */
  artHeading: string
  /** 左侧装帧区补充文案。 */
  artBody: string
  /** 右侧表单标题。 */
  title: string
  /** 右侧表单副标题。 */
  subtitle: string
}>()
</script>

<template>
  <main class="auth">
    <div class="art">
      <span class="kicker">{{ kicker }}</span>
      <h2>{{ artHeading }}</h2>
      <p class="art-body">{{ artBody }}</p>
      <div class="bind-art" aria-hidden="true">
        <span class="paper"></span>
        <span class="seal"></span>
      </div>
    </div>

    <div class="form-side">
      <div class="form-card">
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
  grid-template-columns: 42fr 58fr;
  background: radial-gradient(900px 420px at 50% -10%, #fff 0%, transparent 70%), var(--paper);
}

.art {
  background:
    radial-gradient(620px 400px at 50% 112%, rgba(47, 122, 99, 0.14), transparent 60%),
    linear-gradient(168deg, #17293a 0%, #1e3a4f 100%);
  color: #eef0e9;
  padding: 52px 46px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.art::before {
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

.art .kicker {
  display: block;
  margin-bottom: 16px;
  position: relative;
  font-family: var(--serif);
  font-size: 13px;
  letter-spacing: 0.5em;
  padding-left: 0.5em;
  color: var(--gold-2);
}

.art h2 {
  color: #f5f0e6;
  font-family: var(--serif);
  font-size: clamp(1.6rem, 2.2vw, 2.05rem);
  font-weight: 400;
  line-height: 1.62;
  letter-spacing: 0.02em;
  margin: 0;
  position: relative;
  max-width: 15em;
}

.art-body {
  margin: 18px 0 0;
  color: rgba(238, 240, 233, 0.72);
  font-size: 14.5px;
  max-width: 24em;
  line-height: 1.8;
}

.bind-art {
  position: relative;
  width: 260px;
  height: 190px;
  margin-top: 30px;
}

.paper {
  position: absolute;
  left: 8px;
  top: 34px;
  width: 210px;
  height: 130px;
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
  .auth {
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
