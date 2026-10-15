import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/inovacao")({
  head: () => ({
    meta: [
      { title: "Inovação · Observatório de Contagem" },
      { name: "description", content: "Tecnologia e parceiros para inovar em Contagem." },
      { property: "og:title", content: "Inovação · Observatório de Contagem" },
      { property: "og:description", content: "Tecnologia e parceiros para inovar em Contagem." },
    ],
  }),
  component: () => <WipPage title="Inovação" />,
});
