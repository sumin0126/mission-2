<script setup lang="ts">
import { ref } from 'vue'
import { mockNetworks } from '@/mock/data/networks'
import type { Network } from '@/mock/types/network'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectNetwork = (network: Network) => {
  emit('update:modelValue', network.name)
  isOpen.value = false
}
</script>

<template>
  <div class="select-container">
    <div class="select-box" @click="toggleDropdown" :class="{ active: isOpen }">
      <span :class="{ placeholder: !modelValue }">{{
        modelValue || '네트워크를 선택해 주세요'
      }}</span>
      <span class="arrow-down"></span>
    </div>
    <div v-if="isOpen" class="dropdown-list">
      <div
        v-for="network in mockNetworks"
        :key="network.name"
        class="dropdown-item"
        :class="{ selected: network.name === modelValue }"
        @click="selectNetwork(network)"
      >
        <div class="network-name">{{ network.name }}</div>
        <div class="network-detail">{{ network.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-container {
  position: relative;
  width: 100%;
}

.select-box {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  height: 40px;
  font-size: 14px;
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
  padding: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #262626;
  position: relative;
  height: 48px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.selected {
  background-color: #e6f7ff;
}

.network-name {
  font-weight: 500;
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.network-detail {
  font-size: 12px;
  color: #8c8c8c;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.placeholder {
  color: #bfbfbf;
}
</style>
