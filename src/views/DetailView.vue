<template>
  <div class="modal-mask" @click.self="close">
    <div class="detail-container">
      <!-- 左侧图片或视频区域 -->
      <div class="image">
        <!-- 当帖子有视频时显示视频 -->
        <div v-if="post?.video" class="video-container">
          <video
            ref="videoRef"
            :src="post.video"
            :poster="post.imgs?.[0]"
            class="main-video"
            controls
            @click="openVideoPlayer"
            @error="handleVideoError"
          ></video>
          <div v-if="videoError" class="video-error-message">{{ videoError }}</div>
          <div class="video-play-button" @click="openVideoPlayer">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <!-- 没有视频时显示图片 -->
        <div v-else-if="post" class="image-container">
          <img :src="post.imgs[currentImgIndex]" class="main-image" />

          <!-- 左右切换按钮 - 仅在有多张图片且没有视频时显示 -->
          <div v-if="post.imgs.length > 1" class="img-navigation">
            <div class="nav-arrow prev" @click="prevImage">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </div>
            <div class="nav-arrow next" @click="nextImage">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 缩略图集  -->
        <div v-if="!post?.video && post?.imgs && post.imgs.length > 1" class="thumbnails">
          <img
            v-for="(img, id) in post?.imgs || []"
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
            :style="{ backgroundImage: `url(${post?.author.img})` }"
            @click="otherUser(post?.author.id ?? 0)"
          ></div>
          <div class="author-name">{{ post?.author.name || '用户' }}</div>
          <FollowButton
            v-if="!post?.author.isAuthor"
            :user-id="post?.author.id ?? 0"
            :initial-followed="post?.author.isFollowed"
          />
        </div>

        <!-- 正文内容 -->
        <div class="post-content">
          <h2 class="post-title">{{ post?.title }}</h2>
          <p class="post-text">{{ post?.content }}</p>
          <div class="post-tags">
            <span v-for="(tag, index) in post?.tags" :key="index" class="tag"># {{ tag }}</span>
            <span v-if="!post?.tags || post?.tags.length === 0" class="tag"># 生活</span>

            <!-- 作者编辑删除按钮 -->
            <div v-if="post?.author.isAuthor" class="author-actions">
              <div class="edit-btn" @click="editPost">编辑</div>
              <div class="delete-btn" @click="deletePostConfirm">删除</div>
            </div>
          </div>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <h3 class="comment-title">评论 · {{ commentCount }}</h3>

          <!-- 评论列表 -->
          <div class="comment-list">
            <div v-for="comment in post?.comments" :key="comment.id" class="comment-item">
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
                  <LikeButton
                    type="comment"
                    :id="comment.id"
                    :initial-like-count="comment.like"
                    :initial-is-liked="comment.isLike"
                  />
                  <span class="reply" @click="replyComment(comment)">回复</span>
                  <span
                    v-if="comment.author.id === currentUserId"
                    class="delete"
                    :class="{ deleting: isCommentDeleting === comment.id }"
                    @click="handleDeleteComment(comment.id)"
                  >
                    {{ isCommentDeleting === comment.id ? '删除中...' : '删除' }}
                  </span>
                  <span
                    v-if="comment.reply && comment.reply.length > 0"
                    class="view-replies"
                    @click="toggleReplies(comment.id)"
                  >
                    {{
                      expandedComments.includes(comment.id)
                        ? '收起回复'
                        : `查看${comment.reply.length}条回复`
                    }}
                  </span>
                </div>

                <!-- 二级评论区域 -->
                <div
                  v-if="
                    expandedComments.includes(comment.id) &&
                    comment.reply &&
                    comment.reply.length > 0
                  "
                  class="replies-container"
                >
                  <div v-for="reply in comment.reply" :key="reply.id" class="reply-item">
                    <div
                      class="reply-avatar"
                      :style="{ backgroundImage: `url(${reply.author.img})` }"
                      @click="otherUser(reply.author.id)"
                    ></div>
                    <div class="reply-content">
                      <div class="reply-user">{{ reply.author.name }}</div>
                      <div class="reply-text">{{ reply.content }}</div>
                      <div class="reply-actions">
                        <span class="time">{{ reply.time }}</span>
                        <LikeButton
                          type="comment"
                          :id="reply.id"
                          :initial-like-count="reply.like"
                          :initial-is-liked="reply.isLike"
                        />
                        <span class="reply" @click="replyComment(reply)">回复</span>
                        <span
                          v-if="reply.author.id === currentUserId"
                          class="delete"
                          :class="{ deleting: isCommentDeleting === reply.id }"
                          @click="handleDeleteComment(reply.id)"
                        >
                          {{ isCommentDeleting === reply.id ? '删除中...' : '删除' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="post?.comments?.length === 0" class="no-comments">暂无评论，快来抢沙发吧~</div>
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
              <LikeButton
                type="post"
                :id="post?.id ?? 0"
                :initial-like-count="post?.like ?? 0"
                :initial-is-liked="post?.isLike ?? false"
              >
                <template #icon="{ isLiked, likeCount }">
                  <i class="icon like-icon" :class="isLiked ? 'fas' : 'far'"></i>
                  <span>{{ likeCount }}</span>
                </template>
              </LikeButton>
            </div>

            <div class="action-btn">
              <i
                class="icon fav-icon"
                :class="{
                  active: post?.isFav,
                  loading: isFavoriteLoading,
                }"
                @click="toggleFavorite(post?.id)"
              ></i>
              <span>{{ post?.isFav ? '已收藏' : '收藏' }} {{ post?.fav || 0 }}</span>
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

    <!-- 视频播放器全屏弹窗 -->
    <VideoPlayer
      v-if="showVideoPlayer && post"
      :posts="post"
      :visible="showVideoPlayer"
      @update:visible="showVideoPlayer = $event"
      @post-changed="handlePostChanged"
    />

    <!-- 编辑帖子弹窗 -->
    <PublishView.default v-if="showPublish" :edit-mode="true" @close="closePublishModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import type { PostDetail, Comment } from '../types'
import {
  closeDetail,
  getPostById,
  sendComment,
  favoritePost,
  unfavoritePost,
  deletePost,
  deleteComment,
} from '../api/detail'
import FollowButton from '../components/FollowButton.vue'
import LikeButton from '../components/LikeButton.vue'
import VideoPlayer from '../components/VideoPlayer.vue'
import { useRouter } from 'vue-router'
import * as PublishView from './PublishView.vue'
const router = useRouter()
const props = defineProps<{ id: string }>()

const post = ref<PostDetail | null>(null)
const commentText = ref('')
const commentCount = ref(0)
const replyTarget = ref<Comment | null>(null)
const currentImgIndex = ref(0) // 当前显示的图片索引
const expandedComments = ref<number[]>([]) // 存储已展开评论的ID
const showPublish = ref(false) // 控制编辑弹窗的显示
const showVideoPlayer = ref(false) // 控制视频播放器显示
const currentVideoIndex = ref(0) // 当前播放的视频索引
const videoError = ref<string>('') // 视频错误信息
const isFavoriteLoading = ref(false) // 收藏操作加载状态
const currentUserId = ref<number | null>(null) // 当前登录用户ID
const isCommentDeleting = ref<number | null>(null) // 正在删除的评论ID

// 视频错误处理
function handleVideoError(e: Event) {
  console.error('视频加载错误:', e)
  videoError.value = '视频无法播放，请检查网络连接或视频链接是否有效'

  // 检查视频链接
  const videoElement = e.target as HTMLVideoElement
  if (videoElement && videoElement.src) {
    console.log('视频地址:', videoElement.src)

    // 测试其他可能的视频格式
    if (post.value && post.value.video) {
      // 如果是相对路径，尝试转换为绝对路径
      if (post.value.video.startsWith('/')) {
        const newSrc = window.location.origin + post.value.video
        console.log('尝试使用绝对路径:', newSrc)
        videoElement.src = newSrc
        return
      }

      // 尝试添加协议
      if (!post.value.video.startsWith('http')) {
        const newSrc = 'https://' + post.value.video.replace(/^\/\//, '')
        console.log('尝试添加协议:', newSrc)
        videoElement.src = newSrc
      }
    }
  }
}

// 编辑帖子
function editPost() {
  if (!post.value) return

  // 创建编辑所需的数据
  const editData = {
    id: post.value.id,
    title: post.value.title,
    content: post.value.content,
    tags: post.value.tags,
    imgs: post.value.imgs,
    private: post.value.private || false,
  }

  // 将数据存储到localStorage以便PublishView组件使用
  localStorage.setItem('editPostData', JSON.stringify(editData))

  // 打开编辑弹窗
  showPublish.value = true
}

// 删除帖子
async function deletePostConfirm() {
  if (!post.value) return

  if (confirm('确定要删除这篇帖子吗？删除后将无法恢复。')) {
    try {
      const result = await deletePost(post.value.id)
      if (result && result.success) {
        alert('删除成功')
        close() // 关闭详情页
        // 可能还需要刷新列表页
        router.go(0) // 刷新页面
      } else {
        alert('删除失败：' + (result?.message || '未知错误'))
      }
    } catch (error) {
      console.error('删除帖子失败:', error)
      alert('删除失败，请稍后重试')
    }
  }
}

// 关闭编辑弹窗
function closePublishModal() {
  showPublish.value = false
  // 可以选择在这里刷新帖子数据
  if (props.id) {
    getPostById(Number(props.id)).then((result) => {
      if (result) {
        post.value = result
      }
    })
  }
}

// 打开视频播放器
function openVideoPlayer() {
  if (!post.value?.video) {
    console.error('没有视频可播放')
    return
  }

  console.log('打开视频播放器', post.value.video)
  currentVideoIndex.value = 0 // 默认从第一个视频开始播放
  showVideoPlayer.value = true
}

// 处理键盘左右键切换图片
function handleKeyPress(e: KeyboardEvent) {
  // 只有当没有视频并且有多张图片时才启用键盘切换
  if (!post.value?.video && post.value?.imgs && post.value.imgs.length > 1) {
    if (e.key === 'ArrowLeft') {
      prevImage()
    } else if (e.key === 'ArrowRight') {
      nextImage()
    }
  }
}

// 切换到上一张图片
function prevImage() {
  if (!post.value?.imgs || post.value.imgs.length <= 1) return

  if (currentImgIndex.value > 0) {
    currentImgIndex.value--
  } else {
    currentImgIndex.value = post.value.imgs.length - 1
  }
}

// 切换到下一张图片
function nextImage() {
  if (!post.value?.imgs || post.value.imgs.length <= 1) return

  if (currentImgIndex.value < post.value.imgs.length - 1) {
    currentImgIndex.value++
  } else {
    currentImgIndex.value = 0
  }
}

// 删除评论
async function handleDeleteComment(commentId: number) {
  if (!commentId || isCommentDeleting.value) return

  if (!confirm('确定要删除这条评论吗？')) return

  isCommentDeleting.value = commentId

  try {
    const result = await deleteComment(commentId)
    if (result) {
      // 删除成功，更新评论列表
      if (post.value && post.value.comments) {
        // 查找并删除评论
        post.value.comments = post.value.comments.filter((comment) => {
          // 过滤主评论
          if (comment.id === commentId) return false

          // 过滤回复评论
          if (comment.reply) {
            comment.reply = comment.reply.filter((reply) => reply.id !== commentId)
          }

          return true
        })

        // 更新评论计数
        commentCount.value = post.value.comments.length
      }
    } else {
      alert('删除评论失败')
    }
  } catch (error) {
    console.error('删除评论失败:', error)
    alert('删除评论失败，请稍后重试')
  } finally {
    isCommentDeleting.value = null
  }
}

onMounted(async () => {
  // 从localStorage获取当前用户信息
  try {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      currentUserId.value = userInfo.userId ? Number(userInfo.userId) : null
      console.log('当前用户ID:', currentUserId.value)
    } else {
      console.log('未找到用户信息')
    }
  } catch (error) {
    console.error('解析用户信息失败:', error)
  }

  if (props.id) {
    const result = await getPostById(Number(props.id))
    if (result) {
      post.value = result

      // 如果帖子有视频，预先处理视频相关逻辑
      if (result.video) {
        console.log('帖子包含视频:', result.video)
      }
    } else {
      console.error('帖子不存在或获取失败')
      router.back()
    }
  }

  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyPress)
})

