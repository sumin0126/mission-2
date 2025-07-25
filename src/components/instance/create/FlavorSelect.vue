<template>
  <BaseSelect
    :model-value="modelValue"
    @update:model-value="handleSelect"
    :items="mockFlavors"
    :placeholder="t('instance.create.form.flavor.placeholder')"
    @keydown:enter="$emit('keydown:enter', $event)"
  >
    <template #selected-value>
      <template v-if="modelValue"> {{ modelValue }} - {{ getFlavorDescription }} </template>
      <template v-else>
        {{ t('instance.create.form.flavor.placeholder') }}
      </template>
    </template>
    <template #item="{ item }">
      {{ item.name }}
      <div class="flavor-detail">{{ t(item.description) }}</div>
    </template>
  </BaseSelect>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { mockFlavors } from '@/mock/data/flavors'
import type { Flavor } from '@/mock/types/flavor'
import BaseSelect from '@/components/common/BaseSelect.vue'

const { t } = useI18n()

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:flavor-detail': [flavor: Flavor]
  'keydown:enter': [event: KeyboardEvent]
}>()

const getFlavorDescription = computed(() => {
  const flavor = mockFlavors.find((f) => f.name === props.modelValue)
  return flavor ? t(flavor.description) : ''
})

const handleSelect = (value: string) => {
  emit('update:modelValue', value)
  const selectedFlavor = mockFlavors.find((f) => f.name === value)
  if (selectedFlavor) {
    emit('update:flavor-detail', selectedFlavor)
  }
}
</script>

<style scoped>
.flavor-detail {
  font-size: 14px;
  color: #595959;
}
</style>
