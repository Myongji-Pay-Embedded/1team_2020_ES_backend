// 사용자 멤버쉽 카드 정보 스키마
import mongoose, { Schema } from 'mongoose';

const MembershipSchema = new Schema({
  membershipName: String, // 멤버쉽 이름,
  membershipNumber: Number, // 멤버쉽번호,
  membershipColor: String, // 멤버쉽 카드 색
  user: {
    // 로그인했을 때만 멤버쉽 관련된 것에 접근할 수 있도록
    _id: mongoose.Types.ObjectId,
    userId: String,
  },
});

const Membership = mongoose.model('Membership', MembershipSchema);
export default Membership;
