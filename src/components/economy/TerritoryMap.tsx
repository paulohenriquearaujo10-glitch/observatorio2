import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Feature, FeatureCollection } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import turfArea from "@turf/area";
import turfLength from "@turf/length";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { descricaoZonas, fontesMapa, territorioMunicipal, zonasOrdem } from "@/data/economia-territorio";
import { geoArquivos, type GeoCamada } from "@/config/mapa";
import { Source } from "./ChartPanel";
import { corredoresOrdem, corridorGroup, corridorKind, districtLabel, distritosOrdem, groupFeatures } from "./map-layers";

const ORDER: GeoCamada[] = ["distritosIndustriais", "corredoresViarios", "zoneamento"];
const DISTRICT = "#D9622B";
const zoneGroups = ["ZAE", "ZEIS", "ZPA", "ZUD"] as const;
const groupOf = (code: string) => zoneGroups.find(g => code.startsWith(g)) ?? code;
const cache = new Map<GeoCamada, Promise<FeatureCollection>>();
async function isAvailable(url: string) {
  const r = await fetch(url, { method: "HEAD" });
  if (!r.ok || (r.headers.get("content-type") ?? "").includes("text/html")) throw new Error(`${url}: ${r.status}`);
}
function loadLayer(key: GeoCamada) {
  const existing = cache.get(key);
  if (existing) return existing;
  const request = fetch(geoArquivos[key]).then(async r => { if (!r.ok) throw new Error(`${geoArquivos[key]}: ${r.status}`); return (await r.json()) as FeatureCollection; }).catch(err => { cache.delete(key); throw err; });
  cache.set(key, request);
  return request;
}
const fc = (features: Feature[]): FeatureCollection => ({ type: "FeatureCollection", features });
const km2 = (features: Feature[]) => turfArea(fc(features)) / 1e6;
const km = (features: Feature[]) => features.reduce((s, f) => s + turfLength(f, { units: "kilometers" }), 0);

type Selected = { kind: "distrito"; nome: string; area: number; props: Record<string, unknown> } | { kind: "corredor"; nome: string; extensao: number } | { kind: "zona"; codigo: string; area: number };
type Groups = { distritos: string[]; corredores: string[]; zonas: { code: string; cor: string }[] };

