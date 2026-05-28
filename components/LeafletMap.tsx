"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useSupercluster from 'use-supercluster';
import { players } from '../lib/data';
import { clubs } from '../lib/clubs';

// Fix leaflet default icons for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const tableIcon = L.divIcon({
  html: `<div style="background-color: white; width: 24px; height: 24px; border-radius: 50%; border: 2px solid #0A241E; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px; line-height: 1;">🏓</div>`,
  className: 'custom-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function createClusterIcon(cluster: any) {
  const count = cluster.properties.point_count;
  let size = 44;
  if (count > 100) size = 52;
  if (count > 1000) size = 60;

  return L.divIcon({
    html: `<div style="transform: translate(-50%, -50%); background-color: #0A241E; color: white; min-width: ${size}px; min-height: ${size}px; padding: 6px 8px; border-radius: 40px; display: flex; flex-direction: column; gap: 0px; align-items: center; justify-content: center; font-weight: bold; font-family: var(--font-display, sans-serif); border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: ${size > 44 ? '14px' : '12px'}; line-height: 1.2;"><span>${count}</span><span style="font-size: 0.9em;">🏓</span></div>`,
    className: 'custom-cluster-marker',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function Clustering({ data, onPlayClick }: { data: any[], onPlayClick?: (tableId: string) => void }) {
  const map = useMap();
  const [bounds, setBounds] = useState<[number, number, number, number] | undefined>(undefined);
  const [zoom, setZoom] = useState(map.getZoom());

  function updateMap() {
    const b = map.getBounds();
    setBounds([
      b.getWest(),
      b.getSouth(),
      b.getEast(),
      b.getNorth()
    ]);
    setZoom(map.getZoom());
  }

  useEffect(() => {
    updateMap();
    map.on('moveend', updateMap);
    return () => {
      map.off('moveend', updateMap);
    };
  }, [map]);

  const { clusters, supercluster } = useSupercluster({
    points: data,
    bounds,
    zoom,
    options: { radius: 60, maxZoom: 16 }
  });

  return (
    <>
      {clusters.map(cluster => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster } = cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={createClusterIcon(cluster)}
              eventHandlers={{
                click: () => {
                  if (!supercluster) return;
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id as number),
                    18
                  );
                  map.setView([latitude, longitude], expansionZoom, {
                    animate: true
                  });
                }
              }}
            />
          );
        }

        const tableId = cluster.properties.tableId;
        const hash = String(tableId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const master = players[hash % players.length];
        const topClub = clubs[hash % clubs.length];

        return (
          <Marker
            key={`table-${tableId}`}
            position={[latitude, longitude]}
            icon={tableIcon}
          >
            <Popup>
              <div className="flex flex-col gap-2 p-1 w-48" style={{ fontFamily: "var(--font-ui)" }}>
                <p className="font-bold text-[#0A241E] m-0 text-sm border-b border-[#E5E7EB] pb-2 mb-1 text-center">
                  {cluster.properties.name || "Table de Ping Pong"}
                </p>
                
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl leading-none">{master.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8.5px] font-black uppercase text-[#616363] tracking-wider m-0 leading-none mb-0.5">Maître de la table</p>
                    <p className="text-xs font-bold text-[#0A241E] truncate m-0 leading-none">{master.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl leading-none">{topClub.logo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8.5px] font-black uppercase text-[#616363] tracking-wider m-0 leading-none mb-0.5">Club dominant</p>
                    <p className="text-xs font-bold text-[#0A241E] truncate m-0 leading-none">{topClub.name}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onPlayClick?.(tableId)}
                  className="w-full bg-[#0A241E] text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-transform border-none"
                >
                  Jouer ici
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function LeafletMap({ onPlayClick }: { onPlayClick?: (tableId: string) => void }) {
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/tables')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTables(data);
      })
      .catch(err => console.error("Error fetching tables:", err));
  }, []);

  return (
    <MapContainer 
      center={[48.8566, 2.3522]} // Centered on Paris
      zoom={12} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={false}
    >
      {/* Light basemap style suitable for custom markers */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Clustering data={tables} onPlayClick={onPlayClick} />
    </MapContainer>
  );
}
