<script setup lang="ts">
import AuthShell from '@/components/auth/AuthShell.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
</script>

<template>
  <AuthShell
    variant="login"
    title="登录"
    subtitle="欢迎回来，继续你的双语阅读。"
    art-line-1="让每一页，"
    art-line-2="都有另一门语言陪伴。"
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
