<script setup lang="ts" generic="T">
import { ref, watch } from 'vue'
import type { DataTableColumn } from 'naive-ui'
import VueDraggable from 'vuedraggable'

type Column = DataTableColumn<T>

interface Props {
  columns: Column[]
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

interface Emits {
  (e: 'update:columns', columns: Column[]): void
}

type List = Column & { checked?: boolean }

const list = ref(initList())

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
      <VueDraggable v-model="list" item-key="key">
        <template #item="{ element }">
          <div v-if="element.key" class="h-36px flex items-center px-12px hover:bg-primary_active">
            <icon-mdi-drag class="mr-8px cursor-move text-20px" />
            <n-checkbox v-model:checked="element.checked">
              {{ element.title }}
            </n-checkbox>
          </div>
        </template>
      </VueDraggable>
    </div>
  </n-popover>
</template>

<style scoped></style>
