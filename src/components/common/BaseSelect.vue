<template>
  <!-- 셀렉트 컴포넌트의 최상위 컨테이너 -->
  <div
    class="select-container"
    ref="selectContainer"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @keydown="handleKeyDown"
  >
    <!-- 선택된 값을 보여주는 박스 영역 -->
    <div
      class="select-box"
      :class="{ active: isOpen || isFocused }"
      @click="toggleDropdown"
      tabindex="0"
    >
      <span :class="{ placeholder: !modelValue }">
        <!-- 커스텀 선택 값 표시를 위한 슬롯 -->
        <slot name="selected-value">
          {{ modelValue || placeholder }}
        </slot>
      </span>
      <!-- 드롭다운 화살표 아이콘 -->
      <span class="arrow-down"></span>
    </div>

    <!-- 드롭다운 목록 -->
    <div v-if="isOpen" class="dropdown-list">
      <div
        v-for="(item, index) in items"
        :key="getItemKey(item)"
        class="dropdown-item"
        :class="{
          selected: isItemSelected(item),
          'keyboard-selected': index === selectedIndex,
        }"
        @click="selectItem(item)"
        @mouseenter="handleMouseEnter(index)"
      >
        <!-- 아이템 내용 표시를 위한 슬롯 -->
        <slot name="item" :item="item">
          {{ getItemLabel(item) }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Props 정의
const props = defineProps<{
  modelValue: string
  items: any[]
  placeholder?: string
  labelKey?: string
}>()

// 이벤트 정의
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'keydown:enter': [event: KeyboardEvent]
}>()

const isOpen = ref(false)
const selectedIndex = ref(-1)
const isFocused = ref(false)
const selectContainer = ref<HTMLElement | null>(null)

// 아이템의 고유 키 값을 가져오는 함수
const getItemKey = (item: any) => {
  return typeof item === 'string' ? item : item[props.labelKey || 'name']
}

// 아이템의 표시 레이블을 가져오는 함수
const getItemLabel = (item: any) => {
  return typeof item === 'string' ? item : item[props.labelKey || 'name']
}

// 아이템이 현재 선택된 값인지 확인하는 함수
const isItemSelected = (item: any) => {
  return getItemLabel(item) === props.modelValue
}

// 키보드 이벤트 처리 함수
const handleKeyDown = (event: KeyboardEvent) => {
  if (!isFocused.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        isOpen.value = true
      } else {
        selectedIndex.value = Math.min(selectedIndex.value + 1, props.items.length - 1)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      }
      break
    case 'Enter':
      if (isOpen.value && selectedIndex.value >= 0) {
        event.preventDefault()
        const selectedItem = props.items[selectedIndex.value]
        selectItem(selectedItem)

        // 현재 select-box 요소를 찾음
        const currentSelectBox = selectContainer.value?.querySelector('.select-box') as HTMLElement
        if (currentSelectBox) {
          // 현재 요소의 포커스를 해제
          currentSelectBox.blur()

          // 네트워크 선택 컴포넌트인지 확인
          const isNetworkSelect = selectContainer.value?.closest('.network-select')

          // 네트워크 선택이 아닌 경우에만 다음 필드로 포커스 이동
          if (!isNetworkSelect) {
            // 모든 포커스 가능한 요소들을 찾습니다
            const focusableElements = Array.from(
              document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              )
            ) as HTMLElement[]

            // 현재 요소의 인덱스를 찾습니다
            const currentIndex = focusableElements.findIndex((el) => el === currentSelectBox)

            // 다음 요소에 포커스를 줍니다
            if (currentIndex > -1 && currentIndex < focusableElements.length - 1) {
              focusableElements[currentIndex + 1].focus()
            }
          }
        }
      }
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      selectedIndex.value = -1
      break
  }
}

// 아이템 선택 처리 함수
const selectItem = (item: any) => {
  const value = getItemLabel(item)
  emit('update:modelValue', value)
  isOpen.value = false
  selectedIndex.value = -1
  isFocused.value = false

  // select-box의 포커스를 명시적으로 해제
  const selectBox = selectContainer.value?.querySelector('.select-box') as HTMLElement
  if (selectBox) {
    selectBox.blur()
  }
}

// 드롭다운 토글 함수도 수정
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    const currentIndex = props.items.findIndex((item) => getItemLabel(item) === props.modelValue)
    selectedIndex.value = currentIndex >= 0 ? currentIndex : -1
  } else {
    selectedIndex.value = -1
    // 드롭다운이 닫힐 때 포커스 상태도 해제합니다
    isFocused.value = false
  }
}

// 포커스 핸들러
const handleFocusIn = () => {
  isFocused.value = true
}

const handleFocusOut = () => {
  isFocused.value = false
}

// 마우스 엔터 핸들러
const handleMouseEnter = (index: number) => {
  selectedIndex.value = index
}

// 외부 클릭 처리 함수
const handleClickOutside = (event: MouseEvent) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    isOpen.value = false
    selectedIndex.value = -1
  }
}

// 컴포넌트 마운트 시 외부 클릭 이벤트 리스너 등록
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.select-container {
  position: relative;
  width: 100%;
}

.select-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: white;
  min-height: 40px;
  box-sizing: border-box;
}

.select-box:hover,
.select-box.active {
  border-color: #40a9ff;
}

.select-box:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.placeholder {
  color: #bfbfbf;
}

.arrow-down {
  border: solid #8c8c8c;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  margin-left: 8px;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 256px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-item:hover,
.dropdown-item.keyboard-selected {
  background-color: #f5f5f5;
}

.dropdown-item.selected {
  background-color: #e6f7ff;
  color: #1890ff;
}
</style>
