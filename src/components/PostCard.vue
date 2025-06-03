<template>
  <div class="post-card" @click="handleCardClick">
    <div class="post-media">
      <!-- 图片类型 -->
      <img 
        v-if="post.type === 'image' || !post.type" 
        :src="post.img" 
        :alt="post.title"
        class="post-image"
      />
      
      <!-- 视频类型 -->
      <div v-else-if="post.type === 'video'" class="video-container">
        <img :src="post.img" :alt="post.title" class="video-poster" />
        <div class="video-overlay">
          <div class="play-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div v-if="post.duration" class="video-duration">
            {{ formatDuration(post.duration) }}
          </div>
        </div>
      </div>
    </div>

    <div class="post-content">
      <h3 class="post-title">{{ post.title }}</h3>
      
      <div class="post-author">
        <img :src="post.author.img" :alt="post.author.name" class="author-avatar" />
        <span class="author-name">{{ post.author.name }}</span>
      </div>

      <div class="post-stats">
        <div class="like-count">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {{ post.like }}
        </div>
      </div>

      <div v-if="post.tabs && post.tabs.length" class="post-tags">
        <span 
          v-for="tag in post.tabs" 
          :key="tag" 
          class="tag"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PostCard } from '@/types/user'

interface Props {
  post: PostCard
}

interface Emits {
  (e: 'click', post: PostCard): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleCardClick = () => {
  emit('click', props.post)
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.post-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.post-media {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.post-image,
.video-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-image,
.post-card:hover .video-poster {
  transform: scale(1.05);
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;
}

.post-card:hover .video-overlay {
  background: rgba(0, 0, 0, 0.3);
}

.play-button {
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.post-card:hover .play-button {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  backdrop-filter: blur(10px);
}

.post-content {
  padding: 1rem;
}

.post-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.post-stats {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.like-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #666;
}

.like-count svg {
  color: #ff2d55;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  color: #666;
  background: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  line-height: 1;
}
</style> 