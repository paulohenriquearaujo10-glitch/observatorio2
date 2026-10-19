import { createFileRoute } from "@tanstack/react-router";
import { InnovationDashboard } from "@/components/innovation/InnovationDashboard";

const title = "Inovação e Transformação Produtiva · Observatório de Contagem";
const description = "Há parceiros para inovar e automatizar? Indústria 4.0, universidades, startups, hubs e financiamento à inovação em Contagem e na RMBH.";

export const Route = createFileRoute("/inovacao")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InnovationDashboard,
});
