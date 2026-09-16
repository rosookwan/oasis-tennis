# 오아시스 테니스 — 소개·예약안내 웹사이트

남양주 별내면 야외 테니스 코트 **오아시스 테니스**의 원페이지 소개 사이트.
Claude Design 프로젝트 [`Oasis Tennis.dc.html`](https://claude.ai/design/p/a9a0ec0a-4a96-43b2-9f65-0ea39226a272)를
정적 HTML로 구현한 것입니다.

## 구조

```
index.html      사이트 본체. 의존성 없는 단일 HTML (CSS·JS·아이콘 스프라이트 인라인)
assets/         코트·시설 사진 11장 (webp) — 디자인 프로젝트에서 추출
assets/video/   메인 배경 영상 (oasis-hero.mp4 1080p · oasis-hero-720.mp4 모바일) — 스크롤 양만큼 재생되는 스크럽 영상
build.mjs       dist/artifact.html 생성 (이미지 data URI 인라인 + 호스팅용 조각으로 변환)
dist/           배포 산출물
design-src/     원본 Claude Design 소스와 Wanted Design System 토큰 (참고용)
```

## 로컬에서 보기

```bash
python3 -m http.server 8000
```

`http://localhost:8000` — `index.html`은 그대로 열어도 되지만, 폰트 CDN 때문에 서버로 여는 편이 정확합니다.

## 배포용 빌드

```bash
node build.mjs
```

`dist/artifact.html`이 만들어집니다. `index.html`과 다른 점은 두 가지뿐입니다.

- **이미지를 data URI로 인라인** — 파일 하나로 전체 페이지가 완결됩니다 (약 0.93 MB).
- **Pretendard CDN 링크 제거** — 호스팅 환경의 CSP가 Google Fonts 외 폰트 호스트를 차단하므로,
  Noto Sans KR·Apple SD Gothic Neo 폴백으로 넘깁니다. `index.html`에는 Pretendard가 그대로 있습니다.

## 공개 주소

<https://rosookwan.github.io/oasis-tennis/>

GitHub Pages(`main` 브랜치 루트)로 서비스합니다. `index.html`과 `assets/`가 그대로 올라가므로
빌드 단계가 없습니다 — 수정 후 push하면 1~2분 안에 반영됩니다.

```bash
git add -A && git commit -m "..." && git push
```

Claude Artifact로도 올려 두었지만(<https://claude.ai/code/artifact/cf8a2a2a-79f0-45e4-bb95-23324170b8a2>)
**현재 아티팩트 프레임 서비스 장애로 빈 화면만 나옵니다.** 페이지 크기와 무관하며,
265바이트짜리 최소 페이지도 렌더링되지 않습니다(`/api/frame/*`가 503 반환 중).
페이지 자체의 문제가 아니므로, 서비스가 복구되면 `node build.mjs` 후
같은 URL로 다시 올리기만 하면 됩니다 — 별도 수정은 필요 없습니다.

## 운영자 확인 목록

디자인 원본의 `showTodoFlags` 항목(레슨 요금·주차 대수 등 "확인 필요" 표시)은 공개 페이지에서 숨겨 두었습니다.
확인이 필요할 때만 주소 뒤에 `?todo=1`을 붙이면 보입니다.

```
http://localhost:8000/?todo=1
```

## 연결된 외부 채널

| 항목 | 링크 |
| --- | --- |
| 코트 예약 | `https://link.smaxh.com/oasis_tennis` |
| 스매시 코트 정보 | `https://www.smaxh.com/courts/2de67498-0515-4c6a-8e0d-137277d6ac71` |
| 전화 | `0507-1405-9221` |
| 인스타그램 | `@oasis.tennis` |

## 원본 디자인과 달라진 점

| 항목 | 이유 |
| --- | --- |
| 코트 안내 4장 → 2×2 그리드 | 자동 배치에서는 4번째 카드만 다음 줄에 홀로 남았습니다 |
| 갤러리 첫 사진 2칸 차지 (3×2) | 사진 5장이 4칸 그리드에서 나누어떨어지지 않았습니다 |
| 배치도(입체 안내도)를 갤러리 → 오시는 길 | 사진 갤러리보다 길 안내에서 쓰임새가 큽니다 |
| 푸터 3번째 칸에 예약·문의 링크 | 원래 그 자리는 운영자 확인 목록이라 공개 시 비어 있었습니다 |
| 히어로 헤드라인 그림자 + 그라디언트 보강 | 넓은 화면에서 제목 끝이 클럽하우스 흰 지붕에 겹쳐 읽히지 않았습니다 |
| `word-break: keep-all` | 한글이 어절 중간에서 끊기는 것을 막습니다 |

> 이 저장소는 배포 미러입니다. 개발·수정은 courtdesk monorepo(`sites/oasis/`)에서 하고 `scripts/deploy-oasis.sh`로 발행하세요.

## 메인 배경 영상 (스크롤 스크럽)

히어로의 영상은 재생되는 게 아니라 마우스 휠·터치 스크롤 양만큼 앞뒤로 움직인다(`index.html`의 `scrubHero`).
- 섹션 높이 320vh(모바일 260vh) 동안 무대가 화면에 고정되고, 스크롤 진행률 × 10초를 `currentTime`으로 넣는다.
- 영상은 탐색이 부드럽도록 키프레임 4프레임 간격으로 다시 인코딩했다. 교체할 때는
  `ffmpeg -i 원본.mp4 -an -c:v libx264 -crf 25 -g 4 -keyint_min 4 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart assets/video/oasis-hero.mp4`
  (720p는 `-vf scale=1280:720`). 포스터는 `assets/oasis-hero-poster.jpg`.
- 서버가 HTTP Range를 못 주면(파이썬 `http.server` 등) 탐색이 안 되므로 스크립트가 파일을 통째로 받아 blob으로 바꿔 끼운다. nginx·GitHub Pages는 Range를 지원한다.
- `prefers-reduced-motion`이면 스크럽을 끄고 사진 히어로로 보인다. 영상 로드 실패 시에도 사진으로 남는다.
- `build.mjs`는 mp4를 인라인하지 않는다 — 호스팅된 `dist/artifact.html`에서는 사진 히어로가 보인다.
