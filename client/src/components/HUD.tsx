import React from 'react';
import {
  Users,
  HeartHandshake,
  Lock,
  User,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

interface HUDProps {
  profile: UserProfile;
  onlineCount: number;
  isNearDonation: boolean;
  isNearConfession: boolean;
  onOpenDonation: () => void;
  onOpenConfession: () => void;
  onOpenProfile: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  isMultiplayerConnected: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  profile,
  onlineCount,
  isNearDonation,
  isNearConfession,
  onOpenDonation,
  onOpenConfession,
  onOpenProfile,
  isAudioMuted,
  onToggleAudio,
  isMultiplayerConnected,
}) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}>
      {/* Top Bar */}
      <header
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'auto',
        }}
      >
        {/* Church Title & Status */}
        <div
          className="glass-panel"
          style={{
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderRadius: '24px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '15px',
            }}
          >
            ✝
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px' }}>
              GEREJA ONLINE INDONESIA
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isMultiplayerConnected ? '#10b981' : '#f59e0b',
                  }}
                />
                {isMultiplayerConnected ? 'Ruang Utama (Sanctuary)' : 'Mode Lokal (Solo)'}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={12} />
                {onlineCount} Hadir
              </span>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Donation Quick Button */}
          <button
            onClick={onOpenDonation}
            className="btn btn-primary"
            style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '13px' }}
          >
            <HeartHandshake size={16} />
            <span>Persembahan / QRIS</span>
          </button>

          {/* Confession Room Quick Button */}
          <button
            onClick={onOpenConfession}
            className="btn btn-purple"
            style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '13px' }}
          >
            <Lock size={15} />
            <span>Bilik Pengakuan</span>
          </button>

          {/* Audio BGM Toggle */}
          <button
            onClick={onToggleAudio}
            className="btn btn-secondary"
            style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0 }}
            title="Musik Latar / Suasana"
          >
            {isAudioMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="btn btn-secondary"
            style={{
              borderRadius: '20px',
              padding: '8px 14px',
              gap: '6px',
              borderColor: profile.isPastor ? 'var(--border-gold)' : undefined,
            }}
          >
            <User size={16} color={profile.isPastor ? 'var(--gold-glow)' : undefined} />
            <span style={{ fontSize: '13px' }}>
              {profile.isPastor ? `Pastor ${profile.displayName}` : profile.displayName}
            </span>
          </button>
        </div>
      </header>

      {/* Proximity Interaction Prompts (Center Bottom) */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {isNearDonation && (
          <button
            onClick={onOpenDonation}
            className="btn btn-primary pulse-glow"
            style={{
              padding: '12px 24px',
              borderRadius: '28px',
              fontSize: '15px',
              gap: '10px',
              boxShadow: '0 8px 30px rgba(245, 158, 11, 0.5)',
            }}
          >
            <HeartHandshake size={20} />
            <span>Tekan [E] atau Klik untuk Persembahan &amp; QRIS</span>
          </button>
        )}

        {isNearConfession && (
          <button
            onClick={onOpenConfession}
            className="btn btn-purple pulse-glow"
            style={{
              padding: '12px 24px',
              borderRadius: '28px',
              fontSize: '15px',
              gap: '10px',
              boxShadow: '0 8px 30px rgba(139, 92, 246, 0.5)',
            }}
          >
            <Lock size={18} />
            <span>Tekan [E] atau Klik Masuk Ruang Pengakuan Dosa</span>
          </button>
        )}
      </div>

      {/* Control Help Hints (Bottom Right) */}
      <aside
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-primary)' }}>
          <Compass size={14} />
          <span>Navigasi:</span>
        </div>
        <div>• <strong>WASD / Panah:</strong> Berjalan</div>
        <div>• <strong>Klik Layar &amp; Geser:</strong> Arahkan Kamera</div>
        <div>• <strong>ESC:</strong> Lepaskan Kursor Mouse</div>
      </aside>
    </div>
  );
};
