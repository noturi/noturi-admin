import { NotificationPhonePreview } from '@/entities/notification';
import type { UserReachSummary } from '@/entities/user';

interface NotificationPreviewProps {
  title: string;
  body: string;
  targetCount: number;
  /** 실제로 받을 수 있는 인원 (확인 중이면 null) */
  reach?: UserReachSummary | null;
  schedule: string | null;
  destination: string | null;
}

/**
 * 휴대폰 알림 미리보기 + 발송 요약 — 제출 전에 "누구에게·언제·어떤 내용·어디로"를 한곳에서 검산
 * (실제 기기에서는 제목 약 1줄, 본문 약 2줄 이후가 잘림)
 */
export function NotificationPreview({
  title,
  body,
  targetCount,
  reach,
  schedule,
  destination,
}: NotificationPreviewProps) {
  const unreachable = reach ? reach.total - reach.reachable : 0;
  return (
    <section aria-label="발송 미리보기" className="space-y-4">
      <NotificationPhonePreview title={title} body={body} />

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-1 text-sm">
        <dt className="text-muted-foreground">받는 사람</dt>
        <dd className="font-medium tabular-nums">
          {targetCount > 0 ? `${targetCount.toLocaleString()}명` : '아직 없음'}
          {reach && unreachable > 0 && (
            // 알림 끔·기기 없음은 보내도 받지 못함 — 보내기 전에 알게
            <span className="mt-0.5 block text-xs font-normal break-keep text-muted-foreground">
              실제로 받을 수 있는 사람 {reach.reachable.toLocaleString()}명 (알림 끔{' '}
              {reach.notificationOff.toLocaleString()} · 기기 없음 {reach.noDevice.toLocaleString()}
              {reach.notFound > 0 && ` · 탈퇴 ${reach.notFound.toLocaleString()}`})
            </span>
          )}
        </dd>
        <dt className="text-muted-foreground">발송 시점</dt>
        <dd className="font-medium">{schedule ?? '아직 정하지 않음'}</dd>
        <dt className="text-muted-foreground">누르면</dt>
        <dd className="font-medium break-all">{destination ?? '아직 정하지 않음'}</dd>
      </dl>
    </section>
  );
}
