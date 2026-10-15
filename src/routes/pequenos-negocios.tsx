import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/pequenos-negocios")({
  head: () => ({
    meta: [
      { title: "Pequenos Negócios · Observatório de Contagem" },
      { name: "description", content: "Como abrir e crescer um pequeno negócio em Contagem." },
      { property: "og:title", content: "Pequenos Negócios · Observatório de Contagem" },
      { property: "og:description", content: "Como abrir e crescer um pequeno negócio em Contagem." },
    ],
  }),
  component: () => <WipPage title="Pequenos Negócios" />,
});
