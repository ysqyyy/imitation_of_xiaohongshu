<template>
  <div class="layout">
    <main>
      <!-- 个人信息区 -->
      <section class="user-section">
        <img class="avatar" :src="user.img" alt="头像" />
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
        <PostList
          :posts="posts"
          :emptyText="getEmptyText()"
          :hasMore="hasMore"
          :is-loading="loading"
          @load-more="loadUserPosts(true)"
        />

        <!-- 加载状态和加载更多按钮 -->
        <div v-if="loading" class="loading-indicator">正在加载...</div>
        <div v-if="!loading && hasMore" class="load-more">
          <button @click="loadUserPosts(true)" class="load-more-btn">加载更多</button>
        </div>
        <div v-if="!loading && posts.length > 0 && !hasMore" class="no-more">没有更多内容了</div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { UserInfo, PostCard } from '../types'
import { getOtherUserInfo, getUserPosts } from '../api/user'
import PostList from '../components/PostList.vue'
import FollowButton from '../components/FollowButton.vue'

const route = useRoute()
const router = useRouter()
const userId = computed(() => route.params.id as string)

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
  gender: 0,
  birthday: '',
})

// 标签页配置
const tags = ref([{ label: 'TA的笔记', key: 'note' }])
const activetag = ref('note')
const posts = ref<PostCard[]>([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(9)
const hasMore = ref(false)

// 检查当前用户是否为登录用户
function checkIfCurrentUser() {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr)
      if (userInfo.userId && userInfo.userId.toString() === userId.value) {
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
  if (checkIfCurrentUser()) {
    return
  }
  try {
    // 获取用户基本信息
    const userData = await getOtherUserInfo(Number(userId.value))
    user.value = userData
    // 加载用户的帖子
    await loadUserPosts()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})

// 加载用户帖子数据
async function loadUserPosts(isLoadMore = false) {
  if (loading.value) return

  loading.value = true
  try {
    // 如果不是加载更多，重置页码
    if (!isLoadMore) {
      page.value = 1
      posts.value = []
    }
    // 获取用户帖子
    const postsData = await getUserPosts(Number(userId.value), page.value, pageSize.value)
    // 更新数据
    if (isLoadMore) {
      posts.value.push(...postsData)
    } else {
      posts.value = postsData
    }

    // 更新分页信息
    hasMore.value = postsData.length >= pageSize.value

    // 如果是加载更多，增加页码
    if (isLoadMore) {
      page.value++
    }
  } catch (error) {
    console.error('加载用户帖子失败:', error)
  } finally {
    loading.value = false
  }
}

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

/* 加载更多相关样式 */
.loading-indicator {
  text-align: center;
  padding: 1rem;
  color: #888;
}

.load-more {
  text-align: center;
  padding: 1rem;
}

.load-more-btn {
  background-color: #ff2d55;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.load-more-btn:hover {
  background-color: #ff1a4b;
}

.no-more {
  text-align: center;
  padding: 1rem;
  color: #aaa;
  font-size: 0.9rem;
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
