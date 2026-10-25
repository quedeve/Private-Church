import { Room, Client, ServerError } from "@colyseus/core";
import { ConfessionState } from "./schema/ConfessionState";

export class ConfessionRoom extends Room<ConfessionState> {
  maxClients = 2;

  onCreate(options: any) {
    this.setState(new ConfessionState());
    this.state.livekitRoomName = `confession-${this.roomId}-${Date.now().toString(36)}`;
    this.state.status = "waiting";

    // Allow participants to end the confession explicitly
    this.onMessage("endConfession", (client) => {
      if (
        client.sessionId === this.state.pastorSessionId ||
        client.sessionId === this.state.confessorSessionId
      ) {
        this.state.status = "ended";
        this.broadcast("confessionEnded", { reason: "Participant ended session" });
      }
    });

    console.log(`[ConfessionRoom] Created room: ${this.roomId}`);
  }

  // Server-side authorization check before allowing join
  onAuth(client: Client, options: any) {
    const requestedSlot = options?.requestedSlot || "confessor"; // 'pastor' or 'confessor'

    if (requestedSlot === "pastor") {
      // Must have verified isPastor flag from profile/auth
      if (!options?.isPastor) {
        throw new ServerError(403, "Forbidden: Only authorized pastors may join the Pastor slot.");
      }
      if (this.state.pastorSessionId) {
        throw new ServerError(409, "Pastor slot is already occupied.");
      }
    } else {
      if (this.state.confessorSessionId) {
        throw new ServerError(409, "Confession booth is currently in use. Please wait.");
      }
    }

    return true;
  }

  onJoin(client: Client, options: any) {
    const requestedSlot = options?.requestedSlot || "confessor";
    const displayName = options?.displayName || "Anonymous";
    const userId = options?.userId || client.sessionId;

    if (requestedSlot === "pastor") {
      this.state.pastorSessionId = client.sessionId;
      this.state.pastorUserId = userId;
      this.state.pastorDisplayName = displayName;
      console.log(`[ConfessionRoom] Pastor joined: ${displayName}`);
    } else {
      this.state.confessorSessionId = client.sessionId;
      this.state.confessorUserId = userId;
      this.state.confessorDisplayName = displayName;
      console.log(`[ConfessionRoom] Confessor joined: ${displayName}`);
    }

    // Check if both slots are now filled
    if (this.state.pastorSessionId && this.state.confessorSessionId) {
      this.state.status = "active";
      this.state.startedAt = Date.now();
      console.log(`[ConfessionRoom] Session is now ACTIVE! Both slots occupied.`);
      this.broadcast("confessionReady", {
        roomName: this.state.livekitRoomName,
        status: "active",
      });
    } else {
      this.state.status = "waiting";
    }
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`[ConfessionRoom] Participant left: ${client.sessionId}`);

    if (client.sessionId === this.state.pastorSessionId) {
      this.state.pastorSessionId = "";
      this.state.pastorUserId = "";
    } else if (client.sessionId === this.state.confessorSessionId) {
      this.state.confessorSessionId = "";
      this.state.confessorUserId = "";
    }

    // When either party leaves, mark session as ended to guarantee voice disconnection
    this.state.status = "ended";
    this.broadcast("confessionEnded", { reason: "Participant disconnected" });
  }

  onDispose() {
    console.log(`[ConfessionRoom] Disposing room: ${this.roomId}`);
  }
}
