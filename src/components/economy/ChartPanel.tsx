import { useMemo, useRef, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
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
  return chart.serie.filter(p => { const year = Number(p.periodo.slice(0, 4)); return (!Number.isFinite(year) || year >= period[0] && year <= period[1]) && (chart.recortes?.includes(scope) ? p.recorte === scope : !p.recorte || p.recorte === "municipio"); });
}
export function ChartPanel({ chart, compare, period, scope }: { chart: ChartData; compare: string[]; period: [number, number]; scope: string }) {
  const { t, lang } = useI18n(); const e = t.economy;
  const [mode, setMode] = useState("value"); const [hidden, setHidden] = useState<string[]>([]); const [census, setCensus] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const points = useMemo(() => filteredPoints(chart, period, scope), [chart, period, scope]);
  const keys = chart.chaves.filter(k => (!k.cidade || k.cidade === "contagem" || compare.includes(k.cidade)) && points.some(p => p.valores[k.id] !== null && p.valores[k.id] !== undefined));
  const years = [...new Set(points.map(p => p.recorte).filter((v): v is string => Boolean(v)))];
  const selectedPoints = chart.tipo === "pyramid" && years.length ? points.filter(p => p.recorte === (census || years.at(-1))) : points;
  const data = selectedPoints.map(p => {
    const values: Record<string, string | number | null> = { periodo: p.periodo };
    const sum = keys.reduce((n, k) => n + Math.abs(p.valores[k.id] ?? 0), 0);
    keys.forEach(k => { const value = p.valores[k.id]; const base = selectedPoints[0]?.valores[k.id]; values[k.id] = value == null ? null : mode === "index" ? base ? value / base * 100 : null : mode === "percentage" ? sum ? value / sum * 100 : null : k.negative ? -Math.abs(value) : value; });
    return values;
  });
  if (!data.length || !keys.length) return null;
  const unit = mode === "value" ? chart.unidade : mode === "index" ? "100" : "%";
  const visibleKeys = keys.filter(k => !hidden.includes(k.id));
  const color = (id: string, i: number) => id === "contagem" || i === 0 && !keys.some(k => k.id === "contagem") ? seriesColors[0] : seriesColors[1 + (i % (seriesColors.length - 1))];
  const toggleKey = (id: string) => setHidden(h => h.includes(id) ? h.filter(v => v !== id) : [...h, id]);
  const legend = <Legend onClick={entry => { if (typeof entry.dataKey === "string") toggleKey(entry.dataKey); }} wrapperStyle={{ cursor: "pointer" }} />;
  const tooltip = <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "6px" }} formatter={(value: number) => `${Math.abs(value).toLocaleString(lang === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 2 })} ${unit}`} />;
  return <article ref={ref} className="min-w-0 rounded-lg border bg-card p-5 md:p-6">
    <div className="mb-5 flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold">{chart.titulo[lang]}</h3><p className="mt-1 text-sm text-muted-foreground">{chart.metrica[lang]} · {unit}</p></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button data-export-exclude="true" aria-label={`${e.chartMenu}: ${chart.titulo[lang]}`} size="icon" variant="ghost"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => downloadCsv(chartRows(chart, selectedPoints, keys.map(k => k.id)), chart.id)}><Download />{e.csv}</DropdownMenuItem><DropdownMenuItem onSelect={async () => { try { if (ref.current) await downloadPng(ref.current, chart.id); } catch { toast.error(e.exportError); } }}><ImageDown />{e.png}</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
    </div>
    {chart.modos && <div className="mb-5 flex flex-wrap gap-1" data-export-exclude="true">{chart.modos.map(m => <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} aria-pressed={mode === m} onClick={() => setMode(m)}>{m === "value" ? e.value : m === "index" ? e.index : e.percentage}</Button>)}</div>}
    {chart.tipo === "pyramid" && years.length > 1 && <Select value={census || years.at(-1)} onValueChange={setCensus}><SelectTrigger aria-label="Censo / Census" className="mb-4 w-36"><SelectValue /></SelectTrigger><SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent></Select>}
    <div className="h-72 w-full" role="img" aria-label={`${chart.titulo[lang]} (${unit})`}>
      <ResponsiveContainer width="100%" height="100%">
        {chart.tipo === "radar" ? <RadarChart data={data}><PolarGrid stroke="var(--border)" /><PolarAngleAxis dataKey="periodo" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><PolarRadiusAxis />{tooltip}{keys.map((k, i) => <Radar key={k.id} dataKey={k.id} name={k.nome[lang]} stroke={color(k.id, i)} fill={color(k.id, i)} fillOpacity={0.12} hide={hidden.includes(k.id)} />)}{legend}</RadarChart> :
          <ComposedChart data={data} layout={chart.tipo === "horizontal" || chart.tipo === "pyramid" ? "vertical" : "horizontal"} margin={{ top: 10, right: 15, left: 0, bottom: 16 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={chart.tipo === "horizontal" || chart.tipo === "pyramid" ? undefined : "periodo"} type={chart.tipo === "horizontal" || chart.tipo === "pyramid" ? "number" : "category"} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} label={{ value: chart.tipo === "horizontal" || chart.tipo === "pyramid" ? unit : "", position: "bottom", fill: "var(--muted-foreground)" }} />
            <YAxis dataKey={chart.tipo === "horizontal" || chart.tipo === "pyramid" ? "periodo" : undefined} type={chart.tipo === "horizontal" || chart.tipo === "pyramid" ? "category" : "number"} width={75} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={v => typeof v === "number" ? new Intl.NumberFormat(lang, { notation: "compact" }).format(Math.abs(v)) : v} label={{ value: chart.tipo === "horizontal" || chart.tipo === "pyramid" ? "" : unit, angle: -90, position: "insideLeft", fill: "var(--muted-foreground)" }} />
            <ReferenceLine y={chart.tipo === "horizontal" || chart.tipo === "pyramid" ? undefined : 0} x={chart.tipo === "pyramid" ? 0 : undefined} stroke="var(--muted-foreground)" />{tooltip}{legend}
            {keys.map((k, i) => chart.tipo === "line" || chart.tipo === "sparkline" || chart.tipo === "trade" && k.id === "saldo" ? <Line key={k.id} dataKey={k.id} name={k.nome[lang]} stroke={color(k.id, i)} strokeWidth={2.5} dot={false} hide={hidden.includes(k.id)} connectNulls={false} /> : <Bar key={k.id} dataKey={k.id} name={k.nome[lang]} fill={color(k.id, i)} stackId={chart.tipo === "stacked" || chart.tipo === "pyramid" ? "total" : undefined} hide={hidden.includes(k.id)} />)}
          </ComposedChart>}
      </ResponsiveContainer>
    </div>
    <div className="mt-2 flex flex-wrap gap-3" data-export-exclude="true">{keys.map((k, i) => <Button key={k.id} size="sm" variant="ghost" className={hidden.includes(k.id) ? "opacity-40" : ""} onClick={() => toggleKey(k.id)} aria-pressed={visibleKeys.includes(k)}><svg width="10" height="10" aria-hidden><circle cx="5" cy="5" r="4" fill={color(k.id, i)} /></svg>{k.nome[lang]}</Button>)}</div>
    <div className="mt-4 border-t pt-3"><Source data={chart} />{scope !== "municipio" && !chart.recortes?.includes(scope) && <p className="mt-1 text-xs text-muted-foreground">{e.municipalOnly}</p>}</div>
  </article>;
}