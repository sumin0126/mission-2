## 기술 스택

- **Frontend**: Vue 3 (Composition API) + TypeScript
- **상태 관리**: Pinia
- **라우팅**: Vue Router
- **빌드**: Vite
- **다국어**: Vue i18n (한국어/영어)
- **HTTP**: Axios
- **Mock API**: JSON Server
- **코드 품질**: ESLint + Prettier

## 주요 기능

### 1. 인스턴스 목록 관리

- 인스턴스 목록 조회 (테이블 형태)
- 다중 선택 및 일괄 삭제
- 전원 상태 실시간 토글
- 상태 배지 (RUNNING/SHUTDOWN)
- 반응형 테이블 (모바일 지원)

### 2. 인스턴스 생성

- 단계별 폼 입력 (이름, 이미지, Flavor, 네트워크)
- 실시간 미리보기 (선택 사양 표시)
- 인스턴스 이름 중복 확인
- 폼 유효성 검사
- Enter 키로 다음 필드 이동

### 3. 인스턴스 상세 관리

- 상세 정보 조회 (기본정보, 리소스, 네트워크)
- 인라인 편집 (각 섹션별 모달)
- 전원 상태 관리
- 인스턴스 삭제

### 4. 네트워크 관리

- Private Network: 내부 IP만 할당 (172.30.110.x)
- Public Network: 내부 + 외부 IP 할당 (203.0.113.x)
- 네트워크 변경 시 자동 IP 재할당
- IP 중복 방지 로직

### 5. 사용자 경험 (UX)

- 로딩 상태 관리 (최소/최대 시간 설정)
- "오늘 하루 보지 않기" 기능
- 다국어 지원 (한국어 ↔ 영어)
- 반응형 디자인 (모바일/태블릿/데스크탑)
- 키보드 접근성

## 아키텍처 구조

### 디렉토리 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트들
│   ├── common/          # 공통 컴포넌트 (헤더, 모달, 로딩 등)
│   ├── instance/        # 인스턴스 관련 컴포넌트
│   │   ├── create/      # 인스턴스 생성 관련
│   │   ├── detail/      # 인스턴스 상세 정보 관련
│   │   │   ├── components/  # 상세 정보 표시 컴포넌트
│   │   │   └── modals/      # 편집 모달들
│   │   └── list/        # 인스턴스 목록 관련
│   └── InstancePreview.vue
├── views/               # 페이지 컴포넌트들
├── stores/              # 상태 관리 (Pinia)
│   ├── instances.ts     # 인스턴스 상태 관리
│   └── loading.ts       # 로딩 상태 관리
├── api/                 # API 관련
├── i18n/                # 다국어 지원
│   ├── index.ts         # i18n 설정
│   ├── locales/         # 언어별 메시지
│   └── useLanguage.ts   # 언어 변경 훅
├── mock/                # 목업 데이터
└── router/              # 라우팅 설정
```

### 상태 관리 (Pinia)

```typescript
// stores/instances.ts - 인스턴스 관리
;-getInstances() - // 목록 조회
  getInstance() - // 단일 조회
  createInstance() - // 생성
  updateInstance() - // 수정
  deleteInstance() - // 삭제
  toggleInstancePower() - // 전원 제어
  // stores/loading.ts - 로딩 관리(최소/최대 시간)
  withLoading()
```

## 핵심 구현 사항

### 다국어 지원

```typescript
// 브레드크럼브에서 언어 전환 가능
export const supportedLanguages = [
  { code: 'ko', name: '한국어', flag: 'KR' },
  { code: 'en', name: 'English', flag: 'US' },
]
```

### 중복 이름 검사

```typescript
const checkDuplicateName = async () => {
  const isDuplicate = instanceStore.instances.some(
    (instance) => instance.name.toLowerCase() === trimmedName.toLowerCase()
  )
}
```

### 개발 서버 실행

```bash
# 의존성 설치
pnpm install

# Mock API 서버 실행
pnpm run server

# 개발 서버 실행 (별도 터미널)
pnpm run dev
```

## 리뷰 포인트

- [ ] 수석님들은 컴포넌트 분리를 어떤 기준으로 하시나요?
- [ ] 어떤 기준으로 상태관리(pinia) 대상을 정하시나요??
- [ ] Composition API 방법이 코드 작성 방식이 다양해서 일관된 코딩 스타일을 유지하기 어렵다는 단점이 있다는데, 우리 팀만에서 사용하는 Composition API 컨벤션이 있나요?

## 마무리

이번 미션을 통해 CRUD 구현은 진행해 보았는데, 실무를 진행할 때는 구현은 기본이고 조금 더 많은 요구사항이 있을 것 같은데 이번 미션에는 못했지만 조금 더 공부해보고 찾아보면 좋을 부분들이 있을까요?

감사합니다!
