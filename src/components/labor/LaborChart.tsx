import { useRef, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowLeft, Download, ImageDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Source, seriesColors } from '@/components/economy/ChartPanel';
import { chartRows, downloadCsv, downloadPng } from '@/components/economy/exports';
import { hasChart, type LaborChart as Chart } from '@/data/trabalho-qualificacao';
import { useI18n } from '@/i18n';
export function LaborChart({ chart, compare }: { chart: Chart; compare: string[] }) {
  const { t, lang } = useI18n(); const ref = useRef<HTMLDivElement>(null); const [hidden, setHidden] = useState<string[]>([]); const [detail, setDetail] = useState<Chart | null>(null);
  const keys = chart.chaves.filter(k => (!k.cidade || k.cidade === 'contagem' || compare.includes(k.cidade)) && chart.serie.some(p => p.valores[k.id] != null));
  if (!hasChart(chart) || !keys.length) return null;
  if (detail) return <div><Button variant="ghost" onClick={() => setDetail(null)}><ArrowLeft />{chart.titulo[lang]}</Button><LaborChart chart={detail} compare={compare} /></div>;
  const horizontal = chart.tipo === 'horizontal' || chart.tipo === 'pyramid'; const percentage = chart.modos?.includes('percentage');
  const data = chart.serie.map(p => { const sum = keys.reduce((n, k) => n + Math.abs(p.valores[k.id] ?? 0), 0); return { periodo: p.periodo, ...Object.fromEntries(keys.map(k => { const value = p.valores[k.id]; return [k.id, value == null ? null : k.negative ? -Math.abs(value) : percentage ? sum ? value / sum * 100 : null : value]; })) }; });
  const color = (id: string, city: string | undefined, i: number) => city === 'contagem' || id === 'contagem' || !city && i === 0 ? seriesColors[0] : seriesColors[1 + i % (seriesColors.length - 1)];
  const rows = chartRows({ ...chart, section: 'mercado' }, chart.serie, keys.map(k => k.id));
  return <article ref={ref} className="min-w-0 rounded-lg border bg-card p-5 md:p-6"><h3 className="text-lg font-bold">{chart.titulo[lang]}</h3><p className="mt-2 text-sm text-muted-foreground">{chart.salarioTipo === 'estoque' ? t.labor.stockWage : chart.salarioTipo === 'contratacao' ? t.labor.hiringWage : chart.unidade}</p>
    {chart.periodicidade === 'monthly' && <p className="mt-3 text-sm font-semibold text-orange">{t.labor.through}: {chart.serie.map(p => p.periodo).sort().at(-1)}</p>}
    <div className="mt-5 h-80 w-full" role="img" aria-label={chart.titulo[lang]}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 5, right: 15, bottom: 25, left: 5 }} onClick={state => { const label = state?.activeLabel; const target = label ? chart.drilldown?.[String(label)] : undefined; if (target && hasChart(target)) setDetail(target); }}>
      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} /><XAxis type={horizontal ? 'number' : 'category'} {...(horizontal ? {} : { dataKey: 'periodo' })} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} /><YAxis type={horizontal ? 'category' : 'number'} {...(horizontal ? { dataKey: 'periodo' } : {})} width={horizontal ? 115 : 65} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} label={{ value: horizontal ? '' : chart.unidade, angle: -90, position: 'insideLeft', fill: 'var(--muted-foreground)' }} /><ReferenceLine {...(horizontal ? { x: 0 } : { y: 0 })} stroke="var(--muted-foreground)" /><Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)' }} formatter={(v: number) => `${v.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', { maximumFractionDigits: 2 })} ${chart.unidade}`} />
      {keys.map((k, i) => chart.tipo === 'line' || chart.tipo === 'trade' && k.id === 'saldo' ? <Line key={k.id} dataKey={k.id} name={k.nome[lang]} stroke={color(k.id, k.cidade, i)} strokeWidth={2.5} dot={false} connectNulls={false} hide={hidden.includes(k.id)} /> : <Bar key={k.id} dataKey={k.id} name={k.nome[lang]} fill={color(k.id, k.cidade, i)} hide={hidden.includes(k.id)} {...(chart.tipo === 'stacked' || chart.tipo === 'pyramid' ? { stackId: 'total' } : {})} />)}
    </ComposedChart></ResponsiveContainer></div>
    <div className="flex flex-wrap gap-1" data-export-exclude="true">{keys.map((k, i) => <Button key={k.id} size="sm" variant="ghost" className={hidden.includes(k.id) ? 'opacity-40' : ''} aria-pressed={!hidden.includes(k.id)} onClick={() => setHidden(v => v.includes(k.id) ? v.filter(id => id !== k.id) : [...v, k.id])}><svg width="10" height="10" aria-hidden><circle cx="5" cy="5" r="4" fill={color(k.id, k.cidade, i)} /></svg>{k.nome[lang]}</Button>)}</div>
    <div className="mt-4 flex flex-wrap gap-2" data-export-exclude="true"><Button size="sm" variant="outline" onClick={() => downloadCsv(rows, chart.id)}><Download />{t.economy.csv}</Button><Button size="sm" variant="ghost" onClick={async () => { try { if (ref.current) await downloadPng(ref.current, chart.id); } catch { toast.error(t.economy.exportError); } }}><ImageDown />{t.economy.png}</Button></div><div className="mt-4 border-t pt-3"><Source data={chart} /></div>
  </article>;
}