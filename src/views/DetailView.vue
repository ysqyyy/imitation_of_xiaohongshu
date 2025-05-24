<template>
  <div class="modal-mask" @click.self="close">
    <div class="detail-container">
      <!-- 左侧图片集 -->
      <div class="image">
        <!-- 主图 -->
        <img :src="post.imgs[currentImgIndex]" class="main-image" />
        <!-- 缩略图集 (显示所有图片) -->
        <div class="thumbnails">
          <img
            v-for="(img, id) in post.imgs"
            :key="id"
            :src="img"
            class="thumbnail"
            :class="{ active: id === currentImgIndex }"
            @click="currentImgIndex = id"
          />
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-container">
        <!-- 作者信息 -->
        <div class="author-info">
          <div
            class="avatar"
            :style="{ backgroundImage: `url(${post.author.img})` }"
            @click="otherUser(post.author.id)"
          ></div>
          <div class="author-name">{{ post.author.name || '用户' }}</div>
          <div class="follow-btn" @click="followUser(post.author.id)">关注</div>
        </div>

        <!-- 正文内容 -->
        <div class="post-content">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-text">{{ post.content }}</p>
          <div class="post-tags">
            <span v-for="(tab, index) in post.tabs" :key="index" class="tag"># {{ tab }}</span>
            <span v-if="!post.tabs || post.tabs.length === 0" class="tag"># 生活</span>
          </div>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <h3 class="comment-title">评论 · {{ commentCount }}</h3>

          <!-- 评论列表 -->
          <div class="comment-list">
            <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
              <div
                class="comment-avatar"
                :style="{ backgroundImage: `url(${comment.author.img})` }"
                @click="otherUser(comment.author.id)"
              ></div>
              <div class="comment-content">
                <div class="comment-user">{{ comment.author.name }}</div>
                <div class="comment-text">{{ comment.content }}</div>
                <div class="comment-actions">
                  <span class="time">{{ comment.time }}</span>
                  <span class="like">♥ {{ comment.like }}</span>
                  <span class="reply" @click="replyComment(comment)">回复</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="post.comments?.length === 0" class="no-comments">暂无评论，快来抢沙发吧~</div>
        </div>

        <footer>
          <!-- 评论输入框 -->
          <div class="comment-input-wrapper">
            <input
              v-model="commentText"
              class="comment-input"
              :placeholder="replyTarget ? `回复 @${replyTarget.author.name}` : '说点什么...'"
            />
            <button class="send-btn" @click="submitComment">发送</button>
          </div>

          <!-- 互动按钮区 -->
          <div class="action-buttons">
            <div class="action-btn">
              <i class="icon like-icon" @click="sendLike(post.id)"></i>
              <span>{{ post.like }}</span>
            </div>
            <div class="action-btn">
              <i class="icon fav-icon" @click="sendFav(post.id)"></i>
              <span>收藏</span>
            </div>
            <div class="action-btn">
              <i class="icon comment-icon" @click="replyPost()"></i>
              <span>{{ commentCount }}</span>
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
import { ref, onMounted, watch } from 'vue'
import type { PostDetail, Comment } from '../types/user'
import { closeDetail, getPostById, sendComment, likePost, favoritePost } from '../api/detail'
import { followUser } from '../api/user'
import { useRouter } from 'vue-router'
const router = useRouter()
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
const currentImgIndex = ref(0) // 当前显示的图片索引

onMounted(async () => {
  if (props.id) {
    const result = await getPostById(Number(props.id))
    if (result) {
      post.value = result
    } else {
      console.error('帖子不存在或获取失败')
      router.back()
    }
  }
})
// 监听 id 变化，以便在不同帖子间切换
watch(
  () => props.id,
  (newId) => {
    if (newId) {
      getPostById(Number(newId))
    }
  },
)
function close() {
  closeDetail()
}
// 计算评论数量
watch(
  () => post.value.comments ?? [],
  (newComments) => {
    commentCount.value = newComments.length
  },
  { immediate: true },
)
// 点赞帖子
async function sendLike(id: number) {
  try {
    const result = await likePost(id)
    if (result) {
      post.value.isLike = result.isLike
      post.value.like = result.like
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    // 失败时回滚本地状态
    post.value.isLike = !post.value.isLike
    post.value.like += post.value.isLike ? 1 : -1
  }
}
// 收藏帖子
async function sendFav(id: number) {
  try {
    const result = await favoritePost(id)
    if (result) {
      post.value.isFav = result.isFav
      post.value.fav = result.fav
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    // 失败时回滚本地状态
    post.value.isFav = !post.value.isFav
    post.value.fav += post.value.isFav ? 1 : -1
  }
}
//回复帖子
function replyPost() {
  replyTarget.value = null
  setTimeout(() => {
    const input = document.querySelector('.comment-input') as HTMLInputElement
    input?.focus()
  }, 100)
}
// 回复评论
function replyComment(comment: Comment) {
  replyTarget.value = comment
  setTimeout(() => {
    const input = document.querySelector('.comment-input') as HTMLInputElement
    input?.focus()
  }, 100)
}
// 提交评论（评论/帖子）
function submitComment() {
  if (!commentText.value.trim()) return
  if (replyTarget.value) {
    sendComment(replyTarget.value.id, commentText.value, 'comment')
    replyTarget.value = null
  } else sendComment(post.value.id, commentText.value, 'post')
}
//点击他人头像
function otherUser(id: number) {
  router.push({ path: `/user/${id}` })
}
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
.image {
  flex: 1;
  height: 100%;
  min-width: 45%;
  background: rgba(0, 0, 0, 0.5);
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
  background: rgba(0, 0, 0, 0.5);
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
  height: 100%;
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
  margin-right: 2px;
  cursor: pointer;
}

.author-name {
  font-weight: 600;
  font-size: 16px;
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
  cursor: pointer;
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
</style>
