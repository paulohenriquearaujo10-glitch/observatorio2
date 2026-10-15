import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/infraestrutura")({
  head: () => ({
    meta: [
      { title: "Infraestrutura e Ambiente de Negócios · Observatório de Contagem" },
      { name: "description", content: "Infraestrutura e licenciamento em Contagem." },
      { property: "og:title", content: "Infraestrutura e Ambiente de Negócios · Observatório de Contagem" },
      { property: "og:description", content: "Infraestrutura e licenciamento em Contagem." },
    ],
  }),
  component: () => <WipPage title="Infraestrutura e Ambiente de Negócios" />,
});
