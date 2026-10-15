import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { pt, type Dict } from "./pt";
import { en } from "./en";

export type Lang = "pt" | "en";
const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({ lang: "pt", t: pt, setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");
  useEffect(() => {
    const s = localStorage.getItem("lang");
    if (s === "en" || s === "pt") setLangState(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };
  return <Ctx.Provider value={{ lang, t: lang === "pt" ? pt : en, setLang }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
export const fmt = (s: string, v: string | number) => s.replace("{v}", String(v)).replace("{d}", String(v));
