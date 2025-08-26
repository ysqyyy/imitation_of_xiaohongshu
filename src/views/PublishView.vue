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

        <!-- 标签选择 -->
        <div class="input-group">
          <label for="tags">标签</label>
          <div class="tags-selector">
            <!-- 已选择的标签 -->
            <div class="selected-tags">
              <div v-for="(tag, index) in postData.tags" :key="index" class="tag">
                # {{ tag }}
                <span class="remove-tag" @click="removeTag(index)">×</span>
              </div>
            </div>

            <!-- 标签选择列表 -->
            <div class="tag-options">
              <div
                v-for="tag in availableTags"
                :key="tag"
                class="tag-option"
                :class="{ selected: postData.tags.includes(tag) }"
                @click="toggleTag(tag)"
              >
                # {{ tag }}
              </div>
            </div>
          </div>
          <div class="hint-text">最多选择5个标签</div>
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
import { checkContentSafety, escapeHTML, type ContentCheckResult } from '../utils/contentFilter'
import { getSecurityConfig } from '../utils/securityConfig'

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

// 定义可用的标签列表
const availableTags = ref(['美食', '旅行', '穿搭', '数码', '学习', '娱乐', '生活'])

// 发布状态
const publishing = ref(false)
const postId = ref<number | null>(null)

// 内容安全检查相关
const contentErrors = ref<ContentCheckResult | null>(null)
const titleErrors = ref<ContentCheckResult | null>(null)
const securityConfig = getSecurityConfig()

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

