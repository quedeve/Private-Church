# Church interior — Renaissance / Baroque basilica plan

Plan to replace the current placeholder Gothic sanctuary ([Sanctuary.tsx](../client/src/scenes/Sanctuary.tsx)) with a grand Renaissance/Baroque interior. The scene must run in real time in the browser on desktop **and** mid-range phones.

## Target look (art brief)

| Element | Description |
|---|---|
| Architecture | Monumental basilica. Long nave leads to a crossing under a towering **coffered dome**, ending in a **central arched apse** |
| Dome & vaults | Coffered (recessed square/octagonal panels) dome and barrel vaults, with **gilded gold moldings, friezes, classical cornices** |
| Columns | Tall vertical **marble columns/pilasters with Corinthian capitals**, framing large **clear arched windows** |
| Focal centerpiece | In the apse: an ornate **glory** with shimmering **gold radial rays** surrounding a **glowing oval stained-glass window** (Cathedra Petri style) |
| Lighting | Bright, warm daylight streaming through high side windows. **Volumetric light shafts**, crisp specular highlights on polished marble and gold, deep shadows under the arches, golden highlights on the coffers |
| Rendering | HDR, filmic tone mapping, photoreal PBR textures, metallic gold reflectivity, **polished reflective marble floor** |

> [!IMPORTANT]
> "Photorealistic + volumetric + reflections" in a browser on phones is only possible with **baked lighting** and **quality tiers**. Real-time GI and true volumetrics are not an option on mobile WebGL. The look has to be faked smartly, and this plan is built around that.

---

## Key technical decisions

| Topic | Decision | Why |
|---|---|---|
| Hero geometry (dome, apse, columns, capitals, moldings) | Model in **Blender** and export as **glTF (.glb)** | Corinthian capitals, coffers and friezes are impractical to build from R3F primitives |
| Repeated details (columns, capitals, coffers, pews, window frames) | **Instancing** (`<Instances>` / `InstancedMesh`) or glTF `EXT_mesh_gpu_instancing` | Keeps draw calls low |
| Lighting | **Bake** GI + soft shadows + AO in Blender (Cycles) to lightmaps. Add only 1 real-time directional "sun" for dynamic objects/avatars | Baked light gives the deep arch shadows and warm bounce at zero runtime cost |
| Environment / reflections | Small HDRI or baked **cube map** of the interior for `envMap` (drei `<Environment files=...>`) | Gold and marble need something to reflect. Without an env map, metal looks black |
| Gold | `MeshStandardMaterial` metalness 1, roughness 0.2–0.35, warm albedo (~`#d4a24c`), plus a subtle normal map | Physically plausible gilding |
| Marble | Albedo + roughness + normal maps (CC0 from Poly Haven / ambientCG), roughness ~0.1–0.2 for the floor | Polished look |
| Floor reflections | **High tier:** drei `MeshReflectorMaterial` (blurred planar reflection). **Low/Med:** env-map reflection + baked reflection hint in the lightmap | Planar reflection doubles the render cost, so desktop only |
| Light shafts | **Fake volumetrics:** additive, depth-faded cone/plane meshes with a gradient + animated noise shader, aligned to the sun direction. **High tier:** optional `GodRays` post effect | True volumetric fog is too expensive on mobile |
| Stained-glass glory | Emissive oval texture (strong emissive, HDR value > 1) + gold ray fan (instanced thin wedges, metallic) + **Bloom** on high/med tiers | Bloom gives the "divine glow" |
| Post-processing | `@react-three/postprocessing`: Bloom, ToneMapping (ACES / AgX), SMAA, optional subtle Vignette. **Low tier: no post FX** | |
| Texture delivery | **KTX2 / Basis** textures + **Meshopt or Draco** geometry compression via `gltf-transform` | Cuts download size and GPU memory, which matters a lot on phones |
| Colour pipeline | Keep R3F defaults (sRGB output, ACES tone mapping), and set `toneMappingExposure` per tier | |

### New dependencies (client)
- `@react-three/postprocessing`, `postprocessing`
- Dev/tooling: `@gltf-transform/cli` (compression), `gltfjsx` (glb → typed JSX component)
- Already installed: `three`, `@react-three/fiber`, `@react-three/drei`

---

## Layout & scale (metres)

Bigger than the current 22 × 40 m hall, but kept walkable. Avatars are ~1.8 m, so real basilica proportions make the player feel tiny. The plan scales the space down to roughly 60% of a real basilica.

