import { createFileRoute } from "@tanstack/react-router";
import { EconomyDashboard } from "@/components/economy/EconomyDashboard";

export const Route = createFileRoute("/economia-territorio")({
  head: () => ({
    meta: [
      { title: "Economia e Território · Observatório de Contagem" },
      { name: "description", content: "Economia e Território: tamanho e crescimento do mercado de Contagem." },
      { property: "og:title", content: "Economia e Território · Observatório de Contagem" },
      { property: "og:description", content: "Economia e Território: tamanho e crescimento do mercado de Contagem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EconomyDashboard,
});
