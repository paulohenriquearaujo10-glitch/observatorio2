import { useRef, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { ArrowLeft, Download, ImageDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ChartPanel, Source, seriesColors } from '@/components/economy/ChartPanel';
import { downloadCsv, downloadPng } from '@/components/economy/exports';
import { type CompanyChart as Chart, hasChart } from '@/data/empresas-cadeias';
import { useI18n } from '@/i18n';
export function CompanyChart({ chart, compare }: { chart: Chart; compare: string[] }) {
 const { t, lang } = useI18n(); const ref = useRef<HTMLDivElement>(null); const [detail, setDetail] = useState<Chart | null>(null);
 if (!hasChart(chart)) return null;
 if (detail) return <div><Button variant="ghost" className="mb-3" onClick={() => setDetail(null)}><ArrowLeft />{chart.titulo[lang]}</Button><CompanyChart chart={detail} compare={compare} /></div>;
 if (chart.tipo !== 'donut' && chart.tipo !== 'scatter') return <ChartPanel chart={{ ...chart, tipo: chart.tipo, section: 'economia' }} compare={compare} period={[0, 9999]} scope="municipio" />;
 const keys = chart.chaves.filter(k => !k.cidade || k.cidade === 'contagem' || compare.includes(k.cidade));
 const rows = chart.serie.map(p => ({ name: p.periodo, ...p.valores }));
 const valueKey = keys[0]?.id ?? 'valor';
 return <article ref={ref} className="min-w-0 rounded-lg border bg-card p-5 md:p-6"><h3 className="text-lg font-bold">{chart.titulo[lang]}</h3><p className="mt-1 text-sm text-muted-foreground">{chart.metrica[lang]} · {chart.unidade}</p>
 <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%">{chart.tipo === 'donut' ? <PieChart><Pie data={rows} dataKey={valueKey} nameKey="name" innerRadius={65} outerRadius={100} onClick={(_, index) => { const point = chart.serie[index]; const target = point && chart.drilldown?.[point.periodo]; if (target && hasChart(target)) setDetail(target); }}>{rows.map((r, i) => <Cell key={r.name} fill={seriesColors[i % seriesColors.length]} />)}</Pie><Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)' }} /></PieChart> : <ScatterChart margin={{ top: 15, right: 20, bottom: 20, left: 5 }}><CartesianGrid stroke="var(--border)" /><XAxis type="number" dataKey="ql" name="QL" tick={{ fill: 'var(--muted-foreground)' }} /><YAxis type="number" dataKey="crescimento" name={t.companies.growth} tick={{ fill: 'var(--muted-foreground)' }} /><ZAxis type="number" dataKey="empregos" range={[60, 500]} /><ReferenceLine x={1} stroke="var(--muted-foreground)" /><ReferenceLine y={0} stroke="var(--muted-foreground)" /><Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)' }} /><Scatter data={rows} fill="var(--orange)" /></ScatterChart>}</ResponsiveContainer></div>
 {chart.tipo === 'scatter' && <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground"><span>{t.companies.potential}</span><span>{t.companies.consolidated}</span><span>{t.companies.emerging}</span><span>{t.companies.declining}</span></div>}
 {chart.tipo === 'donut' && <div className="flex flex-wrap gap-2">{chart.serie.map((p, i) => <Button key={p.periodo} variant="ghost" size="sm" onClick={() => { const target = chart.drilldown?.[p.periodo]; if (target && hasChart(target)) setDetail(target); }}><svg width="10" height="10" aria-hidden><circle cx="5" cy="5" r="4" fill={seriesColors[i % seriesColors.length]} /></svg>{p.periodo}: {p.valores[valueKey]?.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')}</Button>)}</div>}
 <div className="mt-4 flex flex-wrap gap-2" data-export-exclude="true"><Button variant="outline" size="sm" onClick={() => downloadCsv(chart.serie.map(p => ({ ...p.valores, periodo: p.periodo, fonte: chart.fonte, unidade: chart.unidade, dataReferencia: chart.dataReferencia, periodicidade: chart.periodicidade, atualizadoEm: chart.atualizadoEm })), chart.id)}><Download />{t.economy.csv}</Button><Button variant="ghost" size="sm" onClick={async () => { try { if (ref.current) await downloadPng(ref.current, chart.id); } catch { toast.error(t.economy.exportError); } }}><ImageDown />{t.economy.png}</Button></div><div className="mt-4 border-t pt-3"><Source data={chart} /></div></article>;
}
