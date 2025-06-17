<template>
  <div v-if="visible" class="video-player-overlay" @click="handleOverlayClick">
    <div class="video-player-container">
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="closePlayer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>

      <!-- 视频播放器 -->
      <div class="video-wrapper" @click.stop>
        <video
          ref="videoRef"
          :src="currentPost?.video"
          :poster="getPostImage(currentPost)"
          controls
          autoplay
          muted
          loop
          class="video-element"
          @loadedmetadata="handleVideoLoaded"
          @ended="handleVideoEnded"
        />
      </div>

      <!-- 视频信息 -->
      <div class="video-info" @click.stop>
        <div class="video-content">
          <h3 class="video-title">{{ currentPost?.title }}</h3>
          <div class="video-author">
            <img
              :src="currentPost?.author.img"
              :alt="currentPost?.author.name"
              class="author-avatar"
            />
            <span class="author-name">{{ currentPost?.author.name }}</span>
            <button class="follow-btn" :class="{ followed: currentPost?.author.isFollowed }">
              {{ currentPost?.author.isFollowed ? '已关注' : '关注' }}
            </button>
          </div>
          <div class="video-stats">
            <div class="like-section">
              <button class="action-btn like-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
                <span>{{ currentPost?.like }}</span>
              </button>
            </div>
          </div>
          <div v-if="currentPost?.tabs && currentPost.tabs.length" class="video-tags">
            <span v-for="tag in currentPost.tabs" :key="tag" class="tag"> #{{ tag }} </span>
          </div>
        </div>
      </div>

      <!-- 上下切换按钮 -->
      <div class="navigation-buttons">
        <button
          v-if="hasPrevious"
          class="nav-button nav-up"
          @click="goToPrevious"
          title="上一个视频"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M7 14l5-5 5 5z" />
          </svg>
          <span>上一个</span>
        </button>
        <button v-if="hasNext" class="nav-button nav-down" @click="goToNext" title="下一个视频">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M7 10l5 5 5-5z" />
          </svg>
          <span>下一个</span>
        </button>
      </div>

      <!-- 视频计数器 -->
      <div class="video-counter">{{ props.currentIndex + 1 }} / {{ props.posts.length }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import type { PostCard, PostDetail } from '../types/index'

interface Props {
  visible: boolean
  posts: (PostCard | PostDetail)[]
  currentIndex: number
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:currentIndex', value: number): void
  (e: 'load-more'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const videoRef = ref<HTMLVideoElement>()

const currentPost = computed(() => props.posts[props.currentIndex])
const hasPrevious = computed(() => props.currentIndex > 0)
const hasNext = computed(() => props.currentIndex < props.posts.length - 1)

// 获取帖子的图片，处理 PostCard 和 PostDetail 的不同结构
function getPostImage(post: PostCard | PostDetail): string {
  if ('img' in post) {
    // PostCard 类型
    return post.img
  } else if ('imgs' in post && post.imgs.length > 0) {
    // PostDetail 类型
    return post.imgs[0]
  }
  return '' // 默认空字符串
}

// 监听当前索引变化，切换视频
watch(
  () => props.currentIndex,
  () => {
    if (videoRef.value) {
      nextTick(() => {
        videoRef.value?.load()
      })
    }
  },
)

// 监听可见性变化
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      document.body.style.overflow = 'hidden'
      nextTick(() => {
        videoRef.value?.play()
      })
    } else {
      document.body.style.overflow = ''
      videoRef.value?.pause()
    }
  },
)

const closePlayer = () => {
  emit('update:visible', false)
}

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closePlayer()
  }
}

const goToPrevious = () => {
  if (hasPrevious.value) {
    emit('update:currentIndex', props.currentIndex - 1)
  }
}

const goToNext = () => {
  if (hasNext.value) {
    emit('update:currentIndex', props.currentIndex + 1)

    // 当接近列表末尾时，加载更多
    if (props.currentIndex >= props.posts.length - 3) {
      emit('load-more')
    }
  }
}

const handleVideoLoaded = () => {
  if (videoRef.value && props.visible) {
    videoRef.value.play()
  }
}

const handleVideoEnded = () => {
  // 视频结束后自动播放下一个
  if (hasNext.value) {
    goToNext()
  }
}
</script>

<style scoped>
.video-player-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 10001;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  color: white;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.05);
}

.video-wrapper {
  position: relative;
  width: 90%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-element {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.video-info {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  z-index: 10001;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  color: white;
  max-width: 400px;
}

.video-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.video-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

.video-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.9rem;
  font-weight: 500;
  flex: 1;
}

.follow-btn {
  background: #ff2d55;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.follow-btn:hover {
  background: #ff1744;
}

.follow-btn.followed {
  background: #666;
  color: #ccc;
}

.video-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-btn {
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.like-btn:hover {
  color: #ff2d55;
}

.video-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.8rem;
  color: #ccc;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  line-height: 1;
}

.navigation-buttons {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10001;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 80px;
}

.nav-button:hover {
  background: rgba(255, 45, 85, 0.8);
  border-color: rgba(255, 45, 85, 0.8);
  transform: scale(1.05);
}

.nav-button:active {
  transform: scale(0.95);
}

.nav-button svg {
  transition: transform 0.2s;
}

.nav-button:hover svg {
  transform: scale(1.2);
}

.video-counter {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10001;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .video-info {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    max-width: none;
    padding: 1rem;
  }

  .close-btn {
    top: 1rem;
    right: 1rem;
  }

  .navigation-buttons {
    right: 1rem;
    gap: 1rem;
  }

  .nav-button {
    padding: 0.75rem;
    min-width: 60px;
    font-size: 0.75rem;
  }

  .video-counter {
    top: 1rem;
    left: 1rem;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .video-title {
    font-size: 1rem;
  }
}
</style>
