# 3D church app — project plan

Solo-build plan for a browser-based 3D virtual church with multiplayer rooms, a role-gated confession room, and donations.

## Goals

- Walk-around 3D space in the browser (desktop + mobile, no VR required)
- Multiple rooms, with people present as avatars in real time
- A confession room where the "pastor" role is assigned at room creation, and only that pair gets private voice
- A donation flow (payment checkout)

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| 3D rendering | React Three Fiber (Three.js / WebGL) | Fits existing React/JS skill, huge ecosystem |
| Multiplayer rooms & roles | Colyseus (managed / Colyseus Cloud) | Built-in room state sync, natural fit for "assign pastor role per room" |
| Voice | LiveKit (managed / LiveKit Cloud) | WebRTC voice, no recording, gate access per role |
| Auth & data | Supabase | Auth, user profiles, church roles, donation records — minimal backend code |
| Donations | Tiered: (1) static QRIS/bank/e-wallet info, (2) external links (Saweria, Trakteer), (3) last/optional: Midtrans/Xendit hosted checkout | Start with zero-backend options; add a gateway only if automated tracking is needed. (Stripe is not available for Indonesian merchants.) |
| Hosting (client) | Vercel or Netlify | Free tier, zero-config for a Vite/React app |

Managed/cloud tiers for Colyseus and LiveKit on purpose — avoids running your own servers while solo.

---

## Phase 0 — Prerequisites & decisions (before writing code)

**Repo & tooling**
- [ ] Git repo + `.gitignore` (`node_modules`, `.env*`, `dist`)
- [ ] Pin Node LTS version (`.nvmrc` or `engines` in `package.json`)
- [ ] Repo layout (one repo, separate deployables):
  ```
  client/     # Vite + R3F app  -> Vercel/Netlify
  server/     # Colyseus rooms  -> Colyseus Cloud
  supabase/   # migrations + edge functions (LiveKit token, donations)
  shared/     # shared types (room names, message types)
  ```
- [ ] Env/secrets plan: `.env.example` committed, real values never committed. Secrets (LiveKit API secret, Supabase service-role key, gateway server key) live **only** server-side, never in `VITE_*` vars, because anything with that prefix ends up in the client bundle
- [ ] Separate dev and prod projects for Supabase / LiveKit / Colyseus

**Accounts & cost check**
- [ ] Check current free tier and pricing for Colyseus Cloud, LiveKit Cloud, Supabase (free projects pause when inactive) and Vercel/Netlify. Estimate monthly cost at e.g. 50 concurrent users
- [ ] Domain + HTTPS. Browsers only allow microphone access on HTTPS (or localhost)

**Product decisions to lock in**
- [ ] Guest access: can people enter the sanctuary without logging in? (Phase 2 runs before auth, so decide whether guests stay allowed later)
- [ ] Confession entry: is login required? Is the confessor's identity shown to the pastor or kept anonymous (anonymous display name / hidden avatar)?
- [ ] Confession queue: what happens when no pastor is online (waiting message, schedule of pastor hours)?
- [ ] Sanctuary communication: none, text chat, or proximity voice? (affects moderation load and LiveKit cost)
- [ ] Max players per sanctuary room (Colyseus `maxClients`), and whether to auto-create new instances when full
- [ ] Language: Indonesian, English, or both (i18n from the start is cheaper than adding it later)
- [ ] Who manages `is_pastor` and the donation info (Supabase dashboard is fine at first, or a simple admin page)

**Legal & safety (Indonesia)**
- [ ] Privacy policy + terms (UU PDP No. 27/2022 personal data law). Say clearly that confessions are not recorded
- [ ] Minimum age / safeguarding policy for private 1:1 voice (minors alone with an adult in private voice is a real risk area)
- [ ] Report/block button in the confession room from day one, not deferred to Phase 7
- [ ] Church/organization approval to collect donations under its name

---

## Phase 1 — Single room, solo movement

**Goal:** one static room you can walk around in, feels good, no networking yet.

**Setup**
- [ ] `npm create vite@latest client -- --template react-ts` (inside the repo root, matching the Phase 0 layout)
- [ ] Install: `three @react-three/fiber @react-three/drei @react-three/rapier` + `-D @types/three`
  - `drei` = helper components (camera controls, loaders, environment)
  - `rapier` = physics/collision, easiest way to get "can't walk through walls" without hand-rolling it
  - Player movement: use Rapier's kinematic character controller (or a ready-made one like `ecctrl`) instead of a plain dynamic body, which tends to tip over, slide, and jitter
  - Mobile joystick: `ecctrl` includes one, or use `nipplejs`. Also add touch-drag to look around
