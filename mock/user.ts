import type { MockMethod } from 'vite-plugin-mock'
import type { UserInfo, PostCard, Author } from '../src/types/user'

const userInfo: UserInfo = {
  name: '用户名',
  id: '12345678',
  img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
  desc: '还没有简介',
  follow: 49,
  fans: 40,
  likes: 54,
  myPosts: [
    {
      id: 1,
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      title: '我的第一条笔记',
      author: {
        id: 1,
        name: '用户名',
        img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
        isAuthor: true,
      },
      like: 2,
      private: true,
      tabs: ['生活'],
    },
    {
      id: 2,
      img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      title: '美食分享',
      author: {
        id: 1,
        name: '用户名',
        img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
        isAuthor: true,
      },
      like: 0,
      private: false,
      tabs: ['美食', '生活'],
    },
  ],
  likedPosts: [
    {
      id: 3,
      img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      title: '别人的好贴',
      author: {
        id: 301,
        name: '小刚',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
        isAuthor: true,
        isFollowed: false,
      },
      like: 10,
      tabs: ['生活'],
    },
  ],
  favPosts: [
    {
      id: 4,
      img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
      title: '收藏的内容',
      author: {
        id: 201,
        name: '小红',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
        isAuthor: true,
        isFollowed: true,
      },
      like: 5,
      tabs: ['旅行', '风景'],
    },
  ],
}

// 其他用户信息
const otherUserInfo: UserInfo = {
  name: '小红书达人',
  id: '87654321',
  img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
  desc: '分享美好生活 | 美食 | 旅行 | 穿搭',
  follow: 120,
  fans: 3500,
  likes: 12460,
  isFollowed: false, // 当前用户是否已关注该用户
  myPosts: [
    {
      id: 5,
      img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60',
      title: '今日美食分享',
      author: {
        id: 2,
        name: '小红书达人',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
        isAuthor: true,
      },
      like: 126,
      tabs: ['美食', '家常菜'],
    },
    {
      id: 6,
      img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60',
      title: '周末旅行记录',
      author: {
        id: 2,
        name: '小红书达人',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
        isAuthor: true,
      },
      like: 89,
      tabs: ['旅行', '风景'],
    },
    {
      id: 7,
      img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60',
      title: '职场穿搭',
      author: {
        id: 2,
        name: '小红书达人',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
        isAuthor: true,
      },
      like: 210,
      tabs: ['穿搭', '办公室搭配'],
    },
  ],
  likedPosts: [],
  favPosts: [],
}

export default [
  {
    url: '/api/user/getuserinfo',
    method: 'get',
    response: () => {
      // cookies 会自动携带
      return {
        code: 200,
        data: userInfo,
        msg: 'ok',
      }
    },
  },
  {
    url: '/api/user/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      // 这里可以根据不同的用户ID返回不同的用户信息
      // 目前简单返回预设的其他用户信息
      return {
        code: 200,
        data: otherUserInfo,
        msg: 'ok',
      }
    },
  },
  {
    url: '/api/user/follow',
    method: 'post',
    response: () => {
      otherUserInfo.isFollowed = true
      otherUserInfo.fans += 1
      return {
        code: 200,
        data: { success: true },
        msg: '关注成功',
      }
    },
  },
  {
    url: '/api/user/unfollow',
    method: 'post',
    response: () => {
      otherUserInfo.isFollowed = false
      if (otherUserInfo.fans > 0) otherUserInfo.fans -= 1
      return {
        code: 200,
        data: { success: true },
        msg: '取消关注成功',
      }
    },
  },
] as MockMethod[]
