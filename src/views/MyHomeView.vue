<template>
  <div class="layout">
    <main>
      <!-- 个人信息区 -->
      <section class="user-section">
        <img class="avatar" :src="user.img || defaultAvatar" alt="头像" />
        <div class="user-info">
          <div class="name-action">
            <div class="name-with-gender">
              <h2>{{ user.name }}</h2>
              <!-- 性别图标 -->
              <div class="gender-icon" :class="getGenderClass((user as any).gender)">
                <svg v-if="(user as any).gender === 1" viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M9,9C10.29,9 11.5,9.41 12.47,10.11L17.58,5H13V3H21V11H19V6.41L13.89,11.5C14.59,12.5 15,13.7 15,15A6,6 0 0,1 9,21A6,6 0 0,1 3,15A6,6 0 0,1 9,9M9,11A4,4 0 0,0 5,15A4,4 0 0,0 9,19A4,4 0 0,0 13,15A4,4 0 0,0 9,11Z"
                  />
                </svg>
                <svg
                  v-else-if="(user as any).gender === 2"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path
                    d="M12,4A6,6 0 0,1 18,10C18,12.97 15.84,15.44 13,15.92V18H15V20H13V22H11V20H9V18H11V15.92C8.16,15.44 6,12.97 6,10A6,6 0 0,1 12,4M12,6A4,4 0 0,0 8,10A4,4 0 0,0 12,14A4,4 0 0,0 16,10A4,4 0 0,0 12,6Z"
                  />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5"
                  />
                </svg>
              </div>
            </div>
            <div class="user-actions">
              <button class="edit-btn" @click="openEditModal">编辑资料</button>
              <button class="password-btn" @click="openPasswordModal">修改密码</button>
            </div>
          </div>
          <div class="user-id">小红书号：{{ user.id }}</div>
          <div class="user-desc">{{ user.desc }}</div>
          <div class="user-stats">
            <span>{{ user.follow }} 关注</span>
            <span>{{ user.fans }} 粉丝</span>
            <span>{{ user.likes }} 获赞与收藏</span>
          </div>
        </div>
      </section>

      <!-- 帖子区域 -->
      <section class="posts-section">
        <div class="tags">
          <span
            v-for="tag in tags"
            :key="tag.key"
            class="tag"
            :class="{ active: activetag === tag.key }"
            @click="selecttag(tag.key)"
          >
            {{ tag.label }}
          </span>
        </div>
        <PostList :posts="posts" :emptyText="getEmptyText()" />
      </section>
    </main>

    <!-- 编辑用户信息模态框 -->
    <div v-if="showEditModal" class="edit-modal-overlay">
      <div class="edit-modal">
        <h3>编辑个人资料</h3>

        <!-- 头像上传区域 -->
        <div class="form-group avatar-upload">
          <label>头像</label>
          <div class="avatar-preview-container">
            <img
              :src="avatarPreview || user.img || defaultAvatar"
              alt="头像预览"
              class="avatar-preview"
            />
            <div class="avatar-upload-btn">
              <input
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
                ref="avatarInput"
                class="avatar-input"
              />
              <button class="change-avatar-btn" @click="triggerAvatarUpload">更换头像</button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>用户名</label>
          <input v-model="editForm.username" placeholder="请输入用户名" />
        </div>

        <div class="form-group">
          <label>个人简介</label>
          <textarea v-model="editForm.bio" placeholder="请输入个人简介"></textarea>
        </div>

        <div class="form-group">
          <label>性别</label>
          <select v-model="editForm.gender">
            <option :value="1">男</option>
            <option :value="2">女</option>
            <option :value="0">保密</option>
          </select>
        </div>

        <div class="form-group">
          <label>生日</label>
          <input type="date" v-model="editForm.birthday" />
        </div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="closeEditModal">取消</button>
          <button class="save-btn" @click="saveUserInfo">保存</button>
        </div>
      </div>
    </div>

    <!-- 修改密码模态框 -->
    <div v-if="showPasswordModal" class="edit-modal-overlay">
      <div class="edit-modal password-modal">
        <h3>修改密码</h3>

        <div class="form-group">
          <label>当前密码</label>
          <input type="password" v-model="passwordForm.oldPassword" placeholder="请输入当前密码" />
        </div>

        <div class="form-group">
          <label>新密码</label>
          <input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码" />
        </div>

        <div class="form-group">
          <label>确认新密码</label>
          <input
            type="password"
            v-model="passwordForm.confirmPassword"
            placeholder="请再次输入新密码"
          />
        </div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="closePasswordModal">取消</button>
          <button class="save-btn" @click="savePassword">确认修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import type { UserInfo, PostCard } from '../types'
