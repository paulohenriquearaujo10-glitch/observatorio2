import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Source } from "@/components/economy/ChartPanel";
import { findCaso } from "@/data/investir";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/investir_/caso/$slug")({
  loader: ({ params }) => { const caso = findCaso(params.slug); if (!caso) throw notFound(); return { slug: caso.slug, nome: caso.nome }; },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.nome} em Contagem · Casos de sucesso` },
      { name: "description", content: `Por que ${loaderData.nome} escolheu Contagem: investimento e números do projeto.` },
      { property: "og:title", content: `${loaderData.nome} em Contagem · Casos de sucesso` },
      { property: "og:description", content: `Por que ${loaderData.nome} escolheu Contagem.` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ] : [{ title: "Caso indisponível · Observatório de Contagem" }, { name: "robots", content: "noindex" }],
  }),
  component: CasePage,
});

function CasePage() {
  const { slug } = Route.useLoaderData(); const caso = findCaso(slug)!;
  const { t, lang } = useI18n(); const c = t.invest;
  const nf = (n: number) => n.toLocaleString(lang === "pt" ? "pt-BR" : "en-US");
  return <article className="mx-auto max-w-3xl px-4 py-14">
    <Button asChild variant="link" className="px-0"><Link to="/investir"><ArrowLeft />{c.caseBack}</Link></Button>
    <p className="eyebrow mt-4 text-orange">{c.sections.casos}</p>
    <h1 className="mt-2 text-4xl font-bold">{caso.nome}</h1><p className="text-muted-foreground">{caso.grupo[lang]}</p>
    {caso.investimento !== null && <p className="mt-6"><span>{c.caseInvestment}: </span><span className="font-serif text-3xl font-bold text-orange">R$ {nf(caso.investimento / 1e6)} {lang === "pt" ? "milhões" : "million"}</span></p>}
    {caso.motivo && <p className="mt-4">{caso.motivo[lang]}</p>}
    {caso.historia && <p className="mt-4">{caso.historia[lang]}</p>}
    {caso.citacao && <blockquote className="mt-6 border-l-4 border-orange pl-4 italic">“{caso.citacao[lang]}”</blockquote>}
    {!caso.motivo && !caso.historia && !caso.citacao && <p className="mt-6 text-sm text-muted-foreground">{c.casePending}</p>}
    <div className="mt-6"><Source data={caso} /></div>
    <Button asChild variant="cta" className="mt-8"><Link to="/contato">{c.cta}</Link></Button>
  </article>;
}
