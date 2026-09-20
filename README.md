# 여의도침례교회 목요성경통독

모바일 우선 단일 페이지 질문 게시판 초안입니다. React/Vinext, Cloudflare Workers, D1을 사용합니다.

## GitHub 배포

- 저장소: https://github.com/wizardjustin25-lgtm/thursday-bible-reading
- 공개 미리보기: https://wizardjustin25-lgtm.github.io/thursday-bible-reading/
- `main`에 소스를 올리면 GitHub Actions가 TypeScript를 검사하고, 동일한 화면 컴포넌트로 미리보기를 만들어 GitHub Pages에 배포합니다.
- 수동 실행은 저장소 **Actions → Deploy preview to GitHub Pages → Run workflow**에서 가능합니다.
- GitHub Pages는 정적 미리보기입니다. 질문 원문 입력은 서버로 전송하거나 저장하지 않으며 AI 자동 요약도 실행하지 않습니다. 화면에서 이 상태를 안내합니다.

### 실제 게시판 운영

실제 질문 공동 저장에는 Cloudflare Workers와 D1의 별도 배포가 필요합니다. `app/api/questions/route.ts`의 서버 코드는 `DB` 바인딩을 사용하며 `drizzle/0000_questions.sql`에 데이터베이스 구조가 있습니다. 현재 GitHub Pages 워크플로는 이 서버를 배포하지 않습니다. AI 서비스와 운영 호스팅 계정을 연결하기 전까지는 참가자의 실제 질문 접수용으로 사용할 수 없습니다.

미리보기만 로컬에서 빌드하려면 `npm ci` 후 `npm run build:pages`를 실행합니다. 결과는 `site-preview/`에 생성됩니다.

## 구현한 기능

- 별도 회원가입 없이 본문과 질문 등록. 이름을 비우면 익명으로 표시합니다.
- 공용 D1 데이터베이스 저장, 최근 100개 질문 표시, 원문 펼치기.
- 핵심 질문 / 원문 보기 전환, 모바일 대응, 키보드와 대화상자 지원.
- 서버 입력 검증과 저장 오류 시 작성 내용 유지.

## 초안의 범위

일정은 2026년 9월 10일–11월 13일, 신약 27권 260장을 매일 4장씩 읽도록 구성했습니다. 한국 시간 기준 오늘 본문과 목요일–수요일 주간 진도, 전체 65일 일정을 표시합니다. 초기 질문 3개는 명시적으로 표시한 예시입니다. 실제 질문이 등록되면 예시 대신 실제 목록을 표시합니다. AI 요약은 예시이며 자동 AI 호출은 아직 연결하지 않았습니다. 신규 질문은 원문으로 표시합니다. 자동 해석이나 신학적 답변은 생성하지 않습니다.

정식 운영 전에는 AI 요약 연결, 관리자 답변/관리 기능, 익명 게시판의 스팸 제한을 구성해야 합니다. 현재 초안은 인도자가 질문을 읽고 모임에서 답변하는 흐름입니다. Sites의 비공개 검토 링크는 소유자 로그인 보호가 있으므로 참가자에게 제공할 때 공개 접근 설정이 필요합니다.

## 로컬 실행

Node.js 22.13 이상과 npm이 필요합니다.

```sh
npm run install:ci
npm run db:generate
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_*.sql
npm run dev
```

위 마이그레이션 파일 이름은 `drizzle/` 안의 실제 SQL 이름으로 바꿉니다. 적용한 마이그레이션은 재실행하지 않습니다. 운영 D1 마이그레이션은 Sites 배포 단계에서 적용됩니다.

## 주요 파일

- `app/page.tsx`: 한국어 게시판, 작성 대화상자, 예시 콘텐츠
- `app/globals.css`: 반응형 스타일
- `app/api/questions/route.ts`: 질문 읽기 및 저장 API
- `db/schema.ts`: 질문 저장 구조 (`summary` 필드 포함)

AI를 연결할 때는 서버 전용 비밀키를 사용하고, 질문을 요약할 뿐 답변하지 않도록 지시하며, 요약 실패 시 원문을 보존합니다. 브라우저에 비밀키를 넣지 않습니다. 현재 별도 API 키나 유료 AI 호출은 사용하지 않습니다.

