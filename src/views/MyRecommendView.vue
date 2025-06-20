<template>
  <div class="my-recommend-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>个性化推荐</h2>
      <p class="subtitle">基于你的兴趣为你推荐</p>
    </div>
    
    <!-- 使用 PostList 组件展示帖子 -->
    <PostList
      :posts="posts"
      :emptyText="'暂无个性化推荐内容'"
      :has-more="hasMore"
      :is-loading="loading"
      @load-more="handleLoadMore"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchMyRecommendPosts } from '@/api/posts'
import PostList from '@/components/PostList.vue'
import { auth } from '@/utils/auth'
import type { PostCard as PostCardType } from '@/types'

const router = useRouter()
const posts = ref<PostCardType[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)
const hasMore = ref(true)

// 检查登录状态
const checkAuth = () => {
  if (!auth.isLoggedIn()) {
    console.log('用户未登录，跳转到首页')
    router.push('/')
    return false
  }
  return true
}

// 初始加载推荐帖子
const loadPosts = async (page: number = 1) => {
  if (!checkAuth()) return
  
  if (loading.value) {
    console.log('正在加载中，跳过请求')
    return
  }

  console.log('开始加载个性化推荐帖子，页码:', page)
  loading.value = true

  try {
    const result = await fetchMyRecommendPosts(page, pageSize.value)
    console.log('获取到个性化推荐帖子数量:', result)

    if (page === 1) {
      // 初始页，直接替换
      posts.value = result.list
    } else {
      // 后续页，追加数据
      posts.value = [...posts.value, ...result.list]
    }

    // 更新分页信息
    currentPage.value = page
    total.value = result.total
    hasMore.value = posts.value.length < result.total

    console.log('当前页:', currentPage.value, '总数:', result.total)
  } catch (error) {
    console.error('加载个性化推荐帖子失败:', error)
    // 如果是认证错误，跳转到首页
    if (error.response && error.response.status === 401) {
      auth.logout()
      router.push('/')
    }
  } finally {
    loading.value = false
    console.log('加载完成')
  }
}

// 加载更多帖子
const handleLoadMore = () => {
  loadPosts(currentPage.value + 1)
}

onMounted(async () => {
  console.log('个性化推荐页面已挂载，开始加载数据')
  if (checkAuth()) {
    await loadPosts(1)
  }
})
</script>

<style scoped>
.my-recommend-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.page-header h2 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .my-recommend-view {
    padding: 0.5rem;
  }
  
  .page-header h2 {
    font-size: 1.5rem;
  }
}
</style>