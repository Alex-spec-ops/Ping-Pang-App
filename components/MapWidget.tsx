"use client";

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#c9e8f5]">
      <div className="text-[#0A241E]/50 font-bold animate-pulse text-sm uppercase tracking-widest" style={{ fontFamily: "var(--font-ui)" }}>
        Chargement de la carte...
      </div>
    </div>
  )
});

export default function MapWidget({ onPlayClick }: { onPlayClick?: (tableId: string) => void }) {
  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <LeafletMap onPlayClick={onPlayClick} />
    </div>
  );
}
