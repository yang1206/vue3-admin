import { useQuery } from '@tanstack/vue-query'
import type { IPostsData } from './types'
import request from '@/service'

export function getPosts(data?: any) {
  return request<unknown, IPostsData>({
    url: 'posts',
    method: 'GET',
    data,
  })
}

export function usePosts(query: any) {
  return useQuery(['posts'], async () => {
    const response = await getPosts(query)
    return response.data
  })
}

export function getPostById(id: string) {
  return request<unknown, any>({
    url: `/post/${id}`,
    method: 'GET',
  })
}

export function addPost(data: {
  author: string
  title: string
  content: string
}) {
  return request<{
    author: string
    title: string
    content: string
  }, any>({
    url: '/post',
    method: 'POST',
    data,
  })
}

export function updatePost(data: any) {
  return request<unknown, any>({
    url: `/post/${data.id}`,
    method: 'PUT',
    data,
  })
}

export function deletePost(id: number) {
  return request<unknown, any>({
    url: `/post/${id}`,
    method: 'DELETE',
  })
}
