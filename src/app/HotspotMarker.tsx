import React from "react";
import { Html } from "@react-three/drei";

interface HotspotMarkerProps {
  position: [number, number, number];
  label: string;
  onClick: () => void;
}

export function HotspotMarker({
  position,
  label,
  onClick,
}: HotspotMarkerProps) {
  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#ff5252" />
      </mesh>
      {/* Label as floating HTML */}
      <Html position={[0, 0.08, 0]} center style={{ pointerEvents: "none" }}>
        <div className="bg-white text-xs px-2 py-1 rounded shadow font-medium border border-gray-200">
          {label}
        </div>
      </Html>
    </group>
  );
}
