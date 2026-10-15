import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { BrandMark, LangSwitch, panelIcons } from "./common";

const navLink = "text-sm font-medium text-navy-foreground/90 hover:text-navy-foreground border-b-2 border-transparent py-1";
const active = { className: "border-orange text-navy-foreground" };

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy text-navy-foreground shadow-lg">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
        <Link to="/" aria-label={t.nav.home}><BrandMark /></Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          <Link to="/" className={navLink} activeProps={active} activeOptions={{ exact: true }}>{t.nav.home}</Link>
          <div className="relative" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
            <button type="button" className={`${navLink} flex items-center gap-1`} aria-expanded={drop} onClick={() => setDrop((v) => !v)}>
              {t.nav.panels} <ChevronDown className="h-4 w-4" />
            </button>
            {drop && (
              <div className="absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-3">
                <ul className="rounded-2xl border bg-card p-2 text-card-foreground shadow-xl">
                  {t.panels.map((p, i) => {
                    const Icon = panelIcons[i];
                    return (
                      <li key={p.slug}>
                        <a href={p.slug} className="flex gap-3 rounded-xl p-3 hover:bg-muted">
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                          <span>
                            <span className="block text-sm font-semibold">{p.name}</span>
                            <span className="block text-xs text-muted-foreground">{p.q}</span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <Button asChild variant="pill" size="sm" className="px-4"><Link to="/mapa">{t.nav.map}</Link></Button>
          <Link to="/dados" className={navLink} activeProps={active}>{t.nav.data}</Link>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LangSwitch />
          <Button asChild variant="cta"><Link to="/contato">{t.nav.contact}</Link></Button>
        </div>

        <button type="button" className="lg:hidden" aria-label={t.nav.menu} onClick={() => setOpen(true)}>
          <Menu className="h-7 w-7" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-navy/60 lg:hidden" onClick={() => setOpen(false)}>
          <div className="ml-auto flex h-full w-80 max-w-full flex-col gap-1 overflow-y-auto bg-navy p-6" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="mb-4 self-end" aria-label="Fechar" onClick={() => setOpen(false)}><X className="h-7 w-7" /></button>
            <Link to="/" onClick={() => setOpen(false)} className="py-2 font-semibold">{t.nav.home}</Link>
            <div className="py-2 text-xs uppercase tracking-wider text-navy-muted">{t.nav.panels}</div>
            {t.panels.map((p) => (
              <a key={p.slug} href={p.slug} className="py-1.5 pl-3 text-sm">{p.name}</a>
            ))}
            <Button asChild variant="pill" className="mt-4"><Link to="/mapa" onClick={() => setOpen(false)}>{t.nav.map}</Link></Button>
            <Link to="/dados" onClick={() => setOpen(false)} className="py-3 font-semibold">{t.nav.data}</Link>
            <div className="mt-auto flex flex-col gap-4 pt-6">
              <LangSwitch />
              <Button asChild variant="cta"><Link to="/contato" onClick={() => setOpen(false)}>{t.nav.contact}</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
