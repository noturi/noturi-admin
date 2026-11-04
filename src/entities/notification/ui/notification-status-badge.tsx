import { Badge } from '@/shared/ui/badge';

import { NOTIFICATION_STATUS_LABEL, type NotificationStatus } from '../model/status';

/** 빨강은 실제로 발송되지 못한 경우에만 (DESIGN.md: The One Red Rule) */
const STATUS_VARIANT: Record<NotificationStatus, 'secondary' | 'outline' | 'destructive'> = {
  scheduled: 'secondary',
  repeating: 'secondary',
  paused: 'outline',
  sent: 'outline',
  missed: 'destructive',
};

export function NotificationStatusBadge({ status }: { status: NotificationStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{NOTIFICATION_STATUS_LABEL[status]}</Badge>;
}
