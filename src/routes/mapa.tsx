import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de Oportunidades · Observatório de Contagem" },
      { name: "description", content: "Lotes, galpões e áreas disponíveis em Contagem." },
      { property: "og:title", content: "Mapa de Oportunidades · Observatório de Contagem" },
      { property: "og:description", content: "Lotes, galpões e áreas disponíveis em Contagem." },
    ],
  }),
  component: () => <WipPage title="Mapa de Oportunidades" />,
});
