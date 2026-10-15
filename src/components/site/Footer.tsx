import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { ultimaAtualizacao } from "@/data/perfil";
import { BrandMark, LangSwitch } from "./common";

export function Footer() {
  const { t } = useI18n();
  const l = "text-sm text-navy-muted hover:text-navy-foreground";
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div className="space-y-3">
          <BrandMark />
          <p className="text-sm text-navy-muted">{t.brand.org}</p>
        </div>
        <ul className="space-y-2">
          {t.panels.map((p) => <li key={p.slug}><a href={p.slug} className={l}>{p.name}</a></li>)}
        </ul>
        <ul className="space-y-2">
          <li><Link to="/mapa" className={l}>{t.nav.map}</Link></li>
          <li><Link to="/dados" className={l}>{t.nav.data}</Link></li>
          <li><Link to="/dados" className={l}>{t.nav.methodology}</Link></li>
          <li><Link to="/contato" className={l}>{t.nav.contact}</Link></li>
        </ul>
        <div className="space-y-3 text-sm text-navy-muted">
          <p>{t.footer.updated}: <span className="text-navy-foreground">{ultimaAtualizacao}</span></p>
          <LangSwitch />
          <p>{t.footer.open}</p>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10 py-5 text-center text-xs text-navy-muted">{t.footer.copy}</div>
    </footer>
  );
}
