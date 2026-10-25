import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface ChatOverlayProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  profile: UserProfile;
}

export const ChatOverlay: React.FC<ChatOverlayProps> = ({ messages, onSendMessage, profile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        width: '320px',
        maxWidth: 'calc(100vw - 48px)',
        zIndex: 20,
        pointerEvents: 'auto',
      }}
    >
      <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '14px' }}>
        {/* Chat Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '10px 14px',
            background: 'rgba(0,0,0,0.35)',
            borderBottom: isOpen ? '1px solid var(--border-subtle)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
            <MessageSquare size={16} color="var(--gold-primary)" />
            <span>Doa &amp; Komunikasi Jemaat</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>

        {/* Message Log */}
        {isOpen && (
          <div
            ref={chatScrollRef}
            style={{
              height: '160px',
              overflowY: 'auto',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12px',
            }}
          >
            {messages.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '36px' }}>
                Belum ada pesan. Sampaikan salam atau pokok doa di sini.
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} style={{ lineHeight: 1.4 }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: msg.isPastor ? 'var(--gold-glow)' : '#38bdf8',
                      marginRight: '6px',
                    }}
                  >
                    {msg.isPastor ? `[Pastor] ${msg.senderName}:` : `${msg.senderName}:`}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>{msg.text}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Input Form */}
        {isOpen && (
          <form
            onSubmit={handleSend}
            style={{
              padding: '8px',
              background: 'rgba(0,0,0,0.3)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '6px',
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan / pokok doa..."
              maxLength={200}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(0,0,0,0.4)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '6px 10px', borderRadius: '8px' }}
            >
              <Send size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
