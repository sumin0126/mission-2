/**
 * API 호출 지연 시뮬레이션 함수
 * 실제 서버 환경의 응답 시간을 모방하기 위해 사용
 *
 * @param ms
 */
export const delay = (ms: number = DELAY_TIMES.NORMAL): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 미리 정의된 지연 시간들
 */
export const DELAY_TIMES = {
  FAST: 100,
  NORMAL: 500,
  SLOW: 1000,
  IP_ALLOCATION: 1500,
} as const
