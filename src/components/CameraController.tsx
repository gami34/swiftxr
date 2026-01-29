import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export const CameraController = ({
  position,
}: {
  position: [number, number, number];
}) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position);
    camera.updateProjectionMatrix();
  }, [position, camera]);

  return null;
};
