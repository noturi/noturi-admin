export function formatDate(date: Date | string | number | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date));
  } catch {
    return '';
  }
}

/**
 * 화면의 날짜·시각은 모두 한국 시간(KST)으로 — 시간대를 지정하지 않으면 서버 렌더(UTC)와 브라우저 렌더 값이 달라짐
 * 형식: 표 "2026. 11. 10." / "2026. 11. 10. 09:30", 상세·요약 "2026년 11월 10일 (화) 09:30"
 */
const KST = 'Asia/Seoul';

function kstParts(date: string | Date | number) {
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KST,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(date));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    weekday: get('weekday'),
    hour: get('hour').padStart(2, '0'),
    minute: get('minute').padStart(2, '0'),
  };
}

/** "2026. 11. 10." */
export const formatKstDate = (date: string | Date | number) => {
  const p = kstParts(date);
  return `${p.year}. ${p.month}. ${p.day}.`;
};

/** "2026. 11. 10. 09:30" */
export const formatKstDateTime = (date: string | Date | number) => {
  const p = kstParts(date);
  return `${p.year}. ${p.month}. ${p.day}. ${p.hour}:${p.minute}`;
};

/** "2026년 11월 10일 (화) 09:30" — withTime: false면 시각 생략 */
export const formatKstLong = (date: string | Date | number, { withTime = true } = {}) => {
  const p = kstParts(date);
  const day = `${p.year}년 ${p.month}월 ${p.day}일 (${p.weekday})`;
  return withTime ? `${day} ${p.hour}:${p.minute}` : day;
};

/** "09:30" */
export const formatKstTime = (date: string | Date | number) => {
  const p = kstParts(date);
  return `${p.hour}:${p.minute}`;
};

export const formatDateShort = formatKstDate;
export const formatTime = formatKstTime;

export const formatRelativeTime = (date: string | Date) => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  }

  return formatDateShort(date);
};

/**
 * 최근 접속일 — 서버가 하루 한 번만 기록하므로 시각 없이 "오늘 / 어제 / N일 전 / 날짜"
 * 날짜 차이는 KST 달력 기준
 */
export const formatLastActive = (date: string | Date | number, now: number = Date.now()) => {
  const day = (d: string | Date | number) => {
    const p = kstParts(d);
    return Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day));
  };
  const diffDays = Math.round((day(now) - day(date)) / 86_400_000);
  if (diffDays <= 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 30) return `${diffDays}일 전`;
  return formatKstDate(date);
};
