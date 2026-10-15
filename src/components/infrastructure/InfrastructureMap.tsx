import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection } from 'geojson';
import acessos from '@/data/geo/corredores.geojson?raw';
import polos from '@/data/geo/polos.geojson?raw';
import { Checkbox } from '@/components/ui/checkbox';
import { Source } from '@/components/economy/ChartPanel';
import { useI18n } from '@/i18n';
import type { MapLayer } from '@/data/infraestrutura';
const geometries: Record<string, string> = { acessos, polos };
export default function InfrastructureMap({ layers }: { layers: MapLayer[] }) {
  const { t, lang } = useI18n(); const container = useRef<HTMLDivElement>(null); const mapRef = useRef<L.Map | null>(null); const refs = useRef<Record<string, L.GeoJSON>>({}); const [active, setActive] = useState(layers.map(l => l.id));
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, { scrollWheelZoom: false }).setView([-19.94, -44.06], 12); mapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(map);
    layers.forEach((l, i) => { const raw = geometries[l.geo]; if (!raw) return; const color = getComputedStyle(document.documentElement).getPropertyValue(i % 2 ? '--chart-blue' : '--orange').trim(); const layer = L.geoJSON(JSON.parse(raw) as FeatureCollection, { style: { color, weight: 3, fillOpacity: 0.12 }, onEachFeature: (feature, item) => { if (feature.properties?.['nome']) item.bindTooltip(String(feature.properties['nome'])); } }); refs.current[l.id] = layer; layer.addTo(map); });
    const observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(container.current);
    return () => { observer.disconnect(); map.remove(); mapRef.current = null; refs.current = {}; };
  }, [layers]);
  useEffect(() => { const map = mapRef.current; if (!map) return; Object.entries(refs.current).forEach(([id, layer]) => active.includes(id) ? layer.addTo(map) : layer.remove()); }, [active]);
  return <div>{layers.some(l => l.ilustrativo) && <p className="mb-4 border-l-4 border-orange bg-highlight px-4 py-3 text-sm leading-relaxed">{t.economy.mapNote}</p>}<div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]"><div className="relative isolate overflow-hidden rounded-lg border"><div ref={container} aria-label={t.economy.map} className="h-[420px] w-full md:h-[480px]" /><span className="pointer-events-none absolute bottom-7 left-3 z-[500] bg-card px-2 py-1 text-xs font-semibold">{t.economy.example}</span></div><aside><h3 className="mb-4 text-lg font-bold">{t.economy.layers}</h3><div className="space-y-5">{layers.map(l => <div key={l.id}><label className="mb-2 flex cursor-pointer items-start gap-3 text-sm"><Checkbox aria-label={l.nome[lang]} checked={active.includes(l.id)} onCheckedChange={checked => setActive(a => checked ? [...a, l.id] : a.filter(id => id !== l.id))} />{l.nome[lang]}</label>{!l.ilustrativo && <Source data={l} />}</div>)}</div></aside></div><p className="mt-3 text-xs text-muted-foreground">{t.source.fonte}: OpenStreetMap · {t.economy.example}</p></div>;
}
