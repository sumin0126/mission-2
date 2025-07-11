import { createI18n } from 'vue-i18n'
import ko from './locales/ko'
import en from './locales/en'

// 브라우저 자체 언어 감지 함수 (내부 사용)
const getBrowserLanguage = (): string => {
  const language = navigator.language.toLowerCase()

  if (language.startsWith('ko')) {
    return 'ko'
  } else if (language.startsWith('en')) {
    return 'en'
  }

  // 기본값은 한국어
  return 'ko'
}

// 저장된 언어 또는 브라우저 언어 가져오기 (내부 사용)
const getStoredLanguage = (): string => {
  return localStorage.getItem('language') || getBrowserLanguage()
}

// 메시지 객체
const messages = {
  ko,
  en,
}

// i18n 인스턴스 생성
const i18n = createI18n({
  legacy: false, // Composition API 사용
  locale: getStoredLanguage(), // 기본 언어 설정
  fallbackLocale: 'ko', // 백업 언어 (번역이 없을 때 대신 사용할 언어)
  messages,
  globalInjection: true, // 전역 주입 활성화
})

// 지원하는 언어 타입
export type SupportedLocale = 'ko' | 'en'

// 지원하는 언어 목록 (실제 사용)
export const supportedLanguages = [
  { code: 'ko' as SupportedLocale, name: '한국어', flag: '🇰🇷' },
  { code: 'en' as SupportedLocale, name: 'English', flag: '🇺🇸' },
]

// 언어 변경 함수
export const setLanguage = (locale: SupportedLocale) => {
  i18n.global.locale.value = locale
  localStorage.setItem('language', locale)
  document.documentElement.lang = locale
}

// 현재 언어 가져오기
export const getCurrentLanguage = (): SupportedLocale => {
  return i18n.global.locale.value as SupportedLocale
}

// 현재 언어 정보 가져오기 (국기, 이름 포함)
export const getCurrentLanguageInfo = () => {
  const currentLang = getCurrentLanguage()
  return supportedLanguages.find((lang) => lang.code === currentLang) || supportedLanguages[0]
}

export default i18n