- [ ] Folder structure to start:
  ```
  src/
    scenes/Sanctuary.tsx      # the room geometry
    player/PlayerController.tsx  # movement + camera
    App.tsx
  ```

**Tasks**
- [ ] Basic `<Canvas>` scene: floor plane, four walls, a couple of lights (`ambientLight` + `directionalLight`)
- [ ] Player controller: WASD + mouse-look (desktop), on-screen joystick (mobile) — `drei`'s `PointerLockControls` for desktop is the fastest start
- [ ] Wrap room geometry in Rapier `RigidBody`/`Collider` so the player can't clip through walls
- [ ] Simple placeholder assets (boxes/cylinders) — don't spend time on final art yet
- [ ] Frame-rate check on a mid-range phone browser (this catches performance problems early, before you've built more on top)

**Acceptance criteria:** you can walk around one room on desktop and mobile browser, camera feels responsive, no clipping through walls.

**Est. effort:** a few solid days if this is your first Three.js/R3F project; a day or two if you've done game-adjacent work before.

---

## Phase 2 — Multiplayer presence

**Goal:** two clients see each other move in the same room, in real time.

**Setup**
- [ ] Create a Colyseus Cloud account + project
- [ ] Scaffold `server/` with `npm create colyseus-app@latest`. Check the current Colyseus version's docs for the client package name
- [ ] `npm install colyseus.js` (client) — server-side schema is written and deployed separately
- [ ] TS gotcha: `@colyseus/schema` decorators need `"experimentalDecorators": true` and `"useDefineForClassFields": false` in tsconfig. Put shared schema types in `shared/` (or use the SDK's typed client) so client and server don't drift apart
- [ ] Run the Colyseus server locally first (`ws://localhost:2567`), and deploy to Cloud only once it works
- [ ] Define a minimal room schema:
  ```ts
  class Player extends Schema {
    @type("number") x = 0;
    @type("number") y = 0;
    @type("number") z = 0;
    @type("number") rotationY = 0;
  }
  class SanctuaryState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
  }
  ```

**Tasks**
- [ ] Client joins a Colyseus room on load, sends position updates on an interval (e.g. every 50-100ms, not every frame)
- [ ] Server broadcasts state; client renders a simple mesh for every other player in `players`
- [ ] Interpolate remote player positions client-side (otherwise movement looks jittery/stepped)
- [ ] Handle join/leave — spawn and despawn avatars cleanly
- [ ] Basic reconnect handling if the WebSocket drops

**Acceptance criteria:** open two browser tabs (or share a link with someone), both see each other's avatar move smoothly in the same room.

**Est. effort:** this is usually the trickiest phase conceptually if you haven't done client-server sync before — budget extra time for interpolation/jitter debugging.

---

## Phase 3 — Confession room & role logic

**Goal:** a distinct room type where the creator assigns a pastor, and the role assignment is enforced server-side.

**Tasks**
- [ ] New room type on the Colyseus server, e.g. `ConfessionRoom`, separate from the general `SanctuaryRoom`
- [ ] Schema:
  ```ts
  class ConfessionState extends Schema {
    @type("string") pastorId = "";
    @type("string") confessorId = "";
    @type("string") status = "waiting"; // waiting | active | ended
  }
  ```
- [ ] Room-creation flow in the UI: creator picks who fills the pastor slot (from a list of users who hold the "pastor" church-role — see Phase 5) — or, alternative pattern: creator opens the room and any available pastor can "claim" the pastor slot, first-come
- [ ] Server-side enforcement: reject any join attempt to the pastor slot from a user who isn't authorized as pastor (this check must live on the server, not just hidden in the UI — otherwise it's trivially bypassable)
- [ ] Only two people can ever occupy the pastor/confessor slots; anyone else attempting to join that specific room is rejected or queued
- [ ] Add a `status` transition: `waiting` → `active` once both slots are filled → `ended` when either leaves

**Acceptance criteria:** creating a confession room and assigning/claiming a pastor works end-to-end and is enforced server-side; a non-pastor user cannot occupy the pastor slot even by tampering with client requests.

---

## Phase 4 — Private voice

**Goal:** the pastor+confessor pair in an active confession room can talk privately; no one else can hear it, and nothing is recorded.

**Setup**
- [ ] Create a LiveKit Cloud project
- [ ] `npm install livekit-client`
- [ ] Server-side: mint a LiveKit access token scoped to a room name unique to that confession session, only for the two authorized participant IDs (token minting happens on your backend/Supabase edge function, never on the client, so the token can't be forged)

**Tasks**
- [ ] When `ConfessionState.status` becomes `active`, client requests a scoped token and connects to that LiveKit room
- [ ] Confirm room config: audio-only track, **recording/egress disabled**, no server-side compositing
- [ ] Disconnect voice automatically when `status` becomes `ended` or either participant leaves
- [ ] Mute/deafen controls in the UI as a baseline safety/comfort feature

**Acceptance criteria:** pastor and confessor can talk; a third party in the same 3D space cannot hear it; verify in the LiveKit dashboard that no recording/egress is configured.

---

## Phase 5 — Auth & accounts

**Goal:** real user identities carry into rooms; a separate "who can be a pastor at all" flag exists.

**Setup**
- [ ] Create Supabase project
- [ ] `npm install @supabase/supabase-js`
- [ ] Tables (minimum):
  ```
  profiles (id, user_id, display_name, avatar_choice, is_pastor boolean, created_at)
  ```

**Tasks**
- [ ] Email/password or magic-link sign-up + login
- [ ] On login, fetch profile and pass `user_id` + `is_pastor` into the Colyseus connection (as auth metadata, not just a client-side flag)
- [ ] Confession room's pastor-assignment UI (Phase 3) only lists users where `is_pastor = true`
- [ ] Basic profile screen: display name, avatar choice

**Acceptance criteria:** users log in, their identity and pastor status are known server-side and used to gate Phase 3's role logic.

---

## Phase 6 — Donations

**Goal:** visitors can donate from inside the 3D space. Built in tiers; ship Tier A/B first, Tier C is last and optional.

**Tier A — Direct transfer (no backend)**
- [ ] Clickable donation object (altar/box) in the sanctuary opens a 2D HTML overlay modal (no need for it to be 3D)
- [ ] Modal shows your static QRIS image, bank account / e-wallet number with a "copy" button, and a short note
- [ ] Store donation info in a config/Supabase `donation_methods` table so you can change it without redeploying

**Tier B — External donation platforms (no backend)**
- [ ] Buttons linking to Saweria / Trakteer / similar page (open in new tab)
- [ ] Optional: let admin toggle which methods are visible

**Tier C — Payment gateway (last, optional)**
- [ ] Midtrans or Xendit hosted checkout (Snap / invoice) — never build a custom card form
- [ ] Supabase Edge Function to create the transaction and verify the webhook signature
- [ ] Store donation record: amount, currency, user or "anonymous", timestamp, provider reference — **never store card details**
- [ ] "Thank you" confirmation state after confirmed payment

**Notes**
- Tier A/B payments are not trackable in-app (no webhook). Don't promise a donation history or receipts for them.
- Church donations may carry legal/tax implications in Indonesia — check requirements for an organization account before a gateway (Tier C) onboarding; gateways usually need a business entity/KYC.

**Acceptance criteria:** Tier A/B: clicking the donation object shows QR/number/links correctly on desktop and mobile. Tier C (if built): a sandbox payment completes and a record appears in Supabase.

---

## Phase 7 — Polish & more rooms

- [ ] Add additional rooms (hallway, fellowship hall) once the sanctuary + confession flow are solid
- [ ] Better avatars/models, lighting, ambient sound
- [ ] Mobile performance pass: reduce draw calls, compress textures, check load times
- [ ] Basic moderation: ability to kick/report a user, rate-limit room creation
- [ ] Optional: livestream integration if you want sermons broadcast into the sanctuary

---

## Explicitly out of scope (for now)

- VR headset support
- Self-hosted Colyseus/LiveKit infrastructure
- Recording or storing confession audio/content

## Cross-cutting notes

- Build in the order above — multiplayer + 3D + audio debugged simultaneously is much harder than staged. **Exception:** Phase 3's role logic depends on Phase 5's `is_pastor`. Either do Phase 5 before Phase 3, or use a hardcoded test user list in Phase 3 and swap in real auth later.
- Every role/permission check (pastor slot, donation records, voice access) must be enforced **server-side** — client-side checks alone can be bypassed.
- `is_pastor` must only be settable by an admin (Supabase RLS: users cannot update their own flag), otherwise anyone can make themselves a pastor.
- Colyseus must verify the Supabase JWT on join (`onAuth`), not trust a `user_id`/`is_pastor` sent by the client.
- The LiveKit token endpoint must confirm with Colyseus (shared secret/server-to-server call) that the requester really holds a slot in an `active` confession room.
- Mobile: `PointerLockControls` is desktop only; mobile needs the joystick/touch look from Phase 1.
- Managed services (Colyseus Cloud, LiveKit Cloud, Supabase) chosen specifically to reduce ops burden for a solo developer.
- Keep placeholder art through Phase 1-4; only invest in final visuals in Phase 7, once the hard technical risk (networking, roles, voice) is proven out.
