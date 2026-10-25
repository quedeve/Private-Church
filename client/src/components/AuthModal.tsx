import React, { useState } from 'react';
import { X, User, Shield, Sparkles, Key } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [displayName, setDisplayName] = useState(currentProfile.displayName);
  const [role, setRole] = useState<UserRole>(currentProfile.role);
  const [avatarColor, setAvatarColor] = useState(currentProfile.avatarColor);
  const [pastorCode, setPastorCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const colorOptions = [
    '#3b82f6', // Sapphire Blue
    '#8b5cf6', // Amethyst Purple
    '#10b981', // Emerald Green
    '#f59e0b', // Amber Gold
    '#ec4899', // Rose Pink
    '#475569', // Slate Gray
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!displayName.trim()) {
      setErrorMsg('Nama tampilan wajib diisi.');
      return;
    }

    let isPastor = currentProfile.isPastor;
    if (role === 'pastor') {
      // Pastoral credential passkey check (Default dev passkey: "pastor123" or already confirmed)
      if (pastorCode === 'pastor123' || currentProfile.isPastor) {
        isPastor = true;
      } else {
        setErrorMsg('Kode otorisasi Pastor tidak valid. Gunakan "pastor123" untuk demo mode.');
        return;
      }
    } else {
      isPastor = false;
    }

    onSaveProfile({
      ...currentProfile,
      displayName: displayName.trim(),
      role,
      isPastor,
      avatarColor,
      isGuest: false,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
              }}
            >
              <User size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Pengaturan Profil &amp; Peran</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Identitas avatar dalam gereja virtual</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errorMsg && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            >
              {errorMsg}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Nama Tampilan (Display Name)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Contoh: David, Maria, Samuel"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(0,0,0,0.4)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Peran di Gereja (Church Role)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRole('visitor')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: role === 'visitor' ? '2px solid #3b82f6' : '1px solid var(--border-subtle)',
                  background: role === 'visitor' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0,0,0,0.2)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <User size={15} />
                <span>Jemaat / Tamu</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('pastor')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: role === 'pastor' ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
                  background: role === 'pastor' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0,0,0,0.2)',
                  color: role === 'pastor' ? 'var(--gold-glow)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={15} />
                <span>Pendeta / Pastor</span>
              </button>
            </div>
          </div>

          {role === 'pastor' && (
            <div style={{ animation: 'fadeIn 0.2s' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Kode Verifikasi Pastor (Server Gate)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={pastorCode}
                  onChange={(e) => setPastorCode(e.target.value)}
                  placeholder="Ketik 'pastor123' untuk demo"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    background: 'rgba(0,0,0,0.4)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <Key size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#f59e0b' }} />
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Memastikan hanya pelayan pastoral resmi yang dapat mengklaim slot Pengakuan Dosa.
              </p>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              Warna Jubah Avatar
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAvatarColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c,
                    border: avatarColor === c ? '3px solid #ffffff' : '1px solid rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    transform: avatarColor === c ? 'scale(1.15)' : 'none',
                    transition: 'transform 0.15s',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Simpan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
