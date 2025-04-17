# CardNews - 카드뉴스 제작 플랫폼

CardNews는 사용자가 쉽게 카드뉴스를 제작하고 공유할 수 있는 웹 플랫폼입니다.

## 주요 기능

- 사용자 인증 (이메일/비밀번호, 소셜 로그인)
- 템플릿 기반 카드뉴스 제작
- 실시간 에디터
- 다국어 지원 (한국어, 영어)
- 템플릿 공유 및 관리
- 작품 버전 관리
- 댓글 및 좋아요 기능

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js
- Tailwind CSS
- Jest
- Redis (캐싱)

## 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- PostgreSQL
- Redis (선택사항)

### 설치

1. 저장소 클론
```bash
git clone https://github.com/yourusername/cardnews.git
cd cardnews
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env
```
`.env` 파일을 열어 필요한 환경 변수들을 설정합니다.

4. 데이터베이스 마이그레이션
```bash
npx prisma migrate dev
```

5. 개발 서버 실행
```bash
npm run dev
```

## 테스트

```bash
npm test
```

## 배포

이 프로젝트는 Vercel에 최적화되어 있습니다.

1. Vercel CLI 설치
```bash
npm i -g vercel
```

2. 배포
```bash
vercel
```

## 라이선스

MIT

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 