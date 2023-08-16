const posts = [
  {
    title: '飞机场的10：30',
    author: 'David Tao',
    category: 'R&B',
    description: '10:30的飞机快要到了， 机场还是那么的拥挤',
    content: '1: 30的我在回家的路上旅客名单没你的名字， 我想你已经做了最后决定，哦， 我已失去你',
    isRecommend: true,
    isPublish: true,
    createDate: '2021-11-04T04:03:36.000Z',
    updateDate: '2021-11-04T04:03:36.000Z',
  },
  {
    title: '普通朋友',
    author: 'David Tao',
    category: 'R&B',
    description: '等待我随时随地在等待',
    content: `
    但你说 爱I only want to be your friend做个朋友我在你心中只是just a friend不是情人
    `,
    isRecommend: true,
    isPublish: false,
    createDate: '2021-10-25T08:57:47.000Z',
    updateDate: '2022-02-28T04:02:39.000Z',
  },
  {
    title: '二十二',
    author: 'David Tao',
    category: 'R&B',
    description: '春天是它最爱的季节，当微风随意吹乱他的头发',
    content: `
    九月天气还是有点热
    他想公车再不来就走一走路
    他开始明白等待未必有结果
    一个人也能走上梦的旅途
    他今年农历三月六号刚满二十二
    刚甩开课本要离开家看看这世界
    却发现许多烦恼要面对
    Oh yeah
    他常会想望能回到那年他一十二
    只需要好好上学生活单纯没忧愁
    他一直满怀希望
    `,
    isRecommend: true,
    isPublish: true,
    createDate: '2021-06-24T18:46:19.000Z',
    updateDate: '2021-09-23T07:51:22.000Z',
  },

  {
    title: 'Run Away',
    author: 'David Tao',
    category: 'Rock',
    description: '无名的怒火有说不出的无力想敲打我自己',
    content: `
    很多人再说,
    不断的一直说,
    必须这个样子做,
    不能够那样做,
    却又没有办法在自己的生命中突破oh yeah,
    如果再不走,
    就永远不会走,
    别让自己在回头,
    没挣扎怎能够有自由 
    快走
    现在就runaway runaway
    不想再怀疑自己对不对
    甩开一切无所谓 
    runaway runaway
    快点去runaway runaway
    不想再怀疑自己对不对
    是为自己不为谁
    不在乎的runaway
    `,
    isRecommend: true,
    isPublish: true,
    createDate: '2021-06-10T18:51:19.000Z',
    updateDate: '2021-09-17T09:33:24.000Z',
  },
  {
    title: '王八蛋',
    author: 'David Tao',
    category: 'Rock',
    description: '你这个没有心的王八蛋',
    content: `
    我的心好像有颗大的石头
    我的头好像原子弹要爆炸
    我的梦好像破了洞的气球
    我真的好倒霉
    `,
    isRecommend: true,
    isPublish: true,
    createDate: '2021-02-22T22:37:06.000Z',
    updateDate: '2021-09-17T09:33:24.000Z',
  },
]

export default [
  {
    url: '/api/posts',
    method: 'get',
    response: (data: MockOption) => {
      const { title, pageNum, pageSize } = data.query
      let pageData: { title: string; author: string; category: string; description: string; content: string; isRecommend: boolean; isPublish: boolean; createDate: string; updateDate: string }[] = []
      let total = 60
      const filterData = posts.filter(item => item.title.includes(title) || (!title && title !== 0))
      if (filterData.length) {
        if (pageSize) {
          while (pageData.length < pageSize)
            pageData.push(filterData[Math.round(Math.random() * (filterData.length - 1))])
        }
        else {
          pageData = filterData
        }
        pageData = pageData.map((item, index) => ({
          id: pageSize * (pageNum - 1) + index + 1,
          ...item,
        }))
      }
      else {
        total = 0
      }
      return {
        code: 0,
        message: 'ok',
        data: {
          pageData,
          total,
          pageNum,
          pageSize,
        },
      }
    },
  },
  {
    url: '/api/post',
    method: 'post',
    response: ({ body }: MockOption) => {
      return {
        code: 0,
        message: 'ok',
        data: body,
      }
    },
  },
  {
    url: '/api/post/:id',
    method: 'put',
    response: ({ query, body }: MockOption) => {
      return {
        code: 0,
        message: 'ok',
        data: {
          id: query.id,
          body,
        },
      }
    },
  },
  {
    url: '/api/post/:id',
    method: 'delete',
    response: ({ query }: MockOption) => {
      return {
        code: 0,
        message: 'ok',
        data: {
          id: query.id,
        },
      }
    },
  },
]
