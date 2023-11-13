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
} as const;
