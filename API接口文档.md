# 小红书仿写项目 API 接口文档

## 目录

1. [认证相关接口](#1-认证相关接口)
2. [用户相关接口](#2-用户相关接口)
3. [帖子详情相关接口](#3-帖子详情相关接口)
4. [帖子搜索相关接口](#4-帖子搜索相关接口)
5. [类型定义](#5-类型定义)

## 1. 认证相关接口

### 1.1 用户登录

用户通过邮箱和密码进行登录。

**请求方式：** POST

**接口地址：** `/auth/login`

**请求参数：**

| 参数名   | 类型   | 必填 | 描述     |
| -------- | ------ | ---- | -------- |
| email    | string | 是   | 用户邮箱 |
| password | string | 是   | 用户密码 |

**请求示例：**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**响应数据：** LoginResponse

```json
{
  "success": true,
  "message": "登录成功",
  "token": "token_1_1640995200000",
  "userInfo": {
    "id": "1",
    "username": "小红书用户",
    "email": "user@example.com",
    "avatar": "https://picsum.photos/100/100?random=1",
    "isLoggedIn": true
  }
}
```

### 1.2 用户注册

新用户注册账号。

**请求方式：** POST

**接口地址：** `/auth/register`

**请求参数：**

| 参数名          | 类型   | 必填 | 描述         |
| --------------- | ------ | ---- | ------------ |
| username        | string | 是   | 用户名       |
| email           | string | 是   | 用户邮箱     |
| password        | string | 是   | 密码(6位以上) |
| confirmPassword | string | 是   | 确认密码     |

**请求示例：**
```json
{
  "username": "新用户",
  "email": "newuser@example.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

**响应数据：** RegisterResponse

```json
{
  "success": true,
  "message": "注册成功",
  "userInfo": {
    "id": "3",
    "username": "新用户",
    "email": "newuser@example.com",
    "avatar": "https://picsum.photos/100/100?random=3",
    "isLoggedIn": false
  }
}
```

### 1.3 用户登出

用户登出系统，清除服务端token。

**请求方式：** POST

**接口地址：** `/auth/logout`

**请求头：**

| 参数名        | 类型   | 必填 | 描述               |
| ------------- | ------ | ---- | ------------------ |
| Authorization | string | 是   | Bearer {token}格式 |

**请求参数：** 无

**响应数据：**
```json
{
  "success": true,
  "message": "登出成功"
}
```

### 1.4 验证Token

验证当前用户token的有效性，获取用户信息。

**请求方式：** GET

**接口地址：** `/auth/verify`

**请求头：**

| 参数名        | 类型   | 必填 | 描述               |
| ------------- | ------ | ---- | ------------------ |
| Authorization | string | 是   | Bearer {token}格式 |

**请求参数：** 无

**响应数据：**
```json
{
  "success": true,
  "userInfo": {
    "id": "1",
    "username": "小红书用户",
    "email": "user@example.com",
    "avatar": "https://picsum.photos/100/100?random=1",
    "isLoggedIn": true
  }
}
```

## 2. 用户相关接口

### 2.1 获取当前用户信息

获取登录用户的个人信息。

**请求方式：** GET

**接口地址：** `/user/getuserinfo`

**请求参数：** 无

**响应数据：** UserInfo

### 2.2 获取其他用户信息

获取指定用户ID的用户信息。

**请求方式：** GET

**接口地址：** `/user/{userId}`

**请求参数：**

| 参数名 | 类型   | 必填 | 描述   |
| ------ | ------ | ---- | ------ |
| userId | number | 是   | 用户ID |

**响应数据：** UserInfo

### 2.3 关注用户

关注指定用户。

**请求方式：** POST

**接口地址：** `/user/follow`

**请求参数：**

| 参数名 | 类型   | 必填 | 描述   |
| ------ | ------ | ---- | ------ |
| userId | number | 是   | 用户ID |

**响应数据：**
{
// 成功或失败信息
}

### 2.4 取消关注用户

取消关注指定用户。

**请求方式：** DELETE

**接口地址：** `/user/follow`

**请求参数：**

| 参数名 | 类型   | 必填 | 描述   |
| ------ | ------ | ---- | ------ |
| userId | number | 是   | 用户ID |

**响应数据：**
{
// 成功或失败信息
}

## 3. 帖子详情相关接口

### 3.1 获取帖子详情

根据帖子ID获取详细信息。

**请求方式：** GET

**接口地址：** `/detail/{id}`

**请求参数：**

| 参数名 | 类型   | 必填 | 描述   |
| ------ | ------ | ---- | ------ |
| id     | number | 是   | 帖子ID |

**响应数据：** PostDetail

### 3.2 发送评论

对帖子或评论发送评论。

**请求方式：** POST

**接口地址：**

- 对帖子评论：`/posts/{id}/comments`
- 对评论回复：`/comments/{id}/comments`

**请求参数：**

| 参数名  | 类型   | 必填 | 描述           |
| ------- | ------ | ---- | -------------- |
| id      | number | 是   | 帖子ID或评论ID |
| content | string | 是   | 评论内容       |

**响应数据：**
{
// 成功或失败信息
}

### 3.3 点赞帖子

对帖子进行点赞。

**请求方式：** POST

**接口地址：** `/detail/like`

**请求参数：**

| 参数名 | 类型   | 必填 | 描述   |
| ------ | ------ | ---- | ------ |
| id     | number | 是   | 帖子ID |

**响应数据：**
{
// 成功或失败信息
}

### 3.4 收藏帖子

收藏指定帖子。

**请求方式：** POST

**接口地址：** `/detail/fav`

**请求参数：**

| 参数名 | 类型   | 必填 | 描述   |
| ------ | ------ | ---- | ------ |
| id     | number | 是   | 帖子ID |

**响应数据：**
{
// 成功或失败信息
}

## 4. 帖子搜索相关接口

### 4.1 获取推荐帖子（分页）

获取系统推荐的帖子列表，支持分页查询，返回图片和视频混合内容。

**请求方式：** GET

**接口地址：** `/posts/recommend`

**请求参数：**

| 参数名 | 类型   | 必填 | 描述                    | 默认值 |
| ------ | ------ | ---- | ----------------------- | ------ |
| page   | number | 否   | 页码，从1开始           | 1      |
| limit  | number | 否   | 每页数量，建议5-20之间  | 10     |

**请求示例：**
```
GET /api/posts/recommend?page=1&limit=5
```

**响应数据结构：**
```typescript
interface RecommendPostsResponse {
  list: PostCard[]  // 帖子列表
  total: number     // 总数据量
}
```

**成功响应示例：**
```json
{
  "code": 200,
  "message": "获取推荐帖子成功",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "Vue3 Composition API 详解",
        "img": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60",
        "type": "video",
        "video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "duration": 180,
        "author": {
          "id": 101,
          "name": "前端小哥",
          "img": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60",
          "isAuthor": true,
          "isFollowed": false
        },
        "like": 888,
        "tabs": ["前端", "Vue3", "教程"]
      },
      {
        "id": 2,
        "title": "今日份的治愈早餐 ✨",
        "img": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60",
        "type": "image",
        "author": {
          "id": 201,
          "name": "美食记录者",
          "img": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60",
          "isAuthor": true,
          "isFollowed": true
        },
        "like": 666,
        "tabs": ["美食", "早餐", "生活"]
      }
    ],
    "total": 20
  }
}
```

**内容类型说明：**

1. **图片帖子** (`type: "image"`)
   - 包含：美食、穿搭、摄影、宠物、手工、植物等生活内容
   - 字段：`id`, `title`, `img`, `author`, `like`, `tabs`, `type`

2. **视频帖子** (`type: "video"`)
   - 包含：技术教程、健身、美妆、音乐、烘焙等视频内容
   - 额外字段：`video`(视频URL), `duration`(时长秒数)

**分页说明：**
- 总共约20条精心设计的推荐内容
- 建议每页5条，共4页
- 支持瀑布流布局的3列展示
- 视频和图片内容混合推荐

**错误响应：**
```json
{
  "code": 500,
  "message": "获取推荐帖子失败",
  "data": {
    "list": [],
    "total": 0
  }
}
```

### 4.2 关键词搜索帖子

根据关键词搜索帖子，支持分页和标签筛选。

**请求方式：** GET

**接口地址：** `/posts/search`

**请求参数：**

| 参数名  | 类型   | 必填 | 描述                         |
| ------- | ------ | ---- | ---------------------------- |
| keyword | string | 是   | 搜索关键词                   |
| page    | number | 否   | 页码，默认为1                |
| limit   | number | 否   | 每页数量，默认为10           |
| tag     | string | 否   | 标签筛选，如"美食"、"旅行"等 |

**响应数据：** PostCard[]

## 5. 类型定义

### 5.1 认证相关类型

```typescript
// 登录请求参数
export interface LoginRequest {
  email: string
  password: string
}

// 注册请求参数
export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// 登录响应数据
export interface LoginResponse {
  success: boolean
  message?: string
  token: string
  userInfo: AuthUserInfo
}

// 注册响应数据
export interface RegisterResponse {
  success: boolean
  message?: string
  userInfo?: AuthUserInfo
}

// 认证用户信息
export interface AuthUserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  isLoggedIn: boolean
}
```

### 5.2 用户相关类型

```typescript
// 用户信息类型
export interface UserInfo {
  id: string
  name: string
  img: string
  desc: string
  follow: number
  fans: number
  likes: number
  isFollowed?: boolean
  myPosts?: PostCard[]
  likedPosts: PostCard[]
  favPosts: PostCard[]
}

// 用户/评论作者
export type Author = {
  id: number
  name: string
  img: string
  isAuthor?: boolean
  isFollowed?: boolean
}
```

### 5.3 帖子相关类型

```typescript
// 帖子卡片(列表展示)
export type PostCard = {
  id: number
  img: string                    // 封面图片URL
  title: string                  // 帖子标题
  author: Author                 // 作者信息
  like: number                   // 点赞数
  private?: boolean              // 是否私密
  tabs?: string[]                // 标签数组
  video?: string                 // 视频URL（视频类型帖子）
  type?: 'image' | 'video'       // 内容类型：图片或视频
  duration?: number              // 视频时长（秒）
}

// 帖子详情
export type PostDetail = {
  id: number
  imgs: string[]
  title: string
  content: string
  tabs: string[]
  author: Author
  like: number
  fav: number
  time: string
  isLike: boolean
  isFav: boolean
  comments: Comment[]
}
```

### 5.4 评论相关类型

```typescript
// 评论详细信息
export type Comment = {
  id: number
  content: string
  author: Author
  like: number
  time: string
  reply?: Comment[]
  isLike: boolean
}
```

### 5.5 推荐帖子响应类型

```typescript
// 获取推荐帖子响应类型
export interface RecommendPostsResponse {
  list: PostCard[]  // 帖子列表
  total: number     // 总数据量
}
```