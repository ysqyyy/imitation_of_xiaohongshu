<template>
  <div class="modal-mask" @click.self="close">
    <div class="publish-container">
      <!-- 左侧图片集 -->
      <div class="image-section">
        <!-- 上传类型切换 -->
        <div class="upload-type-selector">
          <button
            class="type-btn"
            :class="{ active: contentType === 'image' }"
            @click="switchContentType('image')"
          >
            图片
          </button>
          <button
            class="type-btn"
            :class="{ active: contentType === 'video' }"
            @click="switchContentType('video')"
          >
            视频
          </button>
        </div>

        <!-- 主图/视频区域 -->
        <div class="main-content-container">
          <!-- 视频上传/显示 -->
          <div v-if="contentType === 'video'" class="video-container">
            <video
              v-if="videoFile"
              :src="videoUrl"
              class="main-video"
              controls
              ref="videoPreview"
            ></video>
            <div v-else class="upload-placeholder" @click="triggerVideoUpload">
              <div class="upload-icon">+</div>
              <div>点击上传视频</div>
            </div>
            <input
              type="file"
              ref="videoInput"
              accept="video/*"
              style="display: none"
              @change="handleVideoUpload"
            />
            <div v-if="videoFile" class="remove-video" @click="removeVideo">删除视频</div>
          </div>

          <!-- 图片上传/显示 -->
          <div v-else class="image-display">
            <img
              v-if="selectedImages.length > 0"
              :src="selectedImages[currentImgIndex]"
              class="main-image"
            />
            <div v-else class="upload-placeholder" @click="triggerImageUpload">
              <div class="upload-icon">+</div>
              <div>点击上传图片</div>
            </div>
            <input
              type="file"
              ref="fileInput"
              multiple
              accept="image/*"
              style="display: none"
              @change="handleImageUpload"
            />
          </div>
        </div>

        <!-- 缩略图集 (仅图片模式显示) -->
        <div v-if="contentType === 'image'" class="thumbnails">
          <div
            v-for="(img, id) in selectedImages"
            :key="id"
            class="thumbnail"
            :class="{ active: id === currentImgIndex }"
            @click="currentImgIndex = id"
          >
            <img :src="img" class="thumbnail-img" />
            <div class="remove-img" @click.stop="removeImage(id)">×</div>
          </div>
          <div v-if="selectedImages.length < 9" class="add-more" @click="triggerImageUpload">
            <div class="plus-icon">+</div>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-container">
        <h2 class="section-title">{{ editMode ? '编辑笔记' : '创建笔记' }}</h2>

        <!-- 标题输入 -->
        <div class="input-group">
          <label for="title">标题</label>
          <input
            id="title"
            v-model="postData.title"
            class="input-field"
            placeholder="添加标题，让更多人看到你的笔记"
            maxlength="30"
          />
          <div class="char-count">{{ postData.title.length }}/30</div>
        </div>

        <!-- 内容输入 -->
        <div class="input-group">
          <label for="content">内容</label>
          <textarea
            id="content"
            v-model="postData.content"
            class="textarea-field"
            placeholder="分享你的故事、经验或想法..."
            maxlength="1000"
            rows="8"
          ></textarea>
          <div class="char-count">{{ postData.content.length }}/1000</div>
        </div>

        <!-- 标签输入 -->
        <div class="input-group">
          <label for="tags">标签</label>
          <div class="tags-container">
            <div v-for="(tag, index) in postData.tags" :key="index" class="tag">
              # {{ tag }}
              <span class="remove-tag" @click="removeTag(index)">×</span>
            </div>
            <input
              v-if="postData.tags.length < 5"
              v-model="newTag"
              class="tag-input"
              placeholder="添加标签..."
              @keyup.enter="addTag"
            />
          </div>
          <div class="hint-text">最多添加5个标签，按回车确认</div>
        </div>

        <!-- 隐私设置 -->
        <div class="privacy-setting">
          <label>
            <input type="checkbox" v-model="postData.private" />
            <span>设为私密笔记</span>
          </label>
        </div>

        <!-- 底部按钮 -->
        <div class="action-buttons">
          <button class="cancel-btn" @click="close">取消</button>
          <button class="publish-btn" @click="submitPost" :disabled="!canPublish || publishing">
            {{ publishing ? (editMode ? '保存中...' : '发布中...') : editMode ? '保存' : '发布' }}
          </button>
        </div>
      </div>

      <!-- 关闭按钮 -->
      <button class="close-btn" @click="close">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, onMounted } from 'vue'
import { publishPost as apiPublishPost, editPost as apiEditPost } from '../api/detail'

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

// 图片上传相关
const fileInput = ref<HTMLInputElement | null>(null)
const videoInput = ref<HTMLInputElement | null>(null)
const selectedImages = ref<string[]>([])
const imageFiles = ref<File[]>([]) // 存储实际的图片文件对象
const currentImgIndex = ref(0)