import { getUserInfo, updateUserInfo, updatePassword } from '../api/user'
import PostList from '../components/PostList.vue'
const defaultAvatar = '/src/assets/logo.svg'

// 用户信息响应式数据
const user = ref<UserInfo>({
  id: '',
  name: '',
  img: '',
  desc: '',
  gender: 0,
  birthday: '',
  follow: 0,
  fans: 0,
  likes: 0,
  myPosts: [],
  favPosts: [],
  likedPosts: [],
})
// 标签页响应式数据
const tags = ref([
  { label: '我的笔记', key: 'note' },
  { label: '点赞', key: 'like' },
  { label: '收藏', key: 'fav' },
])
const activetag = ref('note')
function selecttag(tagKey: string) {
  activetag.value = tagKey
  if (userCache) {
    posts.value = getPostsBytag(userCache, tagKey)
  }
}

// 帖子响应式数据
const posts = ref<PostCard[]>([])
// 获取用户信息
let userCache: UserInfo | null = null
onMounted(async () => {
  const userData = await getUserInfo()
  userCache = userData
  user.value = userData
  posts.value = getPostsBytag(user.value, activetag.value)
})

function getPostsBytag(user: UserInfo, tag: string) {
  if (tag === 'note') return user.myPosts || []
  if (tag === 'fav') return user.favPosts || []
  if (tag === 'like') return user.likedPosts || []
  return []
}

// 获取空状态文本
function getEmptyText() {
  if (activetag.value === 'note') return '笔记'
  if (activetag.value === 'fav') return '收藏'
  if (activetag.value === 'like') return '点赞'
  return '内容'
}

// 模态框显示状态
const showEditModal = ref(false)
const showPasswordModal = ref(false)

// 编辑表单数据
const editForm = reactive({
  username: '',
  bio: '',
  gender: 0,
  birthday: '',
})

// 密码表单数据
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 头像上传相关
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

// 触发文件选择
function triggerAvatarUpload() {
  avatarInput.value?.click()
}

// 处理头像选择变化
function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    avatarFile.value = file

    // 创建预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 打开编辑模态框
function openEditModal() {
  editForm.username = user.value.name
  editForm.bio = user.value.desc
  editForm.gender = user.value.gender || 0
  editForm.birthday = user.value.birthday || ''
  showEditModal.value = true
}
// 关闭编辑模态框
function closeEditModal() {
  showEditModal.value = false
}
// 打开修改密码模态框
function openPasswordModal() {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  showPasswordModal.value = true
}
// 关闭修改密码模态框
function closePasswordModal() {
  showPasswordModal.value = false
}

// 保存用户信息
async function saveUserInfo() {
  try {
    const formData = new FormData()
    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value)
    }
    formData.append('username', editForm.username)
    formData.append('bio', editForm.bio)
    formData.append('gender', editForm.gender.toString())
    if (editForm.birthday) {
      formData.append('birthday', editForm.birthday)
    }
    // 调用API更新用户信息
    await updateUserInfo(formData)
    // 更新成功后刷新用户信息
    const userData = await getUserInfo()
    userCache = userData
    user.value = userData
    // 清除头像预览和文件
    avatarPreview.value = null
    avatarFile.value = null

    // 关闭模态框
    closeEditModal()
  } catch (error) {
    console.error('更新用户信息失败:', error)
    alert('更新失败，请稍后再试')
  }
}

