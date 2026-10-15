import { createFileRoute } from "@tanstack/react-router";
import { CompaniesDashboard } from "@/components/companies/CompaniesDashboard";

export const Route = createFileRoute("/empresas")({
  head: () => ({
    meta: [
      { title: "Empresas e Cadeias · Observatório de Contagem" },
      { name: "description", content: "Empresas instaladas e cadeias produtivas de Contagem." },
      { property: "og:title", content: "Empresas e Cadeias · Observatório de Contagem" },
      { property: "og:description", content: "Empresas instaladas e cadeias produtivas de Contagem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompaniesDashboard,
});
