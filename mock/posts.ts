import type { MockMethod } from 'vite-plugin-mock'

const posts = [
  {
    id: 1,
    desc: 'Vue3 教程',
    author: '小明',
    img: 'https://img.zcool.cn/community/01b6e95d5e2e6fa801216518a6e2e2.jpg',
    like: 88,
    category: '学习',
  },
  {
    id: 2,
    desc: 'React 实战',
    author: '小红',
    img: 'https://img.zcool.cn/community/01b6e95d5e2e6fa801216518a6e2e2.jpg',
    like: 66,
    category: '学习',
  },
  {
    id: 3,
    desc: '小红书仿写',
    author: '小刚',
    img: 'https://img.zcool.cn/community/01b6e95d5e2e6fa801216518a6e2e2.jpg',
    like: 77,
    category: '项目',
  },
  {
    id: 4,
    desc: '前端面试宝典',
    like: 100,
    author: '小智',
    img: 'https://img.zcool.cn/community/01b6e95d5e2e6fa801216518a6e2e2.jpg',
    category: '全部',
  },
  {
    id: 5,
    desc: '美食分享',
    like: 59,
    author: '小美',
    img: 'https://img.zcool.cn/community/01b6e95d5e2e6fa801216518a6e2e2.jpg',
    category: '生活',
  },
  {
    id: 6,
    desc: '旅行日记',
    like: 42,
    author: '小旅',
    img: 'https://img.zcool.cn/community/01b6e95d5e2e6fa801216518a6e2e2.jpg',
    category: '生活',
  },
  {
    id: 7,
    desc: '摄影技巧',
    like: 35,
    author: '小摄',
    img: 'https://www.xiaohongshu.com/explore/682d081e000000002101a162?xsec_token=ABAkJ1uUxd9kktf__oLnfxVi4ea4zuz3ZG5-o8brquPng=&xsec_source=pc_feed',
    category: '兴趣',
  },
  {
    id: 8,
    desc: '健身打卡',
    like: 51,
    author: '小健',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    category: '生活',
  },
  {
    id: 9,
    desc: '职场成长',
    like: 64,
    author: '小职',
    img: 'https://img.zcool.cn/community/01b6e95d5e2e6fa801216518a6e2e2.jpg',
    category: '全部',
  },
  {
    id: 10,
    desc: '理财经验',
    like: 39,
    author: '小财',
    img: 'https://img.zcool.cn/community/01b6e95d5e2e6fa801216518a6e2e2.jpg',
    category: '生活',
  },
]

export default [
  {
    url: '/api/posts/search',
    method: 'get',
    response: ({ query }: { query: { keyword?: string } }) => {
      const keyword = query.keyword || ''
      return {
        data: posts.filter((post) => post.desc.includes(keyword)),
      }
    },
  },
] as MockMethod[]
