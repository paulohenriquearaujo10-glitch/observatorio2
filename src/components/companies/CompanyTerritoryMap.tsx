import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { FeatureCollection } from 'geojson';
import 'leaflet/dist/leaflet.css';
import regionais from '@/data/geo/regionais.geojson?raw';
import { baseTerritorial, type Filters, matchesFilters } from '@/data/empresas-cadeias';
import { useI18n } from '@/i18n';
import { CompanyTable } from './CompanyTable';
export default function CompanyTerritoryMap({ filters }: { filters: Filters }) {
 const { t, lang } = useI18n(); const container = useRef<HTMLDivElement>(null); const rows = baseTerritorial.filter(r => matchesFilters(r, filters));
 useEffect(() => { if (!container.current || !rows.length) return; const map = L.map(container.current, { scrollWheelZoom: false }).setView([-19.94, -44.06], 12); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map); const color = getComputedStyle(document.documentElement).getPropertyValue('--chart-blue').trim(); const max = Math.max(...rows.map(r => r.valor)); L.geoJSON(JSON.parse(regionais) as FeatureCollection, { style: feature => { const row = rows.find(r => r.geoId === String(feature?.properties?.['id'] ?? feature?.properties?.['nome'])); return { color, fillOpacity: row ? 0.15 + (max ? row.valor / max * 0.65 : 0) : 0, weight: 2 }; }, onEachFeature: (feature, layer) => { const row = rows.find(r => r.geoId === String(feature.properties?.['id'] ?? feature.properties?.['nome'])); if (row) { const text = document.createElement('span'); text.textContent = `${row.nome}: ${row.valor.toLocaleString(lang)} ${t.companies.companiesUnit}`; layer.bindTooltip(text); } } }).addTo(map); const observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(container.current); return () => { observer.disconnect(); map.remove(); }; }, [filters, lang, t]);
 if (!rows.length) return null;
 return <div><p className="mb-4 border-l-4 border-orange bg-highlight p-3 text-sm">{t.economy.mapNote}</p><div className="grid gap-5 lg:grid-cols-2"><div ref={container} className="relative isolate h-[420px] overflow-hidden rounded-lg border" aria-label={t.companies.sections.base} /><CompanyTable title={t.companies.coverage} id="empresas-territorio" rows={rows.map(r => ({ ...r }))} columns={[{ key: 'nome', label: t.companies.territory }, { key: 'valor', label: t.companies.companiesUnit }]} /></div></div>;
}
