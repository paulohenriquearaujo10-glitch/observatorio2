import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Source } from '@/components/economy/ChartPanel';
import { empresasExemplo, findSuppliers } from '@/data/empresas-exemplo';
import { portes, type Filters } from '@/data/empresas-cadeias';
import { useI18n } from '@/i18n';
import { FilterSelect } from './CompanyFilters';
import { CompanyTable } from './CompanyTable';
export function SupplierDirectory({ filters }: { filters: Filters }) {
 const { t, lang } = useI18n(); const c = t.companies; const [query, setQuery] = useState(''); const [bairro, setBairro] = useState('all'); const [page, setPage] = useState(1);
 if (!empresasExemplo.length) return null;
 const results = findSuppliers(empresasExemplo, filters, query, bairro); const pages = Math.max(1, Math.ceil(results.length / 20)); const current = Math.min(page, pages); const rows = results.slice((current - 1) * 20, current * 20);
 const bairros = [...new Set(empresasExemplo.map(s => s.bairro))].sort();
 return <div><div className="mb-6 grid items-end gap-4 md:grid-cols-[2fr_1fr]"><div><label htmlFor="supplier-search" className="mb-1.5 block text-xs font-semibold">{c.search}</label><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="supplier-search" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} className="pl-10" /></div></div><FilterSelect label={c.neighborhood} value={bairro} onChange={v => { setBairro(v); setPage(1); }} options={[{ id: 'all', name: c.all }, ...bairros.map(name => ({ id: name, name }))]} /></div>
 <p className="mb-5 text-xs text-muted-foreground">{c.publicOnly}</p>{rows.length ? <div className="grid gap-4 md:grid-cols-2">{rows.map(row => <article key={row.id} className="rounded-lg border bg-card p-5"><h3 className="font-bold">{row.nomeFantasia || row.razaoSocial}</h3>{row.nomeFantasia && <p className="mt-1 text-xs text-muted-foreground">{row.razaoSocial}</p>}<p className="mt-3 text-sm">{row.atividade}</p><p className="mt-2 text-sm text-muted-foreground">{row.bairro} · {portes.find(p => p.id === row.porte)?.nome[lang]}</p><Button asChild variant="link" className="mt-3 px-0"><Link to="/mapa"><MapPin />{t.economy.opportunities}</Link></Button><Source data={row} /></article>)}</div> : <div className="border-l-2 border-orange py-3 pl-4"><p>{c.noResults}</p><Button variant="link" className="px-0" onClick={() => { setQuery(''); setBairro('all'); setPage(1); }}>{t.economy.reset}</Button></div>}
 {pages > 1 && <nav className="my-5 flex items-center justify-center gap-4" aria-label={c.page}><Button variant="outline" size="icon" aria-label={c.previous} disabled={current === 1} onClick={() => setPage(current - 1)}><ChevronLeft /></Button><span className="text-sm">{c.page} {current} / {pages}</span><Button variant="outline" size="icon" aria-label={c.nextPage} disabled={current === pages} onClick={() => setPage(current + 1)}><ChevronRight /></Button></nav>}
 {results.length > 0 && <div className="mt-8"><CompanyTable title={c.sections.fornecedores} id="fornecedores-contagem" rows={results.map(r => ({ ...r }))} columns={[{ key: 'razaoSocial', label: c.sections.fornecedores }, { key: 'atividade', label: c.activity }, { key: 'bairro', label: c.neighborhood }]} /></div>}
 <Button asChild variant="link" className="mt-5 h-auto whitespace-normal px-0 text-left"><Link to="/contato">{c.correction}</Link></Button></div>;
}
