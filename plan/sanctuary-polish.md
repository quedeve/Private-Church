# Plan: Polished 3D Sanctuary, Altar & Interactive Zones

Roles covered: **Interior designer** (layout, materials), **UX designer** (interaction flow), **3D artist** (realism, lighting), **Developer** (architecture, performance, tests).

Builds on [church-interior.md](./church-interior.md) and [church-interior-fixes.md](./church-interior-fixes.md). Target file: [Sanctuary.tsx](../client/src/scenes/Sanctuary.tsx).

## Requests

| # | Request | Section |
|---|---|---|
| 1 | No overlapping 3D objects. Confession room private, in front, beside the altar, pushed against the wall | §1, §2 |
| 2 | Donation in front of the altar, not overlapped, with lighting and gold falling like rain | §1, §3 |
| 3 | White floor and white walls look 3D and realistic | §4 |
| 4 | Wood floor looks 3D and realistic | §5 |

---

## 0. Overlap audit of the current scene

Coordinates are metres. `x` runs left to right, and the altar is at negative `z`.

| Conflict | Current positions | Problem |
|---|---|---|
| Pews vs columns | Left pew spans x −8.2 → −3.0. Column pedestal spans x −8.25 → −6.75 | Pew end touches or clips the column base (same on the right) |
| Confession booth vs column and pews | Booth at (−8.5, 0, 0), 3.2 × 2.6, covers x −10.1 → −6.9. Column at (−7.5, 2) and left pews | Booth intersects a column and pew rows |
| Donation chest vs altar platform | Chest at (6.5, −15). Platform covers x ±7, z −21.45 → −14.95 | Sits on the platform edge, half embedded |
| Pulpit vs donation chest | Pulpit at (5.4, −14.2), radius about 1.5 | Overlaps the chest and the platform edge |
| Painting vs booth | Left painting at z = −12 and y = 5.5 | Hangs through the booth crown |
| Floor layers | Marble plane, parquet box (y 0.005), marble runner (y 0.002), carpet (y 0.035), medallions (y 0.032 / 0.015) | Stacked coplanar surfaces cause z-fighting |

> [!IMPORTANT]
> These overlaps happen because positions are hardcoded in several places (`Sanctuary.tsx`, `PlayerController.tsx`). The fix is one **layout registry** that everything reads from (§6), plus an automated overlap test.

---

## 1. New layout (zoned floor plan)

```
 z = -22  ┌──────────────── APSE / GLORY ─────────────────┐
          │                                                │
 z = -18  │   ┌─────────── HIGH ALTAR PLATFORM ──────────┐ │   platform: x ±7, z -21.5 → -15.0
          │   └──────────────────────────────────────────┘ │
 z = -15  │ ░░░ chancel steps (full width, x ±7) ░░░░░░░░░ │
          │                                                │
 z = -12.6│   [CONF]        (( DONATION DAIS ))      [AMBO]│   donation dais at x 0, centered on aisle
          │   booth          r = 1.15 + gold rain    pulpit│   booth on left wall, pulpit on right wall
 z = -10  │  ▓ col                                  col ▓ │
          │                                                │
 z = -8   │        pews ──→ face the altar ←── pews        │   pews x ±(3.3 → 7.7), clear of columns
          │              ║ carpet (x ±2.2) ║               │
 z = +20  └──────────── ENTRANCE + holy water ────────────┘
```

**Side aisles** run between the columns (x ±8.25) and the wall faces (x ±12.05, inside the wainscot). They are 3.8 m wide and will hold the confession booth on the left and the pulpit on the right. The pews move out of the way.

### Footprint table (target)

| Object | Center (x, z) | Footprint (w × d) | Rotation y | Notes |
|---|---|---|---|---|
| High altar platform | (0, −18.2) | 14 × 6.5 | 0 | unchanged |
| **Donation dais** | **(0, −12.6)** | **r 1.15 (2.3 × 2.3)** | 0 | centered on the aisle, 2.4 m clear of the steps |
| **Confession booth** | **(−10.25, −13.0)** | **3.2 (along z) × 2.6 (along x)** | **+π/2 (door faces the nave)** | back against the left wall |
| **Pulpit (ambo)** | **(+10.0, −13.0)** | **r 1.7** | 0 | mirrors the booth on the right wall |
| Columns (6 pairs) | (±7.5, −16 / −10 / −4 / 2 / 8 / 14) | 1.65 × 1.65 | 0 | unchanged |
| Pews (7 rows per side) | (±5.5, −12 … +12) | **4.4 × 0.95** (was 5.2) | 0 | stays clear of columns: edges at x 3.3 and 7.7 |
| Holy water stoups | (±3.2, 19) | r 0.45 | 0 | unchanged |

