# Plan: Church Interior Fixes & Atmosphere Enhancements

This plan addresses the 5 visual, spatial, and interaction fixes requested to make the 3D church feel like a comfortable, authentic Vatican / historic mega-church:

---

## 1. Chair / Pew Direction Fix
- **Issue**: Pews currently have their backrests at `-z` (towards the altar), causing the seats to face backward towards the entrance.
- **Fix**:
  - Invert backrest positioning to `+z` (`position={[0, 0.5, +0.38]}`), so the bench faces forward toward the high altar and Cathedra Petri glory (`-z`).
  - Position the padded kneeler / book rack on the back of each pew (`+z` side).
  - Add sculpted walnut armrests / pew ends correctly aligned to the congregation's forward view.

---

## 2. Walk-Through Pews ("Break Through While Walking")
- **Issue**: Players need to be able to walk freely through the pew seating areas without bumping into awkward collision hitboxes or getting snagged between benches.
- **Fix**:
  - Keep pew geometry strictly non-blocking in the character controller's collision loop.
  - The player's collision hull only blocks outer sanctuary boundary walls (`x = ±11.5`, `z = 21`, altar platform at `z < -17.0`), leaving all pew aisles and rows completely passable ("break through") for smooth navigation.

---

## 3. Floor Wood Accents & Z-Fighting Carpet Fix
- **Issue A (Carpet Flickering / Bleaching)**: The red carpet at `y = 0.01` exhibits floating-point depth buffer z-fighting at distant/grazing angles against the underlying floor, causing it to flash white.
- **Issue B (Wood Accents)**: The entire floor is currently pale stone; it needs warm hardwood accents (like Italian chevron/parquet walnut in old basilicas).
- **Fix**:
  - **3D Carpet Slab**: Replace the razor-thin plane with a raised solid velvet runner (`boxGeometry args={[4.6, 0.04, 44]}` at `y = 0.02`) with `polygonOffset` enabled.
  - **Parquet Wood Flooring under Pews**:
    - Under both congregation seating bays (left: `x = -6.2`, right: `x = +6.2`), replace the plain marble with rich dark Italian walnut herringbone/parquet wood flooring.
    - Border the wood bays with Carrara marble stringers and gilded gold strip moldings.
    - Keep the central procession aisle as rich red velvet with gold borders over polished marble.

---

## 4. Authentic Vatican & Old Cathedral Architectural Accessories
To give the space that warm, comfortable, revered old mega-church atmosphere:
1. **Carved Walnut Wainscoting & Dado Paneling**:
   - Install continuous rich dark walnut wood paneling (height 3.2m) with recessed classical moldings along both side walls.
2. **Hanging Brass Sanctuary Chandeliers**:
   - 6 hanging multi-tiered Baroque brass chandeliers suspended from the vault arches along the nave, casting warm candlelight and golden gleams.
3. **Framed Renaissance Fresco & Sacred Paintings**:
   - Gilded framed Renaissance artwork (Stations of the Cross / Masterpiece altar frescoes) mounted along the side aisle bays.
4. **Sculpted Baroque Wooden Pulpit (Ambo)**:
   - Elevated octagonal carved walnut preaching pulpit with spiral stair and sounding canopy on the right side of the chancel steps.
5. **Holy Water Fonts (Stoups)**:
   - Sculpted marble and brass shell-shaped holy water stoups near the south entrance.
6. **Choir Stalls**:
   - Double-tiered carved wood choir stalls flanking the high altar sanctuary.

---

## Implementation Checklist

- [ ] **Step 1**: Update `Sanctuary.tsx` pew orientation (`backrest` at `+z`) so all rows face the altar.
- [ ] **Step 2**: Reconstruct the floor layers in `Sanctuary.tsx`:
  - Solid 3D raised red velvet runner with gold borders (no z-fighting).
  - Rich parquet walnut wood flooring under both seating wings.
  - Polished marble walkways and borders.
- [ ] **Step 3**: Add accessories to `Sanctuary.tsx`:
  - Carved walnut wainscoting along side walls.
  - Hanging brass chandeliers with warm point lights.
  - Framed sacred oil paintings along the aisle walls.
  - Carved wooden pulpit / ambo.
  - Holy water stoups at entrance.
- [ ] **Step 4**: Verify `PlayerController.tsx` allows smooth walkthrough without catching on pews.
- [ ] **Step 5**: Test in browser on `http://localhost:5173/` and verify visual fixes from all viewing angles.
