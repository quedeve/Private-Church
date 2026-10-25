export interface TriggerZone {
  x: number;
  y: number;
  z: number;
  distance: number;
}

export const LAYOUT = {
  // Central Altar & Apse
  highAltar: {
    x: 0,
    y: 0,
    z: -18.2,
    width: 14.0,
    depth: 6.5,
  },

  // Donation Dais centered in front of the Chancel Steps
  donationDais: {
    x: 0,
    y: 0,
    z: -12.5,
    radius: 1.25,
    trigger: {
      x: 0,
      y: 0,
      z: -12.5,
      distance: 3.6,
    } as TriggerZone,
  },

  // Private Confession Room beside Altar, positioned against Left Wall
  confessionBooth: {
    x: -9.8,
    y: 0,
    z: -14.5,
    width: 2.6,
    depth: 3.2,
    rotationY: Math.PI / 2, // Door faces nave / east (+x)
    trigger: {
      x: -8.0,
      y: 0,
      z: -14.5,
      distance: 4.0,
    } as TriggerZone,
  },

  // Preaching Pulpit (Ambo) on Right Wall
  pulpitAmbo: {
    x: 9.8,
    y: 0,
    z: -14.5,
    radius: 1.35,
  },

  // Congregation Pews Layout (4.0m width, zero overlap with columns or central aisle)
  pews: {
    leftX: -5.4,
    rightX: 5.4,
    width: 4.0,
    depth: 0.85,
    rowsZ: [-12, -8, -4, 0, 4, 8, 12],
  },

  // Colossal Columns (6 pairs)
  columns: {
    leftX: -7.5,
    rightX: 7.5,
    rowsZ: [-16, -10, -4, 2, 8, 14],
    radius: 0.85,
  },

  // Sanctuary Movement Collision Bounds
  bounds: {
    minX: -11.2,
    maxX: 11.2,
    minZ: -17.0,
    maxZ: 20.5,
  },
};
