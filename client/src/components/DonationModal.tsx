import React, { useState } from 'react';
import {
  X,
  QrCode,
  CreditCard,
  ExternalLink,
  Copy,
  Check,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DonationMethod } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customMethods?: DonationMethod[];
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'qris' | 'bank' | 'platform' | 'gateway'>('qris');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const bankAccounts = [
    {
      id: 'bca',
      bank: 'Bank Central Asia (BCA)',
      number: '8830129384',
      holder: 'Gereja Online Indonesia',
      color: '#005baa',
    },
    {
      id: 'mandiri',
      bank: 'Bank Mandiri',
      number: '1370019283741',
      holder: 'Gereja Online Indonesia',
      color: '#002d62',
    },
    {
      id: 'bri',
      bank: 'Bank Rakyat Indonesia (BRI)',
      number: '034101002938531',
      holder: 'Gereja Online Indonesia',
      color: '#00529b',
    },
    {
      id: 'ewallet',
      bank: 'GoPay / OVO / Dana / ShopeePay',
      number: '081234567890',
      holder: 'Gereja Online',
      color: '#00a39e',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel glass-panel-gold"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-primary)',
              }}
            >
              <HeartHandshake size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Persembahan &amp; Donasi
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Dukungan pelayanan &amp; diakonia jemaat virtual
              </p>
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

        {/* Tab Selection */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '24px',
            background: 'rgba(0,0,0,0.3)',
            padding: '6px',
            borderRadius: '12px',
          }}
        >
          <button
            onClick={() => setActiveTab('qris')}
            style={{
              padding: '10px 4px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'qris' ? 'var(--gold-primary)' : 'transparent',
              color: activeTab === 'qris' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: activeTab === 'qris' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <QrCode size={15} />
            <span>QRIS</span>
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            style={{
              padding: '10px 4px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'bank' ? 'var(--gold-primary)' : 'transparent',
              color: activeTab === 'bank' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: activeTab === 'bank' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <CreditCard size={15} />
            <span>Transfer Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('platform')}
            style={{
              padding: '10px 4px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'platform' ? 'var(--gold-primary)' : 'transparent',
              color: activeTab === 'platform' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: activeTab === 'platform' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <ExternalLink size={15} />
            <span>Saweria / Trakteer</span>
          </button>

          <button
            onClick={() => setActiveTab('gateway')}
            style={{
              padding: '10px 4px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'gateway' ? 'var(--gold-primary)' : 'transparent',
              color: activeTab === 'gateway' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: activeTab === 'gateway' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Sparkles size={15} />
            <span>Gateway (Opsi)</span>
          </button>
        </div>

        {/* Tab 1: Static QRIS Direct View */}
        {activeTab === 'qris' && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.2s ease-out' }}>
            <div
              style={{
                background: '#ffffff',
                padding: '16px',
                borderRadius: '16px',
                display: 'inline-block',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                marginBottom: '16px',
                maxWidth: '300px',
              }}
            >
              <img
                src="/assets/qris-church-mock.svg"
                alt="QRIS Church Official"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Scan QRIS dari Semua Rekening / E-Wallet
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              BCA mobile, Livin Mandiri, GoPay, OVO, Dana, ShopeePay, LinkAja
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#34d399',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <ShieldCheck size={16} />
              <span>NMID Terverifikasi: ID1020038192837 • Tanpa Biaya Admin</span>
            </div>
          </div>
        )}

        {/* Tab 2: Direct Transfer Bank & E-Wallet Numbers */}
        {activeTab === 'bank' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.2s ease-out' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Silakan lakukan transfer manual ke rekening persembahan berikut:
            </p>
            {bankAccounts.map((acc) => (
              <div
                key={acc.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.2s',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {acc.bank}
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--gold-glow)',
                      letterSpacing: '1px',
                      marginTop: '2px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {acc.number}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>a.n. {acc.holder}</div>
                </div>

                <button
                  onClick={() => handleCopy(acc.number, acc.id)}
                  className="btn btn-secondary"
                  style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    background: copiedId === acc.id ? 'rgba(16, 185, 129, 0.2)' : undefined,
                    borderColor: copiedId === acc.id ? '#10b981' : undefined,
                    color: copiedId === acc.id ? '#34d399' : undefined,
                  }}
                >
                  {copiedId === acc.id ? (
                    <>
                      <Check size={15} />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      <span>Salin No.</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: External Platform Links (Saweria / Trakteer) */}
        {activeTab === 'platform' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s ease-out' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Dukung persembahan dan operasional melalui platform dukungan komunitas (bisa sertakan pesan doa &amp; nama):
            </p>

            <a
              href="https://saweria.co"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(18, 20, 29, 0.8) 100%)',
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold-glow)' }}>
                  Saweria • Persembahan Gereja
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Mendukung QRIS, GoPay, OVO, Dana, LinkAja, ShopeePay + pesan berkat
                </div>
              </div>
              <div className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>
                <span>Buka Saweria</span>
                <ExternalLink size={14} />
              </div>
            </a>

            <a
              href="https://trakteer.id"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(18, 20, 29, 0.8) 100%)',
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#c084fc' }}>
                  Trakteer • Fellowship Fellowship
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Dukungan per unit persembahan kasih dengan notifikasi langsung
                </div>
              </div>
              <div className="btn btn-purple" style={{ padding: '8px 14px', fontSize: '13px' }}>
                <span>Buka Trakteer</span>
                <ExternalLink size={14} />
              </div>
            </a>
          </div>
        )}

        {/* Tab 4: Midtrans / Xendit Gateway (Tier C - Optional) */}
        {activeTab === 'gateway' && (
          <div style={{ textAlign: 'center', padding: '16px 8px', animation: 'fadeIn 0.2s ease-out' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#a78bfa',
              }}
            >
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Tier C — Payment Gateway (Midtrans / Xendit)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 18px', lineHeight: 1.5 }}>
              Opsi otomatis dengan Webhook API &amp; verifikasi instan. Direkomendasikan sebagai tahap akhir setelah entitas legal gereja terdaftar di payment gateway.
            </p>
            <div
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginBottom: '16px',
                textAlign: 'left',
              }}
            >
              💡 <strong>Status:</strong> Mode Sandbox / Terintegrasi. Menggunakan Midtrans Snap / Xendit Invoice Hosted Checkout untuk menjaga keamanan PCI-DSS.
            </div>
            <button
              onClick={() => alert('Simulasi Checkout Gateway: Endpoint /api/donations/record siap dihubungkan dengan MIDTRANS_SERVER_KEY.')}
              className="btn btn-primary"
            >
              Coba Uji Coba Checkout Gateway
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          "Setiap orang hendaknya memberi sesuai dengan kerelaan hatinya, bukan dengan terpaksa atau berat hati." (2 Korintus 9:7)
        </div>
      </div>
    </div>
  );
};
