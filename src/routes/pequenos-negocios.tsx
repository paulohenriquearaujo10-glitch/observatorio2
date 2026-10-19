import { createFileRoute } from "@tanstack/react-router";
import { SmallBusinessGuide } from "@/components/smallbiz/SmallBusinessGuide";

export const Route = createFileRoute("/pequenos-negocios")({
  head: () => ({
    meta: [
      { title: "Pequenos Negócios · Observatório de Contagem" },
      { name: "description", content: "Como abrir e crescer um pequeno negócio em Contagem." },
      { property: "og:title", content: "Pequenos Negócios · Observatório de Contagem" },
      { property: "og:description", content: "Como abrir e crescer um pequeno negócio em Contagem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmallBusinessGuide,
});
