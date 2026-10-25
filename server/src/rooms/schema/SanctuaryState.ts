import { Schema, type, MapSchema } from "@colyseus/schema";

export class SanctuaryPlayer extends Schema {
  @type("string") id: string = "";
  @type("string") userId: string = "";
  @type("string") displayName: string = "Guest";
  @type("string") role: string = "visitor";
  @type("boolean") isPastor: boolean = false;
  @type("string") avatarColor: string = "#3b82f6";

  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
  @type("number") rotationY: number = 0;
  @type("boolean") isSitting: boolean = false;
  @type("string") currentAnimation: string = "idle";
}

export class SanctuaryState extends Schema {
  @type({ map: SanctuaryPlayer }) players = new MapSchema<SanctuaryPlayer>();
}
