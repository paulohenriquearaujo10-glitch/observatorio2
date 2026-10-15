import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useI18n } from "@/i18n";
import { anosDisponiveis, comparadores, recortes } from "@/data/economia-territorio";

export function ComparisonPicker({ value, onChange, max }: { value: string[]; onChange: (value: string[]) => void; max?: number }) {
  const { t } = useI18n(); const e = t.economy;
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="w-full justify-between" aria-label={max ? e.radarCompare : e.compare}><span className="truncate">{value.length} {e.selected}</span><ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="start" className="w-64"><DropdownMenuLabel>{max ? e.radarCompare : e.compare}</DropdownMenuLabel>{comparadores.map(c => <DropdownMenuCheckboxItem key={c.id} checked={value.includes(c.id)} disabled={Boolean(max && value.length >= max && !value.includes(c.id))} onSelect={event => event.preventDefault()} onCheckedChange={checked => onChange(checked ? [...value, c.id] : value.filter(id => id !== c.id))}>{c.nome}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>;
}
export function Filters({ compare, setCompare, period, setPeriod, scope, setScope, reset }: {
  compare: string[]; setCompare: (v: string[]) => void; period: [number, number]; setPeriod: (v: [number, number]) => void; scope: string; setScope: (v: string) => void; reset: () => void;
}) {
  const { t } = useI18n(); const e = t.economy; const years = anosDisponiveis();
  return <div className="grid items-end gap-3 py-4 md:grid-cols-[1.1fr_1fr_1.2fr_auto]">
    <div className="min-w-0"><label className="mb-1.5 flex items-center gap-2 text-xs font-semibold"><SlidersHorizontal className="h-3.5 w-3.5" />{e.compare}</label><ComparisonPicker value={compare} onChange={setCompare} /></div>
    <div><p className="mb-1.5 text-xs font-semibold">{e.period}</p><div className="flex items-center gap-2">
      <Select value={String(period[0])} onValueChange={v => setPeriod([Number(v), Math.max(Number(v), period[1])])}><SelectTrigger aria-label={e.from}><SelectValue /></SelectTrigger><SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select>
      <span className="text-muted-foreground">–</span>
      <Select value={String(period[1])} onValueChange={v => setPeriod([Math.min(period[0], Number(v)), Number(v)])}><SelectTrigger aria-label={e.to}><SelectValue /></SelectTrigger><SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select>
    </div></div>
    <div className="min-w-0"><label className="mb-1.5 block text-xs font-semibold">{e.territory}</label><Select value={scope} onValueChange={setScope}><SelectTrigger aria-label={e.territory}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="municipio">{e.municipality}</SelectItem><SelectItem value="regional">{e.regional}</SelectItem><SelectItem value="polo">{e.pole}</SelectItem>{[...recortes.regionais, ...recortes.polos].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
    <Button variant="ghost" onClick={reset} className="justify-start md:justify-center"><RotateCcw />{e.reset}</Button>
  </div>;
}