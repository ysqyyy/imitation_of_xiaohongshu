<template>
  <div class="post-list-container">
    <div class="posts-list" v-if="props.posts.length > 0">
      <div
        class="post-card"
        v-for="post in props.posts"
        :key="post.id"
        @click="handleGoDetail(post.id)"
      >
        <div class="post-img-wrap">
          <img :src="post.img" class="post-img" alt="帖子图片" />
          <!-- 视频播放图标 - 只在类型为视频时显示 -->
          <div v-if="post.type === 'video'" class="video-play-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <!-- 视频时长 - 只在类型为视频且有时长时显示 -->
          <div v-if="post.type === 'video' && post.duration" class="video-duration">
            {{ formatDuration(post.duration) }}
          </div>
        </div>
        <div class="post-desc">{{ post.title }}</div>

        <!-- 帖子标签 -->
        <div v-if="post.tags && post.tags.length > 0" class="post-tags">
          <span v-for="(tag, index) in post.tags" :key="index" class="tag"># {{ tag }}</span>
        </div>

        <div class="post-meta">
          <div class="author-info">
            <img :src="post.author.img" alt="作者头像" class="author-avatar" />
            <span class="post-author">{{ post.author.name }}</span>
          </div>
          <LikeButton
            type="post"
            :id="post.id"
            :initial-like-count="post.like"
            :initial-is-liked="post.isLike"
          />
        </div>
      </div>
    </div>

    <!-- 无内容显示 -->
    <div class="empty-list" v-else>
      <div class="empty-icon">📝</div>
      <div class="empty-text">暂无{{ emptyText }}</div>
    </div>

    <!-- 底部加载指示器和交叉观察目标 -->
    <div ref="loadMoreTrigger" class="load-more-trigger">
      <div v-if="props.isLoading" class="loading-indicator">
        <div class="loading-spinner"></div>
        <span>加载更多...</span>
      </div>
      <div v-else-if="props.hasMore" class="load-more-text">向下滑动加载更多</div>
      <div v-else class="load-more-text">已经到底了</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { PostCard } from '../types/index'
import { goDetail } from '../api/detail'
import LikeButton from './LikeButton.vue'

// 定义组件属性
const props = defineProps<{
  posts: PostCard[]
  emptyText?: string
  hasMore?: boolean
  isLoading?: boolean
}>()

// 定义事件
const emit = defineEmits<{
  (e: 'load-more'): void
}>()

// 滚动观察目标元素
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// 跳转到详情页
function handleGoDetail(id: number) {
  goDetail(id)
}

// 初始化交叉观察器
function setupIntersectionObserver() {
  if (!loadMoreTrigger.value) return

  // 创建观察器
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]

      // 始终记录观察器状态以便调试
      console.log('IntersectionObserver 状态:', {
        isIntersecting: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio,
        hasMore: props.hasMore,
        isLoading: props.isLoading,
      })

      // 如果目标元素进入视口，且有更多数据可加载，且当前不在加载中
      if (entry.isIntersecting && props.hasMore && !props.isLoading) {
        console.log('滚动到底部，触发加载更多')
        emit('load-more')
      }
    },
    {
      root: null, // 使用页面视口作为根元素
      rootMargin: '0px 0px 800px 0px', // 大幅提前触发，确保能在页面底部之前加载更多
      threshold: 0, // 当目标元素刚出现时就触发，最大化灵敏度
    },
  )

  // 开始观察目标元素
  observer.observe(loadMoreTrigger.value)
}

// 清理观察器
function cleanupIntersectionObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

// 检查滚动位置
function checkScrollPosition() {
  if (!loadMoreTrigger.value || !props.hasMore || props.isLoading) return

  const rect = loadMoreTrigger.value.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight

  // 如果加载触发器在视口或视口下方附近
  if (rect.top <= windowHeight + 300) {
    console.log('滚动检测：触发加载更多', {
      triggerTop: rect.top,
      windowHeight: windowHeight,
      distance: rect.top - windowHeight,
    })
    emit('load-more')
  }
}

// 添加滚动事件监听
function setupScrollListener() {
  window.addEventListener('scroll', checkScrollPosition, { passive: true })
}

