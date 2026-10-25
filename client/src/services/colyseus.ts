import { Client, Room } from 'colyseus.js';
import { RemotePlayer, ChatMessage, UserProfile } from '../types';

class ColyseusService {
  private client: Client;
  private sanctuaryRoom: Room | null = null;
  private confessionRoom: Room | null = null;
  private serverUrl: string;

  constructor() {
    this.serverUrl = import.meta.env.VITE_COLYSEUS_SERVER_URL || 'ws://localhost:2567';
    this.client = new Client(this.serverUrl);
  }

  public async joinSanctuary(
    profile: UserProfile,
    onPlayersChange: (players: RemotePlayer[]) => void,
    onChatMessage: (msg: ChatMessage) => void
  ): Promise<boolean> {
    try {
      this.sanctuaryRoom = await this.client.joinOrCreate('sanctuary', {
        displayName: profile.displayName,
        role: profile.role,
        isPastor: profile.isPastor,
        avatarColor: profile.avatarColor,
      });

      console.log('[Colyseus] Joined Sanctuary Room:', this.sanctuaryRoom.id);

      // Listen to player additions, moves, removals
      this.sanctuaryRoom.state.players.onAdd = () => this.syncPlayers(onPlayersChange);
      this.sanctuaryRoom.state.players.onRemove = () => this.syncPlayers(onPlayersChange);
      this.sanctuaryRoom.state.players.onChange = () => this.syncPlayers(onPlayersChange);

      // Listen to chat messages
      this.sanctuaryRoom.onMessage('chatMessage', (msg: ChatMessage) => {
        onChatMessage(msg);
      });

      return true;
    } catch (err) {
      console.warn('[Colyseus] Could not connect to multiplayer server, running in solo sandbox mode:', err);
      return false;
    }
  }

  private syncPlayers(onPlayersChange: (players: RemotePlayer[]) => void) {
    if (!this.sanctuaryRoom) return;
    const remoteList: RemotePlayer[] = [];

    this.sanctuaryRoom.state.players.forEach((p: any, sessionId: string) => {
      // Exclude self from remote list
      if (sessionId !== this.sanctuaryRoom?.sessionId) {
        remoteList.push({
          id: sessionId,
          userId: p.userId,
          displayName: p.displayName,
          role: p.role,
          isPastor: p.isPastor,
          avatarColor: p.avatarColor,
          x: p.x,
          y: p.y,
          z: p.z,
          rotationY: p.rotationY,
          isSitting: p.isSitting,
        });
      }
    });

    onPlayersChange(remoteList);
  }

  public sendMovement(x: number, y: number, z: number, rotationY: number) {
    if (this.sanctuaryRoom) {
      this.sanctuaryRoom.send('move', { x, y, z, rotationY });
    }
  }

  public sendChatMessage(text: string) {
    if (this.sanctuaryRoom) {
      this.sanctuaryRoom.send('chat', { text });
    }
  }

  public async joinConfession(
    slot: 'pastor' | 'confessor',
    profile: UserProfile,
    onStateChange: (state: any) => void
  ): Promise<Room | null> {
    try {
      this.confessionRoom = await this.client.joinOrCreate('confession', {
        requestedSlot: slot,
        isPastor: profile.isPastor,
        displayName: profile.displayName,
        userId: profile.id,
      });

      this.confessionRoom.onStateChange(onStateChange);
      return this.confessionRoom;
    } catch (err: any) {
      console.error('[Colyseus] Failed to join confession room:', err);
      throw err;
    }
  }

  public leaveConfession() {
    if (this.confessionRoom) {
      this.confessionRoom.leave();
      this.confessionRoom = null;
    }
  }

  public leaveSanctuary() {
    if (this.sanctuaryRoom) {
      this.sanctuaryRoom.leave();
      this.sanctuaryRoom = null;
    }
  }
}

export const colyseusService = new ColyseusService();
