import React, { useState } from "react";

export default function CassetteKeyMesh({ config, isButtonActive, onButtonAction, setTooltipData }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[config.x, config.y, config.z]}>
      {/* Interactive Raycast Collider */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
          setTooltipData({
            label: `CASSETTE CONTROL: ${config.label}`,
            val: `${config.icon} [${config.symbol}] ${config.label}`,
            hint: `${config.desc} • CLICK TO ACTIVATE`,
          });
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
          setTooltipData(null);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onButtonAction(config.id);
        }}
      >
        <boxGeometry args={[0.021, 0.034, 0.030]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Active / Hover LED Glow Indicator */}
      {(isButtonActive || hovered) && (
        <mesh position={[0, 0.022, 0.005]}>
          <circleGeometry args={[0.0035, 12]} />
          <meshBasicMaterial
            color={config.ledColor || "#ffaa55"}
            toneMapped={false}
            transparent
            opacity={isButtonActive ? 0.95 : 0.65}
          />
        </mesh>
      )}
    </group>
  );
}
