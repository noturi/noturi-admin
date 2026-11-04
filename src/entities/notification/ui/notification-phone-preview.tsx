import { Bell } from 'lucide-react';

/**
 * 휴대폰 알림 모양 — 작성 폼 미리보기와 상세 화면이 같은 모양을 씀
 * (실제 기기에서는 제목 약 1줄, 본문 약 2줄 이후가 잘림)
 */
export function NotificationPhonePreview({
  title,
  body,
  time = '지금',
}: {
  title: string;
  body: string;
  time?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-3 text-card-foreground shadow-sm">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Bell className="size-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>노트리</span>
          <span>{time}</span>
        </div>
        <p className="truncate text-sm font-semibold">{title || '제목'}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{body || '내용이 여기에 보여요'}</p>
      </div>
    </div>
  );
}
