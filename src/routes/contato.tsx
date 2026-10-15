import { createFileRoute } from "@tanstack/react-router";
import { WipPage } from "@/components/site/WipPage";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Fale com a SUPGEST · Observatório de Contagem" },
      { name: "description", content: "Contato da Superintendência de Gestão da Prefeitura de Contagem." },
      { property: "og:title", content: "Fale com a SUPGEST · Observatório de Contagem" },
      { property: "og:description", content: "Contato da Superintendência de Gestão da Prefeitura de Contagem." },
    ],
  }),
  component: () => <WipPage title="Fale com a SUPGEST" />,
});
