declare namespace POST {
  export interface RowData {
    id: number
    isPublish: boolean
    title: string
    category: string
    author: string
    createDate: string
    updateDate: string
    publishing: boolean
    description: string
    content: string
    isRecommend: boolean
  }
  export interface IPostsData {
    pageData: RowData[]
    total: number
  }

}