import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { FeatureCollection, GeoJsonProperties } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { territorioMunicipal } from "@/data/economia-territorio";
import { Source } from "./ChartPanel";
import regionais from "@/data/geo/regionais.geojson?raw";
import polos from "@/data/geo/polos.geojson?raw";
import zoneamento from "@/data/geo/zoneamento.geojson?raw";
import corredores from "@/data/geo/corredores.geojson?raw";
import expansao from "@/data/geo/expansao.geojson?raw";

const geometries = { regionais, polos, zoneamento, corredores, expansao };
type LayerKey = keyof typeof geometries;
const defaultLayers: LayerKey[] = ["polos"];
export default function TerritoryMap() {
  const { t, lang } = useI18n(); const e = t.economy;
  const container = useRef<HTMLDivElement>(null); const mapRef = useRef<L.Map | null>(null); const layersRef = useRef<Partial<Record<LayerKey, L.GeoJSON>>>({});
  const [active, setActive] = useState<LayerKey[]>(defaultLayers); const [area, setArea] = useState<GeoJsonProperties>(null);
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, { scrollWheelZoom: false }).setView([-19.94, -44.06], 12); mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(map);
    const palette = ["--chart-blue", "--orange", "--chart-teal", "--chart-gray", "--chart-steel"];
    Object.entries(geometries).forEach(([key, raw], i) => {
      const color = getComputedStyle(document.documentElement).getPropertyValue(palette[i] ?? "--chart-blue").trim();
      const layer = L.geoJSON(JSON.parse(raw) as FeatureCollection, { style: { color, weight: 2, fillOpacity: 0.16 }, onEachFeature: (feature, l) => { const props = feature.properties; if (props?.["nome"]) l.bindTooltip(String(props["nome"])); l.on("click", () => setArea(props)); } });
      layersRef.current[key as LayerKey] = layer; if (defaultLayers.includes(key as LayerKey)) layer.addTo(map);
    });
    const observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(container.current);
    return () => { observer.disconnect(); map.remove(); mapRef.current = null; layersRef.current = {}; };
  }, []);
  useEffect(() => { const map = mapRef.current; if (!map) return; Object.entries(layersRef.current).forEach(([key, layer]) => { if (!layer) return; if (active.includes(key as LayerKey)) layer.addTo(map); else layer.remove(); }); }, [active]);
  return <div>
    <div className="mb-4 border-l-4 border-orange bg-highlight px-4 py-3 text-sm leading-relaxed">{e.mapNote}</div>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="relative isolate overflow-hidden rounded-lg border"><div ref={container} className="h-[420px] w-full md:h-[480px]" aria-label={e.map} />
        <span className="pointer-events-none absolute bottom-7 left-3 z-[500] bg-card px-2 py-1 text-xs font-semibold">{e.example}</span>
      </div>
      <aside className="min-w-0 space-y-6">
        <div className="border-b pb-5"><h3 className="mb-3 text-base font-bold">Contagem</h3><p className="text-sm leading-relaxed">{e.area}: {territorioMunicipal.area?.toLocaleString(lang === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 1 })} km² · {e.census2022}: {territorioMunicipal.pop2022?.toLocaleString(lang === "pt" ? "pt-BR" : "en-US")} · {e.density}: {territorioMunicipal.densidade?.toLocaleString(lang === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 0 })} hab/km²</p><div className="mt-3"><Source data={territorioMunicipal} /></div></div>
        <div><h3 className="mb-3 text-base font-bold">{e.layers}</h3><div className="space-y-3">{(Object.keys(geometries) as LayerKey[]).map(key => <label key={key} className="flex cursor-pointer items-center gap-3 text-sm"><Checkbox checked={active.includes(key)} onCheckedChange={checked => setActive(a => checked ? [...a, key] : a.filter(k => k !== key))} />{e.layersNames[key]}</label>)}</div></div>
        <div className="border-t pt-5">{area ? <><p className="text-xs font-semibold uppercase text-orange">{e.example}</p><h3 className="mt-2 text-lg font-bold">{String(area["nome"])}</h3><dl className="mt-3 space-y-2 text-sm">{([ ["area", e.area, "km²"], ["populacao", e.population, ""], ["empresas", e.companies, ""], ["empregos", e.jobs, ""] ] as const).filter(([key]) => typeof area[key] === "number").map(([key, label, unit]) => <div key={key} className="flex justify-between gap-2"><dt>{label}</dt><dd>{Number(area[key]).toLocaleString(lang)} {unit}</dd></div>)}</dl><Button asChild variant="link" className="mt-3 h-auto whitespace-normal px-0 text-left"><Link to="/mapa">{e.opportunities} →</Link></Button></> : <p className="text-sm text-muted-foreground">{e.mapSelect}</p>}</div>
      </aside>
    </div>
    <p className="mt-3 text-xs text-muted-foreground">{e.source}: OpenStreetMap · {e.example}</p>
  </div>;
}