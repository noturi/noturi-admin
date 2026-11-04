import { z } from 'zod';
import { combineDateAndTime, isValidClock, parseJsonParams } from './notification-form.utils';

/** 서버는 예약 시각이 '지금~1분 전'일 때만 보냄 — 그보다 이전 시각은 영원히 발송되지 않으므로 여유를 둠 */
const MIN_SCHEDULE_LEAD_MS = 60 * 1000;

export const formSchema = z
  .object({
    title: z.string().trim().min(1, '제목을 입력하세요'),
    body: z.string().trim().min(1, '내용을 입력하세요'),
    screen: z.string().min(1, '누르면 이동할 화면을 고르세요'),
    params: z.string().optional(),
    linkUrl: z.string().optional(),
    sendType: z.enum(['immediate', 'scheduled', 'repeat']).or(z.literal('')),
    scheduledAt: z.date().optional(),
    scheduledTime: z.string().optional(),
    repeatType: z.enum(['WEEKLY', 'MONTHLY']).optional(),
    repeatDays: z.array(z.number()).optional(),
    repeatMonthDays: z.array(z.number()).optional(),
    sendOnLastDay: z.boolean().optional(),
    repeatEndAt: z.date().optional(),
    skipHolidays: z.boolean().optional(),
    isActive: z.boolean(),
    targetUserIds: z.array(z.string()).min(1, '받는 사람을 1명 이상 고르세요'),
  })
  .superRefine((values, ctx) => {
    // 발송 방식은 기본값 없이 직접 고르게 함 — 기본이 '즉시'면 아무것도 안 바꾸고 제출해도 바로 나감
    if (!values.sendType) {
      ctx.addIssue({ code: 'custom', path: ['sendType'], message: '발송 방식을 고르세요' });
    }

    // 딥링크: 직접 링크는 http(s) URL, 앱 화면 파라미터는 JSON 객체 — 칸 바로 아래에 오류 표시
    if (values.screen === 'Custom') {
      try {
        const url = new URL(values.linkUrl ?? '');
        if (!/^https?:$/.test(url.protocol)) throw new Error();
      } catch {
        ctx.addIssue({
          code: 'custom',
          path: ['linkUrl'],
          message: 'http:// 또는 https://로 시작하는 주소를 입력하세요',
        });
      }
    } else if (values.params?.trim()) {
      const parsed = parseJsonParams(values.params);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        ctx.addIssue({ code: 'custom', path: ['params'], message: 'JSON 객체 형식이 아니에요 (예: {"id": "123"})' });
      }
    }

    // 예약: 날짜·시간 필수, 지금 이후여야 함 (날짜가 비면 서버가 즉시 발송해 버림)
    if (values.sendType === 'scheduled') {
      if (!values.scheduledAt) {
        ctx.addIssue({ code: 'custom', path: ['scheduledAt'], message: '예약 날짜를 고르세요' });
      }
      if (!isValidClock(values.scheduledTime)) {
        ctx.addIssue({ code: 'custom', path: ['scheduledTime'], message: '발송 시간을 입력하세요' });
      }
      if (values.scheduledAt && isValidClock(values.scheduledTime)) {
        const at = combineDateAndTime(values.scheduledAt, values.scheduledTime);
        if (at.getTime() < Date.now() + MIN_SCHEDULE_LEAD_MS) {
          ctx.addIssue({ code: 'custom', path: ['scheduledTime'], message: '지금보다 이후 시각을 고르세요' });
        }
      }
    }

    if (values.sendType === 'repeat') {
      if (!isValidClock(values.scheduledTime)) {
        ctx.addIssue({ code: 'custom', path: ['scheduledTime'], message: '발송 시간을 입력하세요' });
      }
      if (values.repeatType === 'MONTHLY') {
        if (!values.repeatMonthDays || values.repeatMonthDays.length === 0) {
          ctx.addIssue({ code: 'custom', path: ['repeatMonthDays'], message: '반복할 날짜를 1개 이상 고르세요' });
        }
      } else if (!values.repeatDays || values.repeatDays.length === 0) {
        ctx.addIssue({ code: 'custom', path: ['repeatDays'], message: '반복할 요일을 1개 이상 고르세요' });
      }
      if (values.repeatEndAt) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (values.repeatEndAt < today) {
          ctx.addIssue({ code: 'custom', path: ['repeatEndAt'], message: '오늘 이후 날짜를 고르세요' });
        }
      }
    }
  });

export type FormValues = z.infer<typeof formSchema>;