Clearances:
- Booth vs column at z = −16: edge to edge 0.5 m. Booth vs column at z = −10: 0.45 m. Booth vs wainscot: 0.15 m gap, flush to the wall.
- Dais to chancel steps: 2.35 m. Dais to each side of the aisle: about 1.3 m walkable on either side before the pews.
- Remove the painting on the left wall at z = −12 and shift the paired paintings to z = −4, 4, 12 (and one at −18 above the chancel).

> [!NOTE]
> These footprints are a starting point. The in-engine overlap test (§6) will tell us the real margins, and exact numbers can move by ±0.3 m.

---

## 2. Confession room (private, beside the altar, pushed to the wall)

**Interior designer**
- Mount the booth against the left wall near the chancel, so it reads as a side chapel next to the altar rather than a piece of furniture in the middle of the nave.
- Three-bay Baroque confessional: center bay for the pastor, two side bays for the confessor. Door faces the nave (+x), rear flush with the wall.
- Walnut carcass, gilded pilasters, carved pediment with a small gold cross, red damask curtain, solid base plinth.

**3D artist**
- Solid back face and sides (no visible gaps), `castShadow` and `receiveShadow` on.
- A warm, dim interior light and a status lantern on top (green = free, red = in use), already in the scene.
- A small marble step at the door so it feels grounded, not floating.

**UX**
- Proximity ring on the floor in front of the door (radius 3.5 m) with a soft fade-in label. The label sits at 2.2 m height, not above the roof.
- "Press E" prompt appears only when facing the door within about ±60°.
- While the booth is in use, the lantern is red and the prompt reads "Occupied", with no queue or waiting list shown to other visitors, so confessions stay private.

**Dev**
- `layout.ts` entry `confessionBooth` supplies the position, rotation, trigger point and collision box. Trigger point is the door front: `(−8.9, −13.0)`.
- Booth gets a real collision box so players cannot walk through it, unlike the pews.

---

## 3. Donation: front of the altar, light and gold rain

**Concept: "Fountain of Light".** A circular marble dais directly in front of the chancel steps, with an ornate gilded offering chest on a pedestal. A shaft of warm light falls from above and golden coins and sparks rain down into it.

**Interior designer**
- Dais: two stacked marble rings (r 1.15 and r 0.95), gilded edge band, pedestal with a carved scroll base.
- Chest: gilded Baroque casket with a glowing slot on top, acanthus-style trim.
- Four small candle stands around the dais, which doubles as the visual boundary so nobody places anything on it.

**3D artist: gold rain effect**
- **Light column:** a soft additive cone from y ≈ 9 down to the chest (warm white to gold gradient, vertical falloff, low opacity 0.10 to 0.18) plus a `SpotLight` aimed at the chest. This gives a "heaven lights the offering" read.
- **Gold rain:** `InstancedMesh` of about 180 small gold coins (thin cylinders, `metalness 1`, `roughness 0.25`) falling inside a cylinder of radius 0.9. Each coin has its own speed, spin and phase and wraps back to the top when it reaches the chest. Updated in `useFrame` with a reusable `Object3D` (no per-frame allocation).
- **Sparkle layer:** drei `<Sparkles>` (gold, about 60 count) around the chest, and a short ring "splash" pulse on the dais when a coin lands.
- **Interaction burst:** when the donation panel opens, the rain density doubles for a few seconds (more coins, brighter spotlight).
- **Quality tiers:** High 180 coins plus Sparkles plus bloom; Medium 100 coins; Low 40 coins, no Sparkles, no bloom (see [church-interior.md](./church-interior.md) §G).

**UX**
- Label floats above the rain at y ≈ 3.4: "Persembahan & QRIS".
- Click or tap the chest, or press E within 3.5 m. Camera eases slightly toward the dais while the donation panel is open, and the HUD prompt is hidden so it does not cover the effect.
- Because it stands in the center aisle, keep the walkable gap on each side at least 1.2 m so wheelchair-width movement still works (relevant for the mobile joystick too).

**Dev**
- New file `client/src/scenes/effects/GoldRain.tsx` (props: `count`, `radius`, `height`, `intensity`).
- New file `client/src/scenes/DonationDais.tsx` (dais + chest + light column + rain), with an `onOpen` callback replacing the inline block in `Sanctuary.tsx`.
- Update `PlayerController.tsx` trigger point to `(0, −12.6)` radius 3.5, read from `layout.ts`.

