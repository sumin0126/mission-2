<template>
  <div class="breadcrumb-container">
    <nav class="breadcrumb">
      <!-- 현재 페이지 경로 (가상으로 클릭 불가) -->
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <span class="breadcrumb-text">{{ t('breadcrumb.server') }}</span>
        </li>
        <li class="breadcrumb-separator">
          <span>></span>
        </li>
        <li class="breadcrumb-item">
          <span class="breadcrumb-text">{{ t('breadcrumb.instance') }}</span>
        </li>
      </ol>

      <!-- 언어 선택 버튼 -->
      <div class="language-selector">
        <button class="language-btn" @click="switchLanguage" :title="currentLanguageInfo.name">
          <span class="language-flag">{{ currentLanguageInfo.flag }}</span>
          <span class="language-text">{{ currentLanguageInfo.name }}</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLanguage, getCurrentLanguageInfo, supportedLanguages } from '@/i18n'

const { t } = useI18n()

const currentLanguageInfo = computed(() => getCurrentLanguageInfo())

// 언어 전환 함수 (한국어 ↔ 영어)
const switchLanguage = () => {
  const currentLang = currentLanguageInfo.value.code
  const nextLang = supportedLanguages.find((lang) => lang.code !== currentLang)?.code || 'ko'
  setLanguage(nextLang)
  console.log('변경된 언어:', nextLang)
}
</script>

<style scoped>
.breadcrumb-container {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 12px 0;
  flex-shrink: 0;
}

.breadcrumb {
  padding: 0 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
}

.breadcrumb-text {
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #6c757d;
  font-size: 12px;
  margin: 0 4px;
}

/* 언어 선택 버튼 스타일 */
.language-selector {
  display: flex;
  align-items: center;
}

.language-btn {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 6px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 28px;
  white-space: nowrap;
}

.language-btn:hover {
  border-color: #4096ff;
  background-color: #f0f8ff;
}

.language-flag {
  font-size: 12px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.language-text {
  color: #666;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  display: flex;
  align-items: center;
}

/* 반응형 스타일 */
/* 모바일 - 768px 이하 */
@media (max-width: 768px) {
  .breadcrumb-container {
    padding: 8px 0;
  }

  .breadcrumb {
    padding: 0 18px;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  }

  .breadcrumb-text {
    font-size: 12px;
  }

  .breadcrumb-separator {
    font-size: 10px;
    margin: 0 2px;
  }

  .language-selector {
    align-self: flex-end;
  }

  .language-text {
    display: none; /* 모바일에서는 국기만 표시 */
  }
}

/* 태블릿 - 768px 초과 ~ 1024px 이하 */
@media (min-width: 769px) and (max-width: 1024px) {
  .breadcrumb {
    padding: 0 22px;
  }

  .breadcrumb-text {
    font-size: 13px;
  }
}

/* 대형 데스크탑 - 1440px 초과 */
@media (min-width: 1441px) {
  .breadcrumb {
    padding: 0 32px;
  }
}
</style>
