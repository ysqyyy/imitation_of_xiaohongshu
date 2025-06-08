<template>
  <span class="like-button" @click.stop="handleLike">
    <!-- 使用具名插槽允许父组件自定义图标 -->
    <slot name="icon" :is-liked="isLiked" :like-count="likeCount">
      <span class="like-icon" :class="{ active: isLiked }">♡</span>
      <span class="like-count">{{ likeCount }}</span>
    </slot>
  </span>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { likePost, unlikePost, likeComment, unlikeComment } from '../api/detail'

const props = defineProps<{
  type: 'post' | 'comment' // 点赞类型：帖子或评论
  id: number // 帖子ID或评论ID
  initialLikeCount: number // 初始点赞数
  initialIsLiked: boolean // 初始是否已点赞
}>()

// 响应式数据
const likeCount = ref(0)
const isLiked = ref(false)
watch(
  () => props.initialIsLiked,
  (newValue) => {
    if (newValue !== undefined) {
      isLiked.value = newValue
    }
  },
  { immediate: true },
)
watch(
  () => props.initialLikeCount,
  (newValue) => {
    if (newValue !== undefined) {
      likeCount.value = newValue
    }
  },
  { immediate: true },
)
// 处理点赞事件
async function handleLike() {
  // console.log('islie:', props.initialLikeCount, props.initialIsLiked)
  // console.log('当前点赞状态:', isLiked.value, likeCount.value)
  const previousIsLiked = isLiked.value
  const previousLikeCount = likeCount.value

  // 乐观更新UI，提高响应速度
  isLiked.value = !isLiked.value
  likeCount.value = isLiked.value ? likeCount.value + 1 : likeCount.value - 1

  try {
    let result = null
    if (props.type === 'post') {
      // 调用点赞帖子API
      console.log('当前点赞状态:', !isLiked.value)

      if (isLiked.value === true) {
        result = await likePost(props.id)
      } else {
        result = await unlikePost(props.id)
      }
    } else if (props.type === 'comment') {
      if (isLiked.value === true) {
        result = await likeComment(props.id)
      } else {
        result = await unlikeComment(props.id)
      }
    }

    if (result) {
      // 使用后端返回的真实数据更新状态 (处理不同的API返回格式)
      isLiked.value = result.isLike ?? isLiked.value
      likeCount.value = result.like ?? likeCount.value
    } else {
      // 如果后端没有返回数据，则回滚UI状态
      isLiked.value = previousIsLiked
      likeCount.value = previousLikeCount
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    // 错误时回滚UI状态
    isLiked.value = previousIsLiked
    likeCount.value = previousLikeCount
  }
}
</script>

<style scoped>
.like-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  padding: 2px 6px;
  border-radius: 12px;
}

.like-button:hover {
  color: #ff2d55;
  background: rgba(255, 45, 85, 0.1);
}

.like-icon {
  font-size: 1.1rem;
  transition: all 0.3s;
  transform-origin: center;
}

.like-icon.active {
  color: #ff2d55;
  font-weight: bold;
}

/* 添加点赞动画效果 - 会应用到默认图标和自定义图标 */
.like-button:active :deep(*) {
  transform: scale(1.3);
}
</style>