// 移除滚动事件监听
function cleanupScrollListener() {
  window.removeEventListener('scroll', checkScrollPosition)
}

// 监听帖子列表变化，重新设置观察器
watch(
  () => props.posts.length,
  () => {
    // 如果帖子更新了，需要重新设置观察器
    nextTick(() => {
      console.log('帖子列表更新，重新设置观察器和检查滚动位置')
      cleanupIntersectionObserver()
      setupIntersectionObserver()
      checkScrollPosition() // 检查滚动位置
    })
  },
)

// 监听加载状态变化
watch([() => props.hasMore, () => props.isLoading], () => {
  console.log('加载状态变化:', { hasMore: props.hasMore, isLoading: props.isLoading })
  nextTick(() => {
    checkScrollPosition() // 检查滚动位置
  })
})

// 组件挂载时设置观察器
onMounted(() => {
  setupIntersectionObserver()
  setupScrollListener() // 添加滚动监听器

  // 初始检查，以防内容不足以触发滚动
  nextTick(() => {
    console.log('初始检查滚动位置')
    checkScrollPosition()
  })
})

// 组件卸载时清理观察器
onUnmounted(() => {
  cleanupIntersectionObserver()
  cleanupScrollListener() // 移除滚动监听器
})
// 格式化视频时长（秒转为 mm:ss 格式）
function formatDuration(seconds: number): string {
  if (!seconds) return '00:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`

  return `${formattedMinutes}:${formattedSeconds}`
}
</script>

<script lang="ts">
// 添加默认导出以便支持 import PostList from '../components/PostList.vue'
export default {}
</script>

<style scoped>
.post-list-container {
  width: 100%;
  overflow: visible; /* 确保内容可以溢出而不会创建滚动条 */
}

.posts-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 创建3列网格 */
  grid-gap: 1.5rem;
  width: 100%;
  box-sizing: border-box; /* 确保内边距不会增加元素的总宽度 */
  max-width: 100%; /* 确保不会超出父容器 */
}

.post-card {
  width: 100%;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 #f0f1f2;
  overflow: hidden;
  margin-bottom: 0; /* 移除底部外边距，让grid-gap控制间距 */
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%; /* 使卡片充满整个网格单元格 */
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.post-img-wrap {
  position: relative;
  width: 100%;
  height: 240px; /* 统一图片高度 */
  overflow: hidden;
}

/* 视频播放图标样式 */
.video-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* 确保点击事件传递到底层 */
}

/* 视频时长样式 */
.video-duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 3px 6px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none; /* 确保点击事件传递到底层 */
}

.post-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片覆盖整个容器并保持比例 */
  display: block;
}

.post-desc {
  padding: 1.1rem 1.2rem 0.5rem 1.2rem;
  font-size: 1.05rem;
  color: #333;
  min-height: 2.5rem; /* 减少最小高度 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制最多显示2行 */
  line-clamp: 2; /* 标准属性 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.2rem; /* 添加底部间距 */
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.2rem 1rem 1.2rem;
  color: #777;
  font-size: 0.9rem;
  margin-top: auto; /* 保持在底部 */
}

/* 帖子标签样式 */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  padding: 0 1.2rem;
  margin-bottom: 0.8rem;
  gap: 6px;
}

.tag {
  font-size: 0.8rem;
  color: #666;
  background-color: #f5f5f5;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

/* 作者信息样式 */
.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

/* 加载更多触发器样式 */
.load-more-trigger {
  text-align: center;
  padding: 2rem 0;
  margin-top: 1rem;
  color: #999;
  font-size: 0.9rem;
  min-height: 60px; /* 稍微减小高度 */
  width: 100%; /* 确保宽度占满 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* 允许相对定位以便观察 */
  overflow: visible; /* 确保内容可见 */
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 45, 85, 0.3);
  border-radius: 50%;
  border-top-color: #ff2d55;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.load-more-text {
  opacity: 0.7;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: #999;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.1rem;
}

@media (max-width: 1200px) {
  .posts-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .posts-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .posts-list {
    grid-template-columns: repeat(1, 1fr);
  }

  .post-card {
    width: 100%;
  }
}
</style>
