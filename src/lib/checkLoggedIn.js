// 로그인했을 때만, 카드, 계좌에 접근할 수 있도록 (카드 등록, 카드 조회, 계좌 등록, 계좌 조회 등)

const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    ctx.status = 401; //Unauthorized
    return;
  }
  return next();
};

export default checkLoggedIn;

// 로그인 상태가 아니라면 401 HTTP status 반환
// 로그인 상태면 그다음 미들웨어 실행
