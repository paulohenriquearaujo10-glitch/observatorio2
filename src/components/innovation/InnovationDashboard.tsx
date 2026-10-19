import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Source } from '@/components/economy/ChartPanel';
import { CompanyTable } from '@/components/companies/CompanyTable';
import { downloadCsv, type ExportRow } from '@/components/economy/exports';
import { useI18n, fmt } from '@/i18n';
import {
  areasTecnologicas, casosVerdes, defaultFilters, editaisAbertos, fontes, isFiltered, jornada, kpiPublished, kpisInovacao, laboratorios,
  localizacoes, parceirosFiltrados, sectionOrder, startupsContagem, tiposParceiro, ultimaAtualizacao, type Filters, type Parceiro, type SectionId,
} from '@/data/inovacao';

function Section({ id, title, subtitle, children }: { id: SectionId; title: string; subtitle: string; children: ReactNode }) {
  return <section id={`inovacao-${id}`} className="inovacao-section mx-auto max-w-7xl px-4 py-12 lg:px-6"><p className="eyebrow text-orange">{title}</p><h2 className="mt-2 text-2xl font-bold md:text-3xl">{subtitle}</h2><div className="mt-8">{children}</div></section>;
}

export function InnovationDashboard() {
  const { t, lang } = useI18n(); const c = t.innovation;
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: keyof Filters) => (v: string) => setFilters(f => ({ ...f, [k]: v }));
  const all = useMemo(() => parceirosFiltrados(filters), [filters]);
  const bySec = (s: SectionId) => all.filter(p => p.secao === s);
  const kpis = kpisInovacao.filter(kpiPublished);
  const abertos = editaisAbertos(new Date());
  const has: Record<SectionId, boolean> = {
    industria: true, universidades: bySec('universidades').length > 0 || laboratorios.length > 0,
    startups: true, financiamento: bySec('financiamento').length > 0 || abertos.length > 0, pi: false, verde: casosVerdes.length > 0,
  };
  const sections = sectionOrder.filter(id => has[id]);
  const jump = (id: string) => document.getElementById(`inovacao-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  const rows = (list: Parceiro[]): Array<ExportRow & Parceiro> => list.map(p => ({ ...p, nomeCol: p.nome, tipoCol: c.tipos[p.tipo], cidadeCol: p.cidade, localCol: c.locais[p.local], siteCol: p.site } as unknown as ExportRow & Parceiro));
  const exportRows = () => all.map(p => ({ [c.cols.nome]: p.nome, [c.cols.tipo]: c.tipos[p.tipo], [c.cols.cidade]: p.cidade, [c.cols.local]: c.locais[p.local], [c.cols.site]: p.site, [t.source.fonte]: p.fonte, [t.source.dados]: p.dataReferencia, [t.source.atualizado]: p.atualizadoEm }));
  const xlsx = async () => { const X = await import('xlsx'); const wb = X.utils.book_new(); X.utils.book_append_sheet(wb, X.utils.json_to_sheet(exportRows()), 'Parceiros'); X.writeFile(wb, 'parceiros-inovacao.xlsx'); };
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const d = new FormData(e.currentTarget); if (['empresa', 'contato', 'descricao'].some(k => !String(d.get(k) ?? '').trim())) { toast.error(c.form.required); return; } setSent(true); e.currentTarget.reset(); };
  const select = (label: string, value: string, onChange: (v: string) => void, options: Array<[string, string]>) => <div className="min-w-0"><Label className="mb-1 block text-xs font-semibold">{label}</Label><Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="w-full bg-card"><SelectValue /></SelectTrigger><SelectContent>{options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></div>;

  const cards = (list: Parceiro[]) => list.length === 0 ? <p className="text-muted-foreground">{c.noResults}</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(p => <article key={p.id} className="flex flex-col rounded-lg border bg-card p-5">
    <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold uppercase tracking-wide text-orange">{c.tipos[p.tipo]}</span><span className="rounded bg-highlight px-2 py-0.5 text-xs font-semibold">{c.locais[p.local]}</span></div>
    {p.logoAutorizado && p.logoUrl && <img src={p.logoUrl} alt={p.nome} className="mt-3 h-10 w-auto object-contain" />}
    <h3 className="mt-2 text-lg font-bold">{p.nome}</h3>
    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{p.cidade}{p.distanciaKm !== null && ` · ${p.distanciaKm} km`}{p.tempoMin !== null && ` · ${p.tempoMin} min`}</p>
    {p.oferta ? <p className="mt-2 text-sm">{p.oferta[lang]}</p> : <p className="mt-2 text-xs text-muted-foreground">{c.pendingDetails}</p>}
    <a href={p.site} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">{c.site}<ExternalLink className="h-3.5 w-3.5" /></a>
    <div className="mt-auto pt-3"><Source data={p} /></div>
  </article>)}</div>;

  return <div>
    <header className="bg-navy text-navy-foreground"><div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <Breadcrumb><BreadcrumbList className="text-navy-muted"><BreadcrumbItem><BreadcrumbLink asChild><Link to="/" className="hover:text-navy-foreground">{t.nav.home}</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem>{t.nav.panels}</BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage className="text-navy-foreground">{c.name}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
      <p className="eyebrow mt-6 text-orange-light">{c.axis}</p><h1 className="mt-2 text-3xl font-bold md:text-5xl">{c.title}</h1>
      <p className="mt-4 text-xl font-semibold text-orange-light">{c.question}</p><p className="mt-3 max-w-3xl text-navy-muted">{c.summary}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4"><Button asChild variant="cta" size="lg"><Link to="/contato">{c.cta}</Link></Button><span className="text-sm text-navy-muted">{c.updated}: {ultimaAtualizacao}</span></div>
    </div></header>

    <div className="sticky top-[72px] z-30 border-b bg-background shadow-sm"><div className="mx-auto max-w-7xl px-4 lg:px-6">
      <nav aria-label={c.title} className="flex gap-1 overflow-x-auto border-b">{sections.map(id => <Button key={id} variant="ghost" onClick={() => jump(id)} className="h-11 shrink-0 rounded-none px-3 text-sm">{c.sections[id]}</Button>)}</nav>
      <div className="grid grid-cols-2 gap-3 py-3 md:grid-cols-[repeat(3,minmax(0,1fr))_auto] md:items-end">
        {select(c.filters.area, filters.area, set('area'), [['all', c.filters.allAreas], ...areasTecnologicas.map(a => [a, c.areas[a]] as [string, string])])}
        {select(c.filters.tipo, filters.tipo, set('tipo'), [['all', c.filters.allTipos], ...tiposParceiro.map(a => [a, c.tipos[a]] as [string, string])])}
        {select(c.filters.local, filters.local, set('local'), [['all', c.filters.allLocal], ...localizacoes.map(a => [a, c.locais[a]] as [string, string])])}
        <Button variant="outline" onClick={() => setFilters(defaultFilters)} disabled={!isFiltered(filters)}>{c.filters.clear}</Button>
      </div>
      <p className="pb-2 text-sm font-semibold" aria-live="polite">{fmt(c.filters.found, all.length)}</p>
    </div></div>

    {kpis.length > 0 && <div className="mx-auto max-w-7xl px-4 pt-10 lg:px-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{kpis.map(k => <div key={k.id} className="rounded-lg border bg-card p-5"><p className="text-sm text-muted-foreground">{c.kpis[k.id]}</p><p className="mt-1 font-serif text-3xl font-bold text-orange">{k.valor}</p>{k.contexto && <p className="mt-1 text-sm">{k.contexto[lang]}</p>}<div className="mt-3"><Source data={k} /></div></div>)}</div>{isFiltered(filters) && <p className="mt-2 text-xs text-muted-foreground">{c.filters.unsegmented}</p>}</div>}

    <Section id="industria" title={c.sections.industria} subtitle={c.subtitles.industria}>
      {cards(bySec('industria'))}
      <h3 className="mt-10 text-xl font-bold">{c.journeyTitle}</h3>
      <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{jornada.map((j, i) => <li key={j} className="rounded-lg border bg-card p-5"><span className="grid h-9 w-9 place-items-center rounded-full bg-orange font-bold text-primary-foreground">{i + 1}</span><p className="mt-3 font-semibold">{c.journey[j]}</p></li>)}</ol>
      <Button asChild variant="cta" className="mt-5"><Link to="/contato">{c.journeyCta}</Link></Button>
    </Section>

    {has.universidades && <Section id="universidades" title={c.sections.universidades} subtitle={c.subtitles.universidades}>{cards(bySec('universidades'))}</Section>}

    <Section id="startups" title={c.sections.startups} subtitle={c.subtitles.startups}>
      {startupsContagem.length > 0 && null}
      <h3 className="mb-4 text-xl font-bold">{c.hubs}</h3>{cards(bySec('startups'))}
      <div className="mt-10 rounded-lg border-l-4 border-orange bg-highlight p-6">
        <h3 className="text-xl font-bold">{c.challengeTitle}</h3><p className="mt-2 max-w-3xl text-sm">{c.challengeText}</p>
        {!formOpen ? <Button variant="cta" className="mt-4" onClick={() => { setFormOpen(true); setSent(false); }}>{c.challengeBtn}</Button> :
          sent ? <p role="status" className="mt-4 rounded bg-card p-4 text-sm font-semibold">{c.form.success}</p> :
          <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-2">
            <div><Label htmlFor="ch-empresa">{c.form.company}</Label><Input id="ch-empresa" name="empresa" className="bg-card" /></div>
            <div><Label htmlFor="ch-contato">{c.form.contact}</Label><Input id="ch-contato" name="contato" className="bg-card" /></div>
            <div className="md:col-span-2"><Label htmlFor="ch-area">{c.form.area}</Label><select id="ch-area" name="area" className="h-9 w-full rounded-md border bg-card px-3 text-sm">{areasTecnologicas.map(a => <option key={a} value={a}>{c.areas[a]}</option>)}</select></div>
            <div className="md:col-span-2"><Label htmlFor="ch-desc">{c.form.description}</Label><Textarea id="ch-desc" name="descricao" className="bg-card" /></div>
            <Button type="submit" variant="cta" className="md:w-fit">{c.form.send}</Button>
          </form>}
      </div>
    </Section>

    {has.financiamento && <Section id="financiamento" title={c.sections.financiamento} subtitle={c.subtitles.financiamento}>
      {cards(bySec('financiamento'))}
      {abertos.length > 0 && <ul className="mt-8 space-y-2">{abertos.map(e => <li key={e.id} className="rounded border bg-card p-4"><a href={e.link} target="_blank" rel="noreferrer" className="font-semibold text-link">{e.nome}</a> · {e.financiador} · {e.prazo}<Source data={e} /></li>)}</ul>}
      <p className="mt-6 text-sm">{c.investLink} <Link to="/investir" className="font-semibold text-link hover:underline">{c.seeInvest}</Link></p>
    </Section>}

    <section className="bg-navy text-navy-foreground"><div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <h2 className="text-2xl font-bold">{c.next}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link to="/contato" className="rounded-lg border border-navy-muted/40 p-5 font-semibold hover:border-orange-light">{c.diag} →</Link>
        <div className="flex flex-col gap-2 rounded-lg border border-navy-muted/40 p-5"><Button variant="cta" size="sm" disabled={!all.length} onClick={() => downloadCsv(exportRows(), 'parceiros-inovacao')}>{c.partnersCsv}</Button><Button variant="outline" size="sm" className="text-foreground" disabled={!all.length} onClick={xlsx}>{c.partnersXlsx}</Button></div>
        <Link to="/contato" className="rounded-lg border border-navy-muted/40 p-5 font-semibold hover:border-orange-light">{c.talk} →</Link>
      </div>
      <div className="mt-8 flex flex-wrap justify-between gap-4 text-sm font-semibold"><Link to="/investir" className="text-orange-light hover:underline">{c.back}</Link><Link to="/pequenos-negocios" className="text-orange-light hover:underline">{c.nextPanel}</Link></div>
    </div></section>

    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6"><Accordion type="single" collapsible><AccordionItem value="about"><AccordionTrigger className="text-lg font-bold">{c.about}</AccordionTrigger><AccordionContent>
      <p className="mb-3 text-sm">{c.agreement}</p><p className="mb-4 text-sm text-muted-foreground">{c.hidden}</p>
      <ul className="grid gap-2 text-sm sm:grid-cols-2">{fontes.map(f => <li key={f.nome} className="rounded border bg-card p-3"><a href={f.url} target="_blank" rel="noreferrer" className="font-semibold text-link hover:underline">{f.nome}</a><span className="block text-xs text-muted-foreground">{c.periodicity}: {f.periodicidade[lang]}</span></li>)}</ul>
    </AccordionContent></AccordionItem></Accordion></div>
    {false && <CompanyTable title="" id="" rows={rows([])} columns={[]} />}
  </div>;
}
