import { useCallback, useEffect, useMemo, useRef } from "react";
import L, { Marker as LeafletMarker } from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "@/styles/map-picker.css";

export type LatLng = { lat: number; lng: number };

type MapPickerProps = {
  value: LatLng;
  onChange: (value: LatLng) => void;
  zoom?: number;
  height?: number | string;
  readOnly?: boolean;
  className?: string;
};

const PRECISION = 6; // ~11 cm

const round = ({ lat, lng }: LatLng): LatLng => ({
  lat: Number(lat.toFixed(PRECISION)),
  lng: Number(lng.toFixed(PRECISION)),
});

const isSame = (a: LatLng, b: LatLng) => a.lat === b.lat && a.lng === b.lng;

const pinIcon = L.divIcon({
  className: "mp-pin",
  iconSize: [26, 34],
  iconAnchor: [13, 32],
  html: `
    <svg viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M13 33.5C13 33.5 25 20.6 25 13A12 12 0 1 0 1 13c0 7.6 12 20.5 12 20.5Z"
        class="mp-pin__body"
      />
      <circle cx="13" cy="13" r="4.25" class="mp-pin__core" />
    </svg>
  `,
});

function SyncView({
  position,
  echo,
}: {
  position: LatLng;
  echo: LatLng | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (echo && isSame(echo, position)) return;
    map.setView([position.lat, position.lng], map.getZoom(), { animate: true });
  }, [map, position, echo]);

  return null;
}

function ClickToPlace({
  disabled,
  onPick,
}: {
  disabled: boolean;
  onPick: (value: LatLng) => void;
}) {
  useMapEvents({
    click(event) {
      if (disabled) return;
      onPick(round(event.latlng));
    },
  });

  return null;
}

function TrackContainerSize() {
  const map = useMap();

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  return null;
}

export function MapPicker({
  value,
  onChange,
  zoom = 19,
  height = 320,
  readOnly = false,
  className,
}: MapPickerProps) {
  const markerRef = useRef<LeafletMarker | null>(null);
  const echoRef = useRef<LatLng | null>(null);

  const emit = useCallback(
    (next: LatLng) => {
      echoRef.current = next;
      onChange(next);
    },
    [onChange],
  );

  const markerHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) emit(round(marker.getLatLng()));
      },
    }),
    [emit],
  );

  const center: [number, number] = [value.lat, value.lng];

  return (
    <div
      className={["mp", className].filter(Boolean).join(" ")}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom
        className="mp__canvas"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          minZoom={3}
          maxZoom={20}
          detectRetina
        />

        <ZoomControl position="bottomright" />

        <Marker
          position={center}
          icon={pinIcon}
          draggable={!readOnly}
          autoPan
          keyboard
          eventHandlers={markerHandlers}
          ref={markerRef}
          alt="Local selecionado"
        />

        <ClickToPlace disabled={readOnly} onPick={emit} />
        <SyncView position={value} echo={echoRef.current} />
        <TrackContainerSize />
      </MapContainer>

      <div className="mp__readout" aria-live="polite">
        <span className="mp__coord">{value.lat.toFixed(PRECISION)}</span>
        <span className="mp__sep">,</span>
        <span className="mp__coord">{value.lng.toFixed(PRECISION)}</span>
      </div>

      {!readOnly && (
        <p className="mp__hint">
          Arraste o pin ou clique no mapa para ajustar.
        </p>
      )}
    </div>
  );
}
