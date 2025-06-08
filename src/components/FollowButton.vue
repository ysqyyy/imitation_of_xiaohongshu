<template>
  <button class="follow-button" :class="{ 'is-followed': isFollowed }" @click="toggleFollow">
    {{ isFollowed ? '已关注' : '关注' }}
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { followUser, unfollowUser } from '../api/user'

const props = defineProps<{
  userId: number
  initialFollowed?: boolean
}>()

const isFollowed = ref(props.initialFollowed || false)

// 获取关注状态
onMounted(() => {
  if (props.initialFollowed !== undefined) {
    isFollowed.value = props.initialFollowed
  }
})

// 关注/取消关注用户
async function toggleFollow() {
  try {
    if (isFollowed.value) {
      await unfollowUser(props.userId)
      isFollowed.value = false
    } else {
      await followUser(props.userId)
      isFollowed.value = true
    }
    // 发出关注状态变化事件
    emit('follow-change', isFollowed.value)
  } catch (error) {
    console.error('关注操作失败:', error)
  }
}

// 定义事件
const emit = defineEmits<{
  (e: 'follow-change', value: boolean): void
}>()
</script>

<style scoped>
.follow-button {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  transition: all 0.3s;
  background: #ff2d55;
  color: white;
  border: 1px solid #ff2d55;
}

.follow-button.is-followed {
  background: white;
  color: #ff2d55;
}
</style>
