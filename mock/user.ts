import type { MockMethod } from 'vite-plugin-mock'

const userInfo = {
  username: '用户名',
  id: '12345678',
  userDesc: '还没有简介',
  follow: 49,
  fans: 40,
  likes: 54,
  myPosts: [
    {
      id: 1,
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      desc: '我的第一条笔记',
      like: 2,
      private: true,
    },
    {
      id: 2,
      img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      desc: '美食分享',
      like: 0,
      private: false,
    },
  ],
  likedPosts: [
    {
      id: 3,
      img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      desc: '别人的好贴',
      like: 10,
    },
  ],
  favPosts: [
    {
      id: 4,
      img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
      desc: '收藏的内容',
      like: 5,
    },
  ],
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
] as MockMethod[]
