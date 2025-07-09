<template>
  <label class="power-switch">
    <input type="checkbox" :checked="isRunning" @change="handleClick" :disabled="disabled" />
    <span class="slider"></span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  isRunning: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const handleClick = () => {
  emit('toggle')
}
</script>

<style scoped>
.power-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  cursor: pointer;
}

.power-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 22px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: #1890ff;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider:hover {
  box-shadow: 0 0 5px rgba(24, 144, 255, 0.3);
}

input:disabled + .slider {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
