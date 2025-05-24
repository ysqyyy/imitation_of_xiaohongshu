# 小红书仿写项目 API 接口文档

## 目录

1. [用户相关接口](#1-用户相关接口)
2. [帖子详情相关接口](#2-帖子详情相关接口)
3. [帖子搜索相关接口](#3-帖子搜索相关接口)
4. [类型定义](#4-类型定义)

## 1. 用户相关接口

### 1.1 获取当前用户信息

获取登录用户的个人信息。

**请求方式：** GET

**接口地址：** `/user/getuserinfo`

**请求参数：** 无

**响应数据：** UserInfo

### 1.2 获取其他用户信息

获取指定用户ID的用户信息。

**请求方式：** GET

**接口地址：** `/user/{userId}`

**请求参数：**

| 参数名 | 类型   | 必填 | 描述   |
| ------ | ------ | ---- | ------ |
| userId | number | 是   | 用户ID |

**响应数据：** UserInfo

### 1.3 关注用户

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

### 1.4 取消关注用户

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

## 2. 帖子详情相关接口

### 2.3 获取帖子详情

根据帖子ID获取详细信息。

**请求方式：** GET

**接口地址：** `/detail/{id}`

**请求参数：**

| 参数名 | 类型   | 必填 | 描述   |
| ------ | ------ | ---- | ------ |
| id     | number | 是   | 帖子ID |

**响应数据：** PostDetail

### 2.4 发送评论

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

### 2.5 点赞帖子

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

### 2.6 收藏帖子

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

## 3. 帖子搜索相关接口

### 3.1 关键词搜索帖子

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

## 4. 类型定义

### 4.1 用户相关类型

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

### 4.2 帖子相关类型

// 帖子卡片(列表展示)
export type PostCard = {
id: number
img: string
title: string
author: Author
like: number
private?: boolean
tags?: string[]
}

// 帖子详情
export type PostDetail = {
id: number
imgs: string[]
title: string
content: string
tags: string[]
author: Author
like: number
fav: number
time: string
isLike: boolean
isFav: boolean
comments: Comment[]
}

### 4.3 评论相关类型

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
