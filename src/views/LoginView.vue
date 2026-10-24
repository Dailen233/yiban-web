<script setup lang="ts">
import AuthShell from '@/components/auth/AuthShell.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
</script>

<template>
  <AuthShell
    kicker="双语阅读伴侣"
    art-heading="让每一页，都有另一门语言陪伴。"
    art-body="登录后继续你的双语阅读旅程，重新找到读过的每一本书。"
    title="登录"
    subtitle="欢迎回来，继续你的双语阅读。"
  >
    <LoginForm />
    <p class="foot">
      还没有账号？<RouterLink :to="{ name: 'register' }">注册新账号</RouterLink>
    </p>
  </AuthShell>
</template>

<style scoped>
.foot {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: var(--muted);
}
</style>
