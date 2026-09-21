import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Center, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import boomboxModelUrl from "../../../assets/boombox.glb?url";
import { CASSETTE_BUTTONS } from "../../constants/radioPlaylists";
import CassetteKeyMesh from "./CassetteKeyMesh";

// --- 3D Boombox Model with Working Knobs & Physical Buttons ---
function BoomboxModel({
  audioDataRef,
  audioData,
  active,
  volume,
  setVolume,
  tuning,
  setTuning,
  bassBoost,
  setBassBoost,
  isMuted,
  onButtonAction,
  onSeek,
  trackProgress,
  currentTrack,
}) {
  const { scene } = useGLTF(boomboxModelUrl);
  const groupRef = useRef();
  const speakerMatsRef = useRef([]);

  // Responsive mobile / tablet viewport adaptation
  const { viewport, size } = useThree();
  const aspect = size.width / Math.max(size.height, 1);
  const isMobile = size.width < 768 || aspect < 1.0;
  const isTablet = size.width >= 768 && size.width < 1024;

  // Responsive scale: dynamically scales boombox so speakers and controls fit inside any screen width
  const responsiveScale = isMobile
    ? Math.min(2.55, Math.max(1.75, viewport.width * 0.78))
    : isTablet
    ? 3.25
    : 3.85;

  const verticalY = isMobile ? 0.08 : -0.05;

  // Knob References
  const knobVolRef = useRef();
  const knobBassRef = useRef();
  const knobTuningRef = useRef();
  const knobBigTuningRef = useRef();

  // Active interaction tracking
  const [activeKnob, setActiveKnob] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [seekAngle, setSeekAngle] = useState(0);
  const accumulatedSeek = useRef(0);
  const knobCenter = useRef({ x: 0, y: 0 });
  const lastAngle = useRef(0);
  const lastClientPos = useRef({ x: 0, y: 0 });

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) secs = 0;
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useMemo(() => {
    if (!scene) return;
    speakerMatsRef.current = [];

    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.frustumCulled = false;

        if (o.name === "knob_volume") knobVolRef.current = o;
        if (o.name === "knob_bass") knobBassRef.current = o;
        if (o.name === "knob_tuning") knobTuningRef.current = o;
        if (o.name === "knob_big_tuning") knobBigTuningRef.current = o;

        if (o.name.startsWith("knob_") && !o.getObjectByName("collider")) {
          const colGeom = o.name === "knob_big_tuning"
            ? new THREE.CylinderGeometry(0.048, 0.048, 0.05, 16)
            : new THREE.CylinderGeometry(0.028, 0.028, 0.03, 16);
          const colMat = new THREE.MeshBasicMaterial({ visible: false });
          const collider = new THREE.Mesh(colGeom, colMat);
          collider.rotation.x = Math.PI / 2;
          collider.name = "collider";
          o.add(collider);
        }

        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            const matName = (m.name || "").toLowerCase();

            if (m.map) {
              m.map.colorSpace = THREE.SRGBColorSpace;
              m.map.anisotropy = 16;
              m.map.minFilter = THREE.LinearMipmapLinearFilter;
              m.map.magFilter = THREE.LinearFilter;
              m.map.generateMipmaps = true;
              m.map.needsUpdate = true;
            }
            if (m.normalMap) m.normalMap.anisotropy = 16;
            if (m.roughnessMap) m.roughnessMap.anisotropy = 16;
            if (m.metalnessMap) m.metalnessMap.anisotropy = 16;

            m.transparent = false;
            m.depthWrite = true;
            m.depthTest = true;
            m.side = THREE.FrontSide;
            m.envMapIntensity = 1.4;

            if (matName.includes("speaker") || matName.includes("cone") || mats.indexOf(m) === 1) {
              m.emissive = new THREE.Color(0xff7722);
              m.emissiveMap = m.map;
              m.emissiveIntensity = 0.2;
              speakerMatsRef.current.push(m);
            }

            m.needsUpdate = true;
          });
        }
      }
    });
  }, [scene]);

  const getKnobType = (obj) => {
    let curr = obj;
    while (curr) {
      if (curr.name === "knob_volume") return "volume";
      if (curr.name === "knob_bass") return "bass";
      if (curr.name === "knob_tuning") return "tuning";
      if (curr.name === "knob_big_tuning") return "big_tuning";
      curr = curr.parent;
    }
    return null;
  };

  const handlePointerDown = (e) => {
    const knobType = getKnobType(e.object);
    if (!knobType) return;

    e.stopPropagation();
    setActiveKnob(knobType);

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

    if (e.camera && e.object) {
      const worldPos = new THREE.Vector3();
      e.object.getWorldPosition(worldPos);
      worldPos.project(e.camera);
      const screenX = ((worldPos.x + 1) / 2) * window.innerWidth;
      const screenY = ((-worldPos.y + 1) / 2) * window.innerHeight;
      knobCenter.current = { x: screenX, y: screenY };
      lastAngle.current = Math.atan2(clientY - screenY, clientX - screenX);
    } else {
      knobCenter.current = { x: clientX, y: clientY };
      lastAngle.current = 0;
    }

    lastClientPos.current = { x: clientX, y: clientY };
  };

  const handleWheel = (e) => {
    const knobType = getKnobType(e.object);
    if (!knobType) return;

    e.stopPropagation();
    const dir = e.deltaY < 0 ? 1 : -1;

    if (knobType === "volume") {
      setVolume((prev) => {
        const nextVal = Math.max(0, Math.min(100, prev + dir * 4));
        setTooltipData({ label: "VOLUME", val: `${nextVal}%` });
        return nextVal;
      });
    } else if (knobType === "bass") {
      setBassBoost((prev) => {
        const nextVal = Math.max(0, Math.min(12, prev + dir * 1));
        setTooltipData({ label: "BASS BOOST", val: `+${nextVal} dB` });
        return nextVal;
      });
    } else if (knobType === "big_tuning") {
      const seekDelta = dir * 10;
      setSeekAngle((prev) => prev + dir * 0.35);
      const seekInfo = typeof onSeek === "function" ? onSeek(seekDelta) : null;
      const icon = dir > 0 ? "⏩" : "⏪";
      const sign = dir > 0 ? "+" : "";

      if (seekInfo) {
        setTooltipData({
          label: "SEEK TRACK",
          val: `${seekInfo.formattedTarget} / ${seekInfo.formattedDuration}`,
          hint: `${icon} ${seekInfo.sign}${seekDelta}s • SPIN TO SCRUB`,
        });
      } else {
        setTooltipData({
          label: "SEEK TRACK",
          val: `${icon} ${sign}${seekDelta}s`,
          hint: "SPIN CLOCKWISE: FORWARD | COUNTER: BACKWARD",
        });
      }
    } else if (knobType === "tuning") {
      setTuning((prev) => {
        const step = 0.4;
        const nextVal = Math.max(88.0, Math.min(108.0, Number((prev + dir * step).toFixed(1))));
        setTooltipData({ label: "FM TUNING", val: `${nextVal.toFixed(1)} FM (${currentTrack?.shortTitle || "RADIO"})` });
        return nextVal;
      });
    }
  };

  useEffect(() => {
    if (!activeKnob) return;

    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

      const currentAngle = Math.atan2(clientY - knobCenter.current.y, clientX - knobCenter.current.x);
      let deltaAngle = currentAngle - lastAngle.current;

      if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
      if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;
      lastAngle.current = currentAngle;

      const dy = lastClientPos.current.y - clientY;
      const dx = clientX - lastClientPos.current.x;
      lastClientPos.current = { x: clientX, y: clientY };

      let stepDelta = deltaAngle;
      if (Math.abs(deltaAngle) < 0.002) {
        stepDelta = (dy + dx * 0.5) * 0.03;
      }

      if (activeKnob === "volume") {
        const deltaVol = (stepDelta / (Math.PI * 2)) * 120;
        setVolume((prev) => {
          const nextVal = Math.max(0, Math.min(100, Math.round(prev + deltaVol)));
          setTooltipData({ label: "VOLUME", val: `${nextVal}%` });
          return nextVal;
        });
      } else if (activeKnob === "bass") {
        const deltaBass = (stepDelta / (Math.PI * 2)) * 14;
        setBassBoost((prev) => {
          const nextVal = Math.max(0, Math.min(12, Math.round(prev + deltaBass)));
          setTooltipData({ label: "BASS BOOST", val: `+${nextVal} dB` });
          return nextVal;
        });
      } else if (activeKnob === "tuning") {
        const deltaTune = (stepDelta / (Math.PI * 2)) * 12.0;
        setTuning((prev) => {
          const nextVal = Math.max(88.0, Math.min(108.0, Number((prev + deltaTune).toFixed(1))));
          setTooltipData({ label: "FM TUNING", val: `${nextVal.toFixed(1)} FM (${currentTrack?.shortTitle || "RADIO"})` });
          return nextVal;
        });
      } else if (activeKnob === "big_tuning") {
        accumulatedSeek.current += stepDelta;
        setSeekAngle((prev) => prev + stepDelta);

        if (Math.abs(accumulatedSeek.current) >= 0.16) {
          const steps = Math.trunc(accumulatedSeek.current / 0.16);
          accumulatedSeek.current -= steps * 0.16;
          const seekSec = steps * 6;
          const seekInfo = typeof onSeek === "function" ? onSeek(seekSec) : null;

          const icon = seekSec > 0 ? "⏩" : "⏪";
          const sign = seekSec > 0 ? "+" : "";

          if (seekInfo) {
            setTooltipData({
              label: "SEEK TRACK",
              val: `${seekInfo.formattedTarget} / ${seekInfo.formattedDuration}`,
              hint: `${icon} ${sign}${seekSec}s • DRAG TO SCRUB`,
            });
          } else {
            setTooltipData({
              label: "SEEK TRACK",
              val: `${icon} ${sign}${seekSec}s`,
              hint: "CLOCKWISE: FORWARD ⏩ | COUNTER: BACKWARD ⏪",
            });
          }
        }
      }
    };

    const handlePointerUp = () => {
      setActiveKnob(null);
      setTooltipData(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [activeKnob, setVolume, setBassBoost, setTuning, onSeek, currentTrack]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const bass = audioDataRef?.current ? audioDataRef.current.bass : (audioData?.bass ?? 0);
    const volScale = volume / 100;
    const bassFactor = 1 + (bassBoost / 12) * 1.5;

    // Subtle 3D Model Parallax Tilt towards cursor
    const px = state.pointer.x;
    const py = state.pointer.y;
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      px * 0.12,
      2.5,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      -py * 0.08,
      2.5,
      delta
    );

    // Physical 3D Knob Rotations
    const volAngle = -Math.PI * 0.75 + (volume / 100) * Math.PI * 1.5;
    const bassAngle = -Math.PI * 0.75 + (bassBoost / 12) * Math.PI * 1.5;
    const tuningFraction = (tuning - 88.0) / 20.0;
    const tuningAngle = -Math.PI * 0.75 + tuningFraction * Math.PI * 1.5;

    if (knobVolRef.current) knobVolRef.current.rotation.z = -volAngle;
    if (knobBassRef.current) knobBassRef.current.rotation.z = -bassAngle;
    if (knobTuningRef.current) knobTuningRef.current.rotation.z = -tuningAngle * 2.0;
    if (knobBigTuningRef.current) knobBigTuningRef.current.rotation.z = -seekAngle;

    // Speaker Glow Pulse
    const glowTarget = active ? 0.35 + bass * 0.7 * volScale * bassFactor : 0.15;
    speakerMatsRef.current.forEach((m) => {
      m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, glowTarget, 0.15);
    });

    groupRef.current.position.set(0, verticalY, 0);

    // Subtle speaker diaphragm pulse
    const pulse = active ? bass * 0.02 * volScale * bassFactor : 0;
    groupRef.current.scale.set(1 + pulse, 1 + pulse * 0.6, 1 + pulse * 0.8);
  });

  return (
    <group ref={groupRef} position={[0, verticalY, 0]}>
      <Center scale={responsiveScale}>
        <group>
          <primitive
            object={scene}
            onPointerOver={(e) => {
              const knobType = getKnobType(e.object);
              if (knobType) {
                e.stopPropagation();
                document.body.style.cursor = "grab";
                if (knobType === "volume") setTooltipData({ label: "VOLUME", val: `${volume}%` });
                if (knobType === "bass") setTooltipData({ label: "BASS BOOST", val: `+${bassBoost} dB` });
                if (knobType === "tuning") {
                  setTooltipData({ label: "FM TUNING", val: `${tuning.toFixed(1)} FM (${currentTrack?.shortTitle || "RADIO"})` });
                }
                if (knobType === "big_tuning") {
                  const curStr = formatTime(trackProgress?.currentTime || 0);
                  const durStr = trackProgress?.duration ? formatTime(trackProgress.duration) : "--:--";
                  setTooltipData({
                    label: "FAST FORWARD / REWIND KNOB",
                    val: `⏱️ ${curStr} / ${durStr}`,
                    hint: "DRAG OR SPIN TO SEEK SONG",
                  });
                }
              }
            }}
            onPointerOut={() => {
              if (!activeKnob) {
                document.body.style.cursor = "auto";
                setTooltipData(null);
              }
            }}
            onPointerDown={handlePointerDown}
            onWheel={handleWheel}
          />

          {/* Seamless Physical Controls Raycast Hitboxes with Active LED Indicators */}
          {CASSETTE_BUTTONS.map((btn) => {
            let isButtonActive = false;
            if (btn.id === "play" && active) isButtonActive = true;
            if (btn.id === "power" && active) isButtonActive = true;
            if (btn.id === "mute" && isMuted) isButtonActive = true;
            if (btn.id === "stereo" && bassBoost > 0) isButtonActive = true;
            if (btn.id === "pause" && !active) isButtonActive = true;

            return (
              <CassetteKeyMesh
                key={btn.id}
                config={btn}
                isButtonActive={isButtonActive}
                onButtonAction={onButtonAction}
                setTooltipData={setTooltipData}
              />
            );
          })}
        </group>
      </Center>

      {tooltipData && (
        <Html position={[0, 0.7, 0.5]} center distanceFactor={5.5} pointerEvents="none">
          <div className="knob-3d-tooltip">
            <span className="knob-3d-title">{tooltipData.label}</span>
            <span className="knob-3d-val">{tooltipData.val}</span>
            <span className="knob-3d-hint">{tooltipData.hint || "CLICK TO TOGGLE"}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload(boomboxModelUrl);
export default React.memo(BoomboxModel);