// 视频上传相关
const videoFile = ref<File | null>(null)
const videoUrl = ref<string>('')
const videoPreview = ref<HTMLVideoElement | null>(null)

// 内容类型（图片/视频）
const contentType = ref<'image' | 'video'>('image')

// 帖子数据
const postData = ref({
  title: '',
  content: '',
  tags: [] as string[],
  private: false,
})

// 标签输入
const newTag = ref('')

// 发布状态
const publishing = ref(false)
const postId = ref<number | null>(null)

// 判断是否可以发布
const canPublish = computed(() => {
  const hasContent =
    (contentType.value === 'image' && selectedImages.value.length > 0) ||
    (contentType.value === 'video' && videoFile.value !== null)

  return hasContent && postData.value.title.trim() !== '' && postData.value.content.trim() !== ''
})

// 初始化表单数据
onMounted(() => {
  // 如果是编辑模式，从localStorage获取数据
  if (props.editMode) {
    const savedData = localStorage.getItem('editPostData')
    if (savedData) {
      try {
        const editData = JSON.parse(savedData)
        postData.value.title = editData.title || ''
        postData.value.content = editData.content || ''
        postData.value.tags = editData.tags || []
        postData.value.private = editData.private || false
        postId.value = editData.id || null

        // 检查内容类型
        if (editData.video) {
          // 如果有视频，则设置为视频类型
          contentType.value = 'video'
          videoUrl.value = editData.video
          // 由于是编辑模式，我们不需要实际的 File 对象
          // 只需要URL来显示视频
          videoFile.value = new File([], 'placeholder.mp4', { type: 'video/mp4' })
        } else {
          // 否则设置为图片类型
          contentType.value = 'image'
          selectedImages.value = editData.imgs || []
        }

        // 清除localStorage中的数据，避免下次打开时仍然存在
        localStorage.removeItem('editPostData')
      } catch (error) {
        console.error('解析编辑数据失败:', error)
      }
    }
  }
})

// 切换内容类型（图片/视频）
function switchContentType(type: 'image' | 'video') {
  // 如果已经有内容，提示用户
  if (
    (contentType.value === 'image' && selectedImages.value.length > 0 && type === 'video') ||
    (contentType.value === 'video' && videoFile.value && type === 'image')
  ) {
    if (!confirm('切换内容类型将清空已上传的内容，确定要切换吗？')) {
      return
    }
    // 清空内容
    if (type === 'video') {
      selectedImages.value = []
    } else {
      removeVideo()
    }
  }

  contentType.value = type
}

// 触发文件选择
function triggerImageUpload() {
  fileInput.value?.click()
}

// 处理图片上传
function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const remainingSlots = 9 - selectedImages.value.length
    const filesToProcess = Math.min(input.files.length, remainingSlots)

    // 检查图片数量
    if (input.files.length > remainingSlots) {
      alert(`一次最多只能上传${remainingSlots}张图片`)
    }

    // 检查每个文件
    for (let i = 0; i < filesToProcess; i++) {
      const file = input.files[i]

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert(`文件 "${file.name}" 不是有效的图片类型`)
        continue
      }

      // 检查文件大小 (限制为10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`图片 "${file.name}" 大小超过10MB，请压缩后再上传`)
        continue
      }

      const reader = new FileReader()

      reader.onload = (e) => {
        if (e.target?.result) {
          selectedImages.value.push(e.target.result as string)
          imageFiles.value.push(file) // 保存实际的文件对象
        }
      }

      reader.readAsDataURL(file)
    }
  }
}

// 移除图片
function removeImage(index: number) {
  // 释放对象URL
  if (selectedImages.value[index]) {
    URL.revokeObjectURL(selectedImages.value[index])
  }

  selectedImages.value.splice(index, 1)
  imageFiles.value.splice(index, 1) // 同时删除文件对象

  if (currentImgIndex.value >= selectedImages.value.length) {
    currentImgIndex.value = Math.max(0, selectedImages.value.length - 1)
  }
}

// 触发视频选择
function triggerVideoUpload() {
  videoInput.value?.click()
}

// 处理视频上传
function handleVideoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]

    // 检查文件大小（限制为100MB）
    if (file.size > 100 * 1024 * 1024) {
      alert('视频文件过大，请上传小于100MB的视频')
      return
    }

    // 检查文件类型
    if (!file.type.startsWith('video/')) {
      alert('请上传有效的视频文件')
      return
    }

    videoFile.value = file
    videoUrl.value = URL.createObjectURL(file)

    // 重置文件输入，以便可以再次选择同一文件
    input.value = ''
  }
}

// 删除视频
function removeVideo() {
  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value)
  }
  videoFile.value = null
  videoUrl.value = ''
}

// 添加标签
function addTag() {
  const tag = newTag.value.trim()
  if (tag && !postData.value.tags.includes(tag) && postData.value.tags.length < 5) {
    postData.value.tags.push(tag)
    newTag.value = ''
  }
}

