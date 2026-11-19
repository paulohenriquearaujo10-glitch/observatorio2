import { useMemo, useRef, useState } from "react";
import { Bar, Cell, CartesianGrid, ComposedChart, Legend, Line, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { MoreHorizontal, Download, ImageDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/i18n";
import type { ChartData, Point } from "@/data/economia-territorio";
import { chartRows, downloadCsv, downloadPng } from "./exports";

export const seriesColors = ["var(--orange)", "var(--chart-blue)", "var(--chart-gray)", "var(--chart-steel)", "var(--chart-teal)", "var(--chart-light-blue)", "var(--chart-dark-gray)"];
export function Source({ data }: { data: { fonte: string; dataReferencia: string; atualizadoEm: string } }) {
  const { t } = useI18n(); return <p className="text-xs leading-relaxed text-muted-foreground">{t.source.fonte}: {data.fonte} · {t.source.dados} {data.dataReferencia} · {t.source.atualizado} {data.atualizadoEm}</p>;
}
export function filteredPoints(chart: ChartData, period: [number, number], scope: string): Point[] {
  if (chart.tipo === "pyramid") return chart.serie;
  if (chart.corPorMunicipio) return chart.serie.filter(p => Number(p.recorte) >= period[0] && Number(p.recorte) <= period[1]);
  return chart.serie.filter(p => { const year = Number(p["periodo"].slice(0, 4)); return (!Number.isFinite(year) || year >= period[0] && year <= period[1]) && (chart.recortes?.includes(scope) ? p.recorte === scope : !p.recorte || p.recorte === "municipio"); });
}
export function chartValue(chart: ChartData, point: Point, key: string, mode: string, keys: string[]): number | null {
  const value = point.valores[key];
  if (value == null) return null;
  const base = chart.serie.find(p => p["periodo"] === chart.indexBase)?.valores[key] ?? chart.serie[0]?.valores[key];
  const total = chart.totalKey ? point.valores[chart.totalKey] : keys.reduce((n, k) => n + Math.abs(point.valores[k] ?? 0), 0);
  if (mode === "index") return base ? value / base * 100 : null;
  if (mode === "percentage") return total ? value / total * 100 : null;
  return value / (chart.divisor ?? 1);
}
export function ChartPanel({ chart: primary, alternative, compare, period, scope }: { chart: ChartData; alternative?: ChartData | undefined; compare: string[]; period: [number, number]; scope: string }) {
  const { t, lang } = useI18n(); const e = t.economy;
  const [perCapita, setPerCapita] = useState(false);
  const chart = perCapita && alternative ? alternative : primary;
  const [mode, setMode] = useState("value"); const [hidden, setHidden] = useState<string[]>([]); const [census, setCensus] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const points = useMemo(() => filteredPoints(chart, period, scope), [chart, period, scope]);
  const keys = chart.chaves.filter(k => (!k.cidade || k.cidade === "contagem" || compare.includes(k.cidade)) && points.some(p => p.valores[k.id] !== null && p.valores[k.id] !== undefined));
  const years = [...new Set(points.map(p => p.recorte).filter((v): v is string => Boolean(v)))];
  const selectedPoints = chart.tipo === "pyramid" && years.length ? points.filter(p => p.recorte === (census || years.at(-1))) : points;
  const data = selectedPoints.map(p => {
    const values: Record<string, string | number | null> = { periodo: p["periodo"] };
    keys.forEach(k => { const value = chartValue(chart, p, k.id, mode, keys.map(k => k.id)); values[k.id] = value == null ? null : k.negative ? -Math.abs(value) : value; });
    return values;
  });
  if (!data.length || !keys.length) return null;
  const unit = mode === "value" ? chart.unidadeTela?.[lang] ?? chart.unidade : mode === "index" ? "100" : "%";
  const visibleKeys = keys.filter(k => !hidden.includes(k.id));
  const color = (id: string, i: number) => id === "contagem" || i === 0 && !keys.some(k => k.id === "contagem") ? seriesColors[0] : seriesColors[1 + (i % (seriesColors.length - 1))];
  const toggleKey = (id: string) => setHidden(h => h.includes(id) ? h.filter(v => v !== id) : [...h, id]);
  const legend = <Legend onClick={entry => { if (typeof entry.dataKey === "string") toggleKey(entry.dataKey); }} wrapperStyle={{ cursor: "pointer" }} />;
  const tooltip = <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "6px" }} formatter={(value: number) => `${Math.abs(value).toLocaleString(lang === "pt" ? "pt-BR" : "en-US", { minimumFractionDigits: chart.divisor && mode === "value" ? 1 : 0, maximumFractionDigits: chart.divisor && mode === "value" ? 1 : 2 })} ${unit}`} />;
  return <article ref={ref} className="min-w-0 rounded-lg border bg-card p-5 md:p-6">
    <div className="mb-5 flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold">{chart.titulo[lang]}</h3><p className="mt-1 text-sm text-muted-foreground">{chart.metrica[lang]} · {unit}</p></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button data-export-exclude="true" aria-label={`${e.chartMenu}: ${chart.titulo[lang]}`} size="icon" variant="ghost"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => downloadCsv(chartRows(chart, selectedPoints, keys.map(k => k.id)), chart.id)}><Download />{e.csv}</DropdownMenuItem><DropdownMenuItem onSelect={async () => { try { if (ref.current) await downloadPng(ref.current, chart.id); } catch { toast.error(e.exportError); } }}><ImageDown />{e.png}</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
    </div>
    {alternative && <div className="mb-3 flex flex-wrap gap-1" data-export-exclude="true"><Button size="sm" variant={!perCapita ? "default" : "outline"} aria-pressed={!perCapita} onClick={() => setPerCapita(false)}>{e.kpis.pib}</Button><Button size="sm" variant={perCapita ? "default" : "outline"} aria-pressed={perCapita} onClick={() => setPerCapita(true)}>{e.kpis.pibPc}</Button></div>}
    {chart.modos && <div className="mb-5 flex flex-wrap gap-1" data-export-exclude="true">{chart.modos.map(m => <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} aria-pressed={mode === m} onClick={() => setMode(m)}>{m === "value" ? e.value : m === "index" ? chart.indexBase ? e.index2010 : e.index : e.percentage}</Button>)}</div>}
    {chart.tipo === "pyramid" && years.length > 1 && <Select value={census || years.at(-1) || ""} onValueChange={setCensus}><SelectTrigger aria-label="Censo / Census" className="mb-4 w-36"><SelectValue /></SelectTrigger><SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent></Select>}
    <div className={chart.tipo === "pyramid" ? "h-[420px] w-full" : "h-72 w-full"} role="img" aria-label={`${chart.titulo[lang]} (${unit})`}>
      <ResponsiveContainer width="100%" height="100%">
        {chart.tipo === "radar" ? <RadarChart data={data}><PolarGrid stroke="var(--border)" /><PolarAngleAxis dataKey="periodo" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><PolarRadiusAxis />{tooltip}{keys.map((k, i) => <Radar key={k.id} dataKey={k.id} name={k.nome[lang]} stroke={color(k.id, i)} fill={color(k.id, i)} fillOpacity={0.12} hide={hidden.includes(k.id)} />)}{legend}</RadarChart> :
          <ComposedChart data={data} stackOffset="sign" layout={chart.tipo === "horizontal" || chart.tipo === "pyramid" ? "vertical" : "horizontal"} margin={{ top: 10, right: 15, left: 0, bottom: 16 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis {...(chart.tipo === "horizontal" || chart.tipo === "pyramid" ? {} : { dataKey: "periodo" })} type={chart.tipo === "horizontal" || chart.tipo === "pyramid" ? "number" : "category"} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} label={{ value: chart.tipo === "horizontal" || chart.tipo === "pyramid" ? unit : "", position: "insideBottom", offset: -5, fill: "var(--muted-foreground)" }} />
            <YAxis {...(chart.tipo === "horizontal" || chart.tipo === "pyramid" ? { dataKey: "periodo", interval: 0 } : {})} type={chart.tipo === "horizontal" || chart.tipo === "pyramid" ? "category" : "number"} width={chart.corPorMunicipio ? 105 : 75} tick={{ fill: "var(--muted-foreground)", fontSize: chart.tipo === "pyramid" ? 9 : 11 }} tickFormatter={v => typeof v === "number" ? new Intl.NumberFormat(lang, { notation: "compact" }).format(Math.abs(v)) : v} label={{ value: chart.tipo === "horizontal" || chart.tipo === "pyramid" ? "" : unit, angle: -90, position: "insideLeft", fill: "var(--muted-foreground)" }} />
            <ReferenceLine {...(chart.tipo === "pyramid" ? { x: 0 } : { y: 0 })} stroke="var(--muted-foreground)" />{tooltip}{chart.tipo !== "pyramid" && legend}
            {keys.map((k, i) => chart.tipo === "line" || chart.tipo === "sparkline" || chart.tipo === "trade" && k.id === "saldo" ? <Line key={k.id} dataKey={k.id} name={k.nome[lang]} stroke={color(k.id, i)} strokeWidth={2.5} dot={chart.id === "populacao"} hide={hidden.includes(k.id)} connectNulls={false} /> : <Bar key={k.id} dataKey={k.id} name={k.nome[lang]} fill={color(k.id, i)} {...(chart.tipo === "stacked" || chart.tipo === "pyramid" ? { stackId: "total" } : {})} hide={hidden.includes(k.id)}>{chart.corPorMunicipio && data.map(p => <Cell key={String(p["periodo"])} fill={p["periodo"] === "Contagem" ? seriesColors[0] : seriesColors[1]} />)}</Bar>)}
          </ComposedChart>}
      </ResponsiveContainer>
    </div>
    <div className="mt-2 flex flex-wrap gap-3" data-export-exclude="true">{keys.map((k, i) => <Button key={k.id} size="sm" variant="ghost" className={hidden.includes(k.id) ? "opacity-40" : ""} onClick={() => toggleKey(k.id)} aria-pressed={visibleKeys.includes(k)}><svg width="10" height="10" aria-hidden><circle cx="5" cy="5" r="4" fill={color(k.id, i)} /></svg>{k.nome[lang]}</Button>)}</div>
    <div className="mt-4 border-t pt-3"><Source data={chart.tipo === "pyramid" ? { ...chart, dataReferencia: census || years.at(-1) || chart.dataReferencia } : chart} />{chart.nota && <p className="mt-2 text-xs text-muted-foreground">{chart.nota[lang]}</p>}{scope !== "municipio" && !chart.recortes?.includes(scope) && <p className="mt-1 text-xs text-muted-foreground">{e.municipalOnly}</p>}</div>
  </article>;
}