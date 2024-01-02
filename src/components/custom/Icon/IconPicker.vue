<script lang="ts">
import { computed, defineComponent, ref, shallowReactive, toRef } from 'vue'
import IconsData from './data/icons.data'

export default defineComponent({
  name: 'IconSelector',
  props: {
    defaultIcon: String,
    onUpdateIcon: Function,
  },
  emits: ['selected'],
  setup(props, { emit }) {
    const defaultIcon = toRef(props, 'defaultIcon')
    const pageSize = 40
    const icons = shallowReactive(IconsData.icons.slice(0, 40))
    const currentPage = ref(1)
    const itemCount = computed(() => IconsData.icons.length)
    const selectIcon = ref(defaultIcon.value || '选择图标')
    function onUpdatePage(page: number) {
      currentPage.value = page
      icons.length = 0
      const start = (currentPage.value - 1) * pageSize
      icons.push(...IconsData.icons.slice(start, start + pageSize))
    }

    const { onUpdateIcon } = props
    function onIconClick(name: string) {
      const icon = `${IconsData.prefix}:${name}`
      selectIcon.value = icon
      if (onUpdateIcon)
        onUpdateIcon(icon)
      else
        emit('selected', icon)
    }
    return {
      icons,
      selectIcon,
      currentPage,
      pageSize,
      itemCount,
      IconsData,
      onUpdatePage,
      onIconClick,
    }
  },
})
</script>

<template>
  <n-popover trigger="click" placement="bottom">
    <template #trigger>
      <n-button>
        <template v-if="selectIcon" #icon>
          <TheIcon :size="20" :icon="selectIcon" />
        </template>{{
          selectIcon }}
      </n-button>
    </template>
    <n-scrollbar class="grid-wrapper">
      <n-grid :cols="4" style="height: 300px">
        <n-grid-item v-for="item of icons" :key="item">
          <div class="icon-wrapper flex flex-col items-center justify-center p-2" @click="onIconClick(item)">
            <TheIcon :size="24" :icon="`${IconsData.prefix}:${item}`" />

            <n-ellipsis :line-clamp="1" style="font-size: 12px">
              {{ item }}
            </n-ellipsis>
          </div>
        </n-grid-item>
      </n-grid>
    </n-scrollbar>
    <div class="mb-2 mt-2 flex justify-end">
      <n-pagination
        :page="currentPage" :page-size="pageSize" :page-slot="5" :item-count="itemCount"
        @update-page="onUpdatePage"
      />
    </div>
  </n-popover>
</template>

<style lang="scss" scoped>
.grid-wrapper {
  padding: 10px;

  .icon-wrapper {
    cursor: pointer;
    border: 1px solid #f5f5f5;
  }
}
</style>