// 移除标签
function removeTag(index: number) {
  postData.value.tags.splice(index, 1)
}

// 发布帖子
async function submitPost() {
  if (!canPublish.value || publishing.value) return

  publishing.value = true
  try {
    // 创建 FormData 对象
    const formData = new FormData()

    // 添加基本信息
    formData.append('title', postData.value.title)
    formData.append('content', postData.value.content)

    // 添加标签
    if (postData.value.tags && postData.value.tags.length > 0) {
      formData.append('tags', JSON.stringify(postData.value.tags))
    }

    // 添加私密设置
    formData.append('isPrivate', String(postData.value.private))

    // 如果是编辑模式，添加帖子ID
    if (props.editMode && postId.value) {
      formData.append('id', String(postId.value))
    }

    // 根据内容类型添加不同的数据
    if (contentType.value === 'image') {
      // 图片类型
      formData.append('type', 'image')

      // 添加图片文件
      for (let i = 0; i < imageFiles.value.length; i++) {
        formData.append('images', imageFiles.value[i])
      }

      // 发送请求
      if (props.editMode && postId.value) {
        await apiEditPost(postId.value, formData)
      } else {
        await apiPublishPost(formData)
      }
    } else {
      // 视频类型
      if (videoFile.value) {
        formData.append('type', 'video')
        formData.append('video', videoFile.value)

        // 发送请求
        if (props.editMode && postId.value) {
          await apiEditPost(postId.value, formData)
        } else {
          await apiPublishPost(formData)
        }
      }
    }
    close()
  } catch (error) {
    console.error(props.editMode ? '保存失败:' : '发布失败:', error)
    alert(props.editMode ? '保存失败，请重试' : '发布失败，请重试')
  } finally {
    publishing.value = false
  }
}

// 关闭弹窗
function close() {
  emit('close')
}
</script>

<script lang="ts">
// 添加默认导出以便支持 import 语法
export default {}
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

.publish-container {
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
.image-section {
  flex: 1;
  height: 100%;
  min-width: 45%;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.main-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.main-image {
  max-width: 100%;
  max-height: calc(100% - 80px);
  object-fit: contain;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #aaa;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-placeholder:hover {
  background: #f0f0f0;
  color: #ff2d55;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.thumbnails {
  height: 80px;
  display: flex;
  background: rgba(0, 0, 0, 0.03);
  padding: 10px;
  gap: 8px;
  overflow-x: auto;
}

.thumbnail {
  position: relative;
  height: 60px;
  width: 60px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail.active {
  opacity: 1;
  border: 2px solid #ff2d55;
}

.remove-img {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
}

.add-more {
  height: 60px;
  width: 60px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.plus-icon {
  font-size: 24px;
  color: #aaa;
}

.add-more:hover {
  background: #e0e0e0;
}

.add-more:hover .plus-icon {
  color: #ff2d55;
}

/* 上传类型选择器 */
.upload-type-selector {
  display: flex;
  padding: 10px;
  background: #f8f8f8;
  border-bottom: 1px solid #eee;
}

.type-btn {
  flex: 1;
  padding: 8px 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.type-btn.active {
  background: #ff2d55;
  color: white;
  font-weight: 500;
}

.type-btn:not(.active):hover {
  background: #f0f0f0;
}

/* 主内容容器 */
.main-content-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #f8f8f8;
  overflow: hidden;
}

/* 视频容器 */
.video-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.main-video {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.remove-video {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-video:hover {
  background: rgba(255, 0, 0, 0.7);
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

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.input-field,
.textarea-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  background: #fafbfc;
  transition: border 0.2s;
}

.textarea-field {
  resize: none;
  min-height: 150px;
}

.input-field:focus,
.textarea-field:focus {
  border-color: #ff2d55;
  outline: none;
}

.char-count {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 12px;
  color: #aaa;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 8px;
  min-height: 46px;
  background: #fafbfc;
}

.tag {
  display: flex;
  align-items: center;
  background: #f0f0f0;
  color: #666;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 14px;
}

.tag-input {
  flex: 1;
  min-width: 100px;
  border: none;
  background: transparent;
  padding: 4px;
  font-size: 14px;
  outline: none;
}

.remove-tag {
  margin-left: 6px;
  cursor: pointer;
  font-size: 16px;
}

.remove-tag:hover {
  color: #ff2d55;
}

.hint-text {
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
}

.privacy-setting {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.privacy-setting label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.privacy-setting input {
  margin-right: 8px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: auto;
  padding-top: 20px;
}

.cancel-btn,
.publish-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.publish-btn {
  background: #ff2d55;
  color: white;
}

.publish-btn:hover:not(:disabled) {
  background: #ff1744;
}

.publish-btn:disabled {
  background: #ffb2c2;
  cursor: not-allowed;
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
