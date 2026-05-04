export type ThreadId = string;
export type MessageId = string;

export type ThreadParticipant = {
  id: string;
  name: string;
  role: 'owner' | 'trainer' | 'staff';
};

export type Message = {
  id: MessageId;
  threadId: ThreadId;
  senderId: string;
  text: string;
  sentAt: Date;
  isRead: boolean;
};

export type Thread = {
  id: ThreadId;
  participant: ThreadParticipant;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
};
