# 1team_2020_ES_backend

- Myongji-Pay Backend [Koa.js]

- [api](https://github.com/Myongji-Pay-Embedded/1team_2020_ES_backend/tree/main/src/api)
  - [auth](https://github.com/Myongji-Pay-Embedded/1team_2020_ES_backend/tree/main/src/api/auth)
    - 회원 인증 API
- [models](https://github.com/Myongji-Pay-Embedded/1team_2020_ES_backend/tree/main/src/models)
  - user.js => 사용자 정보
    - yarn add bcrypt (단방향 해쉬함수 지원해주는 라이브러리 이용)
  - card.js => 카드 정보
  - membership.js => 멤버십 카드 정보
  - account.js => 계좌 정보 및
  

* koa-router 설치 => 다른 주소로 요청이 둘어올 경우 다른 작업을 처리할 수 있도록 라우터를 사용

* @hapi/joi 설치 => 객체를 받아올 때 검증하기 위한 라이브러리(모든 값 받아오는지 확인), 제한 및 검증

* 안드로이드스튜디오와 연결
