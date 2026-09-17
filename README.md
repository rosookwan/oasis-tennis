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

히어로는 자동 재생하지 않고 휠·터치 스크롤로 영상을 앞뒤로 탐색합니다(`index.html`의 `scrubHero`).

- 무대는 첫 화면부터 72px 헤더 아래에 고정합니다. 높이는 `100svh - 헤더 - 모바일 하단 CTA`이며, 주소창 변화로 영상이 갑자기 진행되지 않게 안정적인 뷰포트 단위를 사용합니다.
- 기존 진행 구간은 데스크톱 900svh, 모바일(760px 이하) 700svh입니다. 이 구간의 앞 10%는 전경 사진에서 영상 첫 프레임으로 페이드인, 가운데 80%는 영상 재생, 뒤 10%는 마지막 프레임에서 전경으로 페이드아웃합니다. 이후 마지막 전경 사진에만 50svh(반 화면)만큼 더 머물러 전체 섹션은 각각 950svh·750svh가 됩니다. 앞부분과 영상·페이드의 스크롤 속도는 유지합니다.
- 1280×720 기준 영상·전환 진행 거리는 5,832px이며, 마지막 전경 유지 구간 360px를 더해 총 고정 거리는 6,192px입니다. 앞뒤 전환은 각각 약 583px(기존 약 222px·190px), 영상은 100px당 약 0.21초(기존 약 0.85초)로 진행합니다. 스크롤을 멈추면 완충 후 정지하므로 고정된 재생 시간으로 전환 길이를 정의하지 않습니다.
- 영상·사진 확대·문구에 같은 진행률과 180ms 시간 기반 완충을 적용합니다. `seeking` 동안 중복 탐색하지 않고 `seeked` 후 최신 위치로 이동합니다. 30fps에 맞춰 마지막 실제 프레임까지만 탐색하며, 멈추면 애니메이션 루프도 쉽니다.
- 배포 영상은 10초·30fps H.264, 모든 프레임이 키프레임이며 B프레임이 없습니다. 1080p 약 12.9MB, 720p 약 6.7MB입니다. 기존보다 파일 크기는 늘었지만 임의 프레임 탐색 비용을 줄였습니다. 교체할 때는 원본에서 아래와 같이 인코딩하고 HTML의 영상 URL 버전도 갱신합니다.

```bash
ffmpeg -i 원본.mp4 -an -c:v libx264 -preset slow -crf 23 -r 30 \
  -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 -pix_fmt yuv420p \
  -movflags +faststart assets/video/oasis-hero.mp4
# 모바일: 위 명령에 -vf scale=1280:720 추가
```

- HTTP Range 미지원 서버에서 탐색 범위가 열리지 않으면 파일을 한 번 받아 blob으로 전환합니다. GitHub Pages는 Range를 지원합니다.
- 동작 줄이기·데이터 절약 설정에서는 영상을 요청하지 않습니다. 로드 실패 시 전경 사진으로 돌아가고 긴 스크롤 구간도 해제합니다.
- `build.mjs`는 mp4를 인라인하지 않습니다. 외부에 올린 `dist/artifact.html`에서는 영상 경로를 제공하지 않으면 사진으로 보입니다.

컨트롤러 회귀 검증(monorepo 루트):

```bash
node --test scripts/test-oasis-hero.mjs
```

배포 전에는 데스크톱·375px 모바일·320px 작은 화면에서 최초 위치, 앞/중간/뒤 전환, 역방향 탐색, 하단 CTA 가림 여부와 콘솔 오류를 확인합니다. 배포 후 HTML 및 두 영상 파일의 해시와 HTTP Range 응답을 확인하고 공개 페이지에서 다시 스크롤합니다.
