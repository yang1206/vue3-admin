<script setup lang="ts" generic="T">
import { ref, watch } from 'vue'
import type { DataTableColumn } from 'naive-ui'
import type { UseDraggableReturn } from 'vue-draggable-plus'
import { VueDraggable } from 'vue-draggable-plus'

type Column = DataTableColumn<T>

interface Props {
  columns: Column[]
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()
const el = ref<UseDraggableReturn>()
interface Emits {
  (e: 'update:columns', columns: Column[]): void
}

type List = Column & { checked?: boolean }

const list = ref<List[]>(initList())

function initList(): List[] {
  return props.columns.map(item => ({ ...item, checked: true }))
}

watch(
  list,
  (newValue) => {
    const newColumns = newValue.filter(item => item.checked)

    const columns: Column[] = newColumns.map((item) => {
      const column = { ...item }
      delete column.checked

      return column
    }) as Column[]

    emit('update:columns', columns)
  },
  { deep: true },
)
</script>

<template>
  <n-popover placement="bottom" trigger="click">
    <template #trigger>
      <n-button size="small" type="primary">
        <icon-ant-design-setting-outlined class="mr-4px text-16px" />
      </n-button>
    </template>
    <div class="w-180px">
      <VueDraggable ref="el" v-model="list" ghost-class="ghost">
        <div v-for="item in (list as any)" :key="item.key" class="h-36px flex items-center px-12px hover:bg-primary_active">
          <icon-mdi-drag class="mr-8px cursor-move text-20px" />
          <n-checkbox v-model:checked="item.checked">
            {{ item.title }}
          </n-checkbox>
        </div>
      </VueDraggable>
    </div>
  </n-popover>
</template>

<style scoped></style>
