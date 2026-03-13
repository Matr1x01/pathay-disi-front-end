import {useEffect, useRef, useState} from "react";
import "leaflet/dist/leaflet.css";
import {LatLng} from "leaflet";

interface MapPickerProps {
    lat?: number;
    lng?: number;
    address?: string;
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapPicker({lat = 23.8103, lng = 90.4125, address, onLocationSelect}: MapPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        import("leaflet").then((LModule) => {
            const L = LModule.default || LModule;
            if (cancelled || !mapRef.current || mapInstance.current) return;

            // Fix default icon
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
            });

            const map = L.map(mapRef.current!, {zoomControl: false}).setView([lat, lng], 14);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap",
            }).addTo(map);

            L.control.zoom({position: "bottomright"}).addTo(map);

            const marker = L.marker([lat, lng], {draggable: true}).addTo(map);
            marker.on("dragend", () => {
                const pos = marker.getLatLng();
                onLocationSelect(pos.lat, pos.lng);
            });

            map.on("click", (e: any) => {
                marker.setLatLng(e.latlng);
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            });

            mapInstance.current = map;
            markerRef.current = marker;
            setReady(true);
        });

        return () => {
            cancelled = true;
            mapInstance.current?.remove();
            mapInstance.current = null;
        };
    }, []);

    // Update marker when lat/lng props change externally
    useEffect(() => {
        if (markerRef.current && mapInstance.current && lat && lng) {
            markerRef.current.setLatLng([lat, lng]);
            mapInstance.current.setView([lat, lng], 14);
        }
    }, [lat, lng]);

    // Handle geocoding when the address string updates
    useEffect(() => {
        if (!address || !ready || !mapInstance.current) return;

        const controller = new AbortController();

        fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&limit=5&format=json&addressdetails=1`,
            {signal: controller.signal}
        )
            .then((res) => res.json())
            .then((results) => {
                console.log("Geocode results:", results);
                if (results && results.length > 0) {
                    const center = new LatLng(results[0].lat, results[0].lon);

                    if (markerRef.current && mapInstance.current) {
                        markerRef.current.setLatLng(center);
                        mapInstance.current.setView(center, 12);
                        onLocationSelect(center.lat, center.lng);
                    }
                }
            })
            .catch((err) => {
                if (err.name !== "AbortError") console.error("Geocode error:", err);
            });

        return () => controller.abort();
    }, [address, ready]);

    return (
        <div className="relative rounded-lg overflow-hidden border border-border">
            <div ref={mapRef} className="h-48 sm:h-56 w-full"/>
            {!ready && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Loading map…</span>
                </div>
            )}
            <p className="text-[10px] text-muted-foreground text-center py-1 bg-card">
                Tap map or drag marker to set location
            </p>
        </div>
    );
}