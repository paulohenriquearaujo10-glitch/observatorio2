import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/investir")({
  head: () => ({
    meta: [
      { title: "Investir · Observatório de Contagem" },
      { name: "description", content: "Oportunidades e incentivos para investir em Contagem." },
      { property: "og:title", content: "Investir · Observatório de Contagem" },
      { property: "og:description", content: "Oportunidades e incentivos para investir em Contagem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <WipPage title="Investir" />,
});
