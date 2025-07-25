## 주요 기능

- 인스턴스 관리
  - 인스턴스 목록 조회 및 다중 선택 삭제
  - 인스턴스 상세 정보 확인
  - 새 인스턴스 생성 (이름 중복 확인)
  - 전원 상태 관리 (시작/종료)
  - 인스턴스 정보 수정 (이름, 이미지 등)
  - 네트워크 설정 (내부/외부 IP)
- 다국어 지원 (한국어/영어)
- 로딩 상태 표시
- 반응형 디자인

<br/>

## 기술 스택

- **프론트엔드 프레임워크**: Vue 3
- **상태 관리**: Pinia
- **라우팅**: Vue Router
- **다국어 처리**: Vue I18n
- **HTTP 클라이언트**: Axios
- **개발 도구**:
  - TypeScript
  - Vite
  - ESLint
  - Prettier
  - Vitest

<br/>

## 프로젝트 구조

```
src/
├── api/          # API 통합
├── assets/       # 정적 자산
├── components/   # Vue 컴포넌트
│   ├── common/   # 공통 컴포넌트
│   └── instance/ # 인스턴스 관련 컴포넌트
├── i18n/         # 다국어 처리
├── mock/         # 목업 데이터 및 타입
│   └── data/     # 개발 환경용 데이터 (JSON Server)
├── router/       # 라우트 정의
├── stores/       # Pinia 스토어
└── views/        # 페이지 컴포넌트

public/
└── data/         # 배포 환경용 정적 데이터
```

<br/>

## 시작하기

### 필수 조건

- Node.js
- pnpm

### 설치 방법

1. 저장소 복제

```bash
git clone [저장소-URL]
cd mission-2
```

2. 의존성 설치

```bash
pnpm install
```

<br/>

### 환경 변수 설정

1. 프로젝트 루트에 `.env` 파일 생성

```bash
# Application
VITE_APP_TITLE=Instance Manager
VITE_API_BASE_URL=http://localhost:3000  # 개발 환경의 Mock API 서버 주소
VITE_API_TIMEOUT=5000

# Instance Settings
VITE_DEFAULT_INSTANCE_REGION=kr-central-1
VITE_MAX_INSTANCES_PER_USER=10
```

2. 환경 변수 설명:
   - `VITE_APP_TITLE`: 애플리케이션 제목
   - `VITE_API_BASE_URL`:
     - 개발 환경: Mock API 서버 주소 (기본값: http://localhost:3000)
     - 배포 환경: 자동으로 정적 데이터 경로 사용 (/mission-2/data)
   - `VITE_API_TIMEOUT`: API 요청 타임아웃
   - `VITE_DEFAULT_INSTANCE_REGION`: 기본 인스턴스 리전
   - `VITE_MAX_INSTANCES_PER_USER`: 사용자당 최대 인스턴스 수

### 실행 방법

#### 개발 모드 실행 (동적 데이터)

```bash
# 목업 API 서버 시작 (개발 환경)
pnpm run server  # 또는 pnpm server

# 다른 터미널에서 개발 서버 시작
pnpm run dev     # 또는 pnpm dev
```

#### 배포 모드 실행 (정적 데이터)

```bash
# 프로덕션 빌드 생성
pnpm build

# 빌드된 결과물 미리보기
pnpm preview
```

<br/>

## 데이터 소스

이 프로젝트는 두 가지 데이터 소스를 사용합니다

1. **개발 환경** (`src/mock/data/`):

   - JSON Server를 사용하여 실제 API처럼 동작
   - CRUD 작업이 가능한 동적 데이터
   - `pnpm run server`로 목업 API 서버 실행 필요
   - 개발 중 데이터 변경 가능

2. **배포 환경** (`public/data/`):
   - GitHub Pages 호스팅을 위한 정적 데이터
   - 읽기 전용 데이터
   - 서버 실행 없이 정적 파일로 동작
   - `pnpm preview`로 배포 환경 미리보기 가능