export default function TerritoryMap() {
  const { t, lang } = useI18n(); const e = t.economy; const loc = lang === "pt" ? "pt-BR" : "en-US";
  const fmt1 = (n: number) => n.toLocaleString(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const container = useRef<HTMLDivElement>(null); const mapRef = useRef<L.Map | null>(null);
  const objs = useRef<{ distritos: Record<string, { layer: L.GeoJSON; label: L.Tooltip }>; corredores: Record<string, L.Layer[]>; zonas: Record<string, L.GeoJSON> }>({ distritos: {}, corredores: {}, zonas: {} });
  const [available, setAvailable] = useState<Partial<Record<GeoCamada, boolean>>>({});
  const [active, setActive] = useState<GeoCamada[]>(["distritosIndustriais", "corredoresViarios"]);
  const [groups, setGroups] = useState<Groups>({ distritos: [], corredores: [], zonas: [] });
  const [off, setOff] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(12); const [selected, setSelected] = useState<Selected | null>(null);
  const loaded = useRef(new Set<GeoCamada>());

  const fail = useCallback((key: GeoCamada, err: unknown) => { console.error(`[mapa] camada ${key} indisponível`, err); setAvailable(a => ({ ...a, [key]: false })); setActive(a => a.filter(k => k !== key)); }, []);

  const build = useCallback(async (key: GeoCamada) => {
    const map = mapRef.current; if (!map || loaded.current.has(key)) return; loaded.current.add(key);
    try {
      const data = await loadLayer(key); if (!mapRef.current) return;
      if (key === "distritosIndustriais") {
        const gs = groupFeatures(data, ["Polygon", "MultiPolygon"], f => districtLabel(f.properties?.["name"]), distritosOrdem);
        gs.forEach(({ key: nome, features }) => {
          const props = Object.assign({}, ...features.map(f => f.properties ?? {})) as Record<string, unknown>;
          const layer = L.geoJSON(fc(features), { pane: "distritos", style: { color: DISTRICT, weight: 2.5, fillColor: DISTRICT, fillOpacity: 0.25 } });
          layer.bindTooltip(nome, { sticky: true });
          layer.on("mouseover", () => layer.setStyle({ fillOpacity: layer.options.style && (layer as unknown as { _zoneOn?: boolean })._zoneOn ? 0 : 0.45 }));
          layer.on("mouseout", () => layer.setStyle({ fillOpacity: (layer as unknown as { _zoneOn?: boolean })._zoneOn ? 0 : 0.25 }));
          layer.on("click", () => setSelected({ kind: "distrito", nome, area: km2(features), props }));
          const label = L.tooltip({ permanent: true, direction: "center", className: "district-label", pane: "rotulos" }).setLatLng(layer.getBounds().getCenter()).setContent(nome);
          objs.current.distritos[nome] = { layer, label };
        });
        setGroups(g => ({ ...g, distritos: gs.map(x => x.key) }));
      } else if (key === "corredoresViarios") {
        const gs = groupFeatures(data, ["LineString", "MultiLineString"], f => corridorGroup(f.properties), corredoresOrdem);
        gs.forEach(({ key: nome, features }) => {
          const kind = corridorKind(nome); const weight = kind === "federal" ? 5 : kind === "avenida" ? 3.5 : 2;
          const color = kind === "federal" ? "#1F3A5F" : kind === "avenida" ? "#3E7CB1" : "#8FA9C4";
          const parts: L.Layer[] = [];
          if (kind === "federal") parts.push(L.geoJSON(fc(features), { pane: "corredoresBase", interactive: false, style: { color: "#FFFFFF", weight: 7 } }));
          const line = L.geoJSON(fc(features), { pane: "corredores", style: { color, weight } });
          const extensao = km(features);
          line.bindTooltip(nome, { sticky: true });
          line.on("mouseover", () => line.setStyle({ weight: weight + 2 })); line.on("mouseout", () => line.setStyle({ weight }));
          line.on("click", () => setSelected({ kind: "corredor", nome, extensao }));
          parts.push(line); objs.current.corredores[nome] = parts;
        });
        setGroups(g => ({ ...g, corredores: gs.map(x => x.key) }));
      } else {
        const gs = groupFeatures(data, ["Polygon", "MultiPolygon"], f => { const z = String(f.properties?.["zona"] ?? "").toUpperCase(); return (zonasOrdem as readonly string[]).includes(z) ? z : null; }, zonasOrdem);
        const zonas = gs.map(({ key: code, features }) => {
          const cor = String(features[0]?.properties?.["cor"] ?? "#999999");
          const layer = L.geoJSON(fc(features), { pane: "zonas", style: { color: cor, weight: 0.5, fillColor: cor, fillOpacity: 0.55 } });
          const area = km2(features);
          layer.bindTooltip(code, { sticky: true });
          layer.on("mouseover", () => layer.setStyle({ fillOpacity: 0.75 })); layer.on("mouseout", () => layer.setStyle({ fillOpacity: 0.55 }));
          layer.on("click", () => setSelected({ kind: "zona", codigo: code, area }));
          objs.current.zonas[code] = layer; return { code, cor };
        });
        setGroups(g => ({ ...g, zonas }));
      }
    } catch (err) { loaded.current.delete(key); fail(key, err); }
  }, [fail]);

  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, { scrollWheelZoom: false }).setView([-19.94, -44.06], 12); mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(map);
    ([["zonas", 410], ["distritos", 420], ["corredoresBase", 430], ["corredores", 431], ["rotulos", 640]] as const).forEach(([name, z]) => { map.createPane(name).style.zIndex = String(z); });
    map.on("zoomend", () => setZoom(map.getZoom()));
    const observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(container.current);
    ORDER.forEach(key => isAvailable(geoArquivos[key]).then(() => setAvailable(a => ({ ...a, [key]: true }))).catch(err => fail(key, err)));
    return () => { observer.disconnect(); map.remove(); mapRef.current = null; objs.current = { distritos: {}, corredores: {}, zonas: {} }; loaded.current.clear(); };
  }, [fail]);

  useEffect(() => { active.forEach(k => { if (available[k]) void build(k); }); }, [active, available, build]);

  useEffect(() => {
    const map = mapRef.current; if (!map) return;
    const show = (layer: L.Layer, on: boolean) => { if (on) { if (!map.hasLayer(layer)) layer.addTo(map); } else layer.remove(); };
    const zoneOn = active.includes("zoneamento");
    Object.entries(objs.current.distritos).forEach(([nome, { layer, label }]) => {
      const on = active.includes("distritosIndustriais") && !off.has(`d:${nome}`);
      (layer as unknown as { _zoneOn?: boolean })._zoneOn = zoneOn; layer.setStyle({ fillOpacity: zoneOn ? 0 : 0.25 });
      show(layer, on); show(label, on && zoom >= 13);
    });
    Object.entries(objs.current.corredores).forEach(([nome, parts]) => parts.forEach(p => show(p, active.includes("corredoresViarios") && !off.has(`c:${nome}`))));
    Object.entries(objs.current.zonas).forEach(([code, layer]) => show(layer, zoneOn && !off.has(`z:${groupOf(code)}`)));
  }, [active, off, zoom, groups]);

  const toggle = (id: string, on: boolean) => setOff(s => { const n = new Set(s); if (on) n.delete(id); else n.add(id); return n; });
  const visible = ORDER.filter(k => available[k]);
  const sub = (id: string, label: React.ReactNode, on: boolean) => <label key={id} className="flex cursor-pointer items-center gap-2 text-sm"><Checkbox checked={on} onCheckedChange={c => toggle(id, !!c)} />{label}</label>;
  const osmSource = `${e.source}: ${fontesMapa.osm[lang]} · ${e.updatedAt} ${fontesMapa.atualizadoEm}`;

  return <div>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="relative isolate overflow-hidden rounded-lg border"><div ref={container} className="h-[420px] w-full md:h-[480px]" aria-label={e.map} /></div>
      <aside className="min-w-0 space-y-6">
        <div className="border-b pb-5"><h3 className="mb-3 text-base font-bold">Contagem</h3><p className="text-sm leading-relaxed">{e.area}: {territorioMunicipal.area?.toLocaleString(loc, { maximumFractionDigits: 1 })} km² · {e.census2022}: {territorioMunicipal.pop2022?.toLocaleString(loc)} · {e.density}: {territorioMunicipal.densidade?.toLocaleString(loc, { maximumFractionDigits: 0 })} hab/km²</p><div className="mt-3"><Source data={territorioMunicipal} /></div></div>
        {visible.length > 0 && <details open className="group"><summary className="mb-3 cursor-pointer list-none text-base font-bold">{e.layers}</summary><div className="space-y-4">{visible.map(key => {
          const on = active.includes(key);
          return <div key={key}><label className="flex cursor-pointer items-center gap-3 text-sm font-semibold"><Checkbox checked={on} onCheckedChange={c => setActive(a => c ? [...a, key] : a.filter(k => k !== key))} />{e.layersNames[key]}</label>
            {on && key === "distritosIndustriais" && groups.distritos.length > 0 && <div className="ml-7 mt-2 space-y-2">{groups.distritos.map(n => sub(`d:${n}`, n, !off.has(`d:${n}`)))}</div>}
            {on && key === "corredoresViarios" && groups.corredores.length > 0 && <div className="ml-7 mt-2 space-y-2">{groups.corredores.map(n => sub(`c:${n}`, n, !off.has(`c:${n}`)))}</div>}
            {on && key === "zoneamento" && groups.zonas.length > 0 && <div className="ml-7 mt-2 max-h-56 space-y-3 overflow-y-auto pr-1">{zoneGroups.filter(g => groups.zonas.some(z => groupOf(z.code) === g)).map(g => <div key={g}>{sub(`z:${g}`, g, !off.has(`z:${g}`))}<ul className="ml-7 mt-1 space-y-1">{groups.zonas.filter(z => groupOf(z.code) === g).map(z => <li key={z.code} className="flex items-center gap-2 text-xs"><span aria-hidden className="h-3 w-3 shrink-0 border" style={{ backgroundColor: z.cor }} />{z.code}</li>)}</ul></div>)}</div>}
          </div>;
        })}</div></details>}
        <div className="border-t pt-5">{selected ? selected.kind === "distrito" ? <><h3 className="text-lg font-bold">{selected.nome}</h3><dl className="mt-3 space-y-2 text-sm"><div className="flex justify-between gap-2"><dt>{e.area}</dt><dd>{fmt1(selected.area)} km²</dd></div>{([["empresas", e.companies], ["empregos", e.jobs]] as const).filter(([k]) => typeof selected.props[k] === "number").map(([k, label]) => <div key={k} className="flex justify-between gap-2"><dt>{label}</dt><dd>{Number(selected.props[k]).toLocaleString(loc)}</dd></div>)}</dl><Button asChild variant="link" className="mt-3 h-auto whitespace-normal px-0 text-left"><Link to="/mapa">{e.opportunities} →</Link></Button></>
          : selected.kind === "corredor" ? <><h3 className="text-lg font-bold">{selected.nome}</h3><dl className="mt-3 text-sm"><div className="flex justify-between gap-2"><dt>{e.extent}</dt><dd>{fmt1(selected.extensao)} km</dd></div></dl></>
          : <><h3 className="text-lg font-bold">{selected.codigo}</h3>{descricaoZonas[selected.codigo as keyof typeof descricaoZonas] && <p className="mt-2 text-sm">{descricaoZonas[selected.codigo as keyof typeof descricaoZonas]}</p>}<dl className="mt-3 text-sm"><div className="flex justify-between gap-2"><dt>{e.zoneArea}</dt><dd>{fmt1(selected.area)} km²</dd></div></dl><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{e.zoneNotice}</p></>
          : <p className="text-sm text-muted-foreground">{e.mapSelect}</p>}</div>
      </aside>
    </div>
    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
      {(active.includes("distritosIndustriais") || active.includes("corredoresViarios")) && visible.some(k => k !== "zoneamento" && active.includes(k)) && <p>{osmSource}</p>}
      {active.includes("zoneamento") && available.zoneamento && <p>{e.source}: {fontesMapa.zoneamento[lang]} · {e.updatedAt} {fontesMapa.atualizadoEm}</p>}
    </div>
  </div>;
}
