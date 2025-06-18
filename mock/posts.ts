import type { MockMethod } from 'vite-plugin-mock'
import type { PostCard } from '../src/types/index'

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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
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
    isLike: false,
  },
  // 继续添加更多内容...
]

export default [
  {
    url: '/api/posts/search',
    method: 'get',
    response: ({
      query,
    }: {
      query: { keyword?: string; page?: number; limit?: number; tag?: string }
    }) => {
      const keyword = query.keyword || ''
      const page = Number(query.page) || 1
      const limit = Number(query.limit) || 9
      const tag = query.tag

      // 根据关键词和标签过滤帖子
      let filteredPosts = posts.filter((post) => post.title.includes(keyword))

      // 如果指定了标签，进一步过滤
      if (tag && tag !== '全部') {
        filteredPosts = filteredPosts.filter((post) => post.tags?.includes(tag))
      }

      // 计算总数和分页数据
      const total = filteredPosts.length
      const list = filteredPosts.slice((page - 1) * limit, page * limit)

      return {
        code: 200,
        data: {
          list,
          total,
        },
        message: '搜索帖子成功',
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
  {
    url: '/api/posts/related-videos',
    method: 'get',
    response: ({ query }: { query: { postId?: number; page?: number; limit?: number } }) => {
      const postId = Number(query.postId) || 1
      const page = Number(query.page) || 1
      const limit = Number(query.limit) || 5

      // 获取原始帖子的标签，用于筛选相关视频
      const originalPost = posts.find((p) => p.id === postId)
      const relatedTags = originalPost?.tags || []

      // 筛选出所有视频类型的帖子
      const allVideoPosts = posts.filter((p) => p.type === 'video' && p.id !== postId)

      // 根据标签相关性排序（与原帖子共享标签越多越相关）
      const sortedVideoPosts = allVideoPosts.sort((a, b) => {
        const tagsMatchA = a.tags?.filter((tag) => relatedTags.includes(tag)).length || 0
        const tagsMatchB = b.tags?.filter((tag) => relatedTags.includes(tag)).length || 0
        return tagsMatchB - tagsMatchA // 降序排列
      })

      // 转换为PostDetail格式
      const videoDetails = sortedVideoPosts.map((post) => ({
        id: post.id,
        title: post.title,
        content: `这是与帖子#${postId}相关的视频内容：${post.title}`,
        imgs: [post.img], // 使用PostCard的img作为PostDetail的imgs数组第一项
        tags: post.tags || [],
        author: post.author,
        like: post.like,
        fav: Math.floor(post.like / 2), // 模拟收藏数据
        time: new Date().toISOString(),
        isLike: post.isLike,
        isFav: Math.random() > 0.5, // 随机设置是否收藏
        video: post.video,
        type: 'video',
        duration: post.duration || 60,
      }))

      // 如果相关视频不足，生成一些随机视频补充
      if (videoDetails.length < page * limit + 10) {
        // 预先生成更多视频，避免频繁生成
        const baseId = 10000 + videoDetails.length
        for (let i = 0; i < limit * 3; i++) {
          // 生成3倍于limit的视频数量
          const id = baseId + i
          videoDetails.push({
            id,
            title: `相关推荐视频 ${id}`,
            content: `这是与帖子#${postId}相关的随机推荐视频内容`,
            imgs: [`https://picsum.photos/seed/${id}/400/300`],
            tags: [...(relatedTags.length > 0 ? [relatedTags[0]] : []), '推荐', `标签${i % 5}`],
            author: {
              id: 100 + i,
              name: `用户${100 + i}`,
              img: `https://i.pravatar.cc/150?u=${100 + i}`,
              isFollowed: Math.random() > 0.5,
              isAuthor: false,
            },
            like: Math.floor(Math.random() * 1000),
            fav: Math.floor(Math.random() * 500),
            time: new Date().toISOString(),
            isLike: Math.random() > 0.5,
            isFav: Math.random() > 0.5,
            video: `https://www.w3schools.com/html/mov_bbb.mp4?id=${id}`,
            type: 'video',
            duration: 30 + Math.floor(Math.random() * 120),
          })
        }
      }

      // 分页处理
      const total = videoDetails.length
      const list = videoDetails.slice((page - 1) * limit, page * limit)

      return {
        code: 200,
        data: {
          list,
          total,
        },
        message: '获取相关视频成功',
      }
    },
  },
] as MockMethod[]
