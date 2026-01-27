"use client";

import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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

export interface Hotspot {
  id: string;
  position: [number, number, number];
  label: string;
}

export default function Page() {
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [showHotspotDialog, setShowHotspotDialog] = useState(false);
  const [pendingHotspot, setPendingHotspot] = useState<
    [number, number, number] | null
  >(null);
  const [hotspotLabel, setHotspotLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle GLB file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setGlbUrl(url);
      setHotspots([]); // Reset hotspots on new model
    }
  };

  // Add hotspot dialog
  const handleAddHotspot = (point: [number, number, number]) => {
    setPendingHotspot(point);
    setShowHotspotDialog(true);
  };

  const handleHotspotDialogClose = () => {
    setShowHotspotDialog(false);
    setPendingHotspot(null);
    setHotspotLabel("");
  };

  const handleHotspotDialogSave = () => {
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
  };

  const handleRemoveHotspot = (id: string) => {
    setHotspots((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white border-b flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight">
          SwiftXR 3D Mini Editor, for{" "}
          <span className="text-base font-semibold text-black">
            Mmeremnwanne, Gideon
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="file"
            accept=".glb"
            className="w-48"
            onChange={handleFileChange}
          />
        </div>
      </header>

      <p className="text-base bg-orange-100/50 px-2 py-2 rounded-lg">
        Note: Double click to add hobspot to your Models after upload.
      </p>

      {/* Main 3D Editor */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl aspect-video bg-white rounded-lg shadow border flex items-center justify-center relative">
          {glbUrl ? (
            <Canvas camera={{ position: [0, 0.5, 2.5], fov: 50 }} shadows>
              <ambientLight intensity={0.7} />
              <directionalLight
                position={[2, 4, 2]}
                intensity={0.7}
                castShadow
              />
              <OrbitControls enablePan enableRotate enableZoom />
              <GLBModel
                url={glbUrl}
                onPointerMissed={() => {}}
                onAddHotspot={handleAddHotspot}
              />
              {hotspots.map((hotspot) => (
                <HotspotMarker
                  key={hotspot.id}
                  position={hotspot.position}
                  label={hotspot.label}
                  onClick={() => handleRemoveHotspot(hotspot.id)}
                />
              ))}
            </Canvas>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 select-none">
              <span className="text-5xl mb-2">📦</span>
              <span className="font-medium">Import a .GLB file to begin</span>
            </div>
          )}
        </div>
        <div className="w-full max-w-4xl">
          <HotspotList hotspots={hotspots} onRemove={handleRemoveHotspot} />
        </div>
      </main>

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

      {/* Footer */}
      <footer className="w-full px-6 py-3 bg-white border-t text-xs text-gray-500 text-center">
        3D Mini Editor &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
