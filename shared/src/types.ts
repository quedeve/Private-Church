export enum RoomType {
  SANCTUARY = 'sanctuary',
  CONFESSION = 'confession',
}

export enum UserRole {
  VISITOR = 'visitor',
  PASTOR = 'pastor',
  ADMIN = 'admin',
}

export enum ConfessionSessionStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  ENDED = 'ended',
}

export interface PlayerData {
  id: string;
  userId?: string;
  displayName: string;
  role: UserRole;
  isPastor: boolean;
  avatarColor: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  role: UserRole;
  text: string;
  timestamp: number;
}

export interface DonationMethod {
  id: string;
  category: 'qris' | 'bank' | 'ewallet' | 'platform' | 'gateway';
  title: string;
  bankOrProviderName: string;
  accountNumber?: string;
  accountHolder?: string;
  qrImageUrl?: string;
  externalUrl?: string;
  instructions?: string;
  isActive: boolean;
  badge?: string;
}
