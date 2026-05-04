import MapPageClient from "../../components/MapPageClient";

export const metadata = { title: "Carte — PingPang" };

// The map must fill the full available height without a TopBar or padding.
export default function MapPage() {
  return <MapPageClient />;
}
