# Talk

> 친구들과 실시간으로 대화하는 채팅 서비스

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.0-646cff?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-12.5.0-FFCA28?logo=firebase)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)

## 프로젝트 소개

**Talk**는 채팅방을 만들고 친구들을 초대해 실시간으로 대화할 수 있는 PWA 기반 웹 채팅 서비스입니다.

---

## 주요 기능

### 1. 회원제
비회원의 첫 화면은 무조건 로그인 화면입니다. 로그인 후 서비스를 이용할 수 있습니다.

### 2. 실시간 채팅
- 채팅방 생성 및 참여
- Firestore `onSnapshot` 기반 실시간 메시지 수신
- 읽음 상태 추적

### 3. 초대
- 채팅방 멤버를 직접 초대
- 유효기간 있는 초대 URL 생성 및 공유

### 4. 채팅방 관리 (매니저 전용)
- 채팅방 제목 변경
- 공개/비공개 설정
- 일반 멤버의 초대 권한 설정
- 멤버 추방
- 채팅방 삭제

---

## 기술 스택

### Frontend

- **React** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **React Router** - 클라이언트 라우팅
- **Vite** - 빠른 개발 환경 및 빌드 도구

### Styling

- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **SCSS** - CSS 전처리기

### State Management & Data Fetching

- **Zustand** - 경량 상태 관리 (실시간 메시지 스트림)
- **TanStack Query** - 서버 상태 관리 (채팅방 목록, 멤버 조회 등)

### Backend & Database

- **Firebase** - 인증, 데이터베이스, 호스팅
  - Authentication (이메일/비밀번호, 카카오, 네이버 소셜 로그인)
  - Cloud Firestore
- **Express (Cloud Run)** - 카카오/네이버 OAuth 토큰 교환 서버

### Form & Validation

- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증

### PWA

- **Vite Plugin PWA** - PWA 통합
- **Service Worker** - 오프라인 지원
- **Web App Manifest** - 앱 같은 경험

### Development Tools

- **ESLint** - 코드 품질 검사
- **Stylelint** - 스타일 린팅
- **SVGR** - SVG를 React 컴포넌트로 변환
- **React Compiler** - React 컴파일러

---

## Firestore 컬렉션 구조

```
rooms/                         # 채팅방
  {roomId}/
    members/                   # 멤버 (문서 ID = uid)
    messages/                  # 메시지
    readStatus/                # 읽음 상태 (문서 ID = uid)

inviteLinks/                   # 초대 링크 (토큰 기반, 유효기간 있음)
users/                         # 사용자 정보
```

---

## 프로젝트 구조

```
talk/
├── client/                    # React Frontend
│   └── src/
│       ├── assets/            # 폰트, SVG 아이콘, SCSS 스타일
│       ├── components/
│       │   ├── chat/          # 채팅 전용 컴포넌트
│       │   ├── common/        # 공통 UI 컴포넌트 라이브러리
│       │   └── global/        # 전역 컴포넌트 (NavBar, Toast 등)
│       ├── hooks/
│       │   ├── chat/          # 채팅 훅 (useRooms, useMessages 등)
│       │   └── auth/          # 인증 훅
│       ├── layouts/           # 레이아웃 컴포넌트
│       ├── lib/               # Firebase 설정
│       ├── pages/
│       │   ├── chat/          # 채팅 페이지
│       │   ├── main/          # 메인 페이지
│       │   └── auth/          # 인증 페이지
│       ├── services/
│       │   ├── chat/          # 채팅 서비스 (roomsService 등)
│       │   └── firebase/      # Firestore CRUD 유틸
│       ├── types/             # TypeScript 타입 정의
│       ├── router.tsx
│       └── main.tsx
└── server/                    # Express Backend (Cloud Run)
    └── src/
        └── routes/auth.ts     # 카카오/네이버 OAuth 토큰 교환
```

---

## 시작하기

### 사전 요구사항

- Node.js v22.12.0 이상
- Firebase 프로젝트 (Firestore, Authentication 사용)

### 1단계: 환경 변수 설정

`client/.env` 및 `server/.env`를 참고하여 각 키에 맞는 값을 채워넣으세요.

### 2단계: 설치 및 실행

터미널을 2개 열어서 클라이언트와 서버를 각각 실행합니다.

**터미널 1: 서버 (Backend)**
```bash
cd server
npm install
npm run dev
```
> 서버가 `http://localhost:8080` 에서 실행됩니다.

**터미널 2: 클라이언트 (Frontend)**
```bash
cd client
npm install
npm run dev
```
> 클라이언트가 `http://localhost:3000` 에서 실행됩니다.

### 3단계: 배포

**서버 배포 (Cloud Run)**
```bash
cd server
npm run deploy
```

**클라이언트 배포 (Firebase Hosting)**
```bash
# client 폴더에서
npm run build

# 프로젝트 루트에서
firebase deploy
```

---

## 개발 가이드

### 타입 체크

TypeScript Project References를 사용하므로 다음 명령어를 사용하세요:

```bash
# 올바른 방법
npx tsc -b --noEmit

# 잘못된 방법 (모든 참조를 체크하지 않음)
npx tsc --noEmit
```

### 아이콘 추가

1. SVG 파일을 `client/src/assets/icons`에 추가합니다.
2. React 컴포넌트로 변환합니다.
```bash
npm run svgr
```

### 네이밍

| 항목 | 네이밍 규칙 |
| --- | --- |
| 컴포넌트명 | PascalCase |
| 컴포넌트가 포함된 폴더명 | PascalCase |
| 변수, 함수, 훅 | camelCase |
| 아이디, 클래스명 | camelCase |
| 에셋 | snake_case |
| 아이콘 | icon_아이콘명_바리에이션_컬러 |
| 타입명 | PascalCase |

### 컴포넌트 개발

재사용 가능한 공통 컴포넌트 라이브러리를 포함하고 있습니다.
가이드 페이지(`/guide/*`)에서 각 컴포넌트의 사용법을 확인할 수 있습니다.

### 스타일링 규칙

- **전역 SCSS**: `src/assets/styles/abstracts/`의 변수, 믹스인, 함수는 자동으로 사용 가능
- **컴포넌트 스타일**: 공통 컴포넌트는 SCSS Module, 그 외에는 Tailwind CSS 사용
- **인라인 스타일 지양**: 불가피한 경우를 제외하고 피할 것

#### z-index

| 분류 | z |
| --- | --- |
| Alert, Tooltip | 90 |
| Sheet | 80 |
| NavBar, AppBar | 60 |
| FAB | 50 |

### 타이포그래피

| 태그 | 용도 |
| --- | --- |
| h1 | 로고 |
| h2 | 페이지명 |
| h3 | 섹션명 |
| h4 | 아티클명 |
| h5 | 상품명 |
| h6 | 기타 |

---

## 문의

seongchan95s@gmail.com

---

<div align="center">

**Talk** - 언제 어디서나 편하게 대화하세요

[Back to Top](#talk)

</div>
