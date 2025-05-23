import type { MockMethod } from 'vite-plugin-mock'
import type { PostCard, Author } from '../src/types/user'

const posts: PostCard[] = [
  {
    id: 1,
    title: 'Vue3 教程',
    author: {
      id: 101,
      name: '小明',
      img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60',
    like: 88,
    tabs: ['前端', 'Vue3', '学习'],
  },
  {
    id: 2,
    title: 'React 实战',
    author: {
      id: 201,
      name: '小红',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    img: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format&fit=crop&q=60',
    like: 66,
    tabs: ['前端', 'React', '学习'],
  },
  {
    id: 3,
    title: '小红书仿写',
    author: {
      id: 301,
      name: '小刚',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60',
    like: 77,
    tabs: ['前端', 'Vue3', '项目实战'],
  },
  {
    id: 4,
    title: '前端面试宝典',
    author: {
      id: 401,
      name: '小智',
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60',
    like: 100,
    tabs: ['前端', '面试', '求职'],
  },
  {
    id: 5,
    title: '美食分享',
    author: {
      id: 501,
      name: '小美',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60',
    like: 59,
    tabs: ['美食', '生活'],
  },
  {
    id: 6,
    title: '旅行日记',
    author: {
      id: 601,
      name: '小旅',
      img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60',
    like: 42,
    tabs: ['旅行', '生活'],
  },
  {
    id: 7,
    title: '摄影技巧',
    author: {
      id: 701,
      name: '小摄',
      img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&auto=format&fit=crop&q=60',
    like: 35,
    tabs: ['摄影', '兴趣', '技巧'],
  },
  {
    id: 8,
    title: '健身打卡',
    author: {
      id: 801,
      name: '小健',
      img: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60',
    like: 51,
    tabs: ['健身', '生活', '运动'],
  },
  {
    id: 9,
    title: '职场成长',
    author: {
      id: 901,
      name: '小职',
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60',
    like: 64,
    tabs: ['职场', '成长', '经验'],
  },
  {
    id: 10,
    title: '理财经验',
    author: {
      id: 1001,
      name: '小财',
      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=500&auto=format&fit=crop&q=60',
    like: 39,
    tabs: ['理财', '生活', '经验'],
  },
]

export default [
  {
    url: '/api/posts/search',
    method: 'get',
    response: ({ query }: { query: { keyword?: string } }) => {
      const keyword = query.keyword || ''
      return {
        data: posts.filter((post) => post.title.includes(keyword)),
      }
    },
  },
  {
    url: '/api/posts/:id',
    method: 'get',
    response: ({ query, params }: { query: any; params: { id: string } }) => {
      const id = Number(params.id)
      const post = posts.find((post) => post.id === id)

      if (post) {
        return {
          code: 200,
          data: post,
          message: '获取帖子成功',
        }
      } else {
        return {
          code: 404,
          data: null,
          message: '帖子不存在',
        }
      }
    },
  },
  {
    url: '/api/posts/category',
    method: 'get',
    response: ({ query }: { query: { category?: string } }) => {
      const category = query.category || ''
      if (!category || category === '全部') {
        return {
          code: 200,
          data: posts,
          message: '获取帖子列表成功',
        }
      }
      return {
        code: 200,
        data: posts.filter((post) => post.tabs?.some((tab) => tab === category)),
        message: '获取分类帖子成功',
      }
    },
  },
] as MockMethod[]