// 在组件卸载时移除键盘事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
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
  () => post.value?.comments ?? [],
  (newComments) => {
    commentCount.value = newComments.length
  },
  { immediate: true },
)

// 收藏帖子
async function toggleFavorite(id?: number) {
  if (!id || !post.value || isFavoriteLoading.value) return

  isFavoriteLoading.value = true
  const isCurrentlyFavorited = post.value.isFav
  const originalFavCount = post.value.fav

  // 乐观更新 UI
  if (post.value) {
    post.value.isFav = !isCurrentlyFavorited
    post.value.fav += isCurrentlyFavorited ? -1 : 1
  }

  try {
    // 根据当前状态选择 API
    const result = isCurrentlyFavorited ? await unfavoritePost(id) : await favoritePost(id)
    console.log('收藏操作结果:', result)
    // 显示成功提示
    // alert(isCurrentlyFavorited ? '取消收藏成功' : '收藏成功')
  } catch (error) {
    console.error('收藏操作失败:', error)

    // 失败时回滚到原始状态
    if (post.value) {
      post.value.isFav = isCurrentlyFavorited
      post.value.fav = originalFavCount
    }

    // 显示错误提示
    // alert(isCurrentlyFavorited ? '取消收藏失败' : '收藏失败')
  } finally {
    isFavoriteLoading.value = false
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
  } else if (post.value) {
    sendComment(post.value.id, commentText.value, 'post')
  }
}
//点击他人头像
function otherUser(id: number) {
  router.push({ path: `/user/${id}` })
}

