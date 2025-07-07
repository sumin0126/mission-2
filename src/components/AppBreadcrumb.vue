<template>
  <div class="breadcrumb-container">
    <nav class="breadcrumb">
      <ol class="breadcrumb-list">
        <!-- Server (가상의 홈, 클릭 불가) -->
        <li class="breadcrumb-item">
          <span class="breadcrumb-text">Server</span>
        </li>
        <li class="breadcrumb-separator">
          <span>></span>
        </li>
        <li class="breadcrumb-item">
          <span class="breadcrumb-text">Instance</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.breadcrumb-container {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 12px 0;
  flex-shrink: 0;
}

.breadcrumb {
  padding: 0 26px;
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

/* 반응형 스타일 */
/* 모바일 - 768px 이하 */
@media (max-width: 768px) {
  .breadcrumb-container {
    padding: 8px 0;
  }

  .breadcrumb {
    padding: 0 18px;
  }

  .breadcrumb-text {
    font-size: 12px;
  }

  .breadcrumb-separator {
    font-size: 10px;
    margin: 0 2px;
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
