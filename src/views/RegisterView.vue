<script setup lang="ts">
import AuthShell from '@/components/auth/AuthShell.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
</script>

<template>
  <AuthShell
    variant="register"
    title="注册"
    subtitle="几步即可开始处理你的第一本书。"
    art-line-1="创建账号，"
    art-line-2="把读过的书都留住。"
    art-body="账号用于记录你的书籍、任务与阅读进度，再次找到每一段对照。"
    quote="&quot;再次找到它，是双语阅读伴侣的最后一环。&quot;"
  >
    <RegisterForm />
    <p class="foot">
      已有账号？<RouterLink :to="{ name: 'login' }">直接登录</RouterLink>
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
