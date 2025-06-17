import type { MockMethod } from 'vite-plugin-mock'
import type { PostCard } from '../src/types/user'

const posts: PostCard[] = [
  // 技术类视频
  {
    id: 1,
    title: 'Vue3 Composition API 详解',
    author: {
      id: 101,
      name: '前端小哥',
      img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60',
    like: 888,
    tags: ['前端', 'Vue3', '教程'],
    type: 'video',
    video:
      'https://vd4.bdstatic.com/mda-ree9un2b1mjvt33c/cae_h264/1747292379850822234/mda-ree9un2b1mjvt33c.mp4?abtest=peav_l52&appver=&auth_key=1748957207-0-0-4f5e3da367d79a0d47d05250b03f624b&bcevod_channel=searchbox_feed&cd=0&cr=0&did=cfcd208495d565ef66e7dff9f98764da&logid=3407311679&model=&osver=&pd=1&pt=4&sl=945&sle=1&split=799792&vid=14129995574504724938&vt=1',
    duration: 180,
  },
  // 美食图片
  {
    id: 2,
    title: '今日份的治愈早餐 ✨',
    author: {
      id: 201,
      name: '美食记录者',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60',
    like: 666,
    tags: ['美食', '早餐', '生活'],
    type: 'image',
  },
  // 旅行视频
  {
    id: 3,
    title: '云南大理三日游 | 超详细攻略',
    author: {
      id: 301,
      name: '旅行达人',
      img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60',
    like: 1234,
    tags: ['旅行', '大理', '攻略'],
    type: 'video',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 420,
  },
  // 穿搭图片
  {
    id: 4,
    title: '春季穿搭分享 | 温柔系女孩',
    author: {
      id: 401,
      name: '穿搭小仙女',
      img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&auto=format&fit=crop&q=60',
    like: 999,
    tags: ['穿搭', '春季', '温柔'],
    type: 'image',
  },
  // 健身视频
  {
    id: 5,
    title: '10分钟燃脂训练 | 在家就能练',
    author: {
      id: 501,
      name: '健身教练小李',
      img: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60',
    like: 2333,
    tags: ['健身', '燃脂', '居家运动'],
    type: 'video',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 600,
  },
  // 摄影图片
  {
    id: 6,
    title: '城市夜景摄影技巧分享',
    author: {
      id: 601,
      name: '摄影师阿强',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&auto=format&fit=crop&q=60',
    like: 555,
    tags: ['摄影', '夜景', '技巧'],
    type: 'image',
  },
  // 美妆视频
  {
    id: 7,
    title: '日常淡妆教程 | 新手友好',
    author: {
      id: 701,
      name: '美妆博主小美',
      img: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    img: 'https://images.unsplash.com/photo-1556909114-3af1bc58e83a?w=500&auto=format&fit=crop&q=60',
    like: 1888,
    tags: ['美妆', '淡妆', '教程'],
    type: 'video',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 300,
  },
  // 宠物图片
  {
    id: 8,
    title: '我家猫咪的日常可爱瞬间 🐱',
    author: {
      id: 801,
      name: '铲屎官日记',
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60',
    like: 3333,
    tags: ['宠物', '猫咪', '日常'],
    type: 'image',
  },
  // 美食制作视频
  {
    id: 9,
    title: '超简单芝士蛋糕制作教程',
    author: {
      id: 901,
      name: '烘焙小能手',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60',
    like: 2888,
    tags: ['美食', '烘焙', '甜点'],
    type: 'video',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 480,
  },
  // 手工图片
  {
    id: 10,
    title: '手工折纸花朵制作过程',
    author: {
      id: 1001,
      name: '手工爱好者',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500&auto=format&fit=crop&q=60',
    like: 444,
    tags: ['手工', '折纸', 'DIY'],
    type: 'image',
  },
  // 职场视频
  {
    id: 11,
    title: '职场新人必知的5个沟通技巧',
    author: {
      id: 1101,
      name: 'HR小姐姐',
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60',
    like: 1567,
    tags: ['职场', '沟通', '成长'],
    type: 'video',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 360,
  },
  // 书籍推荐图片
  {
    id: 12,
    title: '2024年必读的10本好书推荐',
    author: {
      id: 1201,
      name: '读书小达人',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&auto=format&fit=crop&q=60',
    like: 777,
    tags: ['读书', '推荐', '成长'],
    type: 'image',
  },
  // 编程视频
  {
    id: 13,
    title: 'React Hooks 实战案例详解',
    author: {
      id: 1301,
      name: '代码侠客',
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format&fit=crop&q=60',
    like: 1999,
    tags: ['前端', 'React', 'Hooks'],
    type: 'video',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 720,
  },
  // 植物图片
  {
    id: 14,
    title: '阳台小花园 | 春天的绿意盎然',
    author: {
      id: 1401,
      name: '绿植达人',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop&q=60',
    like: 888,
    tags: ['植物', '阳台', '生活'],
    type: 'image',
  },
  // 音乐视频
  {
    id: 15,
    title: '吉他弹唱《晴天》教学',
    author: {
      id: 1501,
      name: '音乐老师小王',
      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=60',
    like: 2456,
    tags: ['音乐', '吉他', '教学'],
    type: 'video',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 540,
  },
  // 继续添加更多内容...
  {
    id: 16,
    title: '极简主义房间布置分享',
    author: {
      id: 1601,
      name: '极简生活家',
      img: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop&q=60',
    like: 1234,
    tags: ['家居', '极简', '生活'],
    type: 'image',
  },
  {
    id: 17,
    title: 'Python爬虫从入门到实战',
    author: {
      id: 1701,
      name: '后端工程师',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60',
    like: 3456,
    tags: ['Python', '爬虫', '编程'],
    type: 'video',
    video:
      'https://vd4.bdstatic.com/mda-ree9un2b1mjvt33c/cae_h264/1747292379850822234/mda-ree9un2b1mjvt33c.mp4?abtest=peav_l52&appver=&auth_key=1748957207-0-0-4f5e3da367d79a0d47d05250b03f624b&bcevod_channel=searchbox_feed&cd=0&cr=0&did=cfcd208495d565ef66e7dff9f98764da&logid=3407311679&model=&osver=&pd=1&pt=4&sl=945&sle=1&split=799792&vid=14129995574504724938&vt=1',
    duration: 900,
  },
  {
    id: 18,
    title: '今日街拍 | 春日暖阳下的慵懒午后',
    author: {
      id: 1801,
      name: '街拍达人',
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60',
    like: 2789,
    tags: ['街拍', '穿搭', '春日'],
    type: 'image',
  },
  {
    id: 19,
    title: '瑜伽初学者基础动作教学',
    author: {
      id: 1901,
      name: '瑜伽老师小雅',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=60',
    like: 1567,
    tags: ['瑜伽', '健身', '初学者'],
    type: 'video',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 450,
  },
  {
    id: 20,
    title: '手机摄影构图技巧大全',
    author: {
      id: 2001,
      name: '手机摄影师',
      img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=60',
    like: 999,
    tags: ['摄影', '手机', '构图'],
    type: 'image',
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
        data: posts.filter((post) => post.tags?.some((tag) => tag === category)),
        message: '获取分类帖子成功',
      }
    },
  },
  {
    url: '/api/posts/recommend',
    method: 'get',
    response: ({ query }: { query: { page?: number; limit?: number } }) => {
      const page = query.page || 1
      const limit = query.limit || 10
      return {
        code: 200,
        data: {
          list: posts.slice((page - 1) * limit, page * limit),
          total: posts.length,
        },
        message: '获取推荐帖子成功',
      }
    },
  },
] as MockMethod[]
