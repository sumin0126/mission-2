<template>
  <div class="network-select">
    <BaseSelect
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :items="mockNetworks"
      :placeholder="t('instance.create.form.network.placeholder')"
      @keydown:enter="$emit('keydown:enter', $event)"
    >
      <template #item="{ item }">
        {{ item.name }}
        <span class="network-detail">{{ t(item.description) }}</span>
      </template>
    </BaseSelect>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { mockNetworks } from '@/mock/data/networks'
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
.network-detail {
  font-size: 14px;
  color: #595959;
}
</style>
