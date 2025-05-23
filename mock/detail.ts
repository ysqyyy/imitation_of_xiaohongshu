import type { MockMethod } from 'vite-plugin-mock'
import type { PostDetail, Comment, Author } from '../src/types/user'

// 模拟帖子详情数据
const postDetailsData: Record<number, PostDetail> = {
  1: {
    id: 1,
    imgs: [
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60',
    ],
    title: 'Vue3 教程',
    content:
      '这是一篇详细的Vue3教程，包含Composition API、响应式系统和生命周期钩子的详细讲解。在这个项目中，我将演示如何创建一个现代化的Vue3应用程序，并展示框架的强大特性。\n\n本教程适合有一定Vue2基础的开发者，但即使你是完全的新手，按照步骤操作也能快速入门。',
    tabs: ['前端', 'Vue3', '学习', '教程'],
    author: {
      id: 101,
      name: '小明',
      img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    like: 88,
    fav: 36,
    time: '2023-12-10 14:30',
    isLike: false,
    isFav: false,
    comments: [
      {
        id: 1001,
        content: '这个教程太棒了，学到了很多新知识！',
        author: {
          id: 102,
          name: '前端爱好者',
          img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&auto=format&fit=crop&q=60',
          isAuthor: false,
          isFollowed: true,
        },
        like: 15,
        time: '2023-12-11 09:25',
        isLike: true,
        reply: [
          {
            id: 1002,
            content: '谢谢支持，后续会更新更多内容！',
            author: {
              id: 101,
              name: '小明',
              img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
              isAuthor: true,
              isFollowed: false,
            },
            like: 8,
            time: '2023-12-11 10:30',
            isLike: false,
          },
        ],
      },
      {
        id: 1003,
        content: '请问有没有对Pinia状态管理的介绍？',
        author: {
          id: 103,
          name: '学习者',
          img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500&auto=format&fit=crop&q=60',
          isAuthor: false,
          isFollowed: false,
        },
        like: 5,
        time: '2023-12-12 16:40',
        isLike: false,
      },
    ],
  },
  2: {
    id: 2,
    imgs: [
      'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500&auto=format&fit=crop&q=60',
    ],
    title: 'React 实战',
    content:
      '本文将带你从零开始构建一个React应用，涵盖Hooks、Context API和自定义组件。React是前端领域最流行的框架之一，它的组件化思想和虚拟DOM机制极大提升了开发效率和应用性能。\n\n通过这篇实战教程，你将学会如何搭建工程、状态管理以及路由配置等核心知识。',
    tabs: ['前端', 'React', '实战'],
    author: {
      id: 201,
      name: '小红',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    like: 66,
    fav: 28,
    time: '2023-12-08 10:15',
    isLike: true,
    isFav: true,
    comments: [
      {
        id: 2001,
        content: '请问React18的新特性有哪些值得关注的？',
        author: {
          id: 202,
          name: 'React粉丝',
          img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
          isAuthor: false,
          isFollowed: false,
        },
        like: 12,
        time: '2023-12-09 11:20',
        isLike: false,
      },
    ],
  },
  3: {
    id: 3,
    imgs: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60',
    ],
    title: '小红书仿写',
    content:
      '这是一个使用Vue3和TypeScript开发的小红书仿写项目，实现了主页、发现、个人中心等核心功能。本项目采用了最新的前端技术栈，包括Vite构建工具、Vue Router路由管理和Pinia状态管理。\n\n通过这个项目，你可以学习到如何构建一个完整的社交媒体应用，以及前端工程化的最佳实践。',
    tabs: ['前端', 'Vue3', '项目实战', '小红书'],
    author: {
      id: 301,
      name: '小刚',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    like: 77,
    fav: 45,
    time: '2023-12-05 16:30',
    isLike: false,
    isFav: false,
    comments: [
      {
        id: 3001,
        content: '非常棒的项目！请问如何实现模态路由的效果？',
        author: {
          id: 302,
          name: '前端新手',
          img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60',
          isAuthor: false,
          isFollowed: true,
        },
        like: 23,
        time: '2023-12-06 09:45',
        isLike: true,
        reply: [
          {
            id: 3002,
            content: '模态路由主要是通过查询参数和动态组件实现的，可以看代码中的router配置部分',
            author: {
              id: 301,
              name: '小刚',
              img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
              isAuthor: true,
              isFollowed: false,
            },
            like: 18,
            time: '2023-12-06 10:20',
            isLike: true,
          },
        ],
      },
    ],
  },
  // 更多帖子详情...可以继续添加
  4: {
    id: 4,
    imgs: [
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1550439062-609e1531270e?w=500&auto=format&fit=crop&q=60',
    ],
    title: '前端面试宝典',
    content:
      '收集整理了前端领域常见的面试题和解答，包括JavaScript、CSS、框架和工程化等各个方面。这份面试宝典汇总了我在大厂面试中遇到的真实问题，以及面试官期望的答案思路。\n\n无论你是准备校招还是社招，这份资料都能帮助你系统性地复习前端知识，提高面试通过率。',
    tabs: ['前端', '面试', '求职'],
    author: {
      id: 401,
      name: '小智',
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: true,
    },
    like: 100,
    fav: 76,
    time: '2023-12-01 08:20',
    isLike: true,
    isFav: true,
    comments: [],
  },
  5: {
    id: 5,
    imgs: [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60',
    ],
    title: '美食分享',
    content:
      '今天给大家分享一道家常菜——糖醋排骨的做法。这道菜色泽红亮，酸甜可口，非常适合家庭聚餐。\n\n准备材料：排骨500g，白醋30ml，白糖50g，酱油15ml，葱姜蒜适量。\n\n制作步骤：\n1. 排骨焯水去腥\n2. 热锅冷油，放入排骨煎至金黄\n3. 加入调料，小火焖煮20分钟\n4. 大火收汁即可',
    tabs: ['美食', '家常菜', '烹饪技巧'],
    author: {
      id: 501,
      name: '小美',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
      isAuthor: true,
      isFollowed: false,
    },
    like: 59,
    fav: 32,
    time: '2023-12-07 18:45',
    isLike: false,
    isFav: false,
    comments: [
      {
        id: 5001,
        content: '看起来太美味了，我明天就试试！',
        author: {
          id: 502,
          name: '美食爱好者',
          img: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=500&auto=format&fit=crop&q=60',
          isAuthor: false,
          isFollowed: false,
        },
        like: 8,
        time: '2023-12-08 08:10',
        isLike: false,
      },
    ],
  },
}

export default [
  {
    url: '/api/detail/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const id = Number(params.id)
      const postDetail = postDetailsData[id]

      if (postDetail) {
        return {
          code: 200,
          data: postDetail,
          message: '获取帖子详情成功',
        }
      } else {
        return {
          code: 404,
          data: null,
          message: '帖子详情不存在',
        }
      }
    },
  },
  {
    url: '/api/detail/like',
    method: 'post',
    response: ({ body }: { body: { id: number } }) => {
      const { id } = body
      const post = postDetailsData[id]

      if (post) {
        post.isLike = !post.isLike
        post.like += post.isLike ? 1 : -1

        return {
          code: 200,
          data: {
            isLike: post.isLike,
            like: post.like,
          },
          message: post.isLike ? '点赞成功' : '取消点赞成功',
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
    url: '/api/detail/fav',
    method: 'post',
    response: ({ body }: { body: { id: number } }) => {
      const { id } = body
      const post = postDetailsData[id]

      if (post) {
        post.isFav = !post.isFav
        post.fav += post.isFav ? 1 : -1

        return {
          code: 200,
          data: {
            isFav: post.isFav,
            fav: post.fav,
          },
          message: post.isFav ? '收藏成功' : '取消收藏成功',
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
    url: '/api/detail/comment',
    method: 'post',
    response: ({ body }: { body: { postId: number; content: string } }) => {
      const { postId, content } = body
      const post = postDetailsData[postId]

      if (post) {
        const newComment: Comment = {
          id: Date.now(), // 使用时间戳作为临时ID
          content,
          author: {
            id: 101, // 假设当前用户ID为101
            name: '当前用户',
            img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60',
            isAuthor: false,
            isFollowed: false,
          },
          like: 0,
          time: new Date().toLocaleString(),
          isLike: false,
        }

        if (!post.comments) {
          post.comments = []
        }

        post.comments.push(newComment)

        return {
          code: 200,
          data: newComment,
          message: '评论成功',
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
] as MockMethod[]
