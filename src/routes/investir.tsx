import { createFileRoute } from "@tanstack/react-router";
import { InvestDashboard } from "@/components/invest/InvestDashboard";

const desc = "O que está disponível agora, e com que incentivo? Áreas, imóveis, incentivos, investimentos, teses por setor e casos em Contagem.";
export const Route = createFileRoute("/investir")({
  head: () => ({
    meta: [
      { title: "Investir em Contagem · Observatório de Contagem" },
      { name: "description", content: desc },
      { property: "og:title", content: "Investir em Contagem · Observatório de Contagem" },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvestDashboard,
});
