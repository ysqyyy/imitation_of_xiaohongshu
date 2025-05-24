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
      :posts="filteredPosts"
      :emptyText="activeCategory === 0 ? '暂无搜索结果' : '暂无该分类内容'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPosts } from '../api/posts'
import type { PostCard } from '../types/user'
import PostList from '../components/PostList.vue'

const categories = ['全部', '美食', '旅行', '穿搭', '数码', '学习', '娱乐', '生活']
const activeCategory = ref(0)
const keyword = ref('')
const posts = ref<PostCard[]>([])
// 获取路由参数，实现从App.vue跳转带关键词自动搜索
const route = useRoute()

onMounted(async () => {
  if (route.query.keyword) {
    keyword.value = String(route.query.keyword)
  }
  posts.value = await fetchPosts(keyword.value)
})

// 监听路由 keyword 变化，自动刷新数据
watch(
  () => route.query.keyword,
  async (newKeyword, oldKeyword) => {
    if (newKeyword !== oldKeyword) {
      keyword.value = String(newKeyword || '')
      posts.value = await fetchPosts(keyword.value)
    }
  },
)

const filteredPosts = computed(() => {
  let result = posts.value
  if (activeCategory.value !== 0) {
    result = result.filter((p) => p.tabs?.[0] === categories[activeCategory.value])
  }
  return result
})

function selectCategory(idx: number) {
  activeCategory.value = idx
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
