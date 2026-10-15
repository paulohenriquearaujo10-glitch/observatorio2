import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterSelect } from '@/components/companies/CompanyFilters';
import { ComparisonPicker } from '@/components/economy/Filters';
import { useI18n } from '@/i18n';
import { setores, ocupacoes, type Filters } from '@/data/trabalho-qualificacao';
export function LaborFilters({ filters, onChange, compare, setCompare, reset }: { filters: Filters; onChange: (v: Filters) => void; compare: string[]; setCompare: (v: string[]) => void; reset: () => void }) {
  const { t, lang } = useI18n(); const l = t.labor; const [query, setQuery] = useState(''); const all = { id: 'all', name: t.companies.all };
  const occupations = ocupacoes.filter(o => `${o.nome[lang]} ${o.cbo}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) || o.id === filters.cbo);
  const divisions = setores.find(s => s.id === filters.setor)?.divisoes ?? [];
  return <div className="grid min-w-0 grid-cols-1 items-end gap-3 py-4 sm:grid-cols-2 lg:grid-cols-4">
    <FilterSelect label={t.companies.sector} value={filters.setor} onChange={setor => onChange({ ...filters, setor, cnae: 'all' })} options={[all, ...setores.map(s => ({ id: s.id, name: s.nome[lang] }))]} />
    <div className="min-w-0"><label htmlFor="labor-occupation-search" className="mb-1.5 block text-xs font-semibold">{l.occupation}</label><Input id="labor-occupation-search" value={query} onChange={e => setQuery(e.target.value)} placeholder={l.occupationSearch} aria-label={l.occupationSearch} /><div className="mt-2"><FilterSelect label={l.occupation} value={filters.cbo} onChange={cbo => onChange({ ...filters, cbo })} options={[all, ...occupations.map(o => ({ id: o.id, name: `${o.cbo ? `${o.cbo} · ` : ''}${o.nome[lang]}` }))]} /></div></div>
    <FilterSelect label={l.education} value={filters.escolaridade} onChange={escolaridade => onChange({ ...filters, escolaridade })} options={[all, ...Object.entries(l.educationLevels).map(([id, name]) => ({ id, name }))]} />
    <div className="min-w-0"><p className="mb-1.5 text-xs font-semibold">{t.economy.compare}</p><ComparisonPicker value={compare} onChange={setCompare} /></div>
    <div className="flex min-w-0 gap-3 sm:col-span-2"><label className="min-w-0 flex-1 text-xs font-semibold">{l.start}<Input aria-label={l.start} className="mt-1.5" type="month" value={filters.inicio} max={filters.fim || undefined} onChange={e => onChange({ ...filters, inicio: e.target.value })} /></label><label className="min-w-0 flex-1 text-xs font-semibold">{l.end}<Input aria-label={l.end} className="mt-1.5" type="month" value={filters.fim} min={filters.inicio || undefined} onChange={e => onChange({ ...filters, fim: e.target.value })} /></label></div>
    {divisions.length > 0 && <FilterSelect label={t.companies.cnae} value={filters.cnae} onChange={cnae => onChange({ ...filters, cnae })} options={[all, ...divisions.map(d => ({ id: d.id, name: `${d.id} · ${d.nome[lang]}` }))]} />}
    <Button variant="ghost" className="justify-start" onClick={() => { setQuery(''); reset(); }}><RotateCcw />{t.economy.reset}</Button>
    {filters.inicio && filters.fim && filters.inicio > filters.fim && <p role="alert" className="text-sm text-destructive">{l.periodError}</p>}
  </div>;
}