<template>
  <div class="home-layout">
    <!-- 主体内容区 -->
    <div class="main-content">
      <!-- 个人信息区 -->
      <section class="profile-section">
        <img class="avatar" :src="profile.avatar" alt="头像" />
        <div class="profile-info">
          <h2>{{ profile.name }}</h2>
          <div class="profile-id">小红书号：{{ profile.id }}</div>
          <div class="profile-desc">{{ profile.desc }}</div>
          <div class="profile-stats">
            <span>{{ profile.follow }} 关注</span>
            <span>{{ profile.fans }} 粉丝</span>
            <span>{{ profile.likes }} 获赞与收藏</span>
          </div>
        </div>
      </section>

      <!-- 帖子列表 -->
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
        <div class="posts-list">
          <div class="post-card" v-for="(post, idx) in posts" :key="idx">
            <div class="post-img-wrap">
              <img :src="post.img" class="post-img" alt="帖子图片" />
              <span class="post-private" v-if="post.private">仅自己可见</span>
            </div>
            <div class="post-desc">{{ post.postDesc }}</div>
            <div class="post-meta">
              <span class="post-author">{{ profile.name }}</span>
              <span class="post-like" @click="likePost(idx)" style="cursor: pointer"
                >♡ {{ post.like }}</span
              >
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { UserInfo, Post } from '../types/user'
import { getUserInfo } from '../api/myhome'
// 用户信息响应式数据
const profile = ref({
  avatar: '/src/assets/logo.svg',
  name: '',
  id: '',
  desc: '',
  follow: 0,
  fans: 0,
  likes: 0,
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
}

// 帖子响应式数据
const posts = ref<Post[]>([])

// 获取用户信息
let userCache: UserInfo | null = null
onMounted(async () => {
  const user = await getUserInfo()
  userCache = user
  profile.value = {
    avatar: '/src/assets/logo.svg',
    name: user.username,
    id: user.id,
    desc: user.userDesc,
    follow: user.follow,
    fans: user.fans,
    likes: user.likes,
  }
  posts.value = getPostsByTab(user, activeTab.value)
})

function getPostsByTab(user: UserInfo, tab: string) {
  if (tab === 'note') return user.myPosts
  if (tab === 'fav') return user.favPosts
  if (tab === 'like') return user.likedPosts
  return []
}

watch(activeTab, (tab) => {
  if (userCache) {
    posts.value = getPostsByTab(userCache, tab)
  }
})

// 示例：点赞按钮事件
function likePost(idx: number) {
  posts.value[idx].like++
}
</script>

<style scoped>
.home-layout {
  display: flex;
  height: 100%;
  background: #fff;
  gap: 2.5rem; /* 增加主内容区与侧边栏间距 */
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff2d55;
  margin-bottom: 2rem;
}
.nav-list {
  width: 100%;
}
.icon {
  margin-right: 0.7rem;
  font-size: 1.2rem;
}
.main-content {
  flex: 1;
  padding: 3rem 4rem;
  min-width: 70vw;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.header-links a {
  margin-left: 1.5rem;
  color: #888;
  text-decoration: none;
  font-size: 1rem;
}
.header-links a:hover {
  color: #ff2d55;
}
.profile-section {
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
.profile-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}
.profile-id {
  color: #aaa;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}
.profile-desc {
  color: #666;
  margin-bottom: 0.7rem;
}
.profile-stats {
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
.posts-list {
  display: flex;
  gap: 2.5rem 2.5rem;
  flex-wrap: wrap;
}
.post-card {
  width: 240px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 #f0f1f2;
  overflow: hidden;
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
}
.post-img-wrap {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}
.post-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.post-private {
  position: absolute;
  left: 8px;
  bottom: 8px;
  background: rgba(120, 80, 40, 0.7);
  color: #fff;
  font-size: 0.85rem;
  padding: 2px 8px;
  border-radius: 6px;
}
.post-desc {
  padding: 1.1rem 1.2rem 0.5rem 1.2rem;
  font-size: 1.05rem;
  color: #333;
  flex: 1;
}
.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.2rem 1rem 1.2rem;
  color: #aaa;
  font-size: 1rem;
}
@media (max-width: 900px) {
  .main-content {
    padding: 1.2rem;
  }
  .sidebar {
    width: 120px;
    padding-left: 0.5rem;
  }
  .post-card {
    width: 90vw;
    min-width: 140px;
  }
  .posts-list {
    gap: 1.2rem 1.2rem;
  }
}
</style>
