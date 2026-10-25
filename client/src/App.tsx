import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sanctuary } from './scenes/Sanctuary';
import { PlayerController } from './player/PlayerController';
import { RemotePlayers } from './player/RemotePlayers';
import { HUD } from './components/HUD';
import { DonationModal } from './components/DonationModal';
import { ConfessionModal } from './components/ConfessionModal';
import { AuthModal } from './components/AuthModal';
import { ChatOverlay } from './components/ChatOverlay';
import { MobileControls } from './components/MobileControls';
import { colyseusService } from './services/colyseus';
import { liveKitService } from './services/livekit';
import { UserProfile, RemotePlayer, ChatMessage, ConfessionStatus } from './types';

export const App: React.FC = () => {
  // User Profile
  const [profile, setProfile] = useState<UserProfile>({
    id: `guest_${Math.random().toString(36).substr(2, 6)}`,
    displayName: `Tamu-${Math.floor(100 + Math.random() * 900)}`,
    role: 'visitor',
    isPastor: false,
    avatarColor: '#3b82f6',
    isGuest: true,
  });

  // Multiplayer State
  const [remotePlayers, setRemotePlayers] = useState<RemotePlayer[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isMultiplayerConnected, setIsMultiplayerConnected] = useState(false);

  // Proximity Triggers
  const [isNearDonation, setIsNearDonation] = useState(false);
  const [isNearConfession, setIsNearConfession] = useState(false);

  // Modals
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isConfessionOpen, setIsConfessionOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Confession State
  const [confessionStatus, setConfessionStatus] = useState<ConfessionStatus>('idle');
  const [confessionPastorName, setConfessionPastorName] = useState<string>('');
  const [confessionConfessorName, setConfessionConfessorName] = useState<string>('');

  // Mobile Controls
  const [isMobile, setIsMobile] = useState(false);
  const [mobileJoystick, setMobileJoystick] = useState<{ x: number; y: number } | null>(null);

  // Audio BGM via Web Audio API (Sacred Church Drone & Harmony)
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  // Check touch / mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Colyseus Connection
  useEffect(() => {
    let isMounted = true;
    const connect = async () => {
      const success = await colyseusService.joinSanctuary(
        profile,
        (players) => {
          if (isMounted) setRemotePlayers(players);
        },
        (msg) => {
          if (isMounted) setChatMessages((prev) => [...prev.slice(-40), msg]);
        }
      );
      if (isMounted) setIsMultiplayerConnected(success);
    };

    connect();

    return () => {
      isMounted = false;
      colyseusService.leaveSanctuary();
    };
  }, [profile.displayName, profile.role, profile.isPastor, profile.avatarColor]);

  // Keyboard shortcut 'E' for interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        if (isNearDonation) {
          setIsDonationOpen(true);
        } else if (isNearConfession) {
          setIsConfessionOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNearDonation, isNearConfession]);

  // Ambient Church Web Audio Synthesizer (Serene Organ Harmony)
  const toggleAudio = () => {
    if (isAudioMuted) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = audioCtxRef.current || new AudioCtx();
        audioCtxRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Frequencies for a calm Sacred C-Major/A-Minor triad drone (C3, G3, C4, E4)
        const freqs = [130.81, 196.0, 261.63, 329.63];
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
        masterGain.connect(ctx.destination);

        const oscs: OscillatorNode[] = [];
        freqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          osc.connect(masterGain);
          osc.start();
          oscs.push(osc);
        });

        oscillatorsRef.current = oscs;
        setIsAudioMuted(false);
      } catch (err) {
        console.error('Audio synthesizer error:', err);
      }
    } else {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (_) {}
      });
      oscillatorsRef.current = [];
      setIsAudioMuted(true);
    }
  };

  // Join Confession Slot
  const handleJoinConfessionSlot = async (slot: 'pastor' | 'confessor') => {
    try {
      setConfessionStatus('waiting');
      if (slot === 'pastor') {
        setConfessionPastorName(profile.displayName);
      } else {
        setConfessionConfessorName(profile.displayName);
      }

      await colyseusService.joinConfession(slot, profile, (state) => {
        setConfessionPastorName(state.pastorDisplayName || '');
        setConfessionConfessorName(state.confessorDisplayName || '');
        setConfessionStatus(state.status as ConfessionStatus);

        if (state.status === 'active' && state.livekitRoomName) {
          // Attempt LiveKit voice connection
          liveKitService.connectToConfessionVoice(state.livekitRoomName);
        }
      });
    } catch (err: any) {
      alert(err.message || 'Gagal masuk bilik pengakuan');
      setConfessionStatus('idle');
    }
  };

  const handleLeaveConfession = () => {
    colyseusService.leaveConfession();
    liveKitService.disconnect();
    setConfessionStatus('idle');
  };

  const handleSendMessage = (text: string) => {
    colyseusService.sendChatMessage(text);
    // Also append locally for instant feedback if in solo mode
    if (!isMultiplayerConnected) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `local_${Date.now()}`,
          senderId: profile.id,
          senderName: profile.displayName,
          role: profile.role,
          isPastor: profile.isPastor,
          text,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 3D Canvas Scene */}
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 1.7, 14], fov: 65, near: 0.1, far: 200 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#090a10']} />
          <fog attach="fog" args={['#090a10', 15, 45]} />

          <Sanctuary
            onOpenDonation={() => setIsDonationOpen(true)}
            onOpenConfession={() => setIsConfessionOpen(true)}
            isConfessionBusy={confessionStatus === 'active'}
          />

          <PlayerController
            profile={profile}
            onPositionChange={(pos) => {
              colyseusService.sendMovement(pos.x, pos.y, pos.z, pos.rotationY);
            }}
            onNearDonation={setIsNearDonation}
            onNearConfession={setIsNearConfession}
            mobileJoystick={mobileJoystick}
          />

          <RemotePlayers players={remotePlayers} />
        </Canvas>
      </div>

      {/* Crosshair indicator */}
      <div className={`crosshair ${isNearDonation || isNearConfession ? 'hovering' : ''}`} />

      {/* Head-Up Display (Top Navbar & Action Controls) */}
      <HUD
        profile={profile}
        onlineCount={remotePlayers.length + 1}
        isNearDonation={isNearDonation}
        isNearConfession={isNearConfession}
        onOpenDonation={() => setIsDonationOpen(true)}
        onOpenConfession={() => setIsConfessionOpen(true)}
        onOpenProfile={() => setIsAuthOpen(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={toggleAudio}
        isMultiplayerConnected={isMultiplayerConnected}
      />

      {/* Chat & Prayers Overlay */}
      <ChatOverlay
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        profile={profile}
      />

      {/* Mobile Virtual Joystick */}
      {isMobile && <MobileControls onMove={setMobileJoystick} />}

      {/* Modals */}
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />

      <ConfessionModal
        isOpen={isConfessionOpen}
        onClose={() => setIsConfessionOpen(false)}
        profile={profile}
        confessionStatus={confessionStatus}
        pastorName={confessionPastorName}
        confessorName={confessionConfessorName}
        onJoinSlot={handleJoinConfessionSlot}
        onLeaveConfession={handleLeaveConfession}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentProfile={profile}
        onSaveProfile={setProfile}
      />
    </div>
  );
};
