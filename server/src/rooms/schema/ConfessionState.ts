import { Schema, type } from "@colyseus/schema";

export class ConfessionState extends Schema {
  @type("string") pastorSessionId: string = "";
  @type("string") pastorUserId: string = "";
  @type("string") pastorDisplayName: string = "";

  @type("string") confessorSessionId: string = "";
  @type("string") confessorUserId: string = "";
  @type("string") confessorDisplayName: string = "";

  @type("string") status: string = "waiting"; // 'waiting' | 'active' | 'ended'
  @type("string") livekitRoomName: string = "";
  @type("number") startedAt: number = 0;
}
