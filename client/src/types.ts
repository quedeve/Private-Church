export type UserRole = 'visitor' | 'pastor' | 'admin';

export interface UserProfile {
  id: string;
  displayName: string;
  role: UserRole;
  isPastor: boolean;
  avatarColor: string;
  isGuest: boolean;
}

export interface RemotePlayer {
  id: string;
  userId: string;
  displayName: string;
  role: UserRole;
  isPastor: boolean;
  avatarColor: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  isSitting?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  role: string;
  isPastor: boolean;
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
  badge?: string;
  isActive: boolean;
}

export type ConfessionStatus = 'idle' | 'waiting' | 'active' | 'ended';
