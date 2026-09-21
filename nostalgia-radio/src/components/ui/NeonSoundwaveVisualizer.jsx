import React, { useEffect, useRef } from "react";

function NeonSoundwaveVisualizer({
  isPlaying,
  audioDataRef,
  bass = 0,
  volume = 80,
  freqDataRef,
  timeDataRef,
}) {
  const canvasRef = useRef(null);
  const haloCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const haloCanvas = haloCanvasRef.current;
    if (!canvas || !haloCanvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const haloCtx = haloCanvas.getContext("2d", { alpha: true });
    let animId;
    let width = 0;
    let height = 0;

    // Pre-allocated cached linear gradients (recalculated ONLY on window resize)
    let rainbowGrad = null;
    let fillGrad = null;
    let grad2 = null;
    let grad3 = null;

    const buildGradients = () => {
      if (width <= 0 || height <= 0) return;
      const centerY = height * 0.52;

      // Rainbow gradient for halo & primary waveform
      rainbowGrad = ctx.createLinearGradient(0, 0, width, 0);
      rainbowGrad.addColorStop(0.0, "#ff0055");
      rainbowGrad.addColorStop(0.12, "#ff3300");
      rainbowGrad.addColorStop(0.25, "#ff8800");
      rainbowGrad.addColorStop(0.38, "#ffdd00");
      rainbowGrad.addColorStop(0.50, "#00ff66");
      rainbowGrad.addColorStop(0.62, "#00ddff");
      rainbowGrad.addColorStop(0.75, "#0066ff");
      rainbowGrad.addColorStop(0.88, "#8800ff");
      rainbowGrad.addColorStop(1.0, "#ff00aa");

      // Under-wave luminous gradient fill
      fillGrad = ctx.createLinearGradient(0, centerY - 140, 0, height);
      fillGrad.addColorStop(0.0, "rgba(255, 0, 90, 0.35)");
      fillGrad.addColorStop(0.28, "rgba(255, 120, 0, 0.25)");
      fillGrad.addColorStop(0.65, "rgba(140, 0, 255, 0.18)");
      fillGrad.addColorStop(1.0, "rgba(8, 6, 5, 0.0)");

      // Secondary wave gradient
      grad2 = ctx.createLinearGradient(0, 0, width, 0);
      grad2.addColorStop(0.0, "#00ffcc");
      grad2.addColorStop(0.35, "#0099ff");
      grad2.addColorStop(0.7, "#8800ff");
      grad2.addColorStop(1.0, "#ff0099");

      // Tertiary wave gradient
      grad3 = ctx.createLinearGradient(0, 0, width, 0);
      grad3.addColorStop(0.0, "rgba(255, 210, 0, 0.85)");
      grad3.addColorStop(0.5, "rgba(255, 0, 160, 0.85)");
      grad3.addColorStop(1.0, "rgba(0, 240, 255, 0.85)");
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 2, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      haloCanvas.width = width * dpr;
      haloCanvas.height = height * dpr;
      haloCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildGradients();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let smoothedBass = 0;
    let time = 0;
    let pointerX = 0;
    let pointerY = 0;
    let smoothPX = 0;
    let smoothPY = 0;

    const handlePointerMove = (e) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const numPoints = 64; // Optimized from 86 for zero CPU frame drops
    const points1 = new Array(numPoints);
    const points2 = new Array(numPoints);
    const points3 = new Array(numPoints);

    for (let i = 0; i < numPoints; i++) {
      points1[i] = { x: 0, y: 0 };
      points2[i] = { x: 0, y: 0 };
      points3[i] = { x: 0, y: 0 };
    }

    const drawCurve = (targetCtx, pts) => {
      targetCtx.beginPath();
      targetCtx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) * 0.5;
        const yc = (pts[i].y + pts[i + 1].y) * 0.5;
        targetCtx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      targetCtx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      time += isPlaying ? 0.045 : 0.015;

      ctx.clearRect(0, 0, width, height);
      haloCtx.clearRect(0, 0, width, height);

      // Smooth parallax offset
      smoothPX += (pointerX - smoothPX) * 0.06;
      smoothPY += (pointerY - smoothPY) * 0.06;

      const rawBass = audioDataRef?.current ? audioDataRef.current.bass : bass;
      smoothedBass += (rawBass - smoothedBass) * 0.15;
      const volScale = Math.max(0.1, volume / 100);
      const centerY = height * 0.52 - smoothPY * 24;
      const parallaxShiftX = -smoothPX * 32;

      const freqArray = freqDataRef?.current;
      const timeArray = timeDataRef?.current;

      for (let i = 0; i < numPoints; i++) {
        const normalizedX = i / (numPoints - 1);
        const x = normalizedX * width + parallaxShiftX;
        const edgeDamp = Math.sin(normalizedX * Math.PI);

        const sine1 = Math.sin(normalizedX * Math.PI * 5 + time * 3.6) * 40;
        const sine2 = Math.cos(normalizedX * Math.PI * 9 - time * 2.4) * 26;
        const sine3 = Math.sin(normalizedX * Math.PI * 15 + time * 4.4) * 14;
        const baseOsc = (sine1 + sine2 + sine3) * edgeDamp;

        let audioOffset = 0;
        let audioOffset2 = 0;
        let audioOffset3 = 0;

        if (isPlaying && freqArray && timeArray) {
          const freqIdx = Math.floor(normalizedX * 30) % 32;
          const timeVal = (timeArray[freqIdx] - 128) / 128;
          const freqVal = (freqArray[freqIdx] || 0) / 255;

          const peakSign = i % 2 === 0 ? 1 : -1;
          const peakSign2 = i % 3 === 0 ? -1 : 1;

          audioOffset =
            (peakSign * freqVal * 140 * (1 + smoothedBass * 2.0) * volScale +
              timeVal * 95 * volScale) *
            edgeDamp;

          audioOffset2 =
            (peakSign2 * freqVal * 90 * (1 + smoothedBass * 1.4) * volScale -
              timeVal * 60 * volScale) *
            edgeDamp;

          audioOffset3 =
            Math.sin(normalizedX * Math.PI * 7 + time * 2.2) *
            60 *
            (1 + smoothedBass * 2.4) *
            volScale *
            edgeDamp;
        } else {
          audioOffset = baseOsc * 0.5;
          audioOffset2 = Math.cos(normalizedX * Math.PI * 6 + time * 1.8) * 22 * edgeDamp;
          audioOffset3 = Math.sin(normalizedX * Math.PI * 4 - time * 1.2) * 30 * edgeDamp;
        }

        points1[i].x = x;
        points1[i].y = centerY + baseOsc * (isPlaying ? 0.7 : 0.4) + audioOffset;

        points2[i].x = x;
        points2[i].y = centerY + baseOsc * (isPlaying ? 0.5 : 0.3) + audioOffset2;

        points3[i].x = x;
        points3[i].y = centerY + baseOsc * 0.35 + audioOffset3;
      }

      if (!rainbowGrad) buildGradients();

      // 1. Halo Glow Pass (Optimized shadowBlur relying on hardware CSS blur filter)
      haloCtx.save();
      drawCurve(haloCtx, points1);
      haloCtx.strokeStyle = rainbowGrad;
      haloCtx.lineWidth = isPlaying ? 22 + smoothedBass * 14 : 15;
      haloCtx.lineCap = "round";
      haloCtx.lineJoin = "round";
      haloCtx.shadowColor = "#ff0066";
      haloCtx.shadowBlur = isPlaying ? 16 + smoothedBass * 10 : 10;
      haloCtx.stroke();
      haloCtx.restore();

      // 2. Under-Wave Luminous Area Fill
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(points1[0].x, points1[0].y);
      for (let i = 0; i < numPoints - 1; i++) {
        const xc = (points1[i].x + points1[i + 1].x) * 0.5;
        const yc = (points1[i].y + points1[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(points1[i].x, points1[i].y, xc, yc);
      }
      ctx.lineTo(points1[numPoints - 1].x, points1[numPoints - 1].y);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = fillGrad;
      ctx.fill();
      ctx.restore();

      // 3. Secondary Wave
      ctx.save();
      drawCurve(ctx, points2);
      ctx.strokeStyle = grad2;
      ctx.lineWidth = isPlaying ? 5.0 : 3.2;
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = isPlaying ? 16 + smoothedBass * 10 : 8;
      ctx.stroke();
      ctx.restore();

      // 4. Tertiary Wave
      ctx.save();
      drawCurve(ctx, points3);
      ctx.strokeStyle = grad3;
      ctx.lineWidth = isPlaying ? 4.0 : 2.5;
      ctx.shadowColor = "#ff00aa";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // 5. Main Radiant Rainbow Oscilloscope
      ctx.save();
      drawCurve(ctx, points1);
      ctx.strokeStyle = rainbowGrad;
      ctx.lineWidth = isPlaying ? 8.0 + smoothedBass * 4.0 : 5.0;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#ff0055";
      ctx.shadowBlur = isPlaying ? 24 + smoothedBass * 16 : 14;
      ctx.stroke();
      ctx.restore();

      // 6. Glowing Peak Nodes
      if (isPlaying) {
        ctx.save();
        for (let i = 2; i < numPoints - 2; i += 4) {
          const pt = points1[i];
          const distFromCenter = Math.abs(pt.y - centerY);
          if (distFromCenter > 25) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 5.0 + (distFromCenter / 100) * 5, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#ffee33";
            ctx.shadowBlur = 18;
            ctx.fill();
          }
        }
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isPlaying, volume, freqDataRef, timeDataRef, audioDataRef, bass]);

  return (
    <div className="neon-oscilloscope-stage" aria-hidden="true">
      <div className="oscilloscope-ambient-glow" />
      <canvas ref={haloCanvasRef} className="neon-soundwave-canvas-halo" />
      <canvas ref={canvasRef} className="neon-soundwave-canvas" />
    </div>
  );
}

export default React.memo(NeonSoundwaveVisualizer);
