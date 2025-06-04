<template>
  <div class="layout">
    <aside>
      <nav class="custom-nav">
        <RouterLink to="/" class="nav-link" active-class="nav-active">推荐</RouterLink>
        <RouterLink to="/search" class="nav-link" active-class="nav-active">查找</RouterLink>
        <RouterLink to="/myhome" class="nav-link" active-class="nav-active">我的主页</RouterLink>
        <div class="nav-bottom">
          <div class="publish-btn" @click="openPublishModal">
            <span class="plus-icon">+</span><span>发布</span>
          </div>
        </div>
      </nav>
    </aside>
    <main>
      <header>
        <!-- 顶部搜索框 -->
        <div class="search-bar">
          <input
            v-model="keyword"
            class="search-input"
            placeholder="搜索你感兴趣的内容"
            @keyup.enter="onSearch"
          />
          <button class="search-btn" @click="onSearch">搜索</button>
        </div>
      </header>
      <div class="main-content">
        <RouterView />
      </div>
      <DetailView.default v-if="showDetail" :id="detailId" />
      <PublishView.default v-if="showPublish" @close="closePublishModal" />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import * as DetailView from './views/DetailView.vue'
import * as PublishView from './views/PublishView.vue'
const router = useRouter()
const route = useRoute()

const keyword = ref('')
function onSearch() {
  router.push({ path: '/search', query: { keyword: keyword.value } })
}

// 判断当前是否有 detail 查询参数来显示弹窗
const showDetail = computed(() => !!route.query.detail)
// 获取详情 ID
const detailId = computed(() => {
  const val = route.query.detail
  if (Array.isArray(val)) {
    return val[0] ?? ''
  }
  return val ?? ''
})

// 控制发布弹窗的显示
const showPublish = ref(false)
function openPublishModal() {
  showPublish.value = true
}
function closePublishModal() {
  showPublish.value = false
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--color-bg);
}
aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  padding: 1rem 0;
  background: #fff;
  border-right: 1px solid #f2f2f2;
  position: relative;
}
.custom-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  margin-top: 8rem;
  width: 100%;
  height: 100%;
  position: relative;
}

.nav-bottom {
  position: absolute;
  bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.nav-link {
  display: block;
  width: 80%;
  text-align: center;
  padding: 0.9rem 0;
  font-size: 1.25rem;
  color: #888;
  border-radius: 24px;
  background: none;
  transition: all 0.2s;
  font-weight: 500;
  letter-spacing: 1px;
  text-decoration: none;
  margin-bottom: 0.5rem;
}
.nav-link:hover {
  background: #ffe6ec;
  color: #ff2d55;
}
.nav-active {
  background: #ff2d55;
  color: #fff !important;
  box-shadow: 0 2px 8px 0 #ffe6ec;
}
.publish-btn {
  width: 60%;
  height: auto;
  background: transparent;
  color: #888;
  padding: 0.5rem 0;
  font-size: 1.25rem;
  border: 3px solid #aaa;
  border-radius: 24px;
  display: flex;
  font-weight: 500;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 10px 20px;
}

.publish-btn:hover {
  background: #ff2d55;
  color: #fff;
  border-color: #ff2d55;
  transform: scale(1.05);
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
  margin-right: 4px;
}
main {
  flex: 6;
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: var(--color-bg);
  overflow-y: auto;
}
header {
  width: 70%;
  line-height: 1.5;
  max-height: 10%;
}
.search-bar {
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}
.search-input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: 1px solid #eee;
  border-radius: 20px;
  font-size: 1.1rem;
  background: #fafbfc;
  outline: none;
}
.search-btn {
  margin-left: 1rem;
  padding: 0.7rem 1.5rem;
  background: #ff2d55;
  color: #fff;
  border-radius: 20px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.search-btn:hover {
  background: #ff1744;
}
.main-content {
  flex: 1;
  width: 100%;
  max-width: 100%; /* 确保内容不会超出容器 */
  padding-right: 3rem; /* 减小右侧内边距 */
  box-sizing: border-box; /* 确保内边距不会增加元素的总宽度 */
  overflow-x: hidden; /* 防止水平溢出 */
}
</style>
