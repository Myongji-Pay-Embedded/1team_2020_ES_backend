let postId = 1; // id 초깃값

// posts 배열 초기 데어터
const posts = [
  {
    id: 1,
    title: '제목',
    body: '내용',
  },
];

/* 포스트 작성
POST /api/posts
{title, body}
*/
exports.write = (ctx) => {
  //REST API의 Request Body는 ctx.request.body에서 조회
  const { title, body } = ctx.request.body;
  postId +=1; //기존 
};
