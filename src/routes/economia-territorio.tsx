import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/economia-territorio")({
  head: () => ({
    meta: [
      { title: "Economia e Território · Observatório de Contagem" },
      { name: "description", content: "Economia e Território: tamanho e crescimento do mercado de Contagem." },
      { property: "og:title", content: "Economia e Território · Observatório de Contagem" },
      { property: "og:description", content: "Economia e Território: tamanho e crescimento do mercado de Contagem." },
    ],
  }),
  component: () => <WipPage title="Economia e Território" />,
});
