import { useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Download, ImageDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Source } from '@/components/economy/ChartPanel';
import { downloadCsv, downloadPng } from '@/components/economy/exports';
import { cadeias } from '@/data/empresas-cadeias';
import { useI18n } from '@/i18n';
export function ChainDiagram() {
 const { t, lang } = useI18n(); const c = t.companies; const ref = useRef<HTMLDivElement>(null); const available = cadeias.filter(v => v.elos.length); const [selected, setSelected] = useState(''); const chain = available.find(v => v.id === selected) ?? available[0];
 if (!chain) return null;
 const gaps = chain.elos.filter(v => v.status !== 'presente');
 return <div><div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label={c.sections.cadeias}>{available.map(v => <Button key={v.id} role="tab" aria-selected={v.id === chain.id} variant={v.id === chain.id ? 'default' : 'outline'} onClick={() => setSelected(v.id)}>{v.nome[lang]}</Button>)}</div>
 <div ref={ref}><h3 className="mb-5 text-xl font-bold">{chain.nome[lang]}</h3><div className="grid gap-4 md:grid-cols-4">{(['insumos', 'producao', 'distribuicao', 'apoio'] as const).map((stage, index) => <div key={stage}><div className="mb-3 flex items-center justify-between gap-2"><h4 className="font-sans text-sm font-bold">{c.stages[stage]}</h4>{index < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}</div><div className="space-y-3">{chain.elos.filter(v => v.etapa === stage).map(link => <article key={link.id} className={`rounded-lg border border-l-4 bg-card p-4 ${link.status === 'presente' ? 'border-l-chain-present' : link.status === 'fraco' ? 'border-l-chain-weak' : 'border-l-orange'}`}><p className="text-xs font-bold text-muted-foreground">{c.status[link.status]}</p><h4 className="mt-2 font-sans font-bold">{link.nome[lang]}</h4>{link.valor !== null && <p className="mt-2 text-sm">{link.valor.toLocaleString(lang)} {c.companiesUnit}</p>}{link.empregos !== null && <p className="text-sm">{link.empregos.toLocaleString(lang)} {c.jobsUnit}</p>}<div className="mt-3"><Source data={link} /></div></article>)}</div></div>)}</div></div>
 <div className="mt-5 flex flex-wrap gap-3"><Button variant="outline" onClick={() => downloadCsv(chain.elos.map(({ nome, comprasExternas, ...row }) => ({ ...row, nome: nome[lang], comprasExternas: comprasExternas?.[lang] ?? '' })), chain.id)}><Download />{t.economy.csv}</Button><Button variant="ghost" onClick={async () => { try { if (ref.current) await downloadPng(ref.current, chain.id); } catch { toast.error(t.economy.exportError); } }}><ImageDown />{t.economy.png}</Button></div>
 {gaps.length > 0 && <div className="mt-8 border-t pt-6"><h3 className="text-xl font-bold">{c.gaps}</h3><ul className="mt-4 space-y-4">{gaps.map(g => <li key={g.id} className="border-l-2 border-orange pl-4"><strong>{g.nome[lang]}</strong>{g.comprasExternas && <p className="mt-1 text-sm text-muted-foreground">{c.externalPurchases}: {g.comprasExternas[lang]}</p>}</li>)}</ul><div className="mt-5 flex flex-wrap gap-4"><Button asChild variant="outline"><Link to="/mapa">{c.mapAction}<ArrowRight /></Link></Button><Button asChild variant="link"><Link to="/contato">{t.economy.contact}</Link></Button></div></div>}
 </div>;
}
