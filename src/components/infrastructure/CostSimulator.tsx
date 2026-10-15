import { useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { Calculator, Download, MessageSquare } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterSelect } from '@/components/companies/CompanyFilters';
import { Source } from '@/components/economy/ChartPanel';
import { useI18n } from '@/i18n';
import { atividades, calculateCosts, simulationData, type Filters, type CostLine, type SimulationInput } from '@/data/infraestrutura';
export function CostSimulator({ filters }: { filters: Filters }) {
  const { t, lang } = useI18n(); const c = t.infrastructure; const data = simulationData(filters);
  const available = atividades.filter(a => calculateCosts({ atividade: a.id, area: 1, energia: 1, agua: 1, empregados: 1, faturamento: 1 }, data).length > 0);
  const [input, setInput] = useState<SimulationInput>({ atividade: filters.atividade === 'all' ? available[0]?.id ?? '' : filters.atividade, area: 0, energia: 0, agua: 0, empregados: 0, faturamento: 0 });
  const [result, setResult] = useState<CostLine[]>([]);
  const money = (v: number) => v.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', { style: 'currency', currency: 'BRL' });
  if (!available.length) return null;
  const submit = (event: FormEvent) => { event.preventDefault(); setResult(calculateCosts(input, data)); };
  const printResult = () => {
    const frame = document.createElement('iframe'); frame.hidden = true; document.body.appendChild(frame); const doc = frame.contentDocument;
    if (!doc) { frame.remove(); return; }
    const heading = doc.createElement('h1'); heading.textContent = c.result; doc.body.appendChild(heading);
    const summary = doc.createElement('p'); summary.textContent = Object.entries(input).map(([key, value]) => `${key === 'atividade' ? c.activity : c[key === 'area' ? 'area' : key === 'energia' ? 'energy' : key === 'agua' ? 'water' : key === 'empregados' ? 'employees' : 'revenue']}: ${key === 'atividade' ? atividades.find(a => a.id === value)?.nome[lang] ?? value : value}`).join(' · '); doc.body.appendChild(summary);
    for (const line of result) { const p = doc.createElement('p'); p.textContent = `${c.costLabels[line.id]}: ${money(line.valor)} — ${line.fontes.map(f => `${t.source.fonte}: ${f.fonte} · ${t.source.dados} ${f.dataReferencia} · ${t.source.atualizado} ${f.atualizadoEm}`).join('; ')}`; doc.body.appendChild(p); }
    const total = doc.createElement('h2'); total.textContent = `${c.total}: ${money(result.reduce((sum, line) => sum + line.valor, 0))}`; doc.body.appendChild(total);
    const note = doc.createElement('p'); note.textContent = `${c.warning} ${c.method}`; doc.body.appendChild(note);
    frame.contentWindow?.focus(); frame.contentWindow?.print(); setTimeout(() => frame.remove(), 60000);
  };
  return <div id="infrastructure-simulator" className="infrastructure-section mt-8 border-t pt-8"><h3 className="mb-5 text-xl font-bold">{c.simulator}</h3><form onSubmit={submit} className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-3"><FilterSelect label={c.activity} value={input.atividade} options={available.map(a => ({ id: a.id, name: a.nome[lang] }))} onChange={atividade => { setInput(v => ({ ...v, atividade })); setResult([]); }} />{(['area', 'energia', 'agua', 'empregados', 'faturamento'] as const).map(key => <label key={key} className="min-w-0 text-sm font-semibold">{c[key === 'area' ? 'area' : key === 'energia' ? 'energy' : key === 'agua' ? 'water' : key === 'empregados' ? 'employees' : 'revenue']}<Input required type="number" min="0" step={key === 'empregados' ? '1' : 'any'} className="mt-2" value={input[key]} onChange={e => { setInput(v => ({ ...v, [key]: Number(e.target.value) })); setResult([]); }} /></label>)}<Button type="submit"><Calculator />{c.calculate}</Button></form>{result.length > 0 && <div className="mt-8" aria-live="polite"><h3 className="text-xl font-bold">{c.result}</h3><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.map(line => <article key={line.id} className="rounded-lg border bg-card p-5"><h4 className="font-sans font-semibold">{c.costLabels[line.id]}</h4><p className="my-4 text-2xl font-bold text-orange">{money(line.valor)}</p>{line.fontes.map((source, i) => <Source key={i} data={source} />)}</article>)}</div><div className="mt-6 h-80" role="img" aria-label={c.result}><ResponsiveContainer width="100%" height="100%"><BarChart data={result.map(line => ({ nome: c.costLabels[line.id], valor: line.valor }))}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="nome" /><YAxis width={85} /><Tooltip formatter={(value: number) => money(value)} contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)' }} /><Bar dataKey="valor" name={c.value} fill="var(--orange)" /></BarChart></ResponsiveContainer></div><p className="mt-4 text-xl font-bold">{c.total}: {money(result.reduce((sum, line) => sum + line.valor, 0))}</p><p className="mt-4 text-sm text-muted-foreground">{c.warning}</p>{result.some(r => r.id === 'folha') && <p className="mt-2 text-xs text-muted-foreground">{c.payrollNote}</p>}<div className="mt-5 flex flex-wrap gap-3"><Button variant="outline" onClick={printResult}><Download />{c.pdf}</Button><Button asChild><Link to="/contato"><MessageSquare />{t.nav.contact}</Link></Button></div></div>}</div>;
}