// 切换二级评论的展开/收起状态
function toggleReplies(commentId: number) {
  if (expandedComments.value.includes(commentId)) {
    // 如果已展开，则收起
    expandedComments.value = expandedComments.value.filter((id) => id !== commentId)
  } else {
    // 如果未展开，则展开
    expandedComments.value.push(commentId)
  }
}

// 处理来自视频播放器的帖子变更
function handlePostChanged(updatedPost: PostDetail) {
  console.log('接收到视频播放器帖子更新:', updatedPost)

  // 如果是当前帖子，直接更新
  if (post.value && updatedPost.id === post.value.id) {
    post.value = updatedPost
    return
  }

  // 如果是新的帖子，导航到该帖子的详情页
  // 可以选择多种方式：
  // 1. 直接替换当前帖子
  post.value = updatedPost

  // 2. 或者导航到新的详情页（取消注释以启用）
  // goDetail(updatedPost.id)
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
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  margin: 0 auto;
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
  border-color: #ff2d55;
}

.thumbnail:hover {
  transform: scale(1.05);
}

/* 视频容器样式 */
.video-container {
  width: 100%;
  height: calc(100% - 70px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  background-color: #000;
}

.video-error-message {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  max-width: 80%;
  text-align: center;
  z-index: 5;
}

.main-video {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}

/* 视频播放按钮 */
.video-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: 0.8;
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.video-container:hover .video-play-button {
  opacity: 1;
  border: 2px solid #ff2d55;
}

.thumbnail.placeholder {
  background: #333;
}

/* 图片容器和导航按钮 */
.image-container {
  position: relative;
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
}

.img-navigation {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none; /* 让点击事件穿透到底层图片 */
}

.nav-arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto; /* 允许点击 */
  opacity: 0.7;
  transition: opacity 0.3s;
  margin: 0 16px;
}

