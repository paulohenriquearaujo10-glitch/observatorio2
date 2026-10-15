import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { FeatureCollection } from 'geojson';
import 'leaflet/dist/leaflet.css';
import geo from '@/data/geo/bacia-exemplo.geojson?raw';
import { Button } from '@/components/ui/button';
import { CompanyTable } from '@/components/companies/CompanyTable';
import { deslocamentos, instituicoes, sourced, matchesFilters, inPeriod, type Filters } from '@/data/trabalho-qualificacao';
import { useI18n } from '@/i18n';
export default function LaborMap({ mode, filters }: { mode: 'commute' | 'schools'; filters: Filters }) {
  const { t, lang } = useI18n(); const [direction, setDirection] = useState<'entram' | 'saem'>('entram'); const [area, setArea] = useState('all'); const ref = useRef<HTMLDivElement>(null);
  const rows = deslocamentos.filter(r => sourced(r) && matchesFilters(r, filters) && inPeriod(r.dataReferencia, filters) && r[direction] !== null);
  const schools = instituicoes.filter(r => sourced(r) && r.latitude !== null && r.longitude !== null && (area === 'all' || r.areas?.[lang] === area));
  const canShow = mode === 'commute' ? rows.length > 0 : schools.length > 0;
  useEffect(() => {
    if (!ref.current || !canShow) return;
    const map = L.map(ref.current, { scrollWheelZoom: false }).setView([-19.94, -44.06], 11); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
    const color = getComputedStyle(document.documentElement).getPropertyValue('--chart-blue').trim();
    if (mode === 'commute') { const max = Math.max(1, ...rows.map(r => r[direction] ?? 0)); L.geoJSON(JSON.parse(geo) as FeatureCollection, { style: feature => { const row = rows.find(r => r.geoId === feature?.properties?.['id']); return { color, weight: 2, fillOpacity: row ? 0.15 + (row[direction] ?? 0) / max * 0.65 : 0 }; }, onEachFeature: (feature, layer) => { const row = rows.find(r => r.geoId === feature.properties?.['id']); if (row) { const label = document.createElement('span'); label.textContent = `${row.municipio}: ${row[direction]?.toLocaleString(lang)} · ${row.fonte} · ${row.dataReferencia}`; layer.bindTooltip(label); layer.on('click', () => layer.openTooltip()); } } }).addTo(map); }
    else { const bounds = L.latLngBounds([]); schools.forEach(s => { if (s.latitude === null || s.longitude === null) return; const pin = L.circleMarker([s.latitude, s.longitude], { radius: 8, color, fillColor: color, fillOpacity: 0.85 }).addTo(map); const label = document.createElement('span'); label.textContent = `${s.nome} · ${s.unidades?.[lang] ?? ''}`; pin.bindTooltip(label); bounds.extend([s.latitude, s.longitude]); }); if (bounds.isValid()) map.fitBounds(bounds.pad(0.25), { maxZoom: 13 }); }
    const observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(ref.current); return () => { observer.disconnect(); map.remove(); };
  }, [mode, direction, filters, area, lang, canShow]);
  if (!canShow) return null;
  return <div className="mt-8">{mode === 'commute' ? <><p className="mb-4 border-l-4 border-orange bg-highlight p-3 text-sm">{t.labor.illustrative}</p><div className="mb-4 flex flex-wrap gap-2">{(['entram', 'saem'] as const).map(v => <Button key={v} variant={direction === v ? 'default' : 'outline'} aria-pressed={direction === v} onClick={() => setDirection(v)}>{v === 'entram' ? t.labor.incoming : t.labor.outgoing}</Button>)}</div></> : <div className="mb-4 flex flex-wrap gap-2">{['all', ...new Set(instituicoes.flatMap(s => s.areas ? [s.areas[lang]] : []))].map(v => <Button key={v} variant={area === v ? 'default' : 'outline'} onClick={() => setArea(v)}>{v === 'all' ? t.companies.all : v}</Button>)}</div>}<div ref={ref} className="relative isolate h-[420px] overflow-hidden rounded-lg border" aria-label={mode === 'commute' ? t.labor.sections.bacia : t.labor.institutionsMap} />{mode === 'commute' && <div className="mt-5"><CompanyTable title={t.labor.sections.bacia} id={`deslocamentos-${direction}`} rows={rows.map(r => ({ ...r, valor: r[direction] }))} columns={[{ key: 'municipio', label: t.companies.territory }, { key: 'valor', label: t.labor.workers }]} /></div>}</div>;
}