import { lazy, Suspense, useCallback, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ClientOnly, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ArrowRight, Download, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Source } from '@/components/economy/ChartPanel';
import { CompanyTable } from '@/components/companies/CompanyTable';
import { useI18n, fmt } from '@/i18n';
import { pdfs } from '@/data/perfil';
import type { Oportunidade } from '@/data/imoveis-exemplo';
import {
  casos, defaultFilters, estruturantesPublicados, faixasArea, filterOpportunities, fontes, incentivosAplicaveis, incentivosPublicados, isFiltered,
  kpiPublished, kpisInvestir, polos, projetosPublicados, resultados, sectionOrder, setoresCnae, teses, tiposOportunidade, ultimaAtualizacao,
  type Filters, type SectionId,
} from '@/data/investir';
import { printDoc } from './printDoc';

const OpportunityMap = lazy(() => import('./OpportunityMap'));

function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle: string; children: ReactNode }) {
  return <section id={id} className="investir-section mx-auto max-w-7xl px-4 py-12 lg:px-6"><p className="eyebrow text-orange">{title}</p><h2 className="mt-2 text-2xl font-bold md:text-3xl">{subtitle}</h2><div className="mt-8">{children}</div></section>;
}

export function InvestDashboard() {
  const { t, lang } = useI18n(); const c = t.invest;
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<Oportunidade | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [tese, setTese] = useState(teses[0]?.slug ?? '');
  const [sent, setSent] = useState(false);
  const [wizard, setWizard] = useState({ setor: 'all', investimento: '', empregos: '' });
  const items = useMemo(() => filterOpportunities(filters), [filters]);
  const set = (k: keyof Filters) => (v: string) => setFilters(f => ({ ...f, [k]: v }));
  const onHover = useCallback((id: string | null) => setHovered(id), []);
  const onSelect = useCallback((o: Oportunidade) => setSelected(o), []);
  const kpis = kpisInvestir.filter(kpiPublished);
  const incentivos = incentivosPublicados();
  const projetos = projetosPublicados();
  const estruturantes = estruturantesPublicados();
  const sections = sectionOrder.filter(id => ({ areas: true, incentivos: incentivos.length > 0, monitor: projetos.length > 0, estruturantes: estruturantes.length > 0, teses: teses.length > 0, casos: casos.length > 0, expandir: true } as Record<SectionId, boolean>)[id]);
  const jump = (id: string) => document.getElementById(`investir-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  const nf = (n: number) => n.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US');
  const interest = () => toast.success(c.interestSent);
  const sheetPdf = (o: Oportunidade) => printDoc(`${c.tipos[o.tipo]} · ${o.id}`, [c.illustrative, `${c.area}: ${nf(o.area)} m²`, `${c.polo}: ${o.polo}`, `${c.zoning}: ${o.zoneamento ?? c.notInformed}`, `${c.price}: ${o.preco ?? c.onRequest}`, `${t.source.fonte}: ${o.fonte} · ${t.source.dados} ${o.dataReferencia} · ${t.source.atualizado} ${o.atualizadoEm}`]);
  const current = teses.find(x => x.slug === tese);
  const thesisPdf = (l: 'pt' | 'en') => { if (!current) return; printDoc(current.titulo[l], [...current.argumentos.map(a => `${a.valor} ${a.rotulo[l]} (${a.fonte}, ${a.dataReferencia})`), current.ancoras.length ? `${l === 'pt' ? 'Empresas âncora' : 'Anchor companies'}: ${current.ancoras.join(', ')}` : '', 'SUPGEST · Prefeitura de Contagem']); };
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const d = new FormData(e.currentTarget); if (!String(d.get('empresa') ?? '').trim() || !String(d.get('contato') ?? '').trim()) { toast.error(c.form.required); return; } setSent(true); e.currentTarget.reset(); };
  const select = (label: string, value: string, onChange: (v: string) => void, options: Array<[string, string]>) => <div className="min-w-0"><Label className="mb-1 block text-xs font-semibold">{label}</Label><Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="w-full bg-card"><SelectValue /></SelectTrigger><SelectContent>{options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></div>;
  const list = <ul className="max-h-[520px] space-y-3 overflow-y-auto pr-1">{items.map(o => <li key={o.id} onMouseEnter={() => setHovered(o.id)} onMouseLeave={() => setHovered(null)} className={`rounded-lg border bg-card p-4 transition ${hovered === o.id ? 'border-orange ring-2 ring-orange/30' : ''}`}>
    <div className="flex items-start justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wide text-orange">{c.tipos[o.tipo]}</span>{o.areaPronta && <span className="rounded bg-highlight px-2 py-0.5 text-xs font-semibold">{c.readySeal}</span>}</div>
    <p className="mt-1 text-lg font-bold">{nf(o.area)} m²</p><p className="text-sm text-muted-foreground">{c.polo}: {o.polo} · {c.price}: {o.preco ?? c.onRequest}</p>
    <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => setSelected(o)}>{c.sheet}</Button><Button size="sm" variant="cta" onClick={interest}>{c.interest}</Button></div></li>)}</ul>;
  const map = <ClientOnly fallback={<div className="h-[520px] rounded-lg border bg-muted" />}><Suspense fallback={<div className="h-[520px] rounded-lg border bg-muted" />}><OpportunityMap items={items} hovered={hovered} onHover={onHover} onSelect={onSelect} /></Suspense></ClientOnly>;

  return <div>
    <header className="bg-navy text-navy-foreground"><div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <Breadcrumb><BreadcrumbList className="text-navy-muted"><BreadcrumbItem><BreadcrumbLink asChild><Link to="/" className="hover:text-navy-foreground">{t.nav.home}</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem>{t.nav.panels}</BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage className="text-navy-foreground">{c.name}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
      <p className="eyebrow mt-6 text-orange-light">{c.axis}</p><h1 className="mt-2 text-3xl font-bold md:text-5xl">{c.title}</h1>
      <p className="mt-4 text-xl font-semibold text-orange-light">{c.question}</p><p className="mt-3 max-w-3xl text-navy-muted">{c.summary}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4"><Button asChild variant="cta" size="lg"><Link to="/contato">{c.cta}</Link></Button><span className="text-sm text-navy-muted">{c.updated}: {ultimaAtualizacao}</span></div>
    </div></header>

    <div className="sticky top-[72px] z-30 border-b bg-background shadow-sm"><div className="mx-auto max-w-7xl px-4 lg:px-6">
      <nav aria-label={c.title} className="flex gap-1 overflow-x-auto border-b">{sections.map(id => <Button key={id} variant="ghost" onClick={() => jump(id)} className="h-11 shrink-0 rounded-none px-3 text-sm">{c.sections[id]}</Button>)}</nav>
      <div className="grid grid-cols-2 gap-3 py-3 md:grid-cols-[repeat(4,minmax(0,1fr))_auto] md:items-end">
        {select(c.filters.setor, filters.setor, set('setor'), [['all', c.filters.allSetores], ...setoresCnae.map(s => [s.id, s.nome[lang]] as [string, string])])}
        {select(c.filters.territorio, filters.territorio, set('territorio'), [['municipio', c.filters.municipio], ...polos.map(p => [p, p] as [string, string])])}
        {select(c.filters.area, filters.area, set('area'), [['all', c.filters.allAreas], ...faixasArea.map(f => [f.id, c.areaLabels[f.id]] as [string, string])])}
        {select(c.filters.tipo, filters.tipo, set('tipo'), [['all', c.filters.allTipos], ...tiposOportunidade.map(x => [x, c.tipos[x]] as [string, string])])}
        <Button variant="outline" onClick={() => setFilters(defaultFilters)} disabled={!isFiltered(filters)}>{c.filters.clear}</Button>
      </div>
      <p className="pb-2 text-sm font-semibold" aria-live="polite">{fmt(c.filters.found, items.length)}</p>
    </div></div>

    {kpis.length > 0 && <div className="mx-auto max-w-7xl px-4 pt-10 lg:px-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{kpis.map(k => <div key={k.id} className="rounded-lg border bg-card p-5"><p className="text-sm text-muted-foreground">{c.kpis[k.id]}</p><p className="mt-1 font-serif text-3xl font-bold text-orange">{typeof k.valor === 'number' ? nf(k.valor) : k.valor}</p>{k.contexto && <p className="mt-1 text-sm">{k.contexto[lang]}</p>}<div className="mt-3"><Source data={k} /></div></div>)}</div>{isFiltered(filters) && <p className="mt-2 text-xs text-muted-foreground">{c.filters.unsegmented}</p>}</div>}

    <Section id="investir-areas" title={c.sections.areas} subtitle={c.subtitles.areas}>
      <p className="mb-5 border-l-4 border-orange bg-highlight px-4 py-3 text-sm">{c.illustrative}</p>
      {items.length === 0 ? <p className="text-muted-foreground">{c.noResults}</p> : <>
        <div className="mb-4 flex gap-1 lg:hidden" role="group">{(['list', 'map'] as const).map(v => <Button key={v} size="sm" variant={view === v ? 'default' : 'outline'} aria-pressed={view === v} onClick={() => setView(v)}>{v === 'list' ? c.list : c.map}</Button>)}</div>
        <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]"><div className={view === 'map' ? 'hidden lg:block' : ''}>{list}</div><div className={view === 'list' ? 'hidden lg:block' : ''}>{map}</div></div>
      </>}
      <Button asChild variant="pill" className="mt-6"><Link to="/mapa"><MapPin />{c.fullMap}</Link></Button>
    </Section>

    {sections.includes('incentivos') && <Section id="investir-incentivos" title={c.sections.incentivos} subtitle={c.subtitles.incentivos}>
      <div className="grid gap-5 lg:grid-cols-3">{(['municipal', 'estadual', 'federal'] as const).map(n => { const rows = incentivos.filter(i => i.nivel === n); return rows.length ? <div key={n}><h3 className="mb-3 text-lg font-bold">{c.levels[n]}</h3>{rows.map(i => <article key={i.id} className="mb-3 rounded-lg border bg-card p-4"><h4 className="font-bold">{i.nome}</h4>{i.beneficio && <p className="text-sm">{c.benefit}: {i.beneficio[lang]}</p>}{i.publico && <p className="text-sm">{c.who}: {i.publico[lang]}</p>}<p className="text-sm">{c.legal}: {i.baseLegalUrl ? <a className="text-link underline" href={i.baseLegalUrl} target="_blank" rel="noreferrer">{i.baseLegal}</a> : i.baseLegal}</p><p className="text-sm">{c.agency}: {i.orgao}</p><Source data={i} /></article>)}</div> : null; })}</div>
      <div className="mt-8 rounded-lg border bg-card p-5"><h3 className="text-lg font-bold">{c.wizard}</h3><div className="mt-4 grid gap-3 md:grid-cols-3">{select(c.filters.setor, wizard.setor, v => setWizard(w => ({ ...w, setor: v })), [['all', c.filters.allSetores], ...setoresCnae.map(s => [s.id, s.nome[lang]] as [string, string])])}<div><Label className="mb-1 block text-xs font-semibold">{c.investment}</Label><Input type="number" min={0} value={wizard.investimento} onChange={e => setWizard(w => ({ ...w, investimento: e.target.value }))} /></div><div><Label className="mb-1 block text-xs font-semibold">{c.jobs}</Label><Input type="number" min={0} value={wizard.empregos} onChange={e => setWizard(w => ({ ...w, empregos: e.target.value }))} /></div></div>
        <p className="mt-4 text-sm font-semibold">{c.applicable}: {incentivosAplicaveis({ setor: wizard.setor, investimento: Number(wizard.investimento) || 0, empregos: Number(wizard.empregos) || 0 }).map(i => i.nome).join(', ')}</p><Button asChild variant="cta" className="mt-4"><Link to="/contato">{c.talkIncentives}</Link></Button></div>
      <p className="mt-4 text-sm text-muted-foreground">{c.incentiveNote}</p>
    </Section>}

    {sections.includes('monitor') && <Section id="investir-monitor" title={c.sections.monitor} subtitle={c.subtitles.monitor}>
      <CompanyTable title={c.sections.monitor} id="projetos-investimento" rows={projetos.map(p => ({ empresa: p.empresa, setor: p.setor, valor: p.valor, empregos: p.empregos, estagio: c.stages[p.estagio], ano: p.ano, regional: p.regional, fonte: p.fonte, dataReferencia: p.dataReferencia, atualizadoEm: p.atualizadoEm, unidade: 'R$', periodicidade: 'variable' }))} columns={[{ key: 'empresa', label: c.company }, { key: 'setor', label: c.filters.setor }, { key: 'valor', label: c.value }, { key: 'empregos', label: c.jobsCol }, { key: 'estagio', label: c.stage }, { key: 'ano', label: c.year }, { key: 'regional', label: c.regional }]} />
    </Section>}

    {sections.includes('estruturantes') && <Section id="investir-estruturantes" title={c.sections.estruturantes} subtitle={c.subtitles.estruturantes}>
      <div className="grid gap-4 md:grid-cols-2">{estruturantes.map(p => <article key={p.id} className="rounded-lg border bg-card p-5"><h3 className="font-bold">{p.nome[lang]}</h3><p className="mt-1 text-sm">{p.descricao[lang]}</p>{p.impacto && <p className="mt-2 text-sm font-semibold">{p.impacto[lang]}</p>}<Source data={p} /></article>)}</div>
    </Section>}

    {current && <Section id="investir-teses" title={c.sections.teses} subtitle={c.subtitles.teses}>
      <div className="grid gap-3 sm:grid-cols-3" role="tablist">{teses.map(x => <button type="button" role="tab" aria-selected={tese === x.slug} key={x.slug} onClick={() => setTese(x.slug)} className={`rounded-lg border p-5 text-left font-serif text-lg font-bold transition ${tese === x.slug ? 'border-orange bg-highlight' : 'bg-card hover:border-orange'}`}>{x.nome[lang]}</button>)}</div>
      {teses.map(x => <div key={x.slug} id={`setor-${x.slug}`} className="investir-section" hidden={tese !== x.slug} />)}
      <article className="mt-6 rounded-lg border bg-card p-6">
        <h3 className="text-2xl font-bold">{current.titulo[lang]}</h3>
        {current.argumentos.length > 0 && <ul className="mt-4 grid gap-3 md:grid-cols-2">{current.argumentos.map(a => <li key={a.rotulo.pt} className="border-l-4 border-orange pl-3"><p><span className="font-serif text-2xl font-bold text-orange">{a.valor}</span> {a.rotulo[lang]}</p><Source data={a} /></li>)}</ul>}
        {current.ancoras.length > 0 && <div className="mt-5"><h4 className="font-semibold">{c.anchors}</h4><p className="mt-1">{current.ancoras.join(' · ')}</p></div>}
        {current.elosFaltantes.length > 0 && <div className="mt-5"><h4 className="font-semibold">{c.missing}</h4><p>{current.elosFaltantes.map(e => e[lang]).join(' · ')}</p></div>}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => { setFilters(f => ({ ...f, setor: current.setorCnae })); jump('areas'); }}><MapPin />{c.areasFor}</Button>
          <Button asChild variant="outline"><Link to="/empresas">{c.seeChains}</Link></Button>
          <Button variant="outline" onClick={() => thesisPdf('pt')}><Download />{c.thesisPdf}</Button>
          <Button variant="outline" onClick={() => thesisPdf('en')}><Download />{c.thesisPdfEn}</Button>
          <Button asChild variant="cta"><Link to="/contato">{c.talk}</Link></Button>
        </div>
      </article>
    </Section>}

    {sections.includes('casos') && <Section id="investir-casos" title={c.sections.casos} subtitle={c.subtitles.casos}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{casos.map(k => <article key={k.slug} className="flex flex-col rounded-lg border bg-card p-5">{k.logoAutorizado && k.logo ? <img src={k.logo} alt={k.nome} className="h-10 w-auto self-start" /> : <h3 className="text-xl font-bold">{k.nome}</h3>}<p className="text-sm text-muted-foreground">{k.grupo[lang]}{k.ano ? ` · ${k.ano}` : ''}</p>{k.investimento !== null && <p className="mt-3"><span className="text-sm">{c.caseInvestment}: </span><span className="font-serif text-2xl font-bold text-orange">R$ {nf(k.investimento / 1e6)} {lang === 'pt' ? 'milhões' : 'million'}</span></p>}{k.citacao && <blockquote className="mt-2 italic">“{k.citacao[lang]}”</blockquote>}<div className="mt-3"><Source data={k} /></div><Button asChild variant="link" className="mt-auto self-start px-0"><Link to="/investir/caso/$slug" params={{ slug: k.slug }}>{c.seeCase} <ArrowRight /></Link></Button></article>)}</div>
    </Section>}

    <Section id="investir-expandir" title={c.sections.expandir} subtitle={c.subtitles.expandir}>
      <div className="rounded-2xl bg-highlight p-6 md:p-8"><p className="max-w-3xl">{c.expandText}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">{c.expandCards.map(x => <Link key={x.t} to={x.to} className="flex items-center justify-between rounded-lg border bg-card p-4 font-semibold hover:border-orange">{x.t}<ArrowRight className="h-4 w-4 text-orange" /></Link>)}</div>
        <form onSubmit={submit} className="mt-8 grid gap-4 rounded-lg border bg-card p-5 md:grid-cols-2" noValidate><h3 className="text-lg font-bold md:col-span-2">{c.form.title}</h3>
          <div><Label htmlFor="exp-empresa">{c.form.company}</Label><Input id="exp-empresa" name="empresa" required maxLength={120} /></div>
          <div><Label htmlFor="exp-cnpj">{c.form.cnpj}</Label><Input id="exp-cnpj" name="cnpj" maxLength={18} /></div>
          <div><Label htmlFor="exp-contato">{c.form.contact}</Label><Input id="exp-contato" name="contato" required maxLength={120} /></div>
          <div><Label htmlFor="exp-tipo">{c.form.type}</Label><select id="exp-tipo" name="tipo" className="h-9 w-full rounded-md border bg-card px-3 text-sm">{Object.entries(c.form.types).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
          <div className="md:col-span-2"><Label htmlFor="exp-msg">{c.form.message}</Label><Textarea id="exp-msg" name="mensagem" maxLength={1000} /></div>
          <div className="md:col-span-2"><Button type="submit" variant="cta">{c.form.send}</Button>{sent && <p role="status" className="mt-3 text-sm font-semibold">{c.form.success}</p>}</div>
        </form>
      </div>
    </Section>

    {resultados && null}

    <section className="bg-navy text-navy-foreground"><div className="mx-auto max-w-7xl px-4 py-12 lg:px-6"><h2 className="text-2xl font-bold">{c.next}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link to="/mapa" className="rounded-lg border border-navy-foreground/20 p-5 font-semibold hover:border-orange-light">{c.openMap}</Link>
        <a href={pdfs[lang] || undefined} onClick={e => { if (!pdfs[lang]) { e.preventDefault(); window.print(); } }} className="cursor-pointer rounded-lg border border-navy-foreground/20 p-5 font-semibold hover:border-orange-light">{c.profilePdf}</a>
        <Link to="/contato" className="rounded-lg border border-navy-foreground/20 p-5 font-semibold hover:border-orange-light">{c.cta}</Link>
      </div>
      <div className="mt-8 flex flex-wrap justify-between gap-4 text-sm"><Link to="/infraestrutura" className="text-orange-light hover:underline">{c.back}</Link><Link to="/inovacao" className="text-orange-light hover:underline">{c.nextPanel}</Link></div>
    </div></section>

    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6"><Accordion type="single" collapsible><AccordionItem value="about"><AccordionTrigger className="text-lg font-bold">{c.about}</AccordionTrigger><AccordionContent>
      <div className="grid gap-5 pt-3 md:grid-cols-2 lg:grid-cols-3">{fontes.map(f => <div key={f.nome} className="border-l-2 border-orange pl-4"><a href={f.url} target="_blank" rel="noreferrer" className="font-semibold text-link hover:underline">{f.nome}</a><p className="text-sm text-muted-foreground">{f.periodicidade[lang]} · {c.updated}: {ultimaAtualizacao}</p></div>)}</div>
      <p className="mt-5 text-sm">{c.stagesExplain}</p><p className="mt-2 text-sm text-muted-foreground">{c.illustrative}</p>
    </AccordionContent></AccordionItem></Accordion></div>

    <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}><DialogContent className="max-w-lg">{selected && <>
      <DialogHeader><DialogTitle>{c.tipos[selected.tipo]} · {nf(selected.area)} m²</DialogTitle><DialogDescription>{c.illustrative}</DialogDescription></DialogHeader>
      <dl className="grid grid-cols-2 gap-2 text-sm"><dt className="font-semibold">{c.polo}</dt><dd>{selected.polo}</dd><dt className="font-semibold">{c.zoning}</dt><dd>{selected.zoneamento ?? c.notInformed}</dd><dt className="font-semibold">{c.price}</dt><dd>{selected.preco ?? c.onRequest}</dd></dl>
      <p className="text-sm text-muted-foreground">{c.sheetPending}</p><Source data={selected} />
      <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => sheetPdf(selected)}><Download />{c.sheetPdf}</Button><Button variant="outline" onClick={() => toast.info(c.profileText)}>{c.profile}</Button><Button variant="cta" onClick={interest}>{c.interest}</Button></div>
    </>}</DialogContent></Dialog>
  </div>;
}
