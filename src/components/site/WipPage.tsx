import { Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

export function WipPage({ title }: { title: string }) {
  const { t } = useI18n();
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      <Construction className="h-12 w-12 text-orange" />
      <p className="eyebrow mt-6 text-orange">{t.wip.title}</p>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h1>
      <p className="mt-4 text-muted-foreground">{t.wip.text}</p>
      <Button asChild variant="cta" size="lg" className="mt-8"><Link to="/">{t.wip.back}</Link></Button>
    </section>
  );
}