// 验证所有内容
function validateContent() {
  titleErrors.value = checkContentSafety(postData.value.title, securityConfig.maxTitleLength)
  contentErrors.value = checkContentSafety(postData.value.content, securityConfig.maxContentLength)
}

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
    const remainingSlots = securityConfig.maxImageCount - selectedImages.value.length
    const filesToProcess = Math.min(input.files.length, remainingSlots)

    // 检查图片数量
    if (input.files.length > remainingSlots) {
      alert(`一次最多只能上传${remainingSlots}张图片`)
    }

    // 检查每个文件
    for (let i = 0; i < filesToProcess; i++) {
      const file = input.files[i]
      // 检查文件类型
      if (!securityConfig.allowedImageTypes.includes(file.type)) {
        alert(`文件 "${file.name}" 不是支持的图片类型`)
        continue
      }

      // 检查文件大小
      if (file.size > securityConfig.maxImageSize) {
        alert(
          `图片 "${file.name}" 大小超过${Math.round(securityConfig.maxImageSize / 1024 / 1024)}MB，请压缩后再上传`,
        )
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

    // 检查文件类型
    if (!securityConfig.allowedVideoTypes.includes(file.type)) {
      alert('请上传支持的视频文件格式 (MP4, AVI, MOV, WMV)')
      return
    }

    // 检查文件大小
    if (file.size > securityConfig.maxVideoSize) {
      alert(
        `视频文件过大，请上传小于${Math.round(securityConfig.maxVideoSize / 1024 / 1024)}MB的视频`,
      )
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

// 切换标签选择状态
function toggleTag(tag: string) {
  // 如果标签已经被选中，则移除
  if (postData.value.tags.includes(tag)) {
    const index = postData.value.tags.indexOf(tag)
    removeTag(index)
  }
  // 如果标签未被选中且未达到上限，则添加
  else if (postData.value.tags.length < 5) {
    postData.value.tags.push(tag)
  }
}

// 移除标签
function removeTag(index: number) {
  postData.value.tags.splice(index, 1)
}

// 发布帖子
async function submitPost() {
  if (!canPublish.value || publishing.value) return
  validateContent()

  if (!contentErrors.value?.isValid || !titleErrors.value?.isValid) {
    const errorMsg =
      contentErrors.value?.errorMessage ||
      titleErrors.value?.errorMessage ||
      '内容包含不当信息，请修改后重试'
    alert(errorMsg)
    return
  }

  publishing.value = true
  try {
    const formData = new FormData()
    // 对用户输入进行转义处理
    formData.append('title', escapeHTML(postData.value.title.trim()))
    formData.append('content', escapeHTML(postData.value.content.trim()))

    if (postData.value.tags && postData.value.tags.length > 0) {
      // 去除引号，将标签数组转换为字符串形式 [旅游,]
      const tagsString = postData.value.tags.join(',')
      formData.append('tags', tagsString)
    }
    formData.append('isPrivate', String(postData.value.private))

    // 如果是编辑模式，添加帖子ID
    if (props.editMode && postId.value) {
      formData.append('id', String(postId.value))
    }

    // 根据内容类型添加不同的数据
    if (contentType.value === 'image') {
      // 图片类型
      formData.append('type', 'image')

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
  background: rgba(0, 0, 0, 0.7); /* 更深的背景色提高对比度 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px); /* 添加模糊效果，更现代的UI风格 */
}

.publish-container {
  display: flex;
  width: 90%;
  max-width: 1200px;
  height: 85vh;
  background: #fff;
  border-radius: 20px; /* 增加圆角 */
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25); /* 更深的阴影增加立体感 */
  position: relative;
  animation: fade-in 0.3s ease-out; /* 添加淡入动画 */
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 左侧图片区域 */
.image-section {
  flex: 1;
  height: 100%;
  min-width: 45%;
  background: linear-gradient(to bottom, #f8f8f8, #f0f0f0); /* 渐变背景 */
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
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
  border-radius: 8px; /* 图片添加圆角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* 轻微阴影 */
  transition: transform 0.3s ease; /* 平滑过渡 */
}

.main-image:hover {
  transform: scale(1.02); /* 悬停时微小放大效果 */
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
  transition: all 0.3s;
  border: 2px dashed #ddd; /* 虚线边框 */
  border-radius: 12px;
  margin: 20px;
}

.upload-placeholder:hover {
  background: #f3f3f3;
  color: #ff2d55;
  border-color: #ff2d55;
}

.upload-icon {
  font-size: 52px; /* 更大的图标 */
  margin-bottom: 15px;
  opacity: 0.8;
}

.thumbnails {
  height: 90px; /* 略微增加高度 */
  display: flex;
  background: rgba(0, 0, 0, 0.03);
  padding: 12px;
  gap: 10px;
  overflow-x: auto;
  border-top: 1px solid #eee;
}

.thumbnails::-webkit-scrollbar {
  height: 4px;
}

.thumbnails::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.thumbnail {
  position: relative;
  height: 65px;
  width: 65px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail.active {
  opacity: 1;
  border: 2px solid #ff2d55;
  transform: translateY(-3px); /* 当前选中略微上浮 */
}

.remove-img {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  border-radius: 50%;
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.2s;
}

.thumbnail:hover .remove-img {
  opacity: 1; /* 悬停时显示 */
}

.add-more {
  height: 65px;
  width: 65px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px dashed #ddd;
}

.plus-icon {
  font-size: 28px;
  color: #aaa;
}

.add-more:hover {
  background: #e8e8e8;
  transform: translateY(-3px);
}

.add-more:hover .plus-icon {
  color: #ff2d55;
}

/* 上传类型选择器 */
.upload-type-selector {
  display: flex;
  padding: 15px;
  background: #fff;
  border-bottom: 1px solid #eee;
  gap: 10px;
}

.type-btn {
  flex: 1;
  padding: 10px 0;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.type-btn.active {
  background: #ff2d55;
  color: white;
  box-shadow: 0 4px 10px rgba(255, 45, 85, 0.3);
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
  padding: 20px;
}

/* 视频容器 */
.video-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.main-video {
  max-width: 100%;
  max-height: 100%;
  display: block;
  border-radius: 8px;
}

.remove-video {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  font-size: 14px;
  backdrop-filter: blur(3px);
}

.remove-video:hover {
  background: rgba(255, 45, 85, 0.8);
  transform: translateY(-2px);
}

/* 右侧内容区域 */
.content-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 30px;
  position: relative;
  background: linear-gradient(to bottom right, #fff, #fafafa);
}

.content-container::-webkit-scrollbar {
  width: 5px;
}

.content-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #333;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 3px;
  background: #ff2d55;
  border-radius: 3px;
}

.input-group {
  margin-bottom: 25px;
  position: relative;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  font-size: 15px;
}

.input-field,
.textarea-field {
  width: 100%;
  padding: 14px;
  border: 1px solid #eee;
  border-radius: 12px;
  font-size: 16px;
  background: #fff;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.textarea-field {
  resize: none;
  min-height: 180px;
  line-height: 1.5;
}

.input-field:focus,
.textarea-field:focus {
  border-color: #ff2d55;
  outline: none;
  box-shadow: 0 3px 10px rgba(255, 45, 85, 0.1);
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 12px;
  color: #aaa;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 10px;
}

.tag {
  display: flex;
  align-items: center;
  background: #f0f0f0;
  color: #666;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.tag:hover {
  transform: translateY(-2px);
}

.remove-tag {
  margin-left: 8px;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.remove-tag:hover {
  opacity: 1;
  color: #ff2d55;
  background: rgba(255, 255, 255, 0.8);
}

.hint-text {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  font-style: italic;
}

.privacy-setting {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #eee;
}

.privacy-setting label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  color: #555;
}

.privacy-setting input {
  margin-right: 10px;
  transform: scale(1.2);
  accent-color: #ff2d55;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: auto;
  padding-top: 25px;
}

.cancel-btn,
.publish-btn {
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.publish-btn {
  background: #ff2d55;
  color: white;
  min-width: 120px;
}

.publish-btn:hover:not(:disabled) {
  background: #ff1744;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 45, 85, 0.3);
}

.publish-btn:disabled {
  background: #ffb2c2;
  cursor: not-allowed;
  box-shadow: none;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.close-btn:hover {
  background: #fff;
  color: #ff2d55;
  transform: rotate(90deg);
}

/* 标签选择器样式 */
.tags-selector {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  min-height: 40px;
  padding: 5px;
}

.selected-tags .tag {
  display: flex;
  align-items: center;
  background: linear-gradient(45deg, #ff2d55, #ff5983);
  color: white;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 3px 10px rgba(255, 45, 85, 0.2);
  animation: tag-appear 0.3s ease-out;
}

@keyframes tag-appear {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.tag-option {
  background: #f0f0f0;
  color: #666;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.tag-option:hover {
  background: #e0e0e0;
  transform: translateY(-3px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.tag-option.selected {
  background: linear-gradient(45deg, #ff2d55, #ff5983);
  color: white;
  box-shadow: 0 3px 10px rgba(255, 45, 85, 0.2);
}
</style>
