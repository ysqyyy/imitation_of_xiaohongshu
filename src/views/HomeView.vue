<template>
  <div class="home-view">
    <!-- 使用 PostList 组件展示帖子 -->
    <PostList
      :posts="posts"
      :emptyText="'推荐内容'"
      :has-more="hasMore"
      :is-loading="loading"
      @load-more="handleLoadMore"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { fetchRecommendPosts } from '@/api/posts'
import PostList from '@/components/PostList.vue'
import type { PostCard as PostCardType } from '@/types'

const posts = ref<PostCardType[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)
const hasMore = ref(true)

// 初始加载推荐帖子
const loadPosts = async (page: number = 1) => {
  if (loading.value) {
    console.log('正在加载中，跳过请求')
    return
  }

  console.log('开始加载帖子，页码:', page)
  loading.value = true

  try {
    const result = await fetchRecommendPosts(page, pageSize.value)
    console.log('获取到帖子数量:', result.list.length)

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
    console.error('加载帖子失败:', error)
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
  console.log('组件已挂载，开始加载数据')
  await loadPosts(1)
})
</script>

<style scoped>
.home-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
