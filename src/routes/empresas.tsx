import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/empresas")({
  head: () => ({
    meta: [
      { title: "Empresas e Cadeias · Observatório de Contagem" },
      { name: "description", content: "Empresas instaladas e cadeias produtivas de Contagem." },
      { property: "og:title", content: "Empresas e Cadeias · Observatório de Contagem" },
      { property: "og:description", content: "Empresas instaladas e cadeias produtivas de Contagem." },
    ],
  }),
  component: () => <WipPage title="Empresas e Cadeias" />,
});