// 保存新密码
async function savePassword() {
  try {
    // 表单验证
    if (!passwordForm.oldPassword) {
      alert('请输入当前密码')
      return
    }
    if (!passwordForm.newPassword) {
      alert('请输入新密码')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('两次输入的新密码不一致')
      return
    }

    // 调用API修改密码
    await updatePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })
    closePasswordModal()

    // 显示成功消息
    alert('密码修改成功！请使用新密码登录')
  } catch (error) {
    console.error('修改密码失败:', error)
    alert('修改密码失败，请检查当前密码是否正确')
  }
}

// 获取性别对应的CSS类名
function getGenderClass(gender: number | undefined | null) {
  if (gender === 1) return 'male'
  if (gender === 2) return 'female'
  return 'unknown'
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100%;
  background: #fff;
  width: 100%;
  overflow: auto;
}

main {
  flex: 1;
  padding: 3rem 4rem;
  max-width: 1200px; /* 限制最大宽度 */
  margin: 0 auto; /* 居中显示 */
  width: 100%;
}

/* 个人信息区域 */
.user-section {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 2rem;
  border: 2px solid #f7f7f7;
  object-fit: cover;
}

.user-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.name-action {
  display: flex;
  align-items: center;
}

.name-action h2 {
  margin-right: 6px;
  display: flex;
  align-items: center;
}

.name-with-gender {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.user-id {
  color: #aaa;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.user-desc {
  color: #666;
  margin-bottom: 0.7rem;
}

.user-stats {
  color: #888;
  font-size: 0.95rem;
  display: flex;
  gap: 1.5rem;
}

/* 帖子区域 */
.posts-section {
  width: 100%;
  background: #fafbfc;
  border-radius: 14px;
  padding: 2rem 1.5rem 1.5rem 1.5rem; /* 减小内边距 */
  min-height: 400px;
  box-sizing: border-box; /* 确保内边距不会增加元素的总宽度 */
}

.tags {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 2rem;
}

.tag {
  font-size: 1.1rem;
  color: #888;
  cursor: pointer;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s,
    border 0.2s;
}

.tag.active {
  color: #ff2d55;
  border-bottom: 2px solid #ff2d55;
}

/* 用户操作按钮容器 */
.user-actions {
  display: flex;
  gap: 0.8rem;
}

/* 编辑按钮样式 */
.edit-btn {
  background: #ff2d55;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-btn:hover {
  background: #e62147;
}

/* 修改密码按钮 */
.password-btn {
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.password-btn:hover {
  background: #e0e0e0;
  color: #444;
}

/* 编辑模态框样式 */
.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-modal {
  width: 400px;
  max-width: 90%;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.edit-modal h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}

.save-btn {
  background: #ff2d55;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}

/* 头像上传样式 */
.avatar-upload {
  margin-bottom: 2rem;
}

.avatar-preview-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.avatar-upload-btn {
  display: flex;
  flex-direction: column;
}

.avatar-input {
  display: none;
}

.change-avatar-btn {
  background: #ff2d55;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.change-avatar-btn:hover {
  background: #e62147;
}

/* 密码修改模态框样式 */
.password-modal {
  width: 400px;
  max-width: 90%;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.password-modal h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  color: #333;
}

/* 性别图标样式 */
.gender-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gender-icon.male {
  background-color: #409eff;
}

.gender-icon.female {
  background-color: #ff66aa;
}

.gender-icon.unknown {
  background-color: #909399;
}

/* 响应式布局 */
@media (max-width: 900px) {
  main {
    padding: 1.2rem;
    min-width: auto; /* 移除最小宽度限制 */
  }

  .posts-section {
    padding: 1.5rem 1rem 1rem 1rem; /* 在小屏幕上进一步减小内边距 */
  }

  .post-card {
    width: 100%;
  }

  .posts-list {
    gap: 1rem;
  }

  .user-section {
    flex-direction: column;
    text-align: center;
  }

  .avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .name-action {
    justify-content: center;
  }

  .user-stats {
    justify-content: center;
  }
}
</style>
