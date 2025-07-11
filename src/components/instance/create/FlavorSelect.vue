<template>
  <div class="select-container" ref="selectContainer">
    <div
      class="select-box"
      :class="{ active: isOpen }"
      @click="toggleDropdown"
      @keydown.enter.prevent="emit('keydown:enter', $event)"
      tabindex="0"
    >
      <span :class="{ placeholder: !modelValue }">
        {{
          modelValue
            ? `${modelValue} - ${t(
                mockFlavors.find((f) => f.name === modelValue)?.description || ''
              )}`
            : t('instance.create.form.flavor.placeholder')
        }}
      </span>
      <span class="arrow-down"></span>
    </div>
    <div v-if="isOpen" class="dropdown-list">
      <div
        v-for="flavor in mockFlavors"
        :key="flavor.name"
        class="dropdown-item"
        :class="{ selected: flavor.name === modelValue }"
        @click="selectItem(flavor)"
      >
        {{ flavor.name }}
        <div class="flavor-detail">{{ t(flavor.description) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { mockFlavors } from '@/mock/data/flavors'
import type { Flavor } from '@/mock/types/flavor'

const { t } = useI18n()

// 부모 컴포넌트로부터 받는 props (선택된 Flavor 이름)
defineProps<{
  modelValue: string
}>()

// 부모 컴포넌트로 이벤트를 전달하기 위한 emit 함수들
const emit = defineEmits<{
  'update:modelValue': [value: string] // 선택된 Flavor 이름 업데이트
  'update:flavor-detail': [flavor: Flavor] // 선택된 Flavor의 상세 정보 업데이트
  'keydown:enter': [event: KeyboardEvent] // 엔터키 이벤트
}>()

// 드롭다운 메뉴의 열림/닫힘 상태
const isOpen = ref(false)
// 컴포넌트의 최상위 요소 참조 (외부 클릭 감지용)
const selectContainer = ref<HTMLElement | null>(null)

/**
 * 드롭다운 메뉴의 열림/닫힘 상태를 토글합니다.
 */
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

/**
 * Flavor 항목 선택 시 호출되는 함수
 * @param flavor 선택된 Flavor 객체
 */
const selectItem = (flavor: Flavor) => {
  emit('update:modelValue', flavor.name)
  emit('update:flavor-detail', flavor)
  isOpen.value = false
}

/**
 * 컴포넌트 외부 클릭을 감지하여 드롭다운을 닫는 함수
 * @param event 마우스 클릭 이벤트
 */
const handleClickOutside = (event: MouseEvent) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// 컴포넌트가 마운트될 때 전역 클릭 이벤트 리스너 등록
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 컴포넌트가 언마운트될 때 이벤트 리스너 제거 (메모리 누수 방지)
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.select-container {
  position: relative;
  display: flex;
}

.select-box {
  flex: 1;
  height: 40px;
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #262626;
  background-color: #ffffff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-box:hover {
  border-color: #40a9ff;
}

.select-box.active {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.arrow-down {
  border: solid #8c8c8c;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  margin-left: 8px;
  transition: transform 0.2s;
}

.select-box.active .arrow-down {
  transform: rotate(-135deg);
}

.dropdown-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #262626;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.selected {
  background-color: #e6f7ff;
}

.flavor-detail {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.placeholder {
  color: #bfbfbf;
}
</style>
