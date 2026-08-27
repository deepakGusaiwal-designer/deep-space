/**
 * Radar — Spacecraft instrumentation tactical radar widget
 * Displays surrounding objects relative to player orientation.
 */
export class Radar {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 140;
    this.canvas.height = 140;
    this.canvas.className = 'radar-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    this.maxRange = 240; // meters
    this.sweepAngle = 0;
  }

  render(playerPos, cameraYaw, targets = []) {
    this.update(playerPos, cameraYaw, targets);
  }

  update(playerPos, cameraYaw, targets = []) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = w / 2 - 8;

    ctx.clearRect(0, 0, w, h);

    // Radar background disc
    const bgGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    bgGrad.addColorStop(0, 'rgba(0, 20, 35, 0.75)');
    bgGrad.addColorStop(1, 'rgba(0, 10, 20, 0.95)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Concentric range rings
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.18)';
    ctx.lineWidth = 1;
    [0.33, 0.66, 1.0].forEach((pct) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * pct, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.stroke();

    // Rotating sweep line
    this.sweepAngle = (this.sweepAngle + 0.04) % (Math.PI * 2);
    const sweepGrad = ctx.createLinearGradient(cx, cy, cx + Math.cos(this.sweepAngle) * r, cy + Math.sin(this.sweepAngle) * r);
    sweepGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
    sweepGrad.addColorStop(1, 'rgba(0, 229, 255, 0.6)');
    ctx.strokeStyle = sweepGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(this.sweepAngle) * r, cy + Math.sin(this.sweepAngle) * r);
    ctx.stroke();

    // Player arrow (center, pointing forward)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.lineTo(cx, cy + 2);
    ctx.lineTo(cx - 4, cy + 4);
    ctx.closePath();
    ctx.fill();

    // Render Blips
    const cosY = Math.cos(-cameraYaw);
    const sinY = Math.sin(-cameraYaw);

    for (const t of targets) {
      if (!t.position) continue;
      const dx = t.position.x - playerPos.x;
      const dz = t.position.z - playerPos.z;
      const dist = Math.hypot(dx, dz);
      if (dist > this.maxRange) continue;

      // Transform world coords to camera-relative radar coords
      const rx = dx * cosY - dz * sinY;
      const rz = dx * sinY + dz * cosY;

      const normDist = (dist / this.maxRange) * r;
      const angle = Math.atan2(rx, -rz);
      const bx = cx + Math.sin(angle) * normDist;
      const by = cy - Math.cos(angle) * normDist;

      // Color and shape coding
      this._drawBlip(ctx, bx, by, t.type);
    }

    // Outer border ring
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  _drawBlip(ctx, bx, by, type) {
    switch (type) {
      case 'MISSION':
        // Gold Diamond
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(bx, by - 4);
        ctx.lineTo(bx + 4, by);
        ctx.lineTo(bx, by + 4);
        ctx.lineTo(bx - 4, by);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        break;

      case 'HOSTILE':
      case 'DRONE':
        // Red Triangle
        ctx.fillStyle = '#ff3344';
        ctx.shadowColor = 'rgba(255, 51, 68, 0.8)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(bx, by - 4);
        ctx.lineTo(bx + 3.5, by + 3.5);
        ctx.lineTo(bx - 3.5, by + 3.5);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        break;

      case 'STATION':
        // Cyan Square
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fillRect(bx - 3, by - 3, 6, 6);
        ctx.shadowBlur = 0;
        break;

      case 'PLANET':
      case 'MOON':
        // Large Blue/Cyan Celestial Sphere
        ctx.fillStyle = '#2080ff';
        ctx.shadowColor = 'rgba(32, 128, 255, 0.8)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;

      case 'WRECK':
        // Amber Diamond
        ctx.fillStyle = '#ff9933';
        ctx.shadowColor = 'rgba(255, 153, 51, 0.8)';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.moveTo(bx, by - 3.5);
        ctx.lineTo(bx + 3.5, by);
        ctx.lineTo(bx, by + 3.5);
        ctx.lineTo(bx - 3.5, by);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        break;

      case 'SATELLITE':
        // Small Silver Dot
        ctx.fillStyle = '#e0e8f0';
        ctx.beginPath();
        ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'PORTAL':
      case 'EXTRACTION':
      case 'GATE':
        // Green Ring
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'ANOMALY':
      case 'RELIC':
        // Cyan Glowing Star
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'RESOURCE':
      default:
        // Cyan / Blue dot
        ctx.fillStyle = '#60dfff';
        ctx.beginPath();
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }
}
