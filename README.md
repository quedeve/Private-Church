# 3D Virtual Church (Gereja Online)

A full-stack, browser-based 3D virtual church platform with multiplayer rooms, role-gated private confession chambers (with 1-on-1 private voice), and tiered community donations (QRIS, direct bank transfer, Saweria, Trakteer, and optional payment gateway).

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black.svg)](https://threejs.org/)
[![Colyseus](https://img.shields.io/badge/Colyseus-Multiplayer-orange.svg)](https://colyseus.io/)
[![LiveKit](https://img.shields.io/badge/LiveKit-WebRTC%20Voice-teal.svg)](https://livekit.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-emerald.svg)](https://supabase.com/)

---

## 🏛 Features

1. **3D Sanctuary (Ruang Utama Ibadah)**
   - Walk-around Gothic cathedral in the browser (Desktop & Mobile, no VR headset required).
   - Desktop controls: WASD / Arrow keys + Mouse-look (PointerLock).
   - Mobile controls: Touch virtual joystick + touch-drag look.
   - Pews, altar with glowing cross, candlelight, and ambient organ drone synthesizer.

2. **Multiplayer Networking (Colyseus)**
   - Real-time player presence with smooth interpolation.
   - Distinct avatar models with Pastor stole / vestment indicators.
   - Real-time text chat and prayer requests overlay.

3. **Confession Room & Private Voice (LiveKit & Colyseus)**
   - Role-gated 1-on-1 private chamber (Pastor & Confessor).
   - Server-side authorization: only verified pastor accounts can enter the pastor slot.
   - Encrypted WebRTC audio channel; recording/egress is strictly disabled for privacy (UU PDP No. 27/2022 compliance).
   - Mic mute, deafen controls, and safeguarding report/block action.

4. **Tiered Donations (Persembahan & Diakonia)**
   - **Tier A (Direct Transfer / QRIS)**:
     - Real-time Indonesian QRIS digital payment display (BCA, Mandiri, GoPay, OVO, Dana, ShopeePay, etc.).
     - Direct Bank Transfer (BCA, Mandiri, BRI) and E-Wallets with 1-click account number copy button.
   - **Tier B (Community Platforms)**:
     - Outbound support buttons for **Saweria** and **Trakteer** with blessing messages.
   - **Tier C (Payment Gateway - Optional / Last)**:
     - Hosted checkout (Midtrans Snap / Xendit) integration endpoint.

---

## 📁 Project Structure

```
├── client/              # Frontend Vite + React + Three.js / R3F app
│   ├── public/assets/   # Public SVGs (QRIS mock, icons)
│   ├── src/
│   │   ├── components/  # HUD, DonationModal, ConfessionModal, AuthModal, Chat, Mobile
│   │   ├── player/      # Character controller and remote player lerp
│   │   ├── scenes/      # Sanctuary 3D architecture, altar, pews, interactive objects
│   │   ├── services/    # Colyseus, LiveKit, and Supabase client services
│   │   ├── App.tsx      # Main application canvas and state coordinator
│   │   └── main.tsx     # React DOM entrypoint
├── server/              # Colyseus WebSocket Game Server + Express API
│   ├── src/
│   │   ├── rooms/       # SanctuaryRoom, ConfessionRoom
│   │   │   └── schema/  # State schemas with Colyseus decorators
│   │   └── index.ts     # Server startup, LiveKit token generation, donation endpoints
├── shared/              # Shared TypeScript definitions (Room types, roles, messages)
├── supabase/
│   └── migrations/      # PostgreSQL migrations (profiles, donation_methods, donations)
├── .env.example         # Environment template
└── plan.md              # Project plan & architectural roadmap
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies

In the root directory, install the client and server dependencies:

```bash
# In client directory
cd client
npm install

# In server directory
cd ../server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` in both `client/` and `server/` (or run in sandbox mode with default zero-config fallbacks).

### 3. Run Locally

```bash
# Start the Colyseus game server (port 2567)
cd server
npm run dev

# In a second terminal, start Vite client (port 5173)
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🗄 Database Setup (Supabase)

Execute `supabase/migrations/20261025000000_init_church.sql` in your Supabase SQL editor:
- Sets up `profiles` with Row Level Security (RLS) preventing self-elevation to Pastor.
- Configures `donation_methods` and `donations` tables.

---

## 🔒 Security & Pastoral Verification

- Pastor role assignment is enforced **server-side** in `ConfessionRoom.ts`.
- Confession audio sessions are isolated and never recorded.
- In demo mode, use pastor passkey `pastor123` in the Profile menu to test the Pastor slot.
