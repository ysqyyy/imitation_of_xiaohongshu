<template>
  <div>
    <div class="posts-list" v-if="props.posts.length > 0">
      <div
        class="post-card"
        v-for="post in props.posts"
        :key="post.id"
        @click="handleGoDetail(post.id)"
      >
        <div class="post-img-wrap">
          <img :src="post.img" class="post-img" alt="帖子图片" />
        </div>
        <div class="post-desc">{{ post.title }}</div>
        <div class="post-meta">
          <span class="post-author">{{ post.author.name }}</span>
          <span class="post-like" @click.stop="handleLikePost(post)" style="cursor: pointer"
            >♡ {{ post.like }}</span
          >
        </div>
      </div>
    </div>
    <!-- 无内容显示 -->
    <div class="empty-list" v-else>
      <div class="empty-icon">📝</div>
      <div class="empty-text">暂无{{ emptyText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { PostCard } from '../types'
import { goDetail, likePost } from '../api/detail'

// 定义组件属性
const props = defineProps<{
  posts: PostCard[]
  emptyText?: string
}>()

// 跳转到详情页
function handleGoDetail(id: number) {
  goDetail(id)
}

// 处理点赞事件
function handleLikePost(post: PostCard) {
  likePost(post.id)
}
</script>

<script lang="ts">
// 添加默认导出以便支持 import PostList from '../components/PostList.vue'
export default {}
</script>

<style scoped>
.posts-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 创建3列网格 */
  grid-gap: 1.5rem;
  width: 100%;
  min-height: 400px; /* 确保即使内容不足也保持最小高度 */
  box-sizing: border-box; /* 确保内边距不会增加元素的总宽度 */
  max-width: 100%; /* 确保不会超出父容器 */
}

.post-card {
  width: 100%;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 #f0f1f2;
  overflow: hidden;
  margin-bottom: 0; /* 移除底部外边距，让grid-gap控制间距 */
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%; /* 使卡片充满整个网格单元格 */
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.post-img-wrap {
  position: relative;
  width: 100%;
  height: 240px; /* 统一图片高度 */
  overflow: hidden;
}

.post-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片覆盖整个容器并保持比例 */
  display: block;
}

.post-desc {
  padding: 1.1rem 1.2rem 0.5rem 1.2rem;
  font-size: 1.05rem;
  color: #333;
  min-height: 3.5rem; /* 增加最小高度，确保有足够空间显示标题 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制最多显示2行 */
  line-clamp: 2; /* 标准属性 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1; /* 使描述部分占据剩余空间 */
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.2rem 1rem 1.2rem;
  color: #aaa;
  font-size: 1rem;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: #999;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.1rem;
}

@media (max-width: 1200px) {
  .posts-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .posts-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .posts-list {
    grid-template-columns: repeat(1, 1fr);
  }

  .post-card {
    width: 100%;
  }
}
</style>
