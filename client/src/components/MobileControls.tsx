import React, { useRef, useState, useEffect } from 'react';

interface MobileControlsProps {
  onMove: (vector: { x: number; y: number } | null) => void;
  onAction?: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onMove }) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const [isActive, setIsActive] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const radius = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsActive(true);
    updatePosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isActive) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updatePosition(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        setIsActive(false);
        setTouchPos(null);
        touchIdRef.current = null;
        onMove(null);
        break;
      }
    }
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > radius) {
      deltaX = (deltaX / distance) * radius;
      deltaY = (deltaY / distance) * radius;
    }

    setTouchPos({ x: deltaX, y: deltaY });

    // Normalize -1 to 1 (y inverted for standard forward movement)
    onMove({
      x: deltaX / radius,
      y: -(deltaY / radius),
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        zIndex: 25,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Joystick Base */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Joystick Stick / Knob */}
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: isActive ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.4)',
            boxShadow: isActive ? '0 0 16px var(--gold-glow)' : 'none',
            transform: touchPos
              ? `translate(${touchPos.x}px, ${touchPos.y}px)`
              : 'translate(0px, 0px)',
            transition: isActive ? 'none' : 'transform 0.15s ease-out',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};