```
              N (-z)
        ┌───── APSE ─────┐     apse: semicircle r = 9, height 22
        │   Glory window  │
        │   + gold rays   │
   ┌────┴────────────────┴────┐
   │        CROSSING          │  dome: drum + coffered dome, r = 11,
   │     (dome overhead)      │        oculus/lantern top at y ≈ 38
   └────┬────────────────┬────┘
        │                │
        │      NAVE      │  nave: 18 w × 48 l, barrel vault, height 24
        │  columns every │  aisles: 6 w each side, arcades between columns
        │      6 m       │  clear arched clerestory windows above the arcades
        │                │
        └──── ENTRANCE ──┘
              S (+z)
```

- **Player spawn:** south entrance, looking north toward the glory (first impression = the money shot)
- **Donation chest:** move to the crossing, side of the altar steps
- **Confession booths:** move into a side aisle chapel (quieter, more private-feeling)
- All interaction positions and walkable bounds go into one config file (see Integration)

---

## Phases

### Phase A — Reference & blockout
- [ ] Gather reference boards (St. Peter's apse / Cathedra Petri, Il Gesù, Sant'Andrea della Valle, Pantheon coffers). Use only for reference, never as copied assets
- [ ] Blockout in Blender with simple boxes, cylinders and half-domes at the scale above
- [ ] Export the blockout `.glb`, load it in R3F, and walk through it with the current controller. Check scale, sightlines, and that the glory reads from the entrance
- [ ] Lock the dimensions before detailing

**Acceptance:** you can walk the blockout, proportions feel grand but not empty, and the apse is the clear focal point.

### Phase B — Architectural modelling
- [ ] Nave walls, arcades, barrel vault with coffers (model one coffer and array/instance it)
- [ ] Dome: drum with windows, coffered dome (one coffer ring module, radially instanced), lantern/oculus
- [ ] Corinthian capital: model **once** (mid-poly) plus a low-poly LOD, then instance on every column/pilaster
- [ ] Column shafts (fluted normal map instead of fluted geometry), bases, entablature, cornice, frieze strips
- [ ] Arched clear windows (frame geometry + transparent/opaque glass)
- [ ] Apse half-dome + glory: oval window, gold ray fan, cloud/putti shapes (stylised, optional)
- [ ] Floor: patterned marble (inlay pattern via texture, not geometry)
- [ ] Pews/benches (instanced), altar steps, altar
- [ ] UV unwrap: a second UV channel (UV2) for lightmaps on all static meshes

**Budget targets:**

| Tier | Triangles (scene) | Draw calls | Textures |
|---|---|---|---|
| Low (mobile) | ≤ 300k | ≤ 120 | 1K, KTX2 |
| Medium | ≤ 800k | ≤ 200 | 2K, KTX2 |
| High (desktop) | ≤ 1.5M | ≤ 300 | 2K–4K hero, KTX2 |

