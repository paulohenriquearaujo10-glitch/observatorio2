import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Oportunidade } from '@/data/imoveis-exemplo';
import { useI18n } from '@/i18n';

export default function OpportunityMap({ items, hovered, onHover, onSelect }: { items: Oportunidade[]; hovered: string | null; onHover: (id: string | null) => void; onSelect: (o: Oportunidade) => void }) {
  const { t } = useI18n(); const c = t.invest;
  const container = useRef<HTMLDivElement>(null); const mapRef = useRef<L.Map | null>(null); const markers = useRef<Record<string, L.CircleMarker>>({});
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, { scrollWheelZoom: false }).setView([-19.93, -44.06], 12); mapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(map);
    const observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(container.current);
    return () => { observer.disconnect(); map.remove(); mapRef.current = null; };
  }, []);
  useEffect(() => {
    const map = mapRef.current; if (!map) return;
    Object.values(markers.current).forEach(m => m.remove()); markers.current = {};
    const css = getComputedStyle(document.documentElement);
    const orange = css.getPropertyValue('--orange').trim(); const blue = css.getPropertyValue('--chart-blue').trim();
    items.forEach(o => {
      const color = o.tipo === 'lotePublico' || o.tipo === 'terrenoPrivado' ? orange : blue;
      const m = L.circleMarker([o.lat, o.lng], { radius: 7, color, fillColor: color, fillOpacity: 0.75, weight: 2 }).addTo(map);
      const tip = document.createElement('span'); tip.textContent = `${c.tipos[o.tipo]} · ${o.area.toLocaleString('pt-BR')} m²`; m.bindTooltip(tip);
      m.on('mouseover', () => onHover(o.id)); m.on('mouseout', () => onHover(null)); m.on('click', () => onSelect(o));
      markers.current[o.id] = m;
    });
  }, [items, c, onHover, onSelect]);
  useEffect(() => { Object.entries(markers.current).forEach(([id, m]) => { m.setRadius(id === hovered ? 12 : 7); m.setStyle({ weight: id === hovered ? 4 : 2 }); if (id === hovered) m.bringToFront(); }); }, [hovered, items]);
  return <div className="relative isolate overflow-hidden rounded-lg border"><div ref={container} aria-label={c.map} className="h-[520px] w-full" /><span className="pointer-events-none absolute bottom-7 left-3 z-[500] bg-card px-2 py-1 text-xs font-semibold">{t.economy.example}</span></div>;
}
