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
} as const;
