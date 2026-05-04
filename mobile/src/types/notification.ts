export type NotificationId = string;

export type NotificationType =
  | 'booking-confirmed'
  | 'report-published'
  | 'booking-cancelled'
  | 'announcement';

export type Notification = {
  id: NotificationId;
  type: NotificationType;
  title: string;
  body: string;
  receivedAt: Date;
  isRead: boolean;
  deepLinkPath?: string; // e.g. '/report-card/dog-brodie?variant=foundation'
};
