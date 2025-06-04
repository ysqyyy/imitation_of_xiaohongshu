<template>
  <div class="layout">
    <main>
      <section class="user-section">
        <img class="avatar" :src="user.img || defaultAvatar" alt="头像" />
        <div class="user-info">
          <div class="name-action">
            <h2>{{ user.name }}</h2>
          </div>
          <div class="user-id">小红书号：{{ user.id }}</div>
          <div class="user-desc">{{ user.desc }}</div>
          <div class="user-stats">
            <span>{{ user.follow }} 关注</span>
            <span>{{ user.fans }} 粉丝</span>
            <span>{{ user.likes }} 获赞与收藏</span>
          </div>
        </div>
      </section>

      <section class="posts-section">
        <div class="tabs">
          <span
            v-for="tab in tabs"
            :key="tab.key"
            class="tab"
            :class="{ active: activeTab === tab.key }"
            @click="selectTab(tab.key)"
          >
            {{ tab.label }}
          </span>
        </div>
        <PostList :posts="posts" :emptyText="getEmptyText()" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserInfo, PostCard } from '../types'
import { getUserInfo } from '../api/user'
import PostList from '../components/PostList.vue'

const defaultAvatar = '/src/assets/logo.svg'

// 用户信息响应式数据
const user = ref<UserInfo>({
  id: '',
  name: '',
  img: '',
  desc: '',
  follow: 0,
  fans: 0,
  likes: 0,
  myPosts: [],
  favPosts: [],
  likedPosts: [],
})
// 标签页响应式数据
const tabs = ref([
  { label: '我的笔记', key: 'note' },
  { label: '点赞', key: 'like' },
  { label: '收藏', key: 'fav' },
])
const activeTab = ref('note')
function selectTab(tabKey: string) {
  activeTab.value = tabKey
  if (userCache) {
    posts.value = getPostsByTab(userCache, tabKey)
  }
}

// 帖子响应式数据
const posts = ref<PostCard[]>([])
// 获取用户信息
let userCache: UserInfo | null = null
onMounted(async () => {
  const userData = await getUserInfo()
  userCache = userData
  user.value = userData
  posts.value = getPostsByTab(user.value, activeTab.value)
})

function getPostsByTab(user: UserInfo, tab: string) {
  if (tab === 'note') return user.myPosts || []
  if (tab === 'fav') return user.favPosts || []
  if (tab === 'like') return user.likedPosts || []
  return []
}

// 获取空状态文本
function getEmptyText() {
  if (activeTab.value === 'note') return '笔记'
  if (activeTab.value === 'fav') return '收藏'
  if (activeTab.value === 'like') return '点赞'
  return '内容'
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100%;
  background: #fff;
  width: 100%;
  overflow: auto;
}

main {
  flex: 1;
  padding: 3rem 4rem;
  max-width: 1200px; /* 限制最大宽度 */
  margin: 0 auto; /* 居中显示 */
  width: 100%;
}

/* 个人信息区域 */
.user-section {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 2rem;
  border: 2px solid #f7f7f7;
  object-fit: cover;
}

.user-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.name-action {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.user-id {
  color: #aaa;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.user-desc {
  color: #666;
  margin-bottom: 0.7rem;
}

.user-stats {
  color: #888;
  font-size: 0.95rem;
  display: flex;
  gap: 1.5rem;
}

/* 帖子区域 */
.posts-section {
  width: 100%;
  background: #fafbfc;
  border-radius: 14px;
  padding: 2rem 1.5rem 1.5rem 1.5rem; /* 减小内边距 */
  min-height: 400px;
  box-sizing: border-box; /* 确保内边距不会增加元素的总宽度 */
}

.tabs {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 2rem;
}

.tab {
  font-size: 1.1rem;
  color: #888;
  cursor: pointer;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s,
    border 0.2s;
}

.tab.active {
  color: #ff2d55;
  border-bottom: 2px solid #ff2d55;
}

/* 响应式布局 */
@media (max-width: 900px) {
  main {
    padding: 1.2rem;
    min-width: auto; /* 移除最小宽度限制 */
  }

  .posts-section {
    padding: 1.5rem 1rem 1rem 1rem; /* 在小屏幕上进一步减小内边距 */
  }

  .post-card {
    width: 100%;
  }

  .posts-list {
    gap: 1rem;
  }

  .user-section {
    flex-direction: column;
    text-align: center;
  }

  .avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .name-action {
    justify-content: center;
  }

  .user-stats {
    justify-content: center;
  }
}
</style>
