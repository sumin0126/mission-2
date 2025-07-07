<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-section">
        <img src="/images/logo_header.png" alt="KT cloud" class="logo-image" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped>
/* 기본 스타일 (데스크탑용) */
.app-header {
  background-image: url('/images/bg_header.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-container {
  width: 100%;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-image {
  height: 36px;
  width: auto;
  object-fit: contain;
}

/* 반응형 스타일 */
/* 모바일 - 768px 이하 */
@media (max-width: 768px) {
  .app-header {
    height: 50px;
  }

  .header-container {
    padding: 0 16px;
  }

  .logo-image {
    height: 28px;
  }
}

/* 태블릿 - 768px 초과 ~ 1024px 이하 */
@media (min-width: 769px) and (max-width: 1024px) {
  .app-header {
    height: 56px;
  }

  .header-container {
    padding: 0 20px;
  }

  .logo-image {
    height: 32px;
  }
}

/* 대형 데스크탑 - 1440px 초과 */
@media (min-width: 1441px) {
  .header-container {
    padding: 0 30px;
  }

  .logo-image {
    height: 38px;
  }
}
</style>
