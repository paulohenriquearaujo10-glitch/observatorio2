import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/dados")({
  head: () => ({
    meta: [
      { title: "Dados e Fontes · Observatório de Contagem" },
      { name: "description", content: "Dados abertos, fontes e metodologia do Observatório." },
      { property: "og:title", content: "Dados e Fontes · Observatório de Contagem" },
      { property: "og:description", content: "Dados abertos, fontes e metodologia do Observatório." },
    ],
  }),
  component: () => <WipPage title="Dados e Fontes" />,
});
