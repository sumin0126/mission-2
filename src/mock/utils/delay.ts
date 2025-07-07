/**
 * API 호출 지연 시뮬레이션 함수
 * 실제 서버 환경의 응답 시간을 모방하기 위해 사용
 *
 * @param ms 지연 시간 (밀리초)
 * @returns Promise<void>
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 미리 정의된 지연 시간들
 */
export const DELAY_TIMES = {
  FAST: 200, // 빠른 작업 (조회)
  NORMAL: 500, // 일반 작업 (목록 조회)
  SLOW: 800, // 느린 작업 (생성)
  VERY_SLOW: 1500, // 매우 느린 작업 (다중 작업)
  POWER_TOGGLE: 1000, // 전원 토글
  IP_ALLOCATION: 500, // IP 할당
} as const
