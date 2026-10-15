import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComparisonPicker } from '@/components/economy/Filters';
import { useI18n } from '@/i18n';
import { setores, portes, territorios, type Filters } from '@/data/empresas-cadeias';
export function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: Array<{ id: string; name: string }>; onChange: (v: string) => void }) {
 return <div className="min-w-0"><p className="mb-1.5 text-xs font-semibold">{label}</p><Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="w-full"><SelectValue /></SelectTrigger><SelectContent>{options.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent></Select></div>;
}
export function CompanyFilters({ filters, onChange, compare, setCompare, reset }: { filters: Filters; onChange: (v: Filters) => void; compare: string[]; setCompare: (v: string[]) => void; reset: () => void }) {
 const { t, lang } = useI18n(); const c = t.companies; const e = t.economy; const all = { id: 'all', name: c.all }; const divisions = setores.find(s => s.id === filters.setor)?.divisoes ?? [];
 return <div className="grid grid-cols-2 items-end gap-3 py-4 lg:grid-cols-[1fr_1fr_1.2fr_1.1fr_auto]">
 <FilterSelect label={c.sector} value={filters.setor} onChange={setor => onChange({ ...filters, setor, cnae: 'all' })} options={[all, ...setores.map(s => ({ id: s.id, name: s.nome[lang] }))]} />
 <FilterSelect label={c.size} value={filters.porte} onChange={porte => onChange({ ...filters, porte })} options={[all, ...portes.map(s => ({ id: s.id, name: s.nome[lang] }))]} />
 <FilterSelect label={c.territory} value={filters.territorio} onChange={territorio => onChange({ ...filters, territorio })} options={[{ id: 'municipio', name: e.municipality }, { id: 'regional', name: e.regional }, { id: 'polo', name: e.pole }, { id: 'distrito', name: c.district }, ...[...territorios.regionais, ...territorios.polos].map(name => ({ id: name, name }))].concat(territorios.distritos.map(name => ({ id: name, name })))} />
 <div className="min-w-0"><p className="mb-1.5 text-xs font-semibold">{e.compare}</p><ComparisonPicker value={compare} onChange={setCompare} /></div>
 <Button variant="ghost" onClick={reset} className="justify-start lg:justify-center"><RotateCcw />{e.reset}</Button>
 {divisions.length > 0 && <FilterSelect label={c.cnae} value={filters.cnae} onChange={cnae => onChange({ ...filters, cnae })} options={[all, ...divisions.map(d => ({ id: d.id, name: `${d.id} · ${d.nome[lang]}` }))]} />}
 </div>;
}
