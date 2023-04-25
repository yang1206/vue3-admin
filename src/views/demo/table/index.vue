<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NForm, NSwitch } from 'naive-ui'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { formatDateTime, isNullOrUndef, renderIcon } from '@/utils'
import { addPost, deletePost, updatePost, usePosts } from '@/api'
import type { RowData } from '@/api/types'

const queryClient = useQueryClient()
const modalAction = ref('')
let modalForm = reactive({ author: '大脸怪', title: '', content: '' })
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
  mutationFn: addPost,
  onSuccess: () => {
    modalVisible.value = false
    window.$message?.success('新增成功')
  },
})

const { mutate: updateMutate } = useMutation({
  mutationFn: updatePost,
  onSuccess: () => {
    modalVisible.value = false
    window.$message?.success('修改成功')
  },
})

const { mutate: deleteMutate } = useMutation({
  mutationFn: deletePost,
  onSuccess: () => {
    window.$message?.success('删除成功')
  },
  onError: () => {
    window.$message?.success('删除失败')
  },
})

const { data, isLoading } = usePosts(queryForm)

async function handleQuery() {
  queryClient.refetchQueries(['posts'])
}

const columns: DataTableColumns<RowData> = [
  { type: 'selection', fixed: 'left' },
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
]

// 选中事件
function onChecked(rowKeys: string[]) {
  if (rowKeys.length)
    window.$message?.info(`选中${rowKeys.join(' ')}`)
}

// 发布
function handlePublish(row: RowData) {
  if (isNullOrUndef(row.id))
    return

  row.publishing = true
  setTimeout(() => {
    row.isPublish = !row.isPublish
    row.publishing = false
    window.$message?.success(row.isPublish ? '已发布' : '已取消发布')
  }, 1000)
}

async function handleReset() {
  queryForm.title = ''
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
function handleEdit(row: RowData) {
  modalAction.value = 'edit'
  modalVisible.value = true
  modalForm = { ...row }
}

/** 查看 */
function handleView(row: RowData) {
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
</script>

<template>
  <CommonPage show-footer title="文章">
    <template #action>
      <NButton type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新建文章
      </NButton>
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
      </div>
    </div>

    <n-data-table
      mt-30 :scroll-x="1200" :loading="isLoading" :columns="columns" :data="data?.pageData"
      :pagination="{ ...queryForm }" :bordered="false" :row-key="row => row.id" @update:checked-row-keys="onChecked"
    />
    <!-- 新增/编辑/查看 -->
  </CommonPage>
  <n-modal
    v-model:show="modalVisible" preset="card" size="huge" :bordered="false" class="w-600px" :title="modalTitle"
    :loading="isLoading"
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
  </n-modal>
</template>
