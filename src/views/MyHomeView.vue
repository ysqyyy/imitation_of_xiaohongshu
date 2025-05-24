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
import type { UserInfo, PostCard } from '../types/user'
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
main {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
  background: #fff;
  padding: 3rem 4rem;
  gap: 2.5rem; /* 增加主内容区与侧边栏间距 */
}
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
}
.user-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
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
.posts-section {
  background: #fafbfc;
  border-radius: 14px;
  padding: 2.5rem 2rem 2rem 2rem;
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
</style>
