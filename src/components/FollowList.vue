<template>
  <div>
    <!-- 关注按钮 -->
    <span class="follow-btn" @click="handleButtonClick">关注</span>

    <!-- 关注列表弹窗 -->
    <div v-if="isVisible" class="follow-list-modal-overlay" @click="closeModal">
      <div class="follow-list-modal" @click.stop>
        <div class="follow-list-header">
          <h3>{{ currentUserId ? '用户关注' : '我的关注' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <div class="follow-list-content">
          <!-- 加载中提示 -->
          <div v-if="loading" class="loading-indicator">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
            </svg>
            <span>加载中...</span>
          </div>

          <!-- 关注列表 -->
          <div v-else-if="followList.length > 0" class="follow-list">
            <div v-for="user in followList" :key="user.userId" class="follow-item">
              <div class="follow-avatar" @click="navigateToUser(user.userId)">
                <img :src="user.avatar || defaultAvatar" :alt="user.username" />
              </div>
              <div class="follow-info">
                <div class="follow-name" @click="navigateToUser(user.userId)">
                  {{ user.username }}
                </div>
              </div>
            </div>

            <!-- 加载更多按钮 -->
            <div v-if="hasMore" class="load-more">
              <button @click="loadMore" :disabled="loadingMore">
                {{ loadingMore ? '加载中...' : '加载更多' }}
              </button>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <svg viewBox="0 0 24 24" width="64" height="64">
              <path
                fill="currentColor"
                d="M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12H8Z"
              />
            </svg>
            <p>暂无关注的用户</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { getFollowList } from '@/api/follow'
import type { FollowUser } from '@/types/index'

const props = defineProps({
  userId: Number,
})

const defaultAvatar = '/src/assets/logo.svg'
const router = useRouter()
const isVisible = ref(false)
const loading = ref(false)
const loadingMore = ref(false)

// 分页数据
const page = ref(1)
const pageSize = ref(10)
const hasMore = ref(false)

// 关注列表数据
const followList = ref<FollowUser[]>([])

// 存储当前查看的用户ID
const currentUserId = ref<number | undefined>(undefined)

// 处理按钮点击
function handleButtonClick() {
  console.log('关注按钮被点击', props.userId)
  showFollowList(props.userId)
}

// 显示关注列表
async function showFollowList(userId?: number) {
  isVisible.value = true
  // 存储当前查看的用户ID
  currentUserId.value = userId
  // 重置数据
  page.value = 1
  followList.value = []

  // 加载数据
  await loadFollowList()
}

// 加载关注列表
async function loadFollowList() {
  try {
    loading.value = true
    const targetUserId = props.userId || currentUserId.value
    const result = await getFollowList(targetUserId, page.value, pageSize.value)

    followList.value = result
  } catch (error) {
    console.error('加载关注列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载更多
async function loadMore() {
  if (loadingMore.value || !hasMore.value) return

  try {
    loadingMore.value = true
    page.value++

    const targetUserId = props.userId || currentUserId.value
    const result = await getFollowList(targetUserId)
    console.log('加载更多关注:', result)
    followList.value.push(...result)
  } catch (error) {
    console.error('加载更多关注失败:', error)
  } finally {
    loadingMore.value = false
  }
}

// 关闭弹窗
function closeModal() {
  isVisible.value = false
}

// 导航到用户主页
function navigateToUser(userId: number) {
  router.push(`/user/${userId}`)
  closeModal()
}

// 暴露方法给父组件
defineExpose({
  showFollowList,
})
</script>

<style scoped>
/* 关注按钮样式 */
.follow-btn {
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
}

.follow-btn:hover {
  color: #ff2d55;
  background-color: #f8f8f8;
}

/* 弹窗样式 */
.follow-list-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.follow-list-modal {
  width: 400px;
  max-width: 90%;
  max-height: 80vh;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.follow-list-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.follow-list-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #666;
}

.follow-list-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* 关注列表样式 */
.follow-list {
  padding: 12px 0;
}

.follow-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  transition: background-color 0.2s;
  cursor: default;
}

.follow-item:hover {
  background-color: #f8f8f8;
}

.follow-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  cursor: pointer;
}

.follow-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.follow-info {
  flex: 1;
}

.follow-name {
  font-weight: 500;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  cursor: pointer;
}

.follow-name:hover {
  color: #ff2d55;
}

/* 加载状态样式 */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.spinner {
  width: 40px;
  height: 40px;
  animation: rotate 2s linear infinite;
  margin-bottom: 12px;
}

.path {
  stroke: #ff2d55;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* 空状态样式 */
.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.empty-state svg {
  margin-bottom: 12px;
  color: #ddd;
}

.empty-state p {
  margin: 0;
  font-size: 15px;
}

/* 加载更多按钮 */
.load-more {
  text-align: center;
  padding: 16px;
}

.load-more button {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f5f5f5;
}

.load-more button:hover:not(:disabled) {
  background-color: #eee;
  color: #333;
}

.load-more button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
