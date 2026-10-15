import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/infraestrutura")({
  head: () => ({
    meta: [
      { title: "Infraestrutura e Ambiente de Negócios · Observatório de Contagem" },
      { name: "description", content: "Infraestrutura e licenciamento em Contagem." },
      { property: "og:title", content: "Infraestrutura e Ambiente de Negócios · Observatório de Contagem" },
      { property: "og:description", content: "Infraestrutura e licenciamento em Contagem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <WipPage title="Infraestrutura e Ambiente de Negócios" />,
});
