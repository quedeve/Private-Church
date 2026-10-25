import * as THREE from 'three';

// 1. Procedural Carrara Marble PBR Texture
export function createMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base off-white crystalline marble
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 512);

  // Soft cloudy marble mineral variation
  for (let i = 0; i < 24; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const grad = ctx.createRadialGradient(rx, ry, 10, rx, ry, 120 + Math.random() * 80);
    grad.addColorStop(0, 'rgba(226, 232, 240, 0.45)');
    grad.addColorStop(0.5, 'rgba(241, 245, 249, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }

  // Elegant soft grey & golden veins
  ctx.lineWidth = 1.2;
  for (let v = 0; v < 8; v++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = 0;
    ctx.moveTo(x, y);
    ctx.strokeStyle = v % 3 === 0 ? 'rgba(217, 119, 6, 0.12)' : 'rgba(148, 163, 184, 0.28)';

    while (y < 512) {
      x += (Math.random() - 0.5) * 45;
      y += 15 + Math.random() * 25;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  return texture;
}

// 2. Procedural Italian Walnut Parquet Floor Texture
export function createParquetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base deep walnut wood tone
  ctx.fillStyle = '#451a03';
  ctx.fillRect(0, 0, 512, 512);

  // Draw individual parquet planks with bevel gaps
  const plankWidth = 64;
  const plankHeight = 128;

  for (let y = 0; y < 512; y += plankHeight) {
    for (let x = 0; x < 512; x += plankWidth) {
      // Board tone variation
      const brightnessOffset = (Math.random() - 0.5) * 24;
      const r = Math.min(255, Math.max(0, 69 + brightnessOffset));
      const g = Math.min(255, Math.max(0, 26 + brightnessOffset * 0.4));
      const b = Math.min(255, Math.max(0, 8 + brightnessOffset * 0.2));

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x + 1, y + 1, plankWidth - 2, plankHeight - 2);

      // Fine wood grain lines inside each plank
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 0.8;
      for (let gIdx = 0; gIdx < 6; gIdx++) {
        const lineX = x + 4 + gIdx * 9;
        ctx.beginPath();
        ctx.moveTo(lineX, y);
        ctx.bezierCurveTo(
          lineX + (Math.random() - 0.5) * 6,
          y + 40,
          lineX + (Math.random() - 0.5) * 6,
          y + 80,
          lineX,
          y + plankHeight
        );
        ctx.stroke();
      }

      // Dark bevel groove border
      ctx.strokeStyle = 'rgba(15, 6, 2, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, plankWidth, plankHeight);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 10);
  return texture;
}

// 3. Procedural Warm Venetian Stucco / Plaster Wall Texture
export function createPlasterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Warm ivory plaster base
  ctx.fillStyle = '#fffdf5';
  ctx.fillRect(0, 0, 256, 256);

  // Subtle trowel texture and fine stucco noise
  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 14;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain * 0.95));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain * 0.8));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}
