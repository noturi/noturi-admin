// Google Analytics 이벤트 전송 함수
export function sendGAEvent(eventData: { event: string; [key: string]: unknown }) {
  // Google Analytics가 설정되어 있다면 이벤트 전송
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventData.event, eventData);
  } else {
    // 개발 환경에서는 콘솔에 로그
    console.log('GA Event:', eventData);
  }
}

// gtag 타입 선언
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
