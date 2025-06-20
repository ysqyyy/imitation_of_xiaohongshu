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

                <!-- 评论图片 -->
                <div v-if="comment.imageUrl" class="comment-image">
                  <img
                    :src="comment.imageUrl"
                    alt="评论图片"
                    @click="previewImage(comment.imageUrl)"
                  />
                </div>

                <div class="comment-actions">
                  <span class="time">{{ comment.time }}</span>
                  <LikeButton
                    type="comment"
                    :id="comment.id"
                    :initial-like-count="comment.like"
                    :initial-is-liked="comment.isLike"
                  >
                    <template #icon="{ isLiked, likeCount }">
                      <i class="comment-like-icon" :class="isLiked ? 'liked' : ''">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path
                            d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
                          />
                        </svg>
                      </i>
                      <span>{{ likeCount }}</span>
                    </template>
                  </LikeButton>
                  <span class="reply" @click="replyComment(comment)">
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="currentColor"
                      class="reply-icon"
                    >
                      <path
                        d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20V16Z"
                      />
                    </svg>
                    回复
                  </span>
                  <span
                    v-if="comment.author.id === currentUserId"
                    class="delete"
                    :class="{ deleting: isCommentDeleting === comment.id }"
                    @click="handleDeleteComment(comment.id)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="currentColor"
                      class="delete-icon"
                    >
                      <path
                        d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                      />
                    </svg>
                    {{ isCommentDeleting === comment.id ? '删除中...' : '删除' }}
                  </span>
                  <span
                    v-if="comment.reply && comment.reply.length > 0"
                    class="view-replies"
                    @click="toggleReplies(comment.id)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="currentColor"
                      class="replies-icon"
                    >
                      <path
                        d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
                        v-if="expandedComments.includes(comment.id)"
                      />
                      <path
                        d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
                        v-else
                      />
                    </svg>
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
                      <div class="reply-text">
                        <span v-if="getReplyParentName(reply)" class="reply-to"
                          >回复 <span class="parent-name">@{{ getReplyParentName(reply) }}</span
                          >：</span
                        >
                        {{ reply.content }}
                      </div>

                      <!-- 回复图片 -->
                      <div v-if="reply.imageUrl" class="reply-image">
                        <img
                          :src="reply.imageUrl"
                          alt="回复图片"
                          @click="previewImage(reply.imageUrl)"
                        />
                      </div>

                      <div class="reply-actions">
                        <span class="time">{{ reply.time }}</span>
                        <LikeButton
                          type="comment"
                          :id="reply.id"
                          :initial-like-count="reply.like"
                          :initial-is-liked="reply.isLike"
                        >
                          <template #icon="{ isLiked, likeCount }">
                            <i class="comment-like-icon" :class="isLiked ? 'liked' : ''">
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path
                                  d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
                                />
                              </svg>
                            </i>
                            <span>{{ likeCount }}</span>
                          </template>
                        </LikeButton>
                        <span class="reply" @click="replyComment(reply)">
                          <svg
                            viewBox="0 0 24 24"
                            width="12"
                            height="12"
                            fill="currentColor"
                            class="reply-icon"
                          >
                            <path
                              d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20V16Z"
                            />
                          </svg>
                          回复
                        </span>
                        <span
                          v-if="reply.author.id === currentUserId"
                          class="delete"
                          :class="{ deleting: isCommentDeleting === reply.id }"
                          @click="handleDeleteComment(reply.id)"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="12"
                            height="12"
                            fill="currentColor"
                            class="delete-icon"
                          >
                            <path
                              d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                            />
                          </svg>
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
              @keyup.enter="submitComment"
            />
            <div class="comment-actions">
              <label for="comment-image" class="image-upload-btn">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </label>
              <input
                type="file"
                id="comment-image"
                class="image-input"
                accept="image/*"
                @change="handleCommentImageChange"
              />
              <button class="send-btn" @click="submitComment">发送</button>
            </div>

            <!-- 预览已选择的图片 -->
            <div v-if="commentImage" class="image-preview">
              <img :src="commentImagePreview" alt="预览图片" />
              <button class="remove-image-btn" @click="removeCommentImage">×</button>
            </div>
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
                  <i class="icon like-icon" :class="isLiked ? 'fas' : 'far'">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path
                        d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
                      />
                    </svg>
                  </i>
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
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path
                    d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5A2,2 0 0,0 17,3M17,18L12,15.82L7,18V5H17V18Z"
                    v-if="!post?.isFav"
                  />
                  <path
                    d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5A2,2 0 0,0 17,3Z"
                    v-if="post?.isFav"
                  />
                </svg>
              </i>
              <span>{{ post?.isFav ? '已收藏' : '收藏' }} {{ post?.fav || 0 }}</span>
            </div>
            <div class="action-btn">
              <i class="icon comment-icon" @click="replyPost()">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path
                    d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20V16Z"
                  />
                </svg>
              </i>
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
const commentImage = ref<File | null>(null) // 评论图片文件
const commentImagePreview = ref<string>('') // 评论图片预览

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
    video: post.value.video || '',
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
      if (result) {
        alert('删除成功')
        close() // 关闭详情页
        // 可能还需要刷新列表页
        router.go(0) // 刷新页面
      } else {
        alert('删除失败：' + '未知错误')
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

// 图片预览函数
function previewImage(url: string) {
  // 可以实现一个简单的全屏预览，或者使用第三方库
  // 这里实现简单的预览方式
  const img = new Image()
  img.src = url
  img.style.position = 'fixed'
  img.style.top = '0'
  img.style.left = '0'
  img.style.width = '100vw'
  img.style.height = '100vh'
  img.style.objectFit = 'contain'
  img.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  img.style.zIndex = '10000'
  img.style.cursor = 'pointer'

  // 点击关闭预览
  img.onclick = () => {
    document.body.removeChild(img)
  }

  document.body.appendChild(img)
}

// 处理评论图片选择
function handleCommentImageChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 检查文件大小，限制为2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }

    commentImage.value = file

    // 创建图片预览
    const reader = new FileReader()
    reader.onload = (e) => {
      commentImagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 移除评论图片
function removeCommentImage() {
  commentImage.value = null
  commentImagePreview.value = ''

  // 重置文件输入
  const fileInput = document.getElementById('comment-image') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
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
      // console.log('获取到帖子2:', post.value.imgs, post.value.content)
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

  // 额外存储被回复者的信息到本地存储，以便发送评论后能访问
  if (comment.author && comment.author.name) {
    localStorage.setItem('lastReplyToName', comment.author.name)
  }

  setTimeout(() => {
    const input = document.querySelector('.comment-input') as HTMLInputElement
    input?.focus()
  }, 100)
}

// 分析评论内容，判断是否是回复某人，并返回回复的用户名
function getReplyParentName(reply: Comment): string | null {
  // 如果有replyTo标记，则说明是二级回复
  if (post.value && post.value.comments) {
    // 检查每个主评论
    for (const comment of post.value.comments) {
      // 如果这个回复是属于当前评论的
      if (comment.reply && comment.reply.some((r) => r.id === reply.id)) {
        // 这里假设回复的是主评论
        return comment.author.name
      }
    }
  }

  // 如果无法确定，返回null
  return null
}

// 提交评论（评论/帖子）
async function submitComment() {
  if (!commentText.value.trim()) return

  // 添加提交中的状态变量和按钮禁用
  const isSubmitting = ref(true)

  // 获取发送按钮和输入框元素
  const sendButton = document.querySelector('.send-btn') as HTMLButtonElement
  const commentInput = document.querySelector('.comment-input') as HTMLInputElement

  // 禁用按钮和输入框，防止重复提交
  if (sendButton) {
    sendButton.disabled = true
    sendButton.textContent = '发送中...'
  }
  if (commentInput) {
    commentInput.disabled = true
    commentInput.classList.add('submitting')
  }

  let result = null
  try {
    const formData = new FormData()
    formData.append('content', commentText.value)
    if (commentImage.value) {
      if (commentImage.value) {
        formData.append('images', commentImage.value)
      }
    }

    if (replyTarget.value) {
      formData.append('id', replyTarget.value.id.toString())
      result = await sendComment(formData, 'comment')
      replyTarget.value = null
    } else if (post.value) {
      formData.append('id', post.value.id.toString())
      result = await sendComment(formData, 'post')
    }

    // 评论成功后清空输入框和图片
    commentText.value = ''
    removeCommentImage()

    // 评论成功后刷新帖子详情，获取最新评论
    if (result && post.value) {
      // 添加一个临时的评论区刷新动画
      const commentsSection = document.querySelector('.comments-section')
      if (commentsSection) {
        // 添加刷新动画
        commentsSection.classList.add('refreshing')

        // 重新获取帖子详情，包括最新评论
        const updatedPost = await getPostById(post.value.id)
        if (updatedPost) {
          post.value = updatedPost
          console.log('评论成功，已刷新帖子详情')

          // 滚动到评论区最底部，显示新评论
          setTimeout(() => {
            commentsSection.scrollTop = commentsSection.scrollHeight

            // 高亮显示最新评论
            const allComments = document.querySelectorAll('.comment-item')
            if (allComments.length > 0) {
              const lastComment = allComments[allComments.length - 1]
              lastComment.classList.add('new-comment-highlight')

              // 移除高亮效果
              setTimeout(() => {
                lastComment.classList.remove('new-comment-highlight')
              }, 3000)
            }
          }, 300)

          // 添加评论成功的反馈提示
          const successToast = document.createElement('div')
          successToast.className = 'comment-success-toast'
          successToast.textContent = '评论发布成功'
          document.body.appendChild(successToast)

          // 2秒后移除提示
          setTimeout(() => {
            successToast.classList.add('fade-out')
            setTimeout(() => {
              document.body.removeChild(successToast)
            }, 300)
          }, 2000)

          // 移除刷新动画
          setTimeout(() => {
            commentsSection.classList.remove('refreshing')
          }, 500)

          // 如果是回复评论，自动展开原评论的回复区域
          if (replyTarget.value && post.value && post.value.comments) {
            // 寻找父评论并展开
            for (const comment of post.value.comments) {
              if (
                comment.reply &&
                comment.reply.some((reply) => reply.id === replyTarget.value?.id)
              ) {
                if (!expandedComments.value.includes(comment.id)) {
                  expandedComments.value.push(comment.id)
                }
                break
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('提交评论失败:', error)
    // 显示错误提示
    const errorToast = document.createElement('div')
    errorToast.className = 'comment-success-toast'
    errorToast.style.backgroundColor = 'rgba(255, 59, 48, 0.9)'
    errorToast.textContent = '评论发布失败，请重试'
    document.body.appendChild(errorToast)

    // 2秒后移除提示
    setTimeout(() => {
      errorToast.classList.add('fade-out')
      setTimeout(() => {
        document.body.removeChild(errorToast)
      }, 300)
    }, 2000)
  } finally {
    isSubmitting.value = false

    // 恢复按钮和输入框
    if (sendButton) {
      sendButton.disabled = false
      sendButton.textContent = '发送'
    }
    if (commentInput) {
      commentInput.disabled = false
      commentInput.classList.remove('submitting')
      setTimeout(() => {
        commentInput.focus() // 重新获取焦点以便继续输入
      }, 100)
    }
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
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.detail-container {
  display: flex;
  width: 90%;
  max-width: 1100px;
  height: 85vh;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

@keyframes pop-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 左侧图片/视频区域 */
.image {
  flex: 1.2;
  height: 100%;
  min-width: 40%;
  background: #000;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.image-container,
.video-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111;
  position: relative;
  overflow: hidden;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.main-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.video-error-message {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  backdrop-filter: blur(5px);
  border-radius: 8px;
  margin: 0 20px;
}

.video-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(3px);
  opacity: 0.8;
}

.video-play-button:hover {
  background: rgba(255, 45, 85, 0.8);
  transform: translate(-50%, -50%) scale(1.1);
  opacity: 1;
}

.img-navigation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}

.nav-arrow {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s;
  opacity: 0.7;
  margin: 0 16px;
  backdrop-filter: blur(2px);
}

.nav-arrow:hover {
  background: rgba(255, 45, 85, 0.7);
  transform: scale(1.1);
  opacity: 1;
}

.thumbnails {
  height: 80px;
  background: #222;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.thumbnails::-webkit-scrollbar {
  height: 5px;
}

.thumbnails::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.thumbnail {
  height: 60px;
  width: 60px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.thumbnail:hover {
  opacity: 0.8;
}

.thumbnail.active {
  opacity: 1;
  border: 2px solid #ff2d55;
  transform: scale(1.05);
}

/* 右侧内容区域 */
.content-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  position: relative;
  padding-top: 0;
}

/* 作者信息 */
.author-info {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f5;
  background: linear-gradient(to right, #fff, #fafafa);
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 2px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar:hover {
  transform: scale(1.05);
}

.author-name {
  font-weight: 600;
  margin-left: 12px;
  flex: 1;
  font-size: 16px;
  color: #333;
}

/* 帖子内容 */
.post-content {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 0 0 auto;
  border-bottom: 1px solid #f5f5f5;
  max-height: 30%;
}

.post-content::-webkit-scrollbar {
  width: 5px;
}

.post-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.post-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
  color: #333;
}

.post-text {
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  margin-bottom: 16px;
  white-space: pre-line;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  position: relative;
}

.tag {
  background: #f7f7f7;
  color: #666;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  margin-bottom: 4px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tag:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

/* 作者编辑删除按钮 */
.author-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: #f0f0f0;
  color: #666;
}

.edit-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.delete-btn {
  background: #ffebee;
  color: #ff2d55;
}

.delete-btn:hover {
  background: #ffdce0;
  transform: translateY(-2px);
}

/* 评论区 */
.comments-section {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: #fafafa;
  border-radius: 16px 16px 0 0;
  margin-top: -10px;
  z-index: 1;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  position: relative;
}

/* 评论区刷新动画 */
.comments-section.refreshing {
  opacity: 0.7;
  animation: refresh-pulse 1s ease;
}

@keyframes refresh-pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* 评论成功提示 */
.comment-success-toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(56, 179, 84, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  animation: toast-in 0.3s ease;
  transition: all 0.3s ease;
}

.comment-success-toast.fade-out {
  opacity: 0;
  transform: translate(-50%, 20px);
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.comment-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  display: inline-block;
  position: relative;
}

.comment-title:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  height: 2px;
  width: 30px;
  background: #ff2d55;
  border-radius: 2px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s;
}

.comment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.comment-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
}

.comment-text {
  font-size: 14px;
  line-height: 1.5;
  color: #444;
  margin-bottom: 8px;
  white-space: pre-line;
}

.comment-actions {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
  align-items: center;
}

.time {
  color: #aaa;
}

.reply,
.delete,
.view-replies {
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.reply:hover {
  color: #007bff;
}

.delete {
  color: #ff5252;
  display: inline-flex;
  align-items: center;
}

.delete-icon {
  margin-right: 3px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  top: -1px;
}

.view-replies {
  color: #666;
  font-weight: 500;
  margin-left: auto;
}

.view-replies:hover {
  color: #007bff;
}

/* 评论区图标样式 */
.comment-like-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin-right: 3px;
  color: #999;
}

.comment-like-icon.liked {
  color: #ff2d55;
}

.reply-icon,
.replies-icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
  position: relative;
  top: -1px;
}

.reply {
  display: inline-flex;
  align-items: center;
}

.view-replies {
  display: inline-flex;
  align-items: center;
}

/* 二级评论样式 */
.replies-container {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 12px;
  border-left: 3px solid #e1e5eb;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reply-item {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  transition: background 0.2s;
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-item:hover {
  background: rgba(255, 255, 255, 0.9);
}

.reply-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.reply-content {
  flex: 1;
}

.reply-user {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 4px;
  color: #333;
}

.reply-text {
  font-size: 13px;
  line-height: 1.5;
  color: #444;
  margin-bottom: 6px;
  white-space: pre-line;
}

.reply-actions {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #999;
  align-items: center;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 15px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

/* 底部交互栏 */
footer {
  padding: 16px 24px;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 2;
}

.comment-input-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  position: relative;
}

.comment-input {
  flex: 1;
  padding: 12px 18px;
  border: 1px solid #eee;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  background: #f8f8f8;
  transition: all 0.3s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.comment-actions {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.image-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #333;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.2s;
}

.image-upload-btn:hover {
  color: #ff2d55;
  background-color: #f0f0f0;
}

.image-input {
  display: none;
}

.image-preview {
  margin-top: 10px;
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.comment-input:focus {
  border-color: #ff2d55;
  background: white;
  box-shadow: 0 3px 10px rgba(255, 45, 85, 0.1);
}

/* 评论输入动画效果 */
.comment-input.submitting {
  background: #f0f0f0;
  pointer-events: none;
}

/* 评论区滚动动画 */
@keyframes scroll-to-bottom {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.new-comment-highlight {
  animation: scroll-to-bottom 0.5s ease-out;
  box-shadow: 0 0 15px rgba(255, 45, 85, 0.2);
}

.send-btn {
  margin-left: 10px;
  padding: 0 20px;
  background: #ff2d55;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(255, 45, 85, 0.2);
  position: relative;
  overflow: hidden;
}

.send-btn:hover {
  background: #ff0044;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 45, 85, 0.3);
}

.send-btn:disabled {
  background: #ffb0c1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.send-btn:disabled::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: loading-shine 1.5s infinite;
}

@keyframes loading-shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f5f5f5;
  padding-top: 16px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 10px 20px;
  border-radius: 10px;
}

.action-btn:hover {
  color: #ff2d55;
  background: #fff5f7;
  transform: translateY(-2px);
}

.icon {
  font-size: 22px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.like-icon.fas {
  color: #ff2d55;
}

.like-icon.far:hover {
  color: #ff2d55;
}

.fav-icon.active {
  color: #ff9500;
}

.fav-icon.loading {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.comment-icon:hover {
  color: #007bff;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.close-btn:hover {
  background: #fff;
  color: #ff2d55;
  transform: rotate(90deg);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
}

.reply-to {
  color: #999;
  font-size: 0.9em;
  margin-right: 4px;
}

.parent-name {
  color: #007bff;
  font-weight: 500;
}

/* 评论图片样式 */
.comment-image {
  margin-top: 8px;
  margin-bottom: 8px;
  max-width: 250px;
  border-radius: 8px;
  overflow: hidden;
}

.comment-image img {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.comment-image img:hover {
  transform: scale(1.02);
}

/* 回复图片样式 */
.reply-image {
  margin-top: 6px;
  margin-bottom: 6px;
  max-width: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.reply-image img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.reply-image img:hover {
  transform: scale(1.02);
}
</style>
