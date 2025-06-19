<template>
  <div class="layout">
    <aside>
      <nav class="custom-nav">
        <RouterLink to="/" class="nav-link" active-class="nav-active">推荐</RouterLink>
        <RouterLink to="/search" class="nav-link" active-class="nav-active">查找</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/myhome" class="nav-link" active-class="nav-active"
          >我的主页</RouterLink
        >
        <div class="nav-bottom">
          <div class="publish-btn" @click="openPublishModal">
            <span class="plus-icon">+</span><span>发布</span>
          </div>
        </div>

        <!-- 未登录显示登录按钮，已登录显示用户信息 -->
        <div v-if="!isLoggedIn" class="auth-section">
          <button class="login-btn" @click="showLoginModal = true">登录</button>
        </div>
        <div v-else class="user-info-section" @click="toggleUserMenu">
          <img :src="userAvatar" alt="用户头像" class="user-avatar" />
          <span class="user-name">{{ userName }}</span>

          <!-- 用户菜单 -->
          <div v-if="showUserMenu" class="user-menu">
            <div class="menu-item" @click="goToUserHome">我的主页</div>
            <div class="menu-item" @click="handleLogout">退出登录</div>
          </div>
        </div>
      </nav>
    </aside>
    <main>
      <header>
        <!-- 顶部搜索框 -->
        <div class="search-bar">
          <input
            v-model="keyword"
            class="search-input"
            placeholder="搜索你感兴趣的内容"
            @keyup.enter="onSearch"
          />
          <button class="search-btn" @click="onSearch">搜索</button>
        </div>
      </header>
      <div class="main-content">
        <RouterView />
      </div>
      <DetailView.default v-if="showDetail" :id="detailId" />
      <PublishView.default v-if="showPublish" @close="closePublishModal" />
    </main>

    <!-- 登录注册弹窗 -->
    <LoginModal v-model:visible="showLoginModal" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import * as DetailView from './views/DetailView.vue'
import * as PublishView from './views/PublishView.vue'
import LoginModal from './components/LoginModal.vue'
import { auth } from './utils/auth'

const router = useRouter()
const route = useRoute()

const keyword = ref('')
const showLoginModal = ref(false)

// 用户信息相关
const isLoggedIn = ref(false)
const userName = ref('')
const userAvatar = ref('')
const showUserMenu = ref(false)
const defaultAvatar = '/src/assets/logo.svg' // 默认头像

// 在组件挂载时检查登录状态
onMounted(() => {
  checkLoginStatus()
})

// 监听路由变化，检查登录状态
watch(
  () => route.path,
  () => {
    checkLoginStatus()
  },
)

// 检查登录状态并获取用户信息
function checkLoginStatus() {
  // 检查是否已登录
  isLoggedIn.value = auth.isLoggedIn()

  if (isLoggedIn.value) {
    // 从localStorage获取用户信息
    try {
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        userName.value = userInfo.username || '用户'
        userAvatar.value = userInfo.avatar || defaultAvatar
      }
    } catch (error) {
      console.error('解析用户信息失败:', error)
      // 如果解析失败，设置默认值
      userName.value = '用户'
      userAvatar.value = defaultAvatar
    }
  }
}

// 切换用户菜单显示/隐藏
function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

// 跳转到用户主页
function goToUserHome() {
  router.push('/myhome')
  showUserMenu.value = false
}

// 处理登出
function handleLogout() {
  auth.logout()
  isLoggedIn.value = false
  userName.value = ''
  userAvatar.value = ''
  showUserMenu.value = false
  // 跳转到首页
  router.push('/')
}

function onSearch() {
  router.push({ path: '/search', query: { keyword: keyword.value } })
}

// 判断当前是否有 detail 查询参数来显示弹窗
const showDetail = computed(() => !!route.query.detail)
// 获取详情 ID
const detailId = computed(() => {
  const detail = route.query.detail
  return Array.isArray(detail) ? detail[0] || '' : detail || ''
})

// 控制发布弹窗的显示
const showPublish = ref(false)
function openPublishModal() {
  showPublish.value = true
}
function closePublishModal() {
  showPublish.value = false
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--color-bg);
}
aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  padding: 1rem 0;
  background: #fff;
  border-right: 1px solid #f2f2f2;
  position: relative;
}
.custom-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  margin-top: 8rem;
  width: 100%;
  height: 100%;
  position: relative;
}

.nav-bottom {
  position: absolute;
  bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.nav-link {
  display: block;
  width: 80%;
  text-align: center;
  padding: 0.9rem 0;
  font-size: 1.25rem;
  color: #888;
  border-radius: 24px;
  background: none;
  transition: all 0.2s;
  font-weight: 500;
  letter-spacing: 1px;
  text-decoration: none;
  margin-bottom: 0.5rem;
}
.nav-link:hover {
  background: #ffe6ec;
  color: #ff2d55;
}
.nav-active {
  background: #ff2d55;
  color: #fff !important;
  box-shadow: 0 2px 8px 0 #ffe6ec;
}
.publish-btn {
  width: 60%;
  height: auto;
  background: transparent;
  color: #888;
  padding: 0.5rem 0;
  font-size: 1.25rem;
  border: 3px solid #aaa;
  border-radius: 24px;
  display: flex;
  font-weight: 500;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 10px 20px;
}

.publish-btn:hover {
  background: #ff2d55;
  color: #fff;
  border-color: #ff2d55;
  transform: scale(1.05);
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
  margin-right: 4px;
}

.login-btn {
  width: auto;
  text-align: center;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  background: #ff2d55;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  letter-spacing: 2px;
  box-shadow: 0 2px 8px 0 rgba(255, 45, 85, 0.2);
  margin-top: 2rem;
}

.login-btn:hover {
  background: #ff1744;
  box-shadow: 0 4px 12px 0 #ffe6ec;
}

/* 登录区域样式 */
.auth-section {
  margin-top: 2rem;
}

/* 用户信息区域 */
.user-info-section {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
  margin-bottom: 0.5rem;
}

.user-name {
  font-size: 0.85rem;
  color: #333;
  margin-bottom: 0.5rem;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

/* 用户菜单 */
.user-menu {
  position: absolute;
  top: 100%;
  width: 120px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  margin-top: 0.5rem;
}

.menu-item {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #333;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

main {
  flex: 6;
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  padding-bottom: 0;
  background-color: var(--color-bg);
  overflow-y: auto;
}
header {
  width: 70%;
  line-height: 1.5;
  max-height: 10%;
}
.search-bar {
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}
.search-input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: 1px solid #eee;
  border-radius: 20px;
  font-size: 1.1rem;
  background: #fafbfc;
  outline: none;
}
.search-btn {
  margin-left: 1rem;
  padding: 0.7rem 1.5rem;
  background: #ff2d55;
  color: #fff;
  border-radius: 20px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.search-btn:hover {
  background: #ff1744;
}
.main-content {
  flex: 1;
  width: 100%;
  max-width: 100%; /* 确保内容不会超出容器 */
  padding-right: 3rem; /* 减小右侧内边距 */
  box-sizing: border-box; /* 确保内边距不会增加元素的总宽度 */
  overflow-x: hidden; /* 防止水平溢出 */
}
</style>