---

## 4. Realistic white floor and white walls

**Problem:** flat `#f1f5f9` / `#fefce8` colors with a single roughness value read as plastic boxes.

**3D artist: materials**
- Use **PBR texture sets** (albedo, normal, roughness, AO) from CC0 sources (Poly Haven, ambientCG). Keep the licenses in `ASSETS_CREDITS.md`.
  - White marble with grey veining for the floor and pedestals
  - Warm plaster / stucco for the walls (matte, slight bump)
  - Travertine or limestone for the base moldings
- Load with drei `useTexture`, set `wrapS/T = RepeatWrapping`, `anisotropy = 8`, and size the repeat by **world meters** (for example, one tile every 2 m) so scale stays consistent. Set `colorSpace = SRGBColorSpace` on albedo only.
- Add subtle **tonal variation** (a second large-scale noise multiplier or a vertex-color tint) so the floor does not look tiled.
- Environment lighting: an `<Environment>` HDRI (interior or bright "church/studio") so the marble has something to reflect. Without this, marble looks matte regardless of roughness.
- Floor reflections: High tier uses drei `MeshReflectorMaterial` (blurred planar reflection, `mixStrength` ≈ 0.5) on the marble aisle only; other tiers use env reflections.

**Interior designer: architecture that adds depth to flat walls**
- Wall base zone: dado (wainscot) → chair rail → plastered panel field → cornice. The panel field gets **raised pilaster strips** and **recessed panel moldings** (thin boxes with beveled gilded edges) every bay, so light and shadow break the surface.
- Baseboards (skirting) along every wall and column base, in travertine or marble.
- Ceiling: keep the coffers, add an egg-and-dart style cornice band where the walls meet the vault.
- Window reveals: deepen window openings (0.4 m) with marble sills and architraves instead of flat quads.

**Dev**
- `materials.ts` exports shared materials: `whiteMarble`, `plaster`, `travertine`, `walnutParquet`, `gold`. Create each **once** and share, to keep draw calls and memory low.
- Texture budget: 1K for walls, 2K for the floor; convert to KTX2 for production. Keep total textures ≤ 8 MB on Low.
- Fallback: if textures fail to load, use the existing flat colors so the app still renders.

---

## 5. Realistic wood floor accents

**Problem:** the parquet is one flat brown box, with no grain, planks or seams.

**3D artist**
- Herringbone parquet PBR set (albedo, normal, roughness, AO) tiled by world meters. Each plank is about 0.12 × 0.6 m, so the pattern reads at correct scale from eye height.
- Slight roughness variation (satin finish, `roughness ≈ 0.35`), and `clearcoat` (0.3) on High tier for a polished-varnish highlight under the chandeliers.
- Edge detailing so the wood sits *in* the floor rather than on top of it:
  - Marble border stringer around each wood bay
  - Thin brass inlay strip on the inner edge
  - Slightly recessed wood (a 1 cm step down from the marble) with a beveled border
- Under the pews, add darker "shadow" AO decals along the pew bases to ground them.

**Interior designer**
- Wood only in the congregation bays (x ±(2.7 → 8.2)) and the chancel, with marble elsewhere. This matches the warm-wood-and-marble look of many Baroque churches.
- Optional: a darker walnut inlay border around the wood field for a "framed" look.

**Dev**
- Replace the stacked boxes with a **non-overlapping floor partition**, so nothing is coplanar:

  | Zone | x range | Material | y (top) |
  |---|---|---|---|
  | Aisle marble | −2.5 → 2.5 | white marble | 0.000 |
  | Carpet runner | −2.2 → 2.2 | red velvet (box 0.03 thick) | 0.030 |
  | Wood bays | ±(2.7 → 8.2) | herringbone parquet | −0.010 (recessed) |
  | Border stringers | ±(2.5 → 2.7) and ±(8.2 → 8.4) | marble + brass | 0.005 |
  | Side aisles | ±(8.4 → 12.05) | white marble | 0.000 |

- Carpet keeps `polygonOffset` and sits clearly above the marble (30 mm), so the earlier white flicker stays fixed.
- Remove the carpet medallions' coplanar rings (build them as one grouped mesh with distinct heights: 0.031, 0.033, 0.035).

---

## 6. Developer tasks: layout registry and overlap protection

