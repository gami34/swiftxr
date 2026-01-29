import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

  // Add hotspot on double click
  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    // Get intersection point in 3D space
    if (e.point) {
      onAddHotspot([e.point.x, e.point.y, e.point.z]);
    }
  };

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    scene.position.sub(box.getCenter(new THREE.Vector3()));

    // Create scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1, 3);

    // Renderer (attach to GrapesJS container)
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document
      ?.getElementById?.("threejs-container")
      ?.appendChild?.(renderer.domElement);

    // Lighting
    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(light);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      "DamagedHelmet.glb",
      (gltf) => {
        const model = gltf.scene;

        // Compute bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Reposition model so its center is at origin
        model.position.sub(center);

        // Adjust camera distance to fit model
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        camera.position.z = cameraZ * 1.5; // Add some padding

        camera.lookAt(0, 0, 0);

        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      },
    );

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Handle resizing (important in GrapesJS)
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      // ref={meshRef}
      onPointerMissed={onPointerMissed}
      onDoubleClick={handleDoubleClick}
      dispose={null}
    />
  );
}
