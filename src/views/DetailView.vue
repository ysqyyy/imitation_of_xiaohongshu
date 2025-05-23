<template>
  <div class="modal-mask" @click.self="close">
    <div class="detail-container">
      <!-- 左侧图片集 -->
      <div class="image-gallery">
        <!-- 主图 -->
        <img :src="post.img" class="main-image" />
        <!-- 缩略图集 (模拟多张图片) -->
        <div class="thumbnails">
          <img :src="post.img" class="thumbnail active" />
          <div v-for="i in 3" :key="i" class="thumbnail placeholder"></div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-container">
        <!-- 作者信息 -->
        <div class="author-info">
          <div class="avatar" :style="{ backgroundImage: `url(${authorAvatar})` }"></div>
          <div class="author-name">{{ post.author.name || '用户' }}</div>
          <div class="follow-btn" @click="followUser(post.author.id)">关注</div>
        </div>

        <!-- 正文内容 -->
        <div class="post-content">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-text">{{ post.content }}</p>
          <div class="post-tags">
            <span class="tag"># {{ post.tabs || '生活' }}</span>
          </div>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <h3 class="comment-title">评论 · {{ commentCount }}</h3>

          <!-- 评论列表 -->
          <div class="comment-list">
            <div
              v-for="comment in post.comments"
              :key="comment.id"
              :style="{ marginLeft: `${comment.level * 20}px` }"
              class="comment-item"
            >
              <div
                class="comment-avatar"
                :style="{ backgroundImage: `url(${comment.author.img})` }"
              ></div>
              <div class="comment-content">
                <div class="comment-user">{{ comment.author.name }}</div>
                <div class="comment-text">{{ comment.content }}</div>
                <div class="comment-actions">
                  <span class="time">{{ comment.time }}</span>
                  <span class="like">赞 {{ comment.like }}</span>
                  <span class="reply" @click="replyTo(comment)">回复</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 没有评论时的提示 -->
          <div v-if="post.comments?.length === 0" class="no-comments">暂无评论，快来抢沙发吧~</div>
        </div>

        <footer>
          <!-- 评论输入框 -->
          <div class="comment-input-wrapper">
            <input
              v-model="commentText"
              class="comment-input"
              :placeholder="replyTarget ? `回复 @${replyTarget.name}` : '说点什么...'"
            />
            <button class="send-btn" @click="submitComment">发送</button>
          </div>

          <!-- 互动按钮区 -->
          <div class="action-buttons">
            <div class="action-btn">
              <i class="icon like-icon"></i>
              <span>{{ post.like }}</span>
            </div>
            <div class="action-btn">
              <i class="icon fav-icon"></i>
              <span>收藏</span>
            </div>
            <div class="action-btn">
              <i class="icon comment-icon"></i>
              <span>{{ commentCount }}</span>
            </div>
            <div class="action-btn">
              <i class="icon share-icon"></i>
              <span>分享</span>
            </div>
          </div>
        </footer>
      </div>

      <!-- 关闭按钮 -->
      <button class="close-btn" @click="close">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { PostDetail, Comment } from '../types/user'
import { closeDetail, getPostById, sendComment } from '../api/detail'
import { followUser } from '../api/myhome'
import { useRouter } from 'vue-router'
const router = useRouter()
// 接收父组件传递的 id 参数
const props = defineProps<{ id: string }>()

const post = ref<PostDetail>({
  id: 0,
  imgs: [],
  title: '',
  content: '',
  author: {
    id: 0,
    name: '',
    img: '',
  },
  tabs: [],
  like: 0,
  comments: [],
  fav: 0,
  time: '',
  private: false,
  isLike: false,
  isFav: false,
})
const commentText = ref('')
const commentCount = ref(0)
const replyTarget = ref<Comment | null>(null)

onMounted(async () => {
  if (props.id) {
    const actualId = Array.isArray(props.id) ? props.id[0] : props.id
    const result = await getPostById(Number(actualId))
    if (result) {
      post.value = result
    } else {
      console.error('帖子不存在或获取失败')
      router.back()
    }
  }
})
// 计算评论数量
watch(
  () => post.value.comments ?? [],
  (newComments) => {
    commentCount.value = newComments.length
  },
  { immediate: true },
)

function close() {
  // 使用 closeDetail 函数移除 query 参数
  closeDetail()
}

// 回复评论功能 todo
function replyTo(comment: Comment) {
  replyTarget.value = comment
  // 让输入框获取焦点
  setTimeout(() => {
    const input = document.querySelector('.comment-input') as HTMLInputElement
    input?.focus()
  }, 100)
}

// 提交帖子评论
function submitComment() {
  if (!commentText.value.trim()) return
  sendComment(post.value.id, commentText.value, 'post')
}

// 监听 id 变化，以便在不同帖子间切换
watch(
  () => props.id,
  (newId) => {
    if (newId) {
      getPostById(Number(newId))
    }
  },
)
</script>

<style scoped>
.modal-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.detail-container {
  display: flex;
  width: 90%;
  max-width: 1200px;
  height: 85vh;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: relative;
}

/* 左侧图片区域 */
.image-gallery {
  flex: 1;
  min-width: 45%;
  background: #000;
  display: flex;
  flex-direction: column;
}

.main-image {
  flex: 1;
  width: 100%;
  height: calc(100% - 80px);
  object-fit: contain;
}

.thumbnails {
  height: 80px;
  display: flex;
  background: #111;
  padding: 10px;
  gap: 8px;
}

.thumbnail {
  height: 60px;
  width: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s;
}

.thumbnail.active {
  opacity: 1;
  border: 2px solid #ff2d55;
}

.thumbnail.placeholder {
  background: #333;
}

/* 右侧内容区域 */
.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px;
  position: relative;
}

/* 作者信息 */
.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  gap: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-right: 12px;
}

.author-name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.follow-btn {
  padding: 4px 12px;
  border-radius: 16px;
  background: #ff2d55;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

/* 帖子内容 */
.post-content {
  margin-bottom: 24px;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.post-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 16px;
}

.post-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  background: #f8f8f8;
  color: #666;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
}

/* 评论区 */
.comments-section {
  flex: 1;
  margin-bottom: 20px;
  overflow-y: auto;
}

.comment-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.comment-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 6px;
}

.comment-actions {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.reply,
.like {
  cursor: pointer;
}

.reply:hover,
.like:hover {
  color: #ff2d55;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

/* 底部交互栏 */
footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
  margin-top: auto;
}

.comment-input-wrapper {
  display: flex;
  margin-bottom: 16px;
}

.comment-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #eee;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.send-btn {
  margin-left: 8px;
  padding: 0 16px;
  background: #ff2d55;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
}

.action-btn:hover {
  color: #ff2d55;
}

.icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.like-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
}

.fav-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E");
}

.comment-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'/%3E%3C/svg%3E");
}

.share-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'/%3E%3C/svg%3E");
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  right: 16px;
  top: 16px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.close-btn:hover {
  background: #fff;
  color: #ff2d55;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .detail-container {
    flex-direction: column;
    width: 95%;
    height: 90vh;
  }

  .image-gallery {
    min-width: 100%;
    height: 40%;
  }

  .main-image {
    height: calc(100% - 60px);
  }

  .thumbnails {
    height: 60px;
  }

  .thumbnail {
    height: 40px;
    width: 40px;
  }
}
</style>
