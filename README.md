# 오아시스 테니스 — 소개·예약안내 웹사이트

남양주 별내면 야외 테니스 코트 **오아시스 테니스**의 원페이지 소개 사이트.
Claude Design 프로젝트 [`Oasis Tennis.dc.html`](https://claude.ai/design/p/a9a0ec0a-4a96-43b2-9f65-0ea39226a272)를
정적 HTML로 구현한 것입니다.

## 구조

```
index.html      사이트 본체. 의존성 없는 단일 HTML (CSS·JS·아이콘 스프라이트 인라인)
assets/         코트·시설 사진 11장 (webp) — 디자인 프로젝트에서 추출
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

## 호스팅 현황

Claude Artifact로 올린 페이지: <https://claude.ai/code/artifact/cf8a2a2a-79f0-45e4-bb95-23324170b8a2>
(현재 프레임 서비스가 약 41KB를 넘는 페이지를 렌더링하지 못해 빈 화면으로 나옵니다.
같은 접두부를 41KB로 자르면 정상, 57KB 순수 텍스트로 늘리면 실패하는 것을 확인했습니다.
`/api/frame/*` 엔드포인트도 503을 반환 중이라 서비스 측 문제로 보입니다.
서비스가 회복되면 `node build.mjs` 후 같은 URL로 다시 올리면 됩니다.)

실서비스로 올릴 때는 `index.html` + `assets/`를 그대로 정적 호스팅에 올리면 됩니다
(GitHub Pages, Netlify, Vercel, Cloudflare Pages 등). 빌드 단계가 필요 없습니다.

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
