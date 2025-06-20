<template>
  <div class="home-view">
    <!-- 使用 PostList 组件展示帖子 -->
    <div class="breadcrumb-nav">
      <button
        class="breadcrumb-btn"
        :class="{ active: activeTab === 'hot' }"
        @click="switchTab('hot')"
      >
        热点推荐
      </button>
      <span class="breadcrumb-sep">/</span>
      <button
        class="breadcrumb-btn"
        :class="{ active: activeTab === 'personal' }"
        @click="switchTab('personal')"
      >
        个性化推荐
      </button>
    </div>
    <!-- <RecommendButton /> -->
    <PostList
      v-if="activeTab === 'hot'"
      :posts="posts"
      :emptyText="'推荐内容'"
      :has-more="hasMore"
      :is-loading="loading"
      @load-more="handleLoadMore"
    />
    <PostList
      v-else
      :posts="myPosts"
      :emptyText="'暂无个性化推荐内容'"
      :has-more="myHasMore"
      :is-loading="myLoading"
      @load-more="handleMyLoadMore"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { fetchRecommendPosts, fetchMyRecommendPosts } from '@/api/posts'
import PostList from '@/components/PostList.vue'
import type { PostCard as PostCardType } from '@/types'
// import RecommendButton from '@/components/RecommendButton.vue'
import { auth } from '@/utils/auth'
import { useRouter } from 'vue-router'
const router = useRouter()
const posts = ref<PostCardType[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)
const hasMore = ref(true)

const myPosts = ref<PostCardType[]>([])
const myLoading = ref(false)
const myCurrentPage = ref(1)
const myTotal = ref(0)
const myHasMore = ref(true)

const activeTab = ref<'hot' | 'personal'>('hot')
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
const loadMyPosts = async (page: number = 1) => {
  if (!auth.isLoggedIn()) {
    console.log('用户未登录，跳转到首页')
    router.push('/')
    return
  }
  if (myLoading.value) {
    console.log('正在加载中，跳过请求')
    return
  }

  console.log('开始加载个性化推荐帖子，页码:', page)
  myLoading.value = true

  try {
    const result = await fetchMyRecommendPosts(page, pageSize.value)
    console.log('获取到个性化推荐帖子数量:', result)

    if (page === 1) {
      // 初始页，直接替换
      myPosts.value = result.list
    } else {
      // 后续页，追加数据
      myPosts.value = [...myPosts.value, ...result.list]
    }

    // 更新分页信息
    myCurrentPage.value = page
    myTotal.value = result.total
    myHasMore.value = myPosts.value.length < result.total

    console.log('当前页:', myCurrentPage.value, '总数:', result.total)
  } catch (error) {
    console.error('加载个性化推荐帖子失败:', error)
    // 如果是认证错误，跳转到首页
    // if (error.response && error.response.status === 401) {
    //   auth.logout()
    //   router.push('/')
    // }
  } finally {
    myLoading.value = false
    console.log('加载完成')
  }
}

// 加载更多帖子
const handleLoadMore = () => {
  loadPosts(currentPage.value + 1)
}

const handleMyLoadMore = () => {
  loadMyPosts(myCurrentPage.value + 1)
}

onMounted(async () => {
  console.log('组件已挂载，开始加载数据')
  await loadPosts(1)
})

function switchTab(tab: 'hot' | 'personal') {
  if (activeTab.value !== tab) {
    activeTab.value = tab
    if (tab === 'personal') {
      myCurrentPage.value = 1
      loadMyPosts(1)
    } else if (tab === 'hot') {
      currentPage.value = 1
      loadPosts(1)
    }
  }
}
</script>

<style scoped>
.home-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
.breadcrumb-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0 1.5rem 0;
  font-size: 1.1rem;
}
.breadcrumb-btn {
  background: none;
  border: none;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  padding: 0 1.2rem;
  font-size: 1.1rem;
  transition: color 0.2s;
}
.breadcrumb-btn.active {
  color: #ff2d55;
  font-weight: 700;
  border-bottom: 2px solid #ff2d55;
}
.breadcrumb-sep {
  color: #bbb;
  font-size: 1.1rem;
}
</style>
