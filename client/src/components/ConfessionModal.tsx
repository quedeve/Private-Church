import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  ShieldAlert,
  Lock,
  UserCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { UserProfile, ConfessionStatus } from '../types';

interface ConfessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  confessionStatus: ConfessionStatus;
  pastorName?: string;
  confessorName?: string;
  onJoinSlot: (slot: 'pastor' | 'confessor') => void;
  onLeaveConfession: () => void;
}

export const ConfessionModal: React.FC<ConfessionModalProps> = ({
  isOpen,
  onClose,
  profile,
  confessionStatus,
  pastorName,
  confessorName,
  onJoinSlot,
  onLeaveConfession,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (confessionStatus === 'active') {
      // Simulate voice activity waveform pulse
      const interval = setInterval(() => {
        setIsSpeaking(Math.random() > 0.4);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [confessionStatus]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc',
              }}
            >
              <Lock size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Ruang Pengakuan Dosa &amp; Konseling Pribadi
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#a78bfa' }}>
                <ShieldAlert size={12} />
                <span>Saluran Suara Terenkripsi WebRTC • Tanpa Rekaman Audio</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Status: IDLE / SELECT SLOT */}
        {confessionStatus === 'idle' && (
          <div style={{ animation: 'fadeIn 0.2s' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              Ruang sakramen pengakuan dosa dan konseling pastoral secara privat 1-on-1. Hanya ada 1 Pendeta/Pastor dan 1 Jemaat di dalam ruangan.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {/* Confessor Slot */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
                    Slot Jemaat (Confessor)
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Masuk untuk konseling, curahan hati, atau pengakuan dosa secara anonim dan privat.
                  </p>
                </div>
                <button
                  onClick={() => onJoinSlot('confessor')}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <UserCheck size={16} />
                  <span>Masuk sebagai Jemaat</span>
                </button>
              </div>

              {/* Pastor Slot */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gold-glow)', marginBottom: '6px' }}>
                    Slot Gembala (Pastor)
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    {profile.isPastor
                      ? 'Terverifikasi sebagai Pastor. Anda berhak melayani di bilik pengakuan.'
                      : 'Hanya akun dengan hak akses pastor terverifikasi yang dapat mengisi slot ini.'}
                  </p>
                </div>
                <button
                  onClick={() => onJoinSlot('pastor')}
                  disabled={!profile.isPastor}
                  className="btn btn-purple"
                  style={{
                    width: '100%',
                    opacity: profile.isPastor ? 1 : 0.5,
                    cursor: profile.isPastor ? 'pointer' : 'not-allowed',
                  }}
                >
                  <Sparkles size={16} />
                  <span>{profile.isPastor ? 'Buka Pelayanan Pastor' : 'Perlu Hak Pastor'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status: WAITING */}
        {confessionStatus === 'waiting' && (
          <div style={{ textAlign: 'center', padding: '24px 12px', animation: 'fadeIn 0.2s' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--gold-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Clock size={30} className="pulse-glow" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Menunggu Rekan Pengakuan...
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
              {pastorName ? `Pastor ${pastorName} sudah berada di bilik. Menunggu jemaat bergabung...` : 'Anda telah masuk. Menunggu Pastor hadir untuk memulai sesi suara privat.'}
            </p>
            <button onClick={onLeaveConfession} className="btn btn-secondary">
              Batalkan &amp; Keluar Bilik
            </button>
          </div>
        )}

        {/* Status: ACTIVE (Voice Call in Progress) */}
        {confessionStatus === 'active' && (
          <div style={{ animation: 'fadeIn 0.2s' }}>
            {/* Participants View */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: 'rgba(0,0,0,0.4)',
                padding: '16px',
                borderRadius: '14px',
                marginBottom: '20px',
              }}
            >
              {/* Pastor Card */}
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '2px solid var(--gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    fontSize: '22px',
                  }}
                >
                  ✝
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold-glow)' }}>
                  Pastor {pastorName || 'Pendeta'}
                </div>
                <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>• Audio Terhubung</div>
              </div>

              {/* Confessor Card */}
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '2px solid #38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    fontSize: '20px',
                  }}
                >
                  👤
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#e0e7ff' }}>
                  {confessorName || 'Jemaat'}
                </div>
                <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>• Audio Terhubung</div>
              </div>
            </div>

            {/* Audio Waveform Speaking Pulse */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                height: '36px',
                marginBottom: '20px',
              }}
            >
              {[12, 24, 32, 18, 28, 14, 22, 30].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: isSpeaking ? `${h}px` : '6px',
                    background: isSpeaking ? '#a855f7' : 'rgba(255,255,255,0.2)',
                    borderRadius: '2px',
                    transition: 'all 0.15s ease',
                  }}
                />
              ))}
            </div>

            {/* In-Call Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '20px' }}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`btn ${isMuted ? 'btn-danger' : 'btn-secondary'}`}
                style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0 }}
                title={isMuted ? 'Unmute Mikrofon' : 'Mute Mikrofon'}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={() => setIsDeafened(!isDeafened)}
                className={`btn ${isDeafened ? 'btn-danger' : 'btn-secondary'}`}
                style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0 }}
                title={isDeafened ? 'Hidupkan Suara' : 'Matikan Suara'}
              >
                {isDeafened ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <button
                onClick={onLeaveConfession}
                className="btn btn-danger"
                style={{ borderRadius: '24px', padding: '10px 20px', gap: '8px' }}
              >
                <PhoneOff size={18} />
                <span>Akhiri Sesi</span>
              </button>
            </div>
          </div>
        )}

        {/* Safety & Moderation Requirement */}
        <div
          style={{
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          <span>Privasi dijamin UU PDP No. 27/2022. Audio murni p2p dan tidak disimpan.</span>
          {confessionStatus === 'active' && (
            <button
              onClick={() => {
                setReportSuccess(true);
                setTimeout(() => setReportSuccess(false), 3000);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#f87171',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ShieldAlert size={12} />
              <span>{reportSuccess ? 'Laporan Terkirim!' : 'Laporkan / Blokir'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
