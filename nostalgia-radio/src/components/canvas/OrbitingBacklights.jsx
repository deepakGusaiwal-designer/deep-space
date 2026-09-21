import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function OrbitingBacklights({ active, audioDataRef, bass = 0, volScale = 0.8 }) {
  const light1Ref = useRef();
  const light2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const speed = active ? 1.4 : 0.6;
    const angle = t * speed;
    const radiusX = 2.4;
    const radiusY = 1.0;

    const x1 = Math.cos(angle) * radiusX;
    const y1 = Math.sin(angle) * radiusY;
    const x2 = Math.cos(angle + Math.PI) * radiusX;
    const y2 = Math.sin(angle + Math.PI) * radiusY;

    const currentBass = audioDataRef?.current ? audioDataRef.current.bass : bass;

    if (light1Ref.current) {
      light1Ref.current.position.set(x1, y1, -0.6);
      light1Ref.current.intensity = active ? (1.8 + currentBass * 3.2) * volScale : 0.3;
      // Cycle through rainbow chromatic spectrum
      light1Ref.current.color.setHSL((t * 0.08) % 1, 0.95, 0.55);
    }
    if (light2Ref.current) {
      light2Ref.current.position.set(x2, y2, -0.6);
      light2Ref.current.intensity = active ? (1.5 + currentBass * 2.6) * volScale : 0.3;
      // Complementary rainbow hue
      light2Ref.current.color.setHSL((t * 0.08 + 0.5) % 1, 0.95, 0.55);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic Orbiting Rainbow Chromatic Light 1 */}
      <pointLight
        ref={light1Ref}
        color="#ff3366"
        distance={5.0}
        decay={1.8}
      />
      {/* Dynamic Orbiting Rainbow Chromatic Light 2 */}
      <pointLight
        ref={light2Ref}
        color="#00ddff"
        distance={5.0}
        decay={1.8}
      />
    </group>
  );
}

export default React.memo(OrbitingBacklights);
