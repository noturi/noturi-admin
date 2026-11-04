import { NotificationPhonePreview } from '@/entities/notification';

interface NotificationPreviewProps {
  title: string;
  body: string;
  targetCount: number;
  schedule: string | null;
  destination: string | null;
}

/**
 * 휴대폰 알림 미리보기 + 발송 요약 — 제출 전에 "누구에게·언제·어떤 내용·어디로"를 한곳에서 검산
 * (실제 기기에서는 제목 약 1줄, 본문 약 2줄 이후가 잘림)
 */
export function NotificationPreview({ title, body, targetCount, schedule, destination }: NotificationPreviewProps) {
  return (
    <section aria-label="발송 미리보기" className="space-y-4">
      <NotificationPhonePreview title={title} body={body} />

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-1 text-sm">
        <dt className="text-muted-foreground">받는 사람</dt>
        <dd className="font-medium tabular-nums">
          {targetCount > 0 ? `${targetCount.toLocaleString()}명` : '아직 없음'}
        </dd>
        <dt className="text-muted-foreground">발송 시점</dt>
        <dd className="font-medium">{schedule ?? '아직 정하지 않음'}</dd>
        <dt className="text-muted-foreground">누르면</dt>
        <dd className="font-medium break-all">{destination ?? '아직 정하지 않음'}</dd>
      </dl>
    </section>
  );
}
