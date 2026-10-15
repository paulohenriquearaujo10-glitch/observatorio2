import { createFileRoute } from "@tanstack/react-router";
import { LaborDashboard } from "@/components/labor/LaborDashboard";

export const Route = createFileRoute("/trabalho")({
  head: () => ({
    meta: [
      { title: "Trabalho e Qualificação · Observatório de Contagem" },
      { name: "description", content: "Vou achar gente qualificada, e a que custo? Emprego, salários, formação e turmas sob medida em Contagem." },
      { property: "og:title", content: "Trabalho e Qualificação · Observatório de Contagem" },
      { property: "og:description", content: "Vou achar gente qualificada, e a que custo? Emprego, salários e formação profissional em Contagem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LaborDashboard,
});
