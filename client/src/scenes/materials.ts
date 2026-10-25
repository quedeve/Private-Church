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

// 2. Procedural Light Oak / Blonde Parquet Wood Floor Texture
export function createParquetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base warm luminous light oak tone
  ctx.fillStyle = '#f3e3cb';
  ctx.fillRect(0, 0, 512, 512);

  // Draw individual light wood planks with alternating grain and subtle bevels
  const plankWidth = 64;
  const plankHeight = 128;

  for (let y = 0; y < 512; y += plankHeight) {
    for (let x = 0; x < 512; x += plankWidth) {
      // Natural plank-to-plank subtle variation (honey oak, blonde ash, warm maple)
      const toneOffset = (Math.random() - 0.5) * 16;
      const r = Math.min(255, Math.max(0, 238 + toneOffset));
      const g = Math.min(255, Math.max(0, 218 + toneOffset * 0.9));
      const b = Math.min(255, Math.max(0, 188 + toneOffset * 0.7));

      ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      ctx.fillRect(x + 1, y + 1, plankWidth - 2, plankHeight - 2);

      // Fine natural organic wood grain
      ctx.strokeStyle = 'rgba(165, 115, 60, 0.22)';
      ctx.lineWidth = 0.9;
      for (let gIdx = 0; gIdx < 7; gIdx++) {
        const lineX = x + 3 + gIdx * 8.5;
        ctx.beginPath();
        ctx.moveTo(lineX, y);
        ctx.bezierCurveTo(
          lineX + (Math.random() - 0.5) * 5,
          y + 35,
          lineX + (Math.random() - 0.5) * 5,
          y + 85,
          lineX,
          y + plankHeight
        );
        ctx.stroke();
      }

      // Very soft, light plank groove boundary
      ctx.strokeStyle = 'rgba(140, 95, 45, 0.35)';
      ctx.lineWidth = 1.0;
      ctx.strokeRect(x + 0.5, y + 0.5, plankWidth - 1, plankHeight - 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 12);
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
