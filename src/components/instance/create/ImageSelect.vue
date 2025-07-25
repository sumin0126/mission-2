<template>
  <BaseSelect
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :items="mockImages"
    :placeholder="t('instance.create.form.image.placeholder')"
    @keydown:enter="$emit('keydown:enter', $event)"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { mockImages } from '@/mock/data/images'
import BaseSelect from '@/components/common/BaseSelect.vue'

const { t } = useI18n()

defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  'keydown:enter': [event: KeyboardEvent]
}>()
</script>

<style scoped>
/* 이미지 선택에만 필요한 추가 스타일이 있다면 여기에 추가 */
</style>
