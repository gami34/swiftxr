import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";

interface GLBModelProps {
  url: string;
  onPointerMissed: (e: any) => void;
  onAddHotspot: (point: [number, number, number]) => void;
}

export function GLBModel({
  url,
  onPointerMissed,
  onAddHotspot,
}: GLBModelProps) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<any>(null);

  // Add hotspot on double click
  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    // Get intersection point in 3D space
    if (e.point) {
      onAddHotspot([e.point.x, e.point.y, e.point.z]);
    }
  };

  return (
    <primitive
      object={scene}
      ref={meshRef}
      onPointerMissed={onPointerMissed}
      onDoubleClick={handleDoubleClick}
      dispose={null}
    />
  );
}
