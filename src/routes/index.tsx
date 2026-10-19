import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { BarChart3, ArrowRight, Download, FileText, Mail, Phone, Sheet, Check, Award } from "lucide-react";
import { toast } from "sonner";
import { useI18n, fmt } from "@/i18n";
import {
  kpis, perguntas, empresasInstaladas, cidades, comparacao, setores, mapaNumeros, pdfs, contato,
  ultimaAtualizacao, temValor,
} from "@/data/perfil";
import { Button } from "@/components/ui/button";
import { SourceLine, icons, panelIcons } from "@/components/site/common";
import heroImg from "@/assets/hero-contagem.jpg";
import mapaImg from "@/assets/mapa-preview.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perfil de Investimento · Observatório de Contagem/MG" },
      { name: "description", content: "Contagem em números: PIB, empresas, mão de obra, terrenos e comparação com cidades concorrentes. Dados oficiais para investidores." },
      { property: "og:title", content: "Invista em Contagem · Perfil de Investimento 2026" },
      { property: "og:description", content: "Indústria, logística e mercado no coração de Minas Gerais, com fonte e data em cada número." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Section({ title, sub, children, id }: { title: string; sub?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
      <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
      {sub && <p className="mt-3 max-w-2xl text-muted-foreground">{sub}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

const card = "rounded-2xl border bg-card p-6";

function usePdf() {
  const { lang } = useI18n();
  return (l: "pt" | "en" = lang) => {
    const url = pdfs[l];
    if (url) window.open(url, "_blank");
    else window.print();
  };
}

function Index() {
  const { t } = useI18n();
  const openPdf = usePdf();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <img src={heroImg} alt="Vista aérea da área industrial e logística de Contagem" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-6 lg:py-32">
          <p className="eyebrow text-orange-light">{t.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">{t.hero.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-navy-foreground/85">{t.hero.sub}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild variant="cta" size="lg"><Link to="/mapa">{t.hero.ctaMap} <ArrowRight /></Link></Button>
            <Button variant="outlineLight" size="lg" onClick={() => openPdf()}><Download /> {t.hero.ctaPdf}</Button>
            <Button asChild variant="linkLight" size="lg"><Link to="/contato">{t.nav.contact}</Link></Button>
          </div>
          <p className="mt-10 text-sm text-navy-muted">{fmt(t.hero.trust, ultimaAtualizacao)}</p>
        </div>
      </section>

      <Kpis />
      <Why />
      <Compare />
      <Sectors />
      <Explore />
      <MapCta />
      <Close />
    </>
  );
}

function Kpis() {
  const { t } = useI18n();
  const visible = kpis.filter((k) => temValor(k.dado));
  if (!visible.length) return null;
  return (
    <Section title={t.kpi.title}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((k) => {
          const Icon = icons[k.icon] ?? BarChart3;
          return (
            <article key={k.id} className={`${card} flex flex-col`}>
              <Icon className="h-7 w-7 text-orange" aria-hidden />
              <div className="mt-5 font-serif text-4xl font-bold">
                {k.dado.valor}
                {k.dado.unidade && <span className="ml-1 text-2xl">{k.dado.unidade}</span>}
              </div>
              <div className="mt-1 font-semibold">{t.kpi.labels[k.id]}</div>
              {temValor(k.contexto) && <p className="mt-2 text-sm text-muted-foreground">{fmt(t.kpi.ctx[k.id], k.contexto!.valor!)}</p>}
              <SourceLine d={k.dado} className="mt-auto pt-5" />
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function Why() {
  const { t } = useI18n();
  const nums = [perguntas.maoDeObra, perguntas.terreno, perguntas.licenca];
  return (
    <div className="bg-secondary/60">
      <Section title={t.why.title}>
        <div className="grid gap-5 md:grid-cols-3">
          {t.why.items.map((it, i) => {
            const d = nums[i]!;
            return (
              <article key={it.q} className={`${card} flex flex-col`}>
                <h3 className="text-xl font-bold">{it.q}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{it.a}</p>
                {temValor(d) && (
                  <div className="mt-5">
                    <span className="font-serif text-3xl font-bold text-orange">{d.valor}</span>
                    {"unit" in it && it.unit && <span className="ml-2 text-sm font-semibold">{it.unit}</span>}
                    <SourceLine d={d} className="mt-1" />
                  </div>
                )}
                <a href={it.to} className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-link hover:underline">
                  {it.link} <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-14">
          <h3 className="text-lg font-bold">{t.why.who}</h3>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {empresasInstaladas.map((src, i) =>
              src ? (
                <img key={i} src={src} alt="" className="h-16 w-full rounded-xl border bg-card object-contain p-3" loading="lazy" />
              ) : (
                <div key={i} className="grid h-16 place-items-center rounded-xl border border-dashed bg-muted text-xs text-muted-foreground">{t.why.logo}</div>
              ),
            )}
          </div>
          <Link to="/empresas" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
            {t.why.whoLink} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </div>
  );
}

function Compare() {
  const { t } = useI18n();
  const [sel, setSel] = useState<string[]>(cidades.map((c) => c.id));
  const cols = cidades.filter((c) => c.id === "contagem" || sel.includes(c.id));
  const rows = comparacao.filter((r) => Object.keys(r.valores).length > 0);
  const best = useMemo(() => {
    const m: Record<string, string | undefined> = {};
    for (const r of rows) {
      const entries = cols.map((c) => [c.id, r.valores[c.id]?.num] as const).filter((e) => e[1] !== undefined);
      if (entries.length < 2) continue;
      entries.sort((a, b) => (r.maiorMelhor ? b[1]! - a[1]! : a[1]! - b[1]!));
      m[r.id] = entries[0]?.[0];
    }
    return m;
  }, [rows, cols]);
  const pending = rows.some((r) => Object.keys(r.valores).length < cidades.length);

  const csv = () => {
    const head = [t.compare.indicator, ...cols.map((c) => c.nome), "Fonte", "Ano"];
    const lines = rows.map((r) => [t.compare.rows[r.id], ...cols.map((c) => r.valores[c.id]?.txt ?? ""), r.fonte, r.dataReferencia]);
    const body = [head, ...lines].map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob(["\ufeff" + body], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "comparacao-contagem.csv";
    a.click();
  };

  if (!rows.length) return null;
  return (
    <Section title={t.compare.title} sub={t.compare.sub}>
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b">
              <th scope="col" className="sticky left-0 z-10 bg-card p-4 text-left font-semibold">{t.compare.indicator}</th>
              {cols.map((c) => (
                <th key={c.id} scope="col" className={`p-4 text-right font-semibold ${c.id === "contagem" ? "bg-highlight" : ""}`}>{c.nome}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <th scope="row" className="sticky left-0 z-10 bg-card p-4 text-left font-medium">
                  {t.compare.rows[r.id]}
                  <SourceLine d={{ fonte: r.fonte, dataReferencia: r.dataReferencia, atualizadoEm: ultimaAtualizacao }} className="mt-0.5 font-normal" />
                </th>
                {cols.map((c) => (
                  <td key={c.id} className={`p-4 text-right tabular-nums ${c.id === "contagem" ? "bg-highlight font-semibold" : ""}`}>
                    {r.valores[c.id]?.txt ?? <span className="text-muted-foreground">—</span>}
                    {best[r.id] === c.id && <Award className="ml-1 inline h-4 w-4 text-orange" aria-label={t.compare.best} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pending && <p className="mt-3 text-xs text-muted-foreground">{t.compare.pending}</p>}

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="mb-2 w-full text-sm font-semibold lg:mb-0 lg:mr-2 lg:w-auto">{t.compare.with}</legend>
          {cidades.filter((c) => c.id !== "contagem").map((c) => {
            const on = sel.includes(c.id);
            return (
              <button key={c.id} type="button" aria-pressed={on}
                onClick={() => setSel((s) => (on ? s.filter((x) => x !== c.id) : [...s, c.id]))}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium ${on ? "border-navy bg-navy text-navy-foreground" : "bg-card"}`}>
                {on && <Check className="h-3 w-3" />} {c.nome}
              </button>
            );
          })}
        </fieldset>
        <Button variant="outline" className="rounded-full" onClick={csv}><Download /> {t.compare.csv}</Button>
      </div>
    </Section>
  );
}

function Sectors() {
  const { t, lang } = useI18n();
  return (
    <div className="bg-secondary/60">
      <Section title={t.sectors.title}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {setores.slice(0, 6).map((s) => {
            const Icon = icons[s.icon] ?? BarChart3;
            const nums = s.numeros.filter((n) => temValor(n.dado));
            return (
              <article key={s.slug} className={`${card} flex flex-col`}>
                <Icon className="h-8 w-8 text-orange" aria-hidden />
                <h3 className="mt-4 text-xl font-bold">{s.nome[lang]}</h3>
                {nums.map((n, i) => (
                  <div key={i} className="mt-4">
                    <span className="font-serif text-2xl font-bold">{n.dado.valor}</span>{" "}
                    <span className="text-sm">{n.rotulo[lang]}</span>
                    <SourceLine d={n.dado} />
                  </div>
                ))}
                {s.exemplos.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.sectors.examples}</p>
                    <p className="mt-1 text-sm">{s.exemplos.join(" · ")}</p>
                  </div>
                )}
                <a href={`/investir#setor-${s.slug}`} className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-link hover:underline">
                  {t.sectors.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function Explore() {
  const { t } = useI18n();
  return (
    <Section title={t.explore.title}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.panels.map((p, i) => {
          const Icon = panelIcons[i] ?? BarChart3;
          return (
            <a key={p.slug} href={p.slug} className={`${card} group flex flex-col transition hover:-translate-y-1 hover:border-orange hover:shadow-lg`}>
              <div className="flex items-center justify-between">
                <span className="eyebrow text-muted-foreground">{t.explore.axis} {i + 1}</span>
                <Icon className="h-6 w-6 text-orange" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-bold">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.q}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-link">
                {t.explore.open} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </a>
          );
        })}
      </div>
    </Section>
  );
}

function MapCta() {
  const { t } = useI18n();
  const nums = mapaNumeros.filter((n) => temValor(n.dado));
  return (
    <section className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2 lg:px-6">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">{t.map.title}</h2>
          <p className="mt-4 text-navy-foreground/85">{t.map.text}</p>
          {nums.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-8">
              {nums.map((n) => (
                <div key={n.id}>
                  <div className="font-serif text-4xl font-bold text-orange-light">{n.dado.valor}</div>
                  <div className="text-sm text-navy-muted">{t.map.labels[n.id]}</div>
                </div>
              ))}
            </div>
          )}
          <Button asChild variant="cta" size="lg" className="mt-10"><Link to="/mapa">{t.map.cta} <ArrowRight /></Link></Button>
        </div>
        <img src={mapaImg} alt={t.map.alt} width={1280} height={960} loading="lazy" className="w-full rounded-2xl border border-navy-foreground/10 shadow-2xl" />
      </div>
    </section>
  );
}

function Close() {
  const { t } = useI18n();
  const openPdf = usePdf();
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    toast.success(t.close.ok);
    e.currentTarget.reset();
  };
  const input = "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 lg:grid-cols-[1fr_1.4fr] lg:px-6" id="contato">
      <div className="space-y-6">
        <div className={card}>
          <h2 className="text-2xl font-bold">{t.close.take}</h2>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="cta" size="lg" className="justify-start" onClick={() => openPdf("pt")}><FileText /> {t.close.pdfPt}</Button>
            <Button variant="outline" size="lg" className="justify-start rounded-full" onClick={() => openPdf("en")}><FileText /> {t.close.pdfEn}</Button>
            <Link to="/dados" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-link hover:underline"><Sheet className="h-4 w-4" /> {t.close.sheet}</Link>
          </div>
        </div>
        <div className="rounded-2xl bg-highlight p-6">
          <p className="font-serif text-lg font-bold">{t.close.expand}</p>
        </div>
        <div className={card}>
          <h3 className="font-bold">{t.close.direct}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t.close.org}</p>
          <a href={`mailto:${contato.email}`} className="mt-3 flex items-center gap-2 text-sm text-link hover:underline"><Mail className="h-4 w-4" /> {contato.email}</a>
          {contato.telefone && <p className="mt-2 flex items-center gap-2 text-sm"><Phone className="h-4 w-4" /> {contato.telefone}</p>}
        </div>
      </div>

      <form onSubmit={submit} className={card}>
        <h2 className="text-2xl font-bold">{t.close.talk}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">{t.close.f.name}<input required name="nome" className={input} /></label>
          <label className="text-sm font-medium">{t.close.f.company}<input name="empresa" className={input} /></label>
          <label className="text-sm font-medium">{t.close.f.email}<input required type="email" name="email" className={input} /></label>
          <label className="text-sm font-medium">{t.close.f.phone}<input type="tel" name="telefone" className={input} /></label>
          <label className="text-sm font-medium">{t.close.f.sector}
            <select name="setor" className={input} defaultValue=""><option value="" disabled>{t.close.f.select}</option>{t.close.sectorsList.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="text-sm font-medium">{t.close.f.interest}
            <select name="interesse" className={input} defaultValue=""><option value="" disabled>{t.close.f.select}</option>{t.close.interests.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="text-sm font-medium sm:col-span-2">{t.close.f.message}<textarea name="mensagem" rows={4} className={input} /></label>
        </div>
        <Button type="submit" variant="cta" size="lg" className="mt-6">{t.close.f.send}</Button>
        {sent && <p role="status" className="mt-4 text-sm font-medium text-link">{t.close.ok}</p>}
      </form>
    </section>
  );
}
