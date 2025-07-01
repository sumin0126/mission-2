import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', () => {
  const data = ref('')

  function setData(value: string) {
    data.value = value
  }

  return { data, setData }
})
