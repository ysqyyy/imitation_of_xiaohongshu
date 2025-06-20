<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ isLogin ? '欢迎回来' : '加入我们' }}</h2>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- 登录表单 -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="loginEmail">邮箱</label>
            <input
              id="loginEmail"
              v-model="loginForm.email"
              type="email"
              placeholder="请输入邮箱"
              required
            />
          </div>
          <div class="form-group">
            <label for="loginPassword">密码</label>
            <input
              id="loginPassword"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              required
            />
          </div>
          <button type="submit" class="submit-btn" :disabled="loginLoading">
            {{ loginLoading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 注册表单 -->
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="registerUsername">用户名</label>
            <input
              id="registerUsername"
              v-model="registerForm.username"
              type="text"
              placeholder="请输入用户名"
              required
            />
          </div>
          <div class="form-group">
            <label for="registerEmail">邮箱/手机号</label>
            <input
              id="registerEmail"
              v-model="registerForm.email"
              type="text"
              placeholder="请输入邮箱/手机号"
              required
            />
          </div>
          <div class="form-group">
            <label for="registerPassword">密码</label>
            <input
              id="registerPassword"
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码（6位以上）"
              required
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              required
            />
          </div>
          <button type="submit" class="submit-btn" :disabled="registerLoading">
            {{ registerLoading ? '注册中...' : '注册' }}
          </button>
        </form>
      </div>

      <div class="modal-footer">
        <p v-if="isLogin">
          还没有账号？
          <button class="switch-btn" @click="isLogin = false">立即注册</button>
        </p>
        <p v-else>
          已有账号？
          <button class="switch-btn" @click="isLogin = true">立即登录</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../api/auth'
import type { LoginRequest, RegisterRequest } from '../types/auth'
import auth from '../utils/auth'
interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter() // 初始化路由器

const isLogin = ref(true)
const loginLoading = ref(false)
const registerLoading = ref(false)

const loginForm = reactive<LoginRequest>({
  email: '1525040849@qq.com',
  password: '123456',
})

const registerForm = reactive<RegisterRequest>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 重置表单
const resetForms = () => {
  loginForm.email = ''
  loginForm.password = ''
  registerForm.username = ''
  registerForm.email = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
}

// 监听弹窗显示状态，重置表单和切换状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      isLogin.value = true
      resetForms()
    }
  },
)

const closeModal = () => {
  emit('update:visible', false)
}

const handleOverlayClick = () => {
  closeModal()
}

const handleLogin = async () => {
  loginLoading.value = true
  try {
    await login(loginForm)
    closeModal()
    window.location.reload()
    router.push('/') // 跳转到用户主页
  } catch (error) {
    console.error('Login error:', error)
    alert('登录失败，请稍后重试')
  } finally {
    loginLoading.value = false
  }
}

const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  if (registerForm.password.length < 6) {
    alert('密码长度不能少于6位')
    return
  }

  registerLoading.value = true
  try {
    const result = await register(registerForm)
    // 注册成功，直接保存用户信息（因为后端返回了 token）
    auth.setToken(result.token, 7) // 保存7天
    localStorage.setItem('userInfo', JSON.stringify(result.user))
    closeModal()
    alert('注册成功！')
  } catch (error: any) {
    console.error('Register error:', error)
    // 根据后端错误信息显示
    if (error.message.includes('账号可能已存在')) {
      alert('注册失败：该邮箱/手机号已被注册')
    } else {
      alert(error.message || '注册失败，请稍后重试')
    }
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  outline: none;
}

.form-group input:focus {
  border-color: #ff2d55;
}

.submit-btn {
  background: #ff2d55;
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: #ff1744;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  text-align: center;
  border-top: 1px solid #f5f5f5;
}

.modal-footer p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.switch-btn {
  background: none;
  border: none;
  color: #ff2d55;
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
  transition: color 0.2s;
}

.switch-btn:hover {
  color: #ff1744;
}
</style>
