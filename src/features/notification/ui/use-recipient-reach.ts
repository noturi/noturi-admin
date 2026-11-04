'use client';

import { useEffect, useState } from 'react';

import type { UserReachSummary } from '@/entities/user';
import logger from '@/shared/lib/utils/logger';

import { getRecipientReach } from '../api/actions';

const DEBOUNCE_MS = 400;

/**
 * 고른 사람 중 실제로 받을 수 있는 인원 — 알림을 껐거나 기기가 없는 사람은 발송해도 받지 못함
 * 고를 때마다 서버에 묻지 않도록 잠깐 멈춘 뒤 한 번, 늦게 온 이전 응답은 버림
 */
export function useRecipientReach(ids: string[]) {
  const [summary, setSummary] = useState<UserReachSummary | null>(null);
  const key = ids.join(',');

  useEffect(() => {
    if (!key) return;
    let ignore = false;
    const timer = setTimeout(() => {
      getRecipientReach(key.split(','))
        .then((result) => {
          if (!ignore) setSummary(result);
        })
        .catch((error) => logger.error('받을 수 있는 인원을 확인하지 못함:', error));
    }, DEBOUNCE_MS);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [key]);

  // 선택이 비면 이전 결과를 보여주지 않음 / 응답 전에는 총원과 어긋난 옛 값을 쓰지 않음
  if (!key || !summary || summary.total !== ids.length) return null;
  return summary;
}
