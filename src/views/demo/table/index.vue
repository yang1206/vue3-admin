<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { addPost, deletePost, fetchPosts, updatePost } from '@/api'
import { useUserStore } from '@/store'
import { formatDateTime, renderIcon } from '@/utils'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { NButton, NForm } from 'naive-ui'

const userStore = useUserStore()
const modalAction = ref('')
let modalForm = reactive({ author: userStore.name, title: '', content: '' })
const modalFormRef = ref<InstanceType<typeof NForm>>()
const modalVisible = ref(false)
interface Actions {
  [key: string]: string
  view: string
  edit: string
  add: string
}

const ACTIONS: Actions = {
  view: '查看',
  edit: '编辑',
  add: '添加',
}

const modalTitle = computed(() => `${ACTIONS[modalAction.value]}文章`)
const queryForm = reactive({
  title: '',
  pageNum: 1,
  pageSize: 10,
})
const { mutate: addMutate } = useMutation({
  ...addPost(),
  onSuccess: () => {
    modalVisible.value = false
    window.$message?.success('新增成功')
  },
})

const { mutate: updateMutate } = useMutation({
  ...updatePost(),
  onSuccess: () => {
    modalVisible.value = false
    window.$message?.success('修改成功')
  },
})

const { mutate: deleteMutate } = useMutation({
  ...deletePost(),
  onSuccess: () => {
    window.$message?.success('删除成功')
  },
  onError: () => {
    window.$message?.success('删除失败')
  },
})

const { data, isLoading, refetch } = useQuery(computed(() => {
  return {
    ...fetchPosts(queryForm),
  }
}))

async function handleQuery() {
  refetch()
}

const columns = ref<DataTableColumns<POST.RowData>>([
  { type: 'selection', fixed: 'left' },
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
  {
    title: '操作',
    key: 'actions',
    width: 240,
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: () => handleView(row),
          },
          { default: () => '查看', icon: renderIcon('majesticons:eye-line', { size: 14 }) },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 15px;',
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑', icon: renderIcon('material-symbols:edit-outline', { size: 14 }) },
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 15px;',
            onClick: () => handleDelete(row.id),
          },
          { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
        ),
      ]
    },
  },
])

async function handleReset() {
  for (const key in queryForm)
    queryForm[key as keyof typeof queryForm] = null as unknown as never
  queryForm.pageNum = 1
  queryForm.pageSize = 10
  handleQuery()
}

function handleAdd() {
  modalAction.value = 'add'
  modalVisible.value = true
}
/** 保存 */
function handleSave() {
  if (!['edit', 'add'].includes(modalAction.value)) {
    modalVisible.value = false
    return
  }
  modalFormRef.value?.validate(async (err) => {
    if (err)
      return
    if (modalAction.value === 'add')
      addMutate(modalForm)

    else
      updateMutate(modalForm)
  })
}
/** 修改 */
function handleEdit(row: POST.RowData) {
  modalAction.value = 'edit'
  modalVisible.value = true
  modalForm = { ...row }
}

/** 查看 */
function handleView(row: POST.RowData) {
  modalAction.value = 'view'
  modalVisible.value = true
  modalForm = { ...row }
}
/** 删除 */
function handleDelete(id: number) {
  if (!id && id !== 0)
    return
  window.$dialog?.warning({
    content: '确定删除？',
    title: '提示',
    positiveText: '确定',
    negativeText: '取消',
    async onPositiveClick() {
      deleteMutate(id)
    },
  })
}

const Pagination = reactive(
  {
    page: queryForm.pageNum,
    pageSize: queryForm.pageSize,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 40],
    showQuickJumper: true,
    prefix: () => {
      return h('span', `共${data.value?.total}条`)
    },
    onChange: (page: number) => {
      Pagination.page = page
      queryForm.pageNum = page
    },
    onUpdatePageSize: async (pageSize: number) => {
      Pagination.pageSize = pageSize
      queryForm.pageSize = pageSize
      queryForm.pageNum = 1
    },
  },
)
</script>

<template>
  <CommonPage show-footer title="文章">
    <template #action>
      <div>
        <NButton v-permission="[2, 0, 1, 3, 4]" type="primary" @click="handleAdd">
          <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新建文章
        </NButton>
      </div>
    </template>

    <div bg="#fafafc" min-h-60 flex items-start justify-between b-1 rounded-8 p-15 bc-ccc dark:bg-black>
      <n-space wrap :size="[35, 15]">
        <div flex items-center>
          <label w-80 flex-shrink-0 :style="{ width: `50px` }">
            标题
          </label>
          <div flex-shrink-0>
            <n-input v-model:value="queryForm.title" type="text" placeholder="请输入标题" @keydown.enter="handleQuery" />
          </div>
        </div>
      </n-space>

      <div flex-shrink-0>
        <NButton secondary type="primary" @click="handleReset">
          重置
        </NButton>
        <NButton ml-20 type="primary" @click="handleQuery">
          搜索
        </NButton>
        <TableSetting v-model:columns="columns" />
      </div>
    </div>

    <n-data-table
      remote
      mt-30 :loading="isLoading" :columns="columns" :data="data?.pageData" :bordered="false"
      :row-key="row => row.id" :pagination="{ ...Pagination, itemCount: data?.total }"
    />
    <!-- 新增/编辑/查看 -->
  </CommonPage>
  <DragModal
    v-model:open="modalVisible"
    size="huge" :bordered="false" class="w-600px" :title="modalTitle" :loading="isLoading"
  >
    <NForm
      ref="modalFormRef" label-placement="left" label-align="left" :label-width="80" :model="modalForm"
      :disabled="modalAction === 'view'"
    >
      <n-form-item label="作者" path="author">
        <n-input v-model:value="modalForm.author" disabled />
      </n-form-item>
      <n-form-item
        label="文章标题" path="title" :rule="{
          required: true,
          message: '请输入文章标题',
          trigger: ['input', 'blur'],
        }"
      >
        <n-input v-model:value="modalForm.title" placeholder="请输入文章标题" />
      </n-form-item>
      <n-form-item
        label="文章内容" path="content" :rule="{
          required: true,
          message: '请输入文章内容',
          trigger: ['input', 'blur'],
        }"
      >
        <n-input
          v-model:value="modalForm.content" placeholder="请输入文章内容" type="textarea" :autosize="{
            minRows: 3,
            maxRows: 5,
          }"
        />
      </n-form-item>
    </NForm>
    <template v-if="modalAction !== 'view'" #footer>
      <footer flex justify-end>
        <NButton @click="modalVisible = false">
          取消
        </NButton>
        <NButton :loading="isLoading" ml-20 type="primary" @click="handleSave">
          保存
        </NButton>
      </footer>
    </template>
  </DragModal>
</template>
