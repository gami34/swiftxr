import React from "react";
import { Hotspot } from "../../types/interface";
import { XIcon } from "lucide-react";

interface HotspotListProps {
  hotspots: Hotspot[];
  onRemove: (id: string) => void;
}

export function HotspotList({ hotspots, onRemove }: HotspotListProps) {
  return (
    <div className="mt-4">
      <h2 className="font-semibold mb-2 text-sm">Hotspots</h2>
      {hotspots.length === 0 ? (
        <div className="text-gray-400 text-xs">No hotspots added yet.</div>
      ) : (
        <ul className="space-y-1">
          {hotspots.map((h) => (
            <li key={h.id} className="flex items-center gap-2 text-xs">
              <span className="font-medium">{h.label}</span>
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => onRemove(h.id)}
                aria-label="Remove hotspot"
              >
                <XIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
