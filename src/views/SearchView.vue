<template>
  <div class="layout">
    <!-- 分类标签 -->
    <div class="category-bar">
      <span
        v-for="(cat, idx) in categories"
        :key="cat"
        :class="['category-tag', { active: idx === activeCategory }]"
        @click="selectCategory(idx)"
      >
        {{ cat }}
      </span>
    </div>
    <PostList
      :posts="posts"
      :emptyText="activeCategory === 0 ? '暂无搜索结果' : '暂无该分类内容'"
      :has-more="hasMorePosts"
      :is-loading="isLoading"
      @load-more="loadMorePosts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPosts } from '../api/posts'
import type { PostCard } from '../types'
import PostList from '../components/PostList.vue'

const categories = ['全部', '美食', '旅行', '穿搭', '数码', '学习', '娱乐', '生活']
const activeCategory = ref(0)
const keyword = ref('')
const posts = ref<PostCard[]>([])
const currentPage = ref(1)
const isLoading = ref(false)
const hasMorePosts = ref(true)
const totalPosts = ref(0)
// 获取路由参数，实现从App.vue跳转带关键词自动搜索
const route = useRoute()

// 加载初始帖子
async function loadInitialPosts() {
  try {
    isLoading.value = true
    currentPage.value = 1

    const selectedCategory =
      activeCategory.value !== 0 ? categories[activeCategory.value] : undefined

    const result = await fetchPosts(keyword.value, 1, 9, selectedCategory)
    posts.value = result.list
    totalPosts.value = result.total
    hasMorePosts.value = result.total > result.list.length

    isLoading.value = false
  } catch (error) {
    console.error('加载帖子失败:', error)
    isLoading.value = false
  }
}

// 加载更多帖子
async function loadMorePosts() {
  if (isLoading.value || !hasMorePosts.value) return

  try {
    isLoading.value = true
    currentPage.value++

    console.log(`加载更多帖子，当前页码: ${currentPage.value}`)

    const selectedCategory =
      activeCategory.value !== 0 ? categories[activeCategory.value] : undefined

    const result = await fetchPosts(keyword.value, currentPage.value, 9, selectedCategory)

    // 如果返回了新数据，添加到列表中
    if (result.list.length > 0) {
      posts.value = [...posts.value, ...result.list]
    }

    // 更新是否还有更多数据
    hasMorePosts.value = posts.value.length < result.total

    isLoading.value = false
  } catch (error) {
    console.error('加载更多帖子失败:', error)
    isLoading.value = false
  }
}

onMounted(async () => {
  if (route.query.keyword) {
    keyword.value = String(route.query.keyword)
  }
  await loadInitialPosts()
})

// 监听路由 keyword 变化，自动刷新数据
watch(
  () => route.query.keyword,
  async (newKeyword, oldKeyword) => {
    if (newKeyword !== oldKeyword) {
      keyword.value = String(newKeyword || '')
      await loadInitialPosts()
    }
  },
)

// 选择分类
function selectCategory(idx: number) {
  if (activeCategory.value !== idx) {
    activeCategory.value = idx
    loadInitialPosts()
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}
.category-bar {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 2.2rem;
  flex-wrap: wrap;
}
.category-tag {
  padding: 0.4rem 1.2rem;
  border-radius: 16px;
  background: #f5f5f5;
  color: #888;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.category-tag.active {
  background: #ff2d55;
  color: #fff;
}
</style>