.nav-arrow:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.7);
}

.nav-arrow.prev {
  left: 16px;
}

.nav-arrow.next {
  right: 16px;
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

.author-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.edit-btn,
.delete-btn {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #f0f0f0;
  color: #333;
}

.edit-btn:hover {
  background: #e0e0e0;
}

.delete-btn {
  background: #ffeded;
  color: #ff2d55;
}

.delete-btn:hover {
  background: #ffe0e0;
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
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  position: relative;
}

.tag {
  background: #f8f8f8;
  color: #666;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  margin-bottom: 4px;
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

.view-replies {
  cursor: pointer;
  color: #007bff;
}

.view-replies:hover {
  text-decoration: underline;
}

/* 二级评论样式 */
.replies-container {
  margin-top: 10px;
  padding-left: 15px;
  border-left: 2px solid #f0f0f0;
}

.reply-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.reply-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  cursor: pointer;
}

.reply-content {
  flex: 1;
}

.reply-user {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 3px;
}

.reply-text {
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  margin-bottom: 4px;
}

.reply-actions {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #999;
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

/* 未点赞状态 - 轮廓图标 */
.far.like-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
}
/*
/* 已点赞状态 - 实心图标，颜色变为红色 */
.fas.like-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff2d55'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
}
.fav-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E");
  transition: transform 0.2s ease;
}

.fav-icon:hover {
  transform: scale(1.1);
}

.fav-icon.active {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff2d55'%3E%3Cpath d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E");
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

/* 收藏按钮加载动画 */
.fav-icon.loading {
  opacity: 0.7;
  pointer-events: none;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 删除按钮样式 */
.delete {
  color: #ff4d4f;
  margin-left: 15px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.delete:hover {
  opacity: 0.8;
}

.delete.deleting {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式样式 */
@media screen and (max-width: 768px) {
  .post-tags {
    flex-direction: column;
    align-items: flex-start;
  }

  .author-actions {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
