import { queryOptions } from '@tanstack/vue-query'
import request from '@/service'

export function fetchPosts(data?: any) {
  return queryOptions({
    queryKey: [data,'posts'],
    queryFn: async () => (await request.get<IAxiosResponseData<POST.IPostsData>>('posts')).data
  })
}


export function fetchPostById(id: string) {
  return queryOptions({
    queryKey: [id,'post'],
    queryFn: async () => await request.get(`/post/${id}`)
  })
}



export function addPost( ) {
  return {
    mutationKey: ['post'],
    mutationFn: async (data: {
      author: string
      title: string
      content: string
    }) => (await request.post('/post', data))
  }
}

export function updatePost() {
  return {
    mutationFn: async (data: any) => (await request.put(`/post/${data.id}`))
  }
}

export function deletePost() {
  return {
    mutationFn: async (id: number) => (await request.delete(`/post/${id}`))
  }
}
