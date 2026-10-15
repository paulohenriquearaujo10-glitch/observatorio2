import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/trabalho")({
  head: () => ({
    meta: [
      { title: "Trabalho e Qualificação · Observatório de Contagem" },
      { name: "description", content: "Mão de obra, emprego e qualificação em Contagem." },
      { property: "og:title", content: "Trabalho e Qualificação · Observatório de Contagem" },
      { property: "og:description", content: "Mão de obra, emprego e qualificação em Contagem." },
    ],
  }),
  component: () => <WipPage title="Trabalho e Qualificação" />,
});
