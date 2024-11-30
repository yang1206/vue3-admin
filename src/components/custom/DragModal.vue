<script lang="ts" setup>
import type { ModalProps } from 'naive-ui'
import { omit, throttle } from 'lodash-es'
import { NModal } from 'naive-ui'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface Props extends /* @vue-ignore */ Omit<ModalProps, 'show' | 'on-update:show'> {
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fullscreen: false,
  to: 'body',
})
const route = useRoute()

const openModel = defineModel<boolean>('open')

const fullscreenModel = ref(props.fullscreen)

function useDragModal(draggableEl: HTMLElement, childrenSelectors = '.drag-modal-header') {
  const targetEl = draggableEl.querySelector(childrenSelectors) as HTMLElement
  if (!targetEl)
    return

  targetEl.style.cursor = 'move'
  targetEl.style.userSelect = 'none'
  mousedown(targetEl as HTMLElement, draggableEl)
  mouseup()
}

function mousedown(targetEl: HTMLElement, draggableEl: HTMLElement) {
  targetEl.onmousedown = throttle((event: MouseEvent) => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const { width, height, x: minMoveX, y: minMoveY } = draggableEl.getBoundingClientRect()
    const maxMoveX = viewportWidth - width - minMoveX
    const maxMoveY = viewportHeight - height - minMoveY
    const { clientX: originX, clientY: originY } = event
    const { left, top } = draggableEl.style
    const styleLeft = left?.replace('px', '') ?? 0
    const styleTop = top.replace('px', '') ?? 0

    document.onmousemove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      let moveX = clientX - originX
      let moveY = clientY - originY
      if (moveX > maxMoveX)
        moveX = maxMoveX
      else if (-moveX > minMoveX)
        moveX = -minMoveX

      if (moveY > maxMoveY)
        moveY = maxMoveY
      else if (-moveY > minMoveY)
        moveY = -minMoveY

      draggableEl.style.cssText += `;left:${+styleLeft + moveX}px;top:${+styleTop + moveY}px`
    }
  }, 20)
}

function mouseup() {
  document.onmouseup = () => {
    document.onmousemove = null
  }
}
watch(() => route.fullPath, () => {
  fullscreenModel.value = false
})
</script>

<template>
  <NModal
    v-model:show="openModel"
    :mask-closable="false"
    :closable="true"
    header-class="drag-modal-header"
    preset="card"
    v-bind="omit(props, ['show', 'preset', 'on-negative-click', 'on-update:show'])"
    :z-index="100000000"
    :style="fullscreenModel ? { width: '100vw', height: '100vh', left: '0', top: '0' } : $attrs.style"
    @after-enter="useDragModal($event as unknown as HTMLElement)"
  >
    <template #header>
      <slot name="title">
        {{ $attrs.title || '标题' }}
      </slot>
    </template>
    <template #header-extra>
      <n-button size="tiny" class="ant-modal-operate" @click.stop>
        <TheIcon v-if="!fullscreenModel" icon="ant-design:fullscreen-exit-outlined" @click="fullscreenModel = true" />
        <TheIcon v-else icon="ant-design:fullscreen-outlined" @click="fullscreenModel = false" />
      </n-button>
    </template>
    <slot>
      ① 窗口可以拖动；<br>
      ② 窗口可以通过八个方向改变大小；<br>
      ③ 窗口可以最小化、最大化、还原、关闭；<br>
      ④ 限制窗口最小宽度/高度。
    </slot>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </NModal>
</template>
