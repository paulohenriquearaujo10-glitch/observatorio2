import { createFileRoute } from "@tanstack/react-router";
import { InfrastructureDashboard } from "@/components/infrastructure/InfrastructureDashboard";

export const Route = createFileRoute("/infraestrutura")({
  head: () => ({
    meta: [
      { title: "Infraestrutura e Ambiente de Negócios · Observatório de Contagem" },
      { name: "description", content: "Consigo me instalar rápido e operar barato? Logística, utilidades, imóveis, custos e licenciamento em Contagem." },
      { property: "og:title", content: "Infraestrutura e Ambiente de Negócios · Observatório de Contagem" },
      { property: "og:description", content: "Consigo me instalar rápido e operar barato? Logística, utilidades, imóveis, custos e licenciamento em Contagem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InfrastructureDashboard,
});