1. **`client/src/scenes/layout.ts`**: the single source of truth.

   ```ts
   export type Footprint = {
     id: string;
     x: number; z: number;
     w: number; d: number;       // axis-aligned size before rotation
     rotY?: number;
     blocks: boolean;            // true = player collides, false = walk-through (pews)
     trigger?: { x: number; z: number; r: number };
   };
   export const LAYOUT: Footprint[] = [ /* altar, dais, booth, pulpit, columns, pews, stoups */ ];
   export const WALK_BOUNDS = { minX: -11.5, maxX: 11.5, minZ: -21.0, maxZ: 20.5 };
   ```

2. **Overlap test** (`layout.test.ts`, Vitest): check every pair of footprints that have `blocks: true` or are decorative, and **fail when two overlap** (with a minimum clearance, for example 0.3 m). Pews are allowed to overlap each other's rows by design but not columns or the booth. This is what keeps overlaps from coming back.

3. **Dev debug overlay**: a key (for example `F3`) that draws the footprints as translucent boxes, so overlaps are visible in the browser.

4. **PlayerController**: replace hardcoded bounds and trigger points with `LAYOUT` and `WALK_BOUNDS`. Add simple circle-vs-box collision for entries with `blocks: true` (booth, dais, pulpit, columns, altar). Pews stay walk-through.

5. **SanctuaryRoom (server)**: spawn point from the shared layout constants, so new players do not appear inside furniture.

6. **Refactor `Sanctuary.tsx`**: it is already about 1,000 lines. Split it into:

   ```
   scenes/
     Sanctuary.tsx          # composes the pieces
     layout.ts
     materials.ts
     Floor.tsx              # marble + parquet + carpet partition
     Walls.tsx              # walls, wainscot, pilasters, cornices, windows
     Altar.tsx              # chancel, high altar, glory
     DonationDais.tsx
     ConfessionBooth.tsx
     Pulpit.tsx
     Pews.tsx               # instanced
     effects/GoldRain.tsx
   ```

7. **Performance**: pews, columns, coffers and candle stands use instancing. Keep the real-time light count small (the scene already has many point lights; replace the less important ones with emissive materials or cap them per quality tier).

---

## 7. Implementation phases

| Phase | Work | Output |
|---|---|---|
| P1 | `layout.ts`, overlap test, debug overlay, move booth/pulpit/donation, shrink pews, remove the clashing painting | **No overlaps**; test passes |
| P2 | Floor partition (marble / carpet / recessed wood), fix the layering | Clean floor with no z-fighting |
| P3 | `GoldRain` + `DonationDais` with light column, tiers | Donation in front of the altar with gold rain |
| P4 | Confession booth rebuild against the left wall, door facing the nave, collision | Private booth beside the altar |
| P5 | PBR materials (marble, plaster, parquet), HDRI, reflector on High | Realistic white surfaces and wood |
| P6 | Wall architecture: pilasters, panel moldings, skirting, cornice, window reveals | Walls have depth |
| P7 | Split `Sanctuary.tsx`, instancing, tier testing on a phone | Maintainable and fast |
| P8 | QA pass in the browser (all four viewpoints below) | Sign-off |

### QA checklist
- [ ] No two objects intersect (test passes; debug overlay shows clear gaps)
- [ ] Booth is flush to the left wall, beside the altar, door facing the nave
- [ ] Donation dais is centered in front of the chancel steps; gold rain visible; light column visible; can walk around it
- [ ] Carpet is red from every angle (check low grazing angles from the entrance)
- [ ] White marble shows veining and reflections; walls show plaster texture and panel shadows
- [ ] Wood floor shows planks, grain, and a clear border
- [ ] Walk through pews works; walking through booth, dais, pulpit and columns is blocked
- [ ] 60 fps desktop High; 30 fps or more on a mid-range phone (Low tier)
- [ ] Interaction prompts are not hidden behind each other or behind the 3D labels

## Assets to prepare (CC0)
- Marble: Poly Haven / ambientCG white marble set
- Plaster: Poly Haven plaster / stucco set
- Wood: herringbone parquet set
- HDRI: bright church / indoor set
- Gold coin: simple procedural cylinder (no asset needed)

Record each source and license in `ASSETS_CREDITS.md`.

## Risks

| Risk | Mitigation |
|---|---|
| Coordinates above are tight (0.45 m clearances) | The overlap test fails early; widen by moving pews inward or shrinking the booth if needed |
| Gold rain costs too much on phones | Tiered coin count, no post effects on Low |
| Textures make the first load slow | 1K–2K KTX2, lazy load, loading screen already planned |
| Reflector floor doubles render cost | High tier only, aisle strip only |
| Booth behind the wall becomes hard to find | Floor ring marker + minimap/HUD hint "Bilik Pengakuan" |