### Phase C — Materials
- [ ] Material library (keep it small, share materials): white Carrara marble, coloured marble (column shafts), polished floor marble, gold leaf, darker stone for shadowed trim, clear glass, stained glass (emissive)
- [ ] CC0 PBR textures (Poly Haven / ambientCG), converted to KTX2
- [ ] Trim sheet for moldings/friezes, so many meshes share one texture set
- [ ] Gold: metalness 1, roughness map with slight variation (old gilding isn't mirror-perfect)

### Phase D — Lighting & bake
- [ ] Blender lighting setup: strong warm sun (~5500 K) through the high south/side windows, sky light, emissive glory window
- [ ] Bake lightmaps (Cycles: diffuse + indirect + AO) for nave, dome, apse. Denoise. Pack into 2–4 atlases
- [ ] Bake an interior cube map/HDRI from the crossing for `envMap`
- [ ] In R3F: apply lightmaps (`material.lightMap` with UV2), set `envMap`, add one directional light matching the baked sun for avatars (with shadows on high tier only)
- [ ] Check contrast: deep shadows under the arches, bright golden coffers. Tune `toneMappingExposure`

**Acceptance:** with post FX off, the static scene already looks warm, bright and contrasty.

### Phase E — Hero centerpiece (glory)
- [ ] Oval stained-glass texture (dove / radiant motif) as a strong emissive map (HDR intensity 3–8 so it blooms)
- [ ] Gold ray fan: instanced wedges radiating from the oval, metallic gold with varied lengths
- [ ] Subtle animation: slow shimmer (emissive pulse ±5%, or animated roughness/normal offset on the rays)
- [ ] A point/spot light in front (high tier) to cast warm light onto the apse

### Phase F — Atmosphere & post FX
- [ ] Light shafts: custom shader material on cone/plane meshes from each high window (additive blend, soft depth fade, slow drifting noise for dust). Aim them along the sun direction
- [ ] Optional floating dust particles in the shafts (instanced points, low count)
- [ ] Post FX (Medium/High): Bloom (threshold just below the glory/gold highlights), SMAA, ACES/AgX tone mapping, light vignette
- [ ] High only: `MeshReflectorMaterial` on the floor, `GodRays` from the glory or windows, soft shadows
- [ ] Ambient audio: reverb-heavy choir/organ loop (replaces the sine-wave drone) with a large-hall reverb impulse response

### Phase G — Performance & quality tiers
- [ ] `QualityProvider`: auto-detect with drei `<PerformanceMonitor>` + device hints, plus a manual setting in the HUD (Low / Medium / High)
- [ ] `<AdaptiveDpr>` (cap DPR at 1.5 on mobile) and `<AdaptiveEvents>`
- [ ] LODs for capitals/pews (drei `<Detailed>`)
- [ ] Lazy load: show a loading screen with progress (drei `useProgress`). Load the low-res scene first and stream high-res textures after
- [ ] Measure on a real mid-range Android + iPhone: target **≥ 30 fps on Low**, **60 fps on desktop High**
- [ ] Total download goal: **≤ 15 MB on Low**, **≤ 40 MB on High**

### Phase H — Integration with the existing app
- [ ] New folder `client/src/scenes/basilica/`:
  ```
  Basilica.tsx          # loads glb (gltfjsx output), applies lightmaps/materials
  Glory.tsx             # apse centerpiece (emissive oval + gold rays)
  LightShafts.tsx       # fake volumetric shafts shader
  PostFX.tsx            # tiered post-processing
  materials.ts          # shared material library
  layout.ts             # bounds, spawn, interaction points (single source of truth)
  ```
- [ ] `client/public/models/basilica.glb` + `client/public/textures/` (KTX2)
- [ ] Replace the hardcoded movement bounds in [PlayerController.tsx](../client/src/player/PlayerController.tsx) (currently `x ±9.5`, `z ±18.5`, altar block at `z < -15.5`) with values from `layout.ts`. Better: real colliders (Rapier, as in the main plan) so columns and pews block movement
- [ ] Move the donation chest and confession booth proximity points (currently hardcoded `(5.5, 0, -13)` and `(-7.5, 0, 2)` in `PlayerController`) into `layout.ts` and use them in both the scene and the controller
- [ ] Update the server spawn position in `SanctuaryRoom.onJoin` (currently `z ≈ 14`) to match the new entrance
- [ ] Restyle the donation chest and confession booths to match (marble + gold, Baroque woodwork)
- [ ] Keep the old `Sanctuary.tsx` as a fallback scene until the basilica passes the Phase G acceptance criteria

**Acceptance:** the basilica replaces the old hall, donation and confession interactions work at their new positions, multiplayer avatars spawn correctly, and the frame-rate targets hold on a real phone.

---

## Asset sourcing & licensing
- Textures: **Poly Haven, ambientCG** (CC0)
- HDRI (if not baked): Poly Haven (CC0)
- Do **not** use ripped or scanned models of real basilicas without a licence. Photogrammetry of St. Peter's etc. is often non-commercial-only
- Sketchfab models: check the licence per model (CC-BY needs attribution in the app's credits)
- Keep an `ASSETS_CREDITS.md` listing every external asset and its licence

## Risks

| Risk | Mitigation |
|---|---|
| Too heavy for phones | Tiers from day one, baked lighting, KTX2, instancing, measure early in Phase A/B |
| Gold looks flat/black | Always provide an `envMap`, and test gold under the final env map, not a default one |
| Light shafts look like solid cones | Depth fade + soft edges + low opacity; tune them in context with bloom |
| Bake/UV2 work is time-consuming solo | Bake only big static architecture, and let small props use env lighting only |
| Scope creep on ornament detail | Detail goes where the player looks (apse, dome, capitals at eye level). Use normal maps/trim sheets elsewhere |

## Suggested order & rough effort (solo)

| Phase | Effort |
|---|---|
| A — Blockout | 2–4 days |
| B — Modelling | 2–3 weeks (capitals, dome and glory are the bulk) |
| C — Materials | 3–5 days |
| D — Lighting & bake | 1 week (iteration heavy) |
| E — Glory | 3–5 days |
| F — Atmosphere & post FX | 4–6 days |
| G — Performance | 1 week |
| H — Integration | 3–5 days |

> [!TIP]
> Fastest path to a convincing result: do A → D with plain white marble and gold only (no detailed textures). Baked lighting is ~70% of the "divine, luminous" look. Add detail afterwards.
