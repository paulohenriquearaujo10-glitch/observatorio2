import { useEffect, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowDown, ArrowUpRight, Check, CreditCard, FileText, GraduationCap, Handshake, MapPin, Printer, ShoppingBag, Smartphone, Store, Truck, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SourceLine } from '@/components/site/common';
import { useI18n } from '@/i18n';
import { aglomerados, atendimentos, caminhos, clusterPublished, coursePublished, cursos, digitalTopics, distancias, faqs, fornecedores, glossary, headings, indexLabels, links, metricPublished, numeros, revisadoEm, sectionOrder, sourced, vantagens, type Atendimento, type SectionId } from '@/data/pequenos-negocios';

const symbols = { Handshake, GraduationCap, Smartphone, Store, Truck, Users, ShoppingBag, CreditCard };
function External({ url, children, light = false }: { url: string; children: ReactNode; light?: boolean }) {
  return <a href={url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 underline-offset-4 hover:underline ${light ? 'text-orange-light' : 'text-link'}`}>{children}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden /></a>;
}
function Term({ term }: { term: keyof typeof glossary }) {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  return <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><Button variant="link" className="inline h-auto whitespace-normal rounded-none border-b border-dotted border-current p-0 text-inherit text-[length:inherit] font-[inherit] leading-[inherit]" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>{term}</Button></PopoverTrigger><PopoverContent className="text-sm" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>{glossary[term][lang]}</PopoverContent></Popover>;
}
function Glossed({ value }: { value: string }) {
  const terms = Object.keys(glossary) as Array<keyof typeof glossary>;
  const parts = value.split(/(inscrição municipal|CNAE|CNPJ|alvará|NFS-e)/gi);
  return <>{parts.map((p, i) => { const term = terms.find(t => t.toLowerCase() === p.toLowerCase()); return term ? <Term key={i} term={term} /> : p; })}</>;
}
function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  const { lang } = useI18n();
  return <section id={id} className="smallbiz-section border-b py-12 md:py-16"><div className="mx-auto max-w-7xl px-4 lg:px-6"><h2 className="mb-7 text-2xl font-bold md:text-3xl">{headings[id][lang]}</h2>{children}</div></section>;
}
function Contact({ contact, light = false }: { contact: Atendimento; light?: boolean }) {
  const { t, lang } = useI18n(); const c = t.smallBiz;
  return <div className="space-y-3">
    {contact.description && <p>{contact.description[lang]}</p>}
    {contact.endereco && <p>{c.address}: {contact.endereco}</p>}
    {contact.horario && <p>{c.hours}: {contact.horario[lang]}</p>}
    {contact.telefone && <External url={`tel:${contact.telefone}`} light={light}>{c.phone}: {contact.telefone}</External>}
    {contact.whatsapp && <External url={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} light={light}>WhatsApp</External>}
    {contact.email && <External url={`mailto:${contact.email}`} light={light}>{c.email}: {contact.email}</External>}
    {contact.url && <div><External url={contact.url} light={light}>{c.channels}</External></div>}
    {contact.maps && <div><External url={contact.maps} light={light}><MapPin className="h-4 w-4" />{c.directions}</External></div>}
  </div>;
}

export function SmallBusinessGuide() {
  const { t, lang } = useI18n(); const c = t.smallBiz;
  const [expanded, setExpanded] = useState<string[]>([]);
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    const before = () => setPrinting(true); const after = () => setPrinting(false);
    window.addEventListener('beforeprint', before); window.addEventListener('afterprint', after);
    return () => { window.removeEventListener('beforeprint', before); window.removeEventListener('afterprint', after); };
  }, []);
  const print = () => { setPrinting(true); window.setTimeout(() => window.print(), 150); };
  const metrics = numeros.filter(metricPublished);
  const availableCourses = cursos.filter(coursePublished);
  const clusters = aglomerados.filter(clusterPublished);
  const sala = atendimentos.find(a => a.id === 'sala');
  return <article className="smallbiz-guide">
    <div className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14 lg:px-6">
        <nav aria-label={c.name} className="smallbiz-no-print mb-6 flex flex-wrap gap-2 text-sm text-navy-muted"><Link to="/">{t.nav.home}</Link><span aria-hidden>›</span><span>{t.nav.panels}</span><span aria-hidden>›</span><span className="text-navy-foreground">{c.name}</span></nav>
        <p className="mb-3 text-xs font-bold text-orange-light">{c.axis}</p>
        <h1 className="max-w-4xl text-3xl font-bold md:text-5xl">{c.title}</h1>
        <p className="mt-5 max-w-4xl text-xl text-orange-light md:text-2xl">{c.question}</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-navy-muted">{c.summary}</p>
        <p className="mt-5 text-sm text-navy-muted">{c.reviewed} {revisadoEm}</p>
        <div className="smallbiz-no-print mt-7 flex flex-wrap gap-3"><Button variant="cta" className="h-auto min-h-11 whitespace-normal text-left" onClick={print}><Printer />{c.print}</Button><Button asChild variant="outlineLight" className="h-auto min-h-11 whitespace-normal text-left"><a href="#atendimento"><Handshake />{c.talk}</a></Button></div>
        <nav aria-label={c.index} className="smallbiz-no-print mt-9 border-t border-navy-foreground/20 pt-5"><ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">{sectionOrder.map(id => <li key={id}><a href={`#${id}`} className="inline-flex items-center gap-1 hover:text-orange-light">{indexLabels[id][lang]}<ArrowDown className="h-3 w-3" /></a></li>)}</ul></nav>
      </div>
    </div>
    {metrics.length > 0 && <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-4">{metrics.map(m => <div key={m.id}><p className="text-3xl font-bold text-orange">{m.valor?.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')}{m.unidade}</p><p>{m.label[lang]}</p><SourceLine d={m} /></div>)}</div>}
    <Section id="vantagens"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{vantagens.map(v => { const Icon = symbols[v.icon]; return <div key={v.id} className="flex flex-col rounded-lg border bg-card p-6"><Icon className="mb-4 h-9 w-9 text-orange" /><h3 className="mb-3 text-xl font-bold">{v.title[lang]}</h3><p className="mb-5 flex-1 leading-relaxed text-muted-foreground">{v.description[lang]}</p>{v.target === '/economia-territorio' ? <Link to="/economia-territorio" className="text-link">{c.more} →</Link> : <a href={`#${v.target}`} className="text-link">{c.more} ↓</a>}</div>; })}</div></Section>
    <Section id="caso"><div className="grid gap-5 lg:grid-cols-3">{caminhos.map((path, i) => <a key={path.id} href={`#caminho-${path.id}`} className="group rounded-lg border border-orange/40 bg-card p-6 transition-colors hover:bg-highlight"><span className="mb-5 block text-sm font-bold text-orange">{c.path} {String.fromCharCode(65 + i)}</span><h3 className="mb-3 text-xl font-bold">{path.title[lang]}</h3><p className="leading-relaxed text-muted-foreground">{path.intro[lang]}</p><ArrowDown className="mt-5 h-5 w-5 text-orange" /></a>)}</div></Section>
    <Section id="passos"><div className="max-w-4xl">{caminhos.map((path, p) => <div id={`caminho-${path.id}`} className="smallbiz-section mb-12" key={path.id}><div className="mb-7 border-l-4 border-orange pl-5"><p className="mb-2 text-sm font-bold text-orange">{c.path} {String.fromCharCode(65 + p)}</p><h3 className="text-2xl font-bold">{path.title[lang]}</h3><p className="mt-3 text-muted-foreground">{path.intro[lang]}</p></div><ol className="ml-4 border-l border-orange/30">{path.steps.map((s, i) => <li key={i} className="relative pb-8 pl-9"><span className="absolute -left-4 top-0 grid h-8 w-8 place-items-center rounded-full bg-orange text-primary-foreground text-sm font-bold">{i + 1}</span><h4 className="flex items-start gap-2 text-lg font-bold"><FileText className="mt-1 h-4 w-4 shrink-0 text-orange" /><span><Glossed value={s.title[lang]} /></span></h4><p className="mt-2 leading-relaxed"><Glossed value={s.description[lang]} /></p><dl className="mt-3 space-y-2 text-sm text-muted-foreground">{s.where && <div><dt className="inline font-semibold">{c.where}: </dt><dd className="inline">{s.url ? <External url={s.url}>{s.where[lang]}</External> : s.where[lang]}</dd></div>}{(['documents', 'cost', 'deadline'] as const).map(key => s[key] ? <div key={key}><dt className="inline font-semibold">{c[key]}: </dt><dd className="inline">{s[key]?.[lang]}</dd></div> : null)}</dl></li>)}</ol>{p === 0 && <p className="flex gap-3 rounded-lg border border-orange/30 bg-highlight p-5 font-semibold"><AlertCircle className="h-6 w-6 shrink-0 text-orange" />{c.warning}</p>}</div>)}<div className="grid gap-8 border-t pt-8 md:grid-cols-2"><div><h3 className="mb-3 text-xl font-bold">{c.documentTitle}</h3><p className="mb-4 text-sm text-muted-foreground">{c.documentNote}</p><ul className="space-y-3">{c.documentsList.map(d => <li key={d} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-orange" />{d}</li>)}</ul></div><div><h3 className="mb-3 text-xl font-bold">{c.accountantTitle}</h3><p className="leading-relaxed text-muted-foreground">{c.accountantText}</p></div></div></div></Section>
    <Section id="atendimento"><div className="grid gap-5 md:grid-cols-2">{atendimentos.filter(a => a.description || a.url || a.endereco).map(a => <div className="rounded-lg border bg-card p-6" key={a.id}>{a.foto && <img src={a.foto} alt={a.nome} className="mb-5 aspect-video w-full rounded object-cover" />}<Handshake className="mb-4 h-8 w-8 text-orange" /><h3 className="mb-4 text-xl font-bold">{a.nome}</h3><Contact contact={a} /></div>)}</div></Section>
    <Section id="cursos"><p className="mb-6 max-w-3xl leading-relaxed text-muted-foreground">{c.courseIntro}</p>{availableCourses.length > 0 && <div className="grid gap-8 md:grid-cols-2">{(['prefeitura', 'sebrae'] as const).map(group => { const rows = availableCourses.filter(row => row.grupo === group); return rows.length ? <div key={group}><h3 className="mb-4 text-xl font-bold">{group === 'prefeitura' ? c.municipalCourses : c.sebraeCourses}</h3>{[...new Set(rows.map(row => row.tema[lang]))].map(tema => <div key={tema}><h4 className="mb-3 font-bold">{tema}</h4>{rows.filter(row => row.tema[lang] === tema).map(row => <div key={row.id} className="mb-4 rounded-lg border bg-card p-5"><h4 className="font-bold">{row.nome[lang]}</h4><p>{row.provider}</p><p className="my-3 text-sm text-muted-foreground">{[row.formato?.[lang], row.carga, row.gratuito ? c.free : null].filter(Boolean).join(' · ')}</p><External url={row.url}>{c.enroll}</External><SourceLine d={row} className="mt-3" /></div>)}</div>)}</div> : null; })}</div>}<div className="border-l-4 border-orange pl-6"><h3 className="mb-3 text-xl font-bold">{c.trails}</h3><p className="mb-4 max-w-3xl text-muted-foreground">{c.trailsText}</p><External url={links.sebrae}>{c.courseCatalog}</External></div></Section>
    <Section id="digital"><p className="mb-6 max-w-3xl text-muted-foreground">{c.digitalIntro}</p><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{digitalTopics.map(topic => { const Icon = symbols[topic.icon as keyof typeof symbols]; return <div key={topic.icon} className="rounded-lg border bg-card p-6"><Icon className="mb-4 h-8 w-8 text-orange" /><h3 className="mb-3 text-lg font-bold">{topic.title[lang]}</h3><p className="mb-4 text-muted-foreground">{topic.description[lang]}</p><External url={links.sebrae}>{c.training}</External></div>; })}</div><p className="mt-7 flex gap-3 border-l-4 border-orange bg-highlight p-5"><Truck className="h-6 w-6 shrink-0 text-orange" />{c.logisticsNote}</p></Section>
    <Section id="aglomerados"><p className="mb-6 max-w-3xl text-muted-foreground">{c.clusterIntro}</p>{clusters.length > 0 && <div className="mb-6 grid gap-5 md:grid-cols-3">{clusters.map(cl => <div className="rounded-lg border bg-card p-5" key={cl.id}>{cl.foto && <img src={cl.foto} alt={cl.nome} className="mb-4 aspect-video w-full object-cover" />}<h3 className="text-xl font-bold">{cl.nome}</h3>{cl.regiao && <p>{cl.regiao}</p>}{cl.tipo && <p>{cl.tipo[lang]}</p>}{cl.quantidade !== undefined && <p>{cl.quantidade}</p>}{cl.maps && <External url={cl.maps}>{c.directions}</External>}<SourceLine d={cl} /></div>)}</div>}<Link to="/economia-territorio" className="text-link">{c.poles} →</Link></Section>
    <Section id="fornecedores"><div className="grid gap-8 lg:grid-cols-3"><div><Store className="mb-4 h-8 w-8 text-orange" /><h3 className="mb-3 text-xl font-bold">{c.supplierTitle}</h3><p className="mb-4 text-muted-foreground">{c.supplierText}</p>{fornecedores.filter(row => row.id === 'atacado' && metricPublished(row)).map(row => <div key={row.id}><p>{row.valor}</p><SourceLine d={row} /></div>)}<Link to="/empresas" className="text-link">{c.supplierLink} →</Link></div><div><Truck className="mb-4 h-8 w-8 text-orange" /><h3 className="mb-3 text-xl font-bold">{c.carrierTitle}</h3><p className="text-muted-foreground">{c.carrierText}</p>{fornecedores.filter(row => row.id === 'transporte' && metricPublished(row)).map(row => <div key={row.id}><p>{row.valor}</p><SourceLine d={row} /></div>)}</div><div><MapPin className="mb-4 h-8 w-8 text-orange" /><h3 className="mb-3 text-xl font-bold">{c.locationTitle}</h3><p className="mb-4 text-muted-foreground">{c.locationText}</p>{distancias.filter(d => d.valor !== null && sourced(d)).map(d => <div key={d.destino}><p>{d.destino}: {d.valor} {d.unidade}</p><SourceLine d={d} /></div>)}<Link to="/economia-territorio" className="text-link">{c.locationLink} →</Link></div></div></Section>
    <Section id="faq"><Accordion type="multiple" value={printing ? faqs.map(f => f.id) : expanded} onValueChange={setExpanded} className="max-w-4xl">{faqs.map(f => <AccordionItem key={f.id} value={f.id}><AccordionTrigger className="text-left text-base">{f.question[lang]}</AccordionTrigger><AccordionContent className="text-base leading-relaxed"><Glossed value={f.answer[lang]} /></AccordionContent></AccordionItem>)}</Accordion></Section>
    <section className="bg-navy py-12 text-navy-foreground"><div className="mx-auto max-w-7xl px-4 lg:px-6"><div className="grid gap-10 md:grid-cols-2"><div><h2 className="mb-4 text-2xl font-bold">{c.help}</h2>{sala && <Contact contact={sala} light />}</div><div><h2 className="mb-4 text-2xl font-bold">{c.growth}</h2><p className="mb-5 text-navy-muted">{c.growthText}</p><Button asChild variant="cta"><Link to="/investir">{c.invest}</Link></Button></div></div><p className="mt-10 text-sm text-navy-muted">{c.reviewed} {revisadoEm}</p><p className="mt-3 max-w-4xl text-sm text-navy-muted">{c.guidance}</p><nav className="smallbiz-no-print mt-8 flex flex-wrap justify-between gap-4 border-t border-navy-foreground/20 pt-6"><Link to="/inovacao" className="text-orange-light">{c.back}</Link><Link to="/" className="text-orange-light">{c.home} ↑</Link></nav></div></section>
  </article>;
}