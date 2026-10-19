import brandLogo from "@/assets/logo-observatorio-contagem-128.png.asset.json";
import {
  Landmark, Users, Briefcase, Building2, TrendingUp, MapPin, Truck, Cog, Store, BarChart3, Factory,
  GraduationCap, Network, Rocket, Lightbulb, Sprout, type LucideIcon,
} from "lucide-react";
import { useI18n, type Lang } from "@/i18n";
import type { Dado } from "@/data/perfil";
import { cn } from "@/lib/utils";

export const icons: Record<string, LucideIcon> = { Landmark, Users, Briefcase, Building2, TrendingUp, MapPin, Truck, Cog, Store };
export const panelIcons: LucideIcon[] = [BarChart3, Factory, GraduationCap, Network, Rocket, Lightbulb, Sprout];

export function SourceLine({ d, className }: { d: Pick<Dado, "fonte" | "dataReferencia" | "atualizadoEm">; className?: string }) {
  const { t } = useI18n();
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      {t.source.fonte}: {d.fonte} · {t.source.dados} {d.dataReferencia} · {t.source.atualizado} {d.atualizadoEm}
    </p>
  );
}

export function LangSwitch({ dark = true }: { dark?: boolean }) {
  const { lang, setLang } = useI18n();
  const opt = (l: Lang) => (
    <button
      type="button"
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      className={cn(
        "px-2 py-1 text-sm font-semibold rounded",
        lang === l ? (dark ? "text-orange-light" : "text-orange") : dark ? "text-navy-muted hover:text-navy-foreground" : "text-muted-foreground",
      )}
    >
      {l.toUpperCase()}
    </button>
  );
  return (
    <div className="flex items-center" role="group" aria-label="Idioma / Language">
      {opt("pt")}
      <span className="text-navy-muted" aria-hidden>|</span>
      {opt("en")}
    </div>
  );
}

export function BrandMark() {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-3">
      <img src={brandLogo.url} alt="" className="h-10 w-10 rounded-full object-cover" aria-hidden />
      <div className="leading-tight">
        <div className="font-serif text-base font-bold text-navy-foreground">{t.brand.name}</div>
        <div className="text-xs text-navy-muted">{t.brand.tagline}</div>
      </div>
    </div>
  );
}
