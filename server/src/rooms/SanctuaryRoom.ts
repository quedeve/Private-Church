import { Room, Client } from "@colyseus/core";
import { SanctuaryState, SanctuaryPlayer } from "./schema/SanctuaryState";

export class SanctuaryRoom extends Room<SanctuaryState> {
  maxClients = 100;

  onCreate(options: any) {
    this.setState(new SanctuaryState());

    // Register movement handler
    this.onMessage("move", (client, data: { x: number; y: number; z: number; rotationY: number; animation?: string }) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = data.x;
        player.y = data.y;
        player.z = data.z;
        player.rotationY = data.rotationY;
        if (data.animation) {
          player.currentAnimation = data.animation;
        }
      }
    });

    // Register sitting state
    this.onMessage("sit", (client, data: { isSitting: boolean; pewIndex?: number }) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.isSitting = data.isSitting;
      }
    });

    // Register text chat / prayer request broadcast
    this.onMessage("chat", (client, message: { text: string }) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      const chatPayload = {
        id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        senderId: client.sessionId,
        senderName: player.displayName,
        role: player.role,
        isPastor: player.isPastor,
        text: message.text.slice(0, 300), // sanitize length
        timestamp: Date.now(),
      };

      this.broadcast("chatMessage", chatPayload);
    });

    console.log(`[SanctuaryRoom] Created room: ${this.roomId}`);
  }

  onJoin(client: Client, options: any) {
    console.log(`[SanctuaryRoom] Client joined: ${client.sessionId}`, options);

    const player = new SanctuaryPlayer();
    player.id = client.sessionId;
    player.userId = options?.userId || client.sessionId;
    player.displayName = options?.displayName || `Guest-${client.sessionId.slice(0, 4)}`;
    player.role = options?.role || "visitor";
    player.isPastor = Boolean(options?.isPastor);
    player.avatarColor = options?.avatarColor || "#4f46e5";

    // Random initial spawn offset near the entrance
    player.x = (Math.random() - 0.5) * 4;
    player.y = 0;
    player.z = 14 + (Math.random() - 0.5) * 2;
    player.rotationY = Math.PI;

    this.state.players.set(client.sessionId, player);

    // Notify others of arrival
    this.broadcast("playerNotice", {
      type: "join",
      name: player.displayName,
      isPastor: player.isPastor,
    });
  }

  onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      this.broadcast("playerNotice", {
        type: "leave",
        name: player.displayName,
      });
      this.state.players.delete(client.sessionId);
    }
    console.log(`[SanctuaryRoom] Client left: ${client.sessionId}`);
  }

  onDispose() {
    console.log(`[SanctuaryRoom] Disposing room: ${this.roomId}`);
  }
}
