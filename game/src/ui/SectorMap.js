/**
 * SectorMap — Holographic 2D/3D Tactical Sector Map overlay (Toggled with M)
 */
export class SectorMap {
  constructor(container) {
    this.container = container;
    this.visible = false;

    this.el = document.createElement('div');
    this.el.className = 'sector-map-overlay glass';
    this.el.style.display = 'none';
    this.el.innerHTML = /* html */ `
      <div class="sector-map-header">
        <div class="sector-title">SECTOR 01 — ORBITAL RUINS</div>
        <div class="sector-sub">TACTICAL CARTOGRAPHY // LIVE TELEMETRY</div>
        <button class="sector-close" data-el="closeMap">✕ [M]</button>
      </div>
      <div class="sector-canvas-wrap">
        <canvas class="sector-canvas" width="480" height="340"></canvas>
      </div>
      <div class="sector-legend">
        <span class="legend-item"><i class="dot gold"></i> Mission Objective</span>
        <span class="legend-item"><i class="dot cyan"></i> Station</span>
        <span class="legend-item"><i class="dot green"></i> Stargate</span>
        <span class="legend-item"><i class="dot magenta"></i> Anomaly</span>
        <span class="legend-item"><i class="dot red"></i> Hostile Drone</span>
      </div>
    `;

    container.appendChild(this.el);
    this.canvas = this.el.querySelector('.sector-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.el.querySelector('[data-el="closeMap"]').addEventListener('click', () => {
      this.hide();
    });
  }

  toggle() {
    if (this.visible) this.hide();
    else this.show();
  }

  show() {
    this.visible = true;
    this.el.style.display = 'flex';
  }

  hide() {
    this.visible = false;
    this.el.style.display = 'none';
  }

  render(playerPos, cameraYaw, pois = []) {
    if (!this.visible) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 0.45; // meters to pixels

    ctx.clearRect(0, 0, w, h);

    // Background Grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 35;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Concentric Orbit Lines
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.14)';
    [60, 120, 180].forEach((rad) => {
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Render POIs
    for (const p of pois) {
      if (!p.position) continue;
      const dx = (p.position.x - playerPos.x) * scale;
      const dz = (p.position.z - playerPos.z) * scale;
      const px = cx + dx;
      const py = cy + dz;

      if (px < 10 || px > w - 10 || py < 10 || py > h - 10) continue;

      ctx.fillStyle = p.color ?? '#00e5ff';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(p.name ?? '', px + 6, py + 3);
    }

    // Player position (Center)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    // Player heading line
    const hx = cx - Math.sin(cameraYaw) * 16;
    const hy = cy - Math.cos(cameraYaw) * 16;
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(hx, hy);
    ctx.stroke();
  }
}
