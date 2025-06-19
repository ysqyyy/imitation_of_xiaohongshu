<template>
  <div class="layout">
    <main>
      <!-- 个人信息区 -->
      <section class="user-section">
        <img class="avatar" :src="user.img || defaultAvatar" alt="头像" />
        <div class="user-info">
          <div class="name-action">
            <h2>{{ user.name }}</h2>
            <FollowButton :user-id="Number(userId)" :initial-followed="user.isFollowed" />
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
        <div class="tags">
          <span
            v-for="tag in tags"
            :key="tag.key"
            class="tag"
            :class="{ active: activetag === tag.key }"
            @click="selecttag(tag.key)"
          >
            {{ tag.label }}
          </span>
        </div>
        <PostList :posts="posts" :emptyText="getEmptyText()" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { UserInfo, PostCard } from '../types'
import { getOtherUserInfo } from '../api/user'
import PostList from '../components/PostList.vue'
import FollowButton from '../components/FollowButton.vue'

const route = useRoute()
const router = useRouter()
const userId = computed(() => route.params.id as string)
const defaultAvatar =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop'

// 用户信息响应式数据
const user = ref<UserInfo>({
  id: '',
  name: '',
  img: '',
  desc: '',
  follow: 0,
  fans: 0,
  likes: 0,
  isFollowed: false,
  myPosts: [],
  likedPosts: [],
  favPosts: [],
})

// 标签页配置
const tags = ref([{ label: 'TA的笔记', key: 'note' }])
const activetag = ref('note')
const posts = ref<PostCard[]>([])

// 检查当前用户是否为登录用户
function checkIfCurrentUser() {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr)
      console.log('当前用户信息:', userInfo)
      if (userInfo.userId && userInfo.userId.toString() === userId.value) {
        // 如果是当前登录用户，跳转到我的主页
        router.push('/myhome')
        return true
      }
    } catch (e) {
      console.error('解析用户信息失败', e)
    }
  }
  return false
}

// 获取用户信息
onMounted(async () => {
  // 检查是否为当前登录用户，如果是则跳转到我的主页
  if (checkIfCurrentUser()) {
    return
  }

  try {
    const userData = await getOtherUserInfo(Number(userId.value))
    user.value = {
      ...userData,
      img: userData.img || defaultAvatar,
    }

    if (userData.myPosts && userData.myPosts.length > 0) {
      posts.value = userData.myPosts
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})

function selecttag(tagKey: string) {
  activetag.value = tagKey
}
// 获取空状态文本
function getEmptyText() {
  if (activetag.value === 'note') return '笔记'
  return '内容'
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100%;
  background: #fff;
  width: 100%;
  overflow-x: hidden; /* 防止水平溢出 */
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

.tags {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 2rem;
}

.tag {
  font-size: 1.1rem;
  color: #888;
  cursor: pointer;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s,
    border 0.2s;
}

.tag.active {
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
