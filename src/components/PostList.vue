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
          <span class="post-private" v-if="post.private">仅自己可见</span>
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
import { defineProps, defineEmits } from 'vue'
import type { PostCard } from '../types/user'
import { goDetail } from '../api/detail'

// 定义组件属性
const props = defineProps<{
  posts: PostCard[]
  emptyText?: string
}>()

// 定义事件
const emit = defineEmits<{
  (e: 'like', post: PostCard): void
}>()

// 跳转到详情页
function handleGoDetail(id: number) {
  goDetail(id)
}

// 处理点赞事件
function handleLikePost(post: PostCard) {
  emit('like', post)
}
</script>

<style scoped>
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
  cursor: pointer;
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-5px);
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

@media (max-width: 900px) {
  .post-card {
    width: 90vw;
    min-width: 140px;
  }

  .posts-list {
    gap: 1.2rem 1.2rem;
  }
}
</style>
