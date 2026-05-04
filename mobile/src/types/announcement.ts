export type AnnouncementId = string;

export type AnnouncementCategory =
  | 'urgent'
  | 'team'
  | 'class'
  | 'event'
  | 'promo';

export type Announcement = {
  id: AnnouncementId;
  category: AnnouncementCategory;
  title: string;
  publishedAt: Date;
  deepLinkPath?: string; // routes to an info page e.g. '/info/yappy-hour'
};
