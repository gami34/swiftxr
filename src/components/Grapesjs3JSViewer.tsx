import React, { useState, useRef, Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, Preload } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { GLBModel } from "./GLBModel";
import { HotspotMarker } from "./HotspotMarker";
import { HotspotList } from "./HotspotList";
import { Hotspot } from "../../types/interface";
import { CanvasLoader } from "./CanvasLoader";
import { CameraController } from "./CameraController";

interface Props {
  "data-bg-color": string;
  "data-model-scale": number;
  "data-camera-pos-x": number;
  "data-camera-pos-y": number;
  "data-camera-pos-z": number;
}

export const ThreeJSViewer = (config: Props) => {
  // const [config, setConfig] = useState<Props>(props);

  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [showHotspotDialog, setShowHotspotDialog] = useState(false);
  const [pendingHotspot, setPendingHotspot] = useState<
    [number, number, number] | null
  >(null);
  const [hotspotLabel, setHotspotLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle GLB file upload
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setGlbUrl(url);
        setHotspots([]); // Reset hotspots on new model
      }
    },
    [],
  );
  // Add hotspot dialog
  const handleAddHotspot = useCallback((point: [number, number, number]) => {
    setPendingHotspot(point);
    setShowHotspotDialog(true);
  }, []);

  const handleHotspotDialogClose = useCallback(() => {
    setShowHotspotDialog(false);
    setPendingHotspot(null);
    setHotspotLabel("");
  }, []);

  const handleHotspotDialogSave = useCallback(() => {
    if (pendingHotspot && hotspotLabel.trim()) {
      setHotspots((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          position: pendingHotspot,
          label: hotspotLabel.trim(),
        },
      ]);
      handleHotspotDialogClose();
    }
  }, [pendingHotspot, hotspotLabel]);

  const handleRemoveHotspot = useCallback((id: string) => {
    setHotspots((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return (
    <div
      className="w-full h-full min-h-[400px]"
      style={{ backgroundColor: config["data-bg-color"] as string }}
    >
      <div className="h-full flex flex-col">
        <header className="w-full px-6 py-4 te border-b flex items-center justify-between">
          <div className="flex items-center float-right gap-2">
            <div className="text-base px-2 py-2 rounded-lg">
              Note: Double click to add Hotspots to your Models after upload.
            </div>
            <Input
              ref={inputRef}
              type="file"
              id="file"
              accept=".glb"
              className="w-48 "
              onChange={handleFileChange}
            />
          </div>
        </header>

        {/* Main 3D Editor */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl h-screen max-h-96 rounded-lg shadow border border-border flex items-center justify-center relative">
            {glbUrl ? (
              <Canvas>
                <CameraController
                  position={[
                    config["data-camera-pos-x"],
                    config["data-camera-pos-y"],
                    config["data-camera-pos-z"],
                  ]}
                />
                <ambientLight intensity={0.7} />
                <directionalLight position={[3, 5, 3]} intensity={1} />
                <Suspense fallback={<CanvasLoader />}>
                  <Center scale={config["data-model-scale"]}>
                    <GLBModel
                      url={glbUrl}
                      onPointerMissed={() => {}}
                      onAddHotspot={handleAddHotspot}
                    />
                  </Center>
                </Suspense>
                {hotspots.map((hotspot) => (
                  <HotspotMarker
                    key={hotspot.id}
                    position={hotspot.position}
                    label={hotspot.label}
                    onClick={() => handleRemoveHotspot(hotspot.id)}
                  />
                ))}
                <OrbitControls makeDefault />
                <Preload all />
              </Canvas>
            ) : (
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full h-full text-gray-400 select-none"
              >
                <span className="text-5xl mb-2">📦</span>
                <span className="font-medium">
                  Select to Import a .GLB file to begin
                </span>
              </label>
            )}
          </div>
          <div className="w-full max-w-4xl">
            <HotspotList hotspots={hotspots} onRemove={handleRemoveHotspot} />
          </div>
        </div>

        {/* Hotspot Label Dialog */}
        <Dialog open={showHotspotDialog} onOpenChange={setShowHotspotDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Hotspot Label</DialogTitle>
            </DialogHeader>
            <Input
              autoFocus
              placeholder="Enter label for hotspot"
              value={hotspotLabel}
              onChange={(e) => setHotspotLabel(e.target.value)}
              className="mb-4"
            />
            <DialogFooter>
              <Button variant="outline" onClick={handleHotspotDialogClose}>
                Cancel
              </Button>
              <Button
                onClick={handleHotspotDialogSave}
                disabled={!hotspotLabel.trim()}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
