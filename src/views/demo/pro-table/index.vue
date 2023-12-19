<script setup lang="ts">
import { NProTable, defineTable, useColumns } from 'naive-ui-pro-components'
import {
  NSwitch,
} from 'naive-ui'
import { useQuery } from '@tanstack/vue-query'
import {
  formatDateTime,
  isNullOrUndef,
} from '@/utils'
import { fetchPosts } from '@/api'

const queryForm = reactive({
  title: '',
  page: 1,
  pageSize: 10,
})

// 发布
function handlePublish(row: POST.RowData) {
  if (isNullOrUndef(row.id))
    return

  row.publishing = true
  setTimeout(() => {
    row.isPublish = !row.isPublish
    row.publishing = false
    window.$message?.success(row.isPublish ? '已发布' : '已取消发布')
  }, 1000)
}

const columns = useColumns<POST.RowData>([
  {
    title: '发布',
    key: 'isPublish',
    width: 60,
    align: 'center',
    fixed: 'left',
    render(row) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: row.isPublish,
        loading: !!row.publishing,
        onUpdateValue: () => handlePublish(row),
      })
    },
  },
  { title: '标题', key: 'title', width: 150, ellipsis: { tooltip: true } },
  { title: '分类', key: 'category', width: 80, ellipsis: { tooltip: true } },
  { title: '创建人', key: 'author', width: 80 },
  {
    title: '创建时间',
    key: 'createDate',
    width: 150,
    render(row) {
      return h('span', formatDateTime(row.createDate))
    },
  },
  {
    title: '最后更新时间',
    key: 'updateDate',
    width: 150,
    render(row) {
      return h('span', formatDateTime(row.updateDate))
    },
  },
])

const { refetch } = useQuery(computed(() => {
  return {
    ...fetchPosts(queryForm),
  }
}))

const table = defineTable<POST.RowData[]>({
  request: async ({ page, pageSize }) => {
    queryForm.page = page
    queryForm.pageSize = pageSize
    const data = await refetch()
    return {
      data: data.data?.pageData,
      total: data.data?.total,
    } as any
  },
  pagination: { pageSize: 10 },
  // 默认开始请求第一页
  immediate: true,
})

const controls = defineControls([
  {
    render: '搜索',
    helper: () => table.search(),
  },
  {
    render: '重置',
    type: 'primary',
    secondary: true,
    // 重置当前表格页，并重新请求
    helper: () => {
      queryForm.title = ''
      table.reset()
    },
  },
])
</script>

<template>
  <CommonPage show-footer title="文章">
    <div bg="#fafafc" min-h-60 flex items-start justify-between b-1 rounded-8 p-15 bc-ccc dark:bg-black>
      <n-space wrap :size="[35, 15]">
        <div flex items-center>
          <label w-80 flex-shrink-0 :style="{ width: `50px` }">
            标题
          </label>
          <div flex-shrink-0>
            <n-input v-model:value="queryForm.title" type="text" placeholder="请输入标题" @keydown.enter="table.search()" />
          </div>
        </div>
      </n-space>

      <component :is="controls" style="margin-bottom: 24px;" />
    </div>
    <NProTable mt-30 :instance="table" :columns="columns" :bordered="false" :row-key="row => row.id" />
  </CommonPage>
</template>
