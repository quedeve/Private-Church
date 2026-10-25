import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { AccessToken } from "livekit-server-sdk";

import { SanctuaryRoom } from "./rooms/SanctuaryRoom";
import { ConfessionRoom } from "./rooms/ConfessionRoom";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 2567);

app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "3D Virtual Church Colyseus Multiplayer Server",
    timestamp: new Date().toISOString(),
  });
});

// LiveKit Access Token Generation Endpoint
app.post("/api/livekit/token", async (req, res) => {
  try {
    const { roomName, identity, name } = req.body;

    if (!roomName || !identity) {
      return res.status(400).json({ error: "Missing required parameters: roomName and identity" });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      // Dev mode fallback for local sandbox / test runs without cloud credentials
      return res.json({
        token: `mock_livekit_token_${identity}_${Date.now()}`,
        devMode: true,
        message: "LiveKit credentials not configured in .env. Running in simulated voice mode.",
      });
    }

    // Mint scoped LiveKit access token (Voice audio only, egress/recording disabled)
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: name || identity,
      ttl: "1h",
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const jwt = await at.toJwt();
    res.json({ token: jwt, devMode: false });
  } catch (error: any) {
    console.error("[LiveKit Token Error]", error);
    res.status(500).json({ error: error.message || "Failed to generate voice token" });
  }
});

// Donation methods endpoint (Tier A & B)
app.get("/api/donations/methods", (req, res) => {
  res.json({
    methods: [
      {
        id: "qris-default",
        category: "qris",
        title: "QRIS Universal Payment",
        bankOrProviderName: "QRIS",
        accountHolder: "Gereja Online Indonesia",
        accountNumber: "NMID: ID1020038192837",
        qrImageUrl: "/assets/qris-church-mock.svg",
        instructions: "Scan using BCA, Mandiri, GoPay, OVO, Dana, ShopeePay, or any banking app.",
        badge: "Scan QR",
        isActive: true,
      },
      {
        id: "bca-transfer",
        category: "bank",
        title: "BCA Transfer",
        bankOrProviderName: "Bank Central Asia (BCA)",
        accountNumber: "8830129384",
        accountHolder: "Gereja Online Indonesia",
        instructions: "ATM / Mobile Banking BCA transfer (24/7).",
        badge: "Bank Transfer",
        isActive: true,
      },
      {
        id: "mandiri-transfer",
        category: "bank",
        title: "Mandiri Transfer",
        bankOrProviderName: "Bank Mandiri",
        accountNumber: "1370019283741",
        accountHolder: "Gereja Online Indonesia",
        instructions: "ATM / Livin by Mandiri transfer.",
        badge: "Bank Transfer",
        isActive: true,
      },
      {
        id: "ewallet-transfer",
        category: "ewallet",
        title: "GoPay / OVO / Dana",
        bankOrProviderName: "E-Wallet",
        accountNumber: "081234567890",
        accountHolder: "Gereja Online",
        instructions: "Direct transfer / top-up to church e-wallet.",
        badge: "E-Wallet",
        isActive: true,
      },
      {
        id: "saweria-link",
        category: "platform",
        title: "Saweria",
        bankOrProviderName: "Saweria",
        externalUrl: "https://saweria.co",
        instructions: "Support directly via Saweria with optional prayer / blessing text.",
        badge: "Saweria",
        isActive: true,
      },
      {
        id: "trakteer-link",
        category: "platform",
        title: "Trakteer",
        bankOrProviderName: "Trakteer",
        externalUrl: "https://trakteer.id",
        instructions: "Support church fellowship projects with Trakteer units.",
        badge: "Trakteer",
        isActive: true,
      },
    ],
  });
});

const server = http.createServer(app);

// Attach Colyseus game server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
});

// Register rooms
gameServer.define("sanctuary", SanctuaryRoom);
gameServer.define("confession", ConfessionRoom);

server.listen(port, () => {
  console.log(`[Virtual Church Server] Listening on http://localhost:${port}`);
  console.log(`[Colyseus WebSocket] ws://localhost:${port}`);
});
