export interface ErrorCode {
  statusCode: number;
  message: string | object;
}
export const ERROR_INFO = {
  EXPIRED_TOKEN: {
    statusCode: 401,
    message: '만료된 토큰입니다.',
  },
  FETCH_PUBLIC_KEY: {
    statusCode: 500,
    message: 'Apple ID 서버로의 public key 요청이 실패했습니다.',
  },
  INVALID_TOKEN: {
    statusCode: 401,
    message: '잘못된 토큰입니다.',
  },
  POLICY_NOT_FOUND: {
    statusCode: 500,
    message: '운영정책을 조회할 수 없습니다.',
  },
  POLICY_ALREADY_EXISTS: {
    statusCode: 500,
    message: '이미 초기화된 모티메이트 운영정책입니다.',
  },
  USER_ALREADY_REGISTERED_ADMIN: {
    statusCode: 400,
    message: '이미 등록된 관리자입니다.',
  },
  ADMIN_INVALID_PASSWORD: {
    statusCode: 400,
    message: '잘못된 비밀번호입니다.',
  },
  USER_NOT_ADMIN_PENDING_STATUS: {
    statusCode: 400,
    message: '관리자 승인 대기중인 사용자가 아닙니다.',
  },
  NO_SUCH_ACHIEVEMENT: {
    statusCode: 404,
    message: '존재하지 않는 달성기록 입니다.',
  },
  FAIL_FILE_TASK: {
    statusCode: 500,
    message: '파일 요청 작업에 실패했습니다.',
  },
  IMAGE_ALREADY_EXISTS_THUMBNAIL: {
    statusCode: 400,
    message: '이미 썸네일이 생성된 이미지 입니다.',
  },
  RESTRICT_ACEESS_TO_ADMIN: {
    statusCode: 403,
    message: '제한된 요청입니다.',
  },
  INVALID_CATEGORY: {
    statusCode: 400,
    message: '유효하지 않은 카테고리입니다.',
  },
  IMAGE_NOT_FOUND: {
    statusCode: 400,
    message: '존재하지 않는 이미지 입니다.',
  },
  NO_USER_IMAGE: {
    statusCode: 400,
    message: '이미지를 찾을 수 없습니다.',
  },
  UNAUTHORIZED_GROUP_CATEGORY: {
    statusCode: 400,
    message: '그룹에 카테고리를 만들 수 없습니다.',
  },
  NO_SUCH_USER_GROUP: {
    statusCode: 400,
    message: '그룹의 멤버가 아닙니다.',
  },
  LEADER_NOT_ALLOWED_TO_LEAVE: {
    statusCode: 400,
    message: '그룹의 리더는 탈퇴를 할 수 없습니다.',
  },
  NO_SUCH_GROUP_ACHIEVEMENT: {
    statusCode: 400,
    message: '존재하지 않는 그룹 달성기록 입니다.',
  },
  INVALID_REJECT_REQUEST: {
    statusCode: 400,
    message: '유효하지 않은 차단 요청입니다.',
  },
  INVITE_PERMISSION_DENIED: {
    statusCode: 400,
    message: '그룹원 초대 권한이 없습니다.',
  },
  DUPLICATED_INVITE: {
    statusCode: 400,
    message: '이미 초대된 그룹원 입니다.',
  },
} as const;
