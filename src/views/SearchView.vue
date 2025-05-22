<template>
  <div class="search-page">
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
    <!-- 帖子列表 -->
    <div class="posts-list">
      <div class="post-card" v-for="(post, idx) in filteredPosts" :key="idx">
        <div class="post-img-wrap">
          <img :src="post.img" class="post-img" alt="帖子图片" />
        </div>
        <div class="post-desc">{{ post.desc }}</div>
        <div class="post-meta">
          <span class="post-author">{{ post.author }}</span>
          <span class="post-like">♡ {{ post.like }}</span>
        </div>
      </div>
      <div v-if="filteredPosts.length === 0" class="no-result">暂无相关内容</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import request from '../utils/request'

const categories = ['全部', '美食', '旅行', '穿搭', '数码', '学习', '娱乐', '生活']
const activeCategory = ref(0)
const keyword = ref('')
interface Post {
  img: string
  desc: string
  author: string
  like: number
  category: string
}

const posts = ref<Post[]>([])

// 获取路由参数，实现从App.vue跳转带关键词自动搜索
const route = useRoute()

onMounted(() => {
  if (route.query.keyword) {
    keyword.value = String(route.query.keyword)
  }
  fetchPosts()
})

// 监听路由 keyword 变化，自动刷新数据
watch(
  () => route.query.keyword,
  (newKeyword, oldKeyword) => {
    if (newKeyword !== oldKeyword) {
      keyword.value = String(newKeyword || '')
      fetchPosts()
    }
  },
)

function fetchPosts() {
  request
    .get('/posts/search', { params: { keyword: keyword.value } })
    .then((res) => {
      posts.value = res.data
    })
    .catch((err) => {
      posts.value = []
      console.error('搜索失败', err)
    })
}

const filteredPosts = computed(() => {
  let result = posts.value
  if (activeCategory.value !== 0) {
    result = result.filter((p) => p.category === categories[activeCategory.value])
  }
  return result
})

function selectCategory(idx: number) {
  activeCategory.value = idx
}
</script>

<style scoped>
.search-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}
.search-bar {
  display: flex;
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
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.search-btn:hover {
  background: #ff1744;
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
.posts-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem 2rem;
  min-height: 200px;
}
.post-card {
  width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 #f0f1f2;
  overflow: hidden;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}
.post-img-wrap {
  position: relative;
  width: 100%;
  height: 140px;
  overflow: hidden;
}
.post-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.post-desc {
  padding: 0.9rem 1rem 0.4rem 1rem;
  font-size: 1rem;
  color: #333;
  flex: 1;
}
.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem 0.7rem 1rem;
  color: #aaa;
  font-size: 0.95rem;
}
.no-result {
  color: #aaa;
  font-size: 1.1rem;
  margin: 2rem auto;
}
</style>
