import { computed } from 'vue'
import { setLanguage, getCurrentLanguageInfo, supportedLanguages } from '.'

export function useLanguage() {
  const currentLanguageInfo = computed(() => getCurrentLanguageInfo())

  // 언어 전환 함수 (한국어 ↔ 영어)
  const switchLanguage = () => {
    const currentLang = currentLanguageInfo.value.code
    const nextLang = supportedLanguages.find((lang) => lang.code !== currentLang)?.code || 'ko'
    setLanguage(nextLang)
  }

  return {
    currentLanguageInfo,
    switchLanguage,
  }
}
