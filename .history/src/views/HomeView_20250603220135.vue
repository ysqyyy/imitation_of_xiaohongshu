
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { fetchRecommendPosts } from '@/api/posts'
import PostCard from '@/components/PostCard.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import type { PostCard as PostCardType } from '@/types/user'

const posts = ref<PostCardType[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
const showVideoPlayer = ref(false)
const currentVideoIndex = ref(0)

// 计算视频帖子列表（用于视频播放器）
const videoPosts = computed(() => posts.value.filter(post => post.type === 'video'))

// 计算总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 瀑布流分列
const columns = computed(() => {
  const columnCount = 3 // 固定3列
  const result: PostCardType[][] = Array.from({ length: columnCount }, () => [])

  posts.value.forEach((post, index) => {
    const columnIndex = index % columnCount
    result[columnIndex].push(post)
  })

  return result
})

// 加载推荐帖子
const loadPosts = async (page: number = 1) => {
  if (loading.value) {
    console.log('正在加载中，跳过请求')
    return
  }

  console.log('开始加载帖子，页码:', page)
  loading.value = true

  try {
    const newPosts = await fetchRecommendPosts(page, pageSize.value)
    console.log('获取到帖子数量:', newPosts.list.length)

    posts.value = newPosts.list
    currentPage.value = page
    
    // 模拟总数据量（实际应该从API返回）
    // 这里假设总共有100条数据
    total.value = newPosts.total

    console.log('当前页:', currentPage.value, '总页数:', totalPages.value)
    
  } catch (error) {
    console.error('加载帖子失败:', error)
  } finally {
    loading.value = false
    console.log('加载完成')
  }
}

// 处理页码变化
const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value || loading.value) return
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  loadPosts(page)
}

// 处理帖子点击
const handlePostClick = (post: PostCardType) => {
  if (post.type === 'video') {
    // 视频类型，打开视频播放器
    const videoIndex = videoPosts.value.findIndex(p => p.id === post.id)
    if (videoIndex !== -1) {
      currentVideoIndex.value = videoIndex
      showVideoPlayer.value = true
    }
  } else {
    // 图片类型，跳转到详情页
    window.open(`/?detail=${post.id}`, '_blank')
  }
}

// 加载更多视频（视频播放器触发）
const loadMoreVideos = () => {
  // 在分页模式下，可以跳转到下一页
  if (currentPage.value < totalPages.value) {
    handlePageChange(currentPage.value + 1)
  }
}

// 获取显示的页码范围
const getVisiblePages = () => {
  const current = currentPage.value
  const total = totalPages.value
  const range = 2 // 当前页前后显示的页数

  let start = Math.max(1, current - range)
  let end = Math.min(total, current + range)

  // 确保至少显示5个页码（如果总页数足够）
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else if (end === total) {
      start = Math.max(1, end - 4)
    }
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}

onMounted(async () => {
  console.log('组件已挂载，开始加载数据')
  await loadPosts(1)
})
</script>

<template>
  <div class="home-view">
    <!-- 加载状态 -->
    <div v-if="loading && posts.length === 0" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载精彩内容...</p>
    </div>

    <!-- 瀑布流内容 -->
    <div v-else class="waterfall-container">
      <div class="waterfall-columns">
        <div
          v-for="(column, index) in columns"
          :key="index"
          class="waterfall-column"
        >
          <PostCard
            v-for="post in column"
            :key="post.id"
            :post="post"
            @click="handlePostClick"
          />
        </div>
      </div>

      <!-- 分页器 -->
      <div v-if="totalPages > 1" class="pagination-container">
        <div class="pagination">
          <!-- 上一页 -->
          <button
            :disabled="currentPage <= 1 || loading"
            @click="handlePageChange(currentPage - 1)"
            class="pagination-btn"
            :class="{ disabled: currentPage <= 1 || loading }"
          >
            上一页
          </button>

          <!-- 页码 -->
          <div class="pagination-numbers">
            <!-- 第一页 -->
            <button
              v-if="currentPage > 3"
              @click="handlePageChange(1)"
              class="pagination-number"
            >
              1
            </button>
            
            <!-- 省略号 -->
            <span v-if="currentPage > 4" class="pagination-ellipsis">...</span>

            <!-- 当前页附近的页码 -->
            <button
              v-for="page in getVisiblePages()"
              :key="page"
              @click="handlePageChange(page)"
              class="pagination-number"
              :class="{ active: page === currentPage }"
              :disabled="loading"
            >
              {{ page }}
            </button>

            <!-- 省略号 -->
            <span v-if="currentPage < totalPages - 3" class="pagination-ellipsis">...</span>

            <!-- 最后一页 -->
            <button
              v-if="currentPage < totalPages - 2"
              @click="handlePageChange(totalPages)"
              class="pagination-number"
            >
              {{ totalPages }}
            </button>
          </div>

          <!-- 下一页 -->
          <button
            :disabled="currentPage >= totalPages || loading"
            @click="handlePageChange(currentPage + 1)"
            class="pagination-btn"
            :class="{ disabled: currentPage >= totalPages || loading }"
          >
            下一页
          </button>
        </div>

        <!-- 分页信息 -->
        <div class="pagination-info">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页，总共 {{ total }} 条
        </div>
      </div>

      <!-- 加载中指示器 -->
      <div v-if="loading && posts.length > 0" class="loading-overlay">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>
    </div>

    <!-- 视频播放器 -->
    <VideoPlayer
      v-model:visible="showVideoPlayer"
      v-model:currentIndex="currentVideoIndex"
      :posts="videoPosts"
      @load-more="loadMoreVideos"
    />
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #666;
}

.loading-state p {
  margin-top: 1rem;
  font-size: 1rem;
}

.waterfall-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  position: relative;
}

.waterfall-columns {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1rem;
  gap: 1rem;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ff2d55;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pagination-container {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.pagination-btn:hover:not(.disabled) {
  background: #f5f5f5;
  border-color: #d0d0d0;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-number {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #d0d0d0;
}

.pagination-number.active {
  background: #ff2d55;
  color: white;
  border-color: #ff2d55;
}

.pagination-number:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  padding: 0 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.pagination-info {
  color: #666;
  font-size: 0.85rem;
  text-align: center;
}
</style>
