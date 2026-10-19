import type { Dict } from "./pt";
import { economiaEn } from "./economia";
import { empresasEn } from "./empresas";
import { trabalhoEn } from "./trabalho";
import { infraestruturaEn } from "./infraestrutura";
import { investirEn } from "./investir";
import { inovacaoEn } from "./inovacao";
import { pequenosEn } from "./pequenos-negocios";

export const en: Dict = {
  economy: economiaEn,
  companies: empresasEn,
  labor: trabalhoEn,
  infrastructure: infraestruturaEn,
  invest: investirEn,
  innovation: inovacaoEn,
  smallBiz: pequenosEn,
  brand: { name: "Contagem Observatory", tagline: "Invest in Contagem", org: "City of Contagem · SUPGEST" },
  nav: { home: "Home", panels: "Dashboards", map: "Opportunity Map", data: "Data & Sources", contact: "Talk to SUPGEST", menu: "Open menu", methodology: "Methodology" },
  panels: [
    { slug: "/economia-territorio", name: "Economy & Territory", q: "Is the market large and growing?" },
    { slug: "/empresas", name: "Companies & Supply Chains", q: empresasEn.question },
    { slug: "/trabalho", name: "Labor & Skills", q: trabalhoEn.question },
    { slug: "/infraestrutura", name: "Infrastructure & Business Climate", q: infraestruturaEn.question },
    { slug: "/investir", name: "Invest", q: investirEn.question },
    { slug: "/inovacao", name: "Innovation", q: inovacaoEn.question },
    { slug: "/pequenos-negocios", name: "Small Business", q: pequenosEn.question },
  ],
  source: { fonte: "Source", dados: "Data from", atualizado: "Updated on" },
  hero: {
    eyebrow: "Investment Profile · 2026",
    title: "Contagem: industry, logistics and market in the heart of Minas Gerais",
    sub: "The data you need to decide where to invest, with sources, dates and comparison with competing cities.",
    ctaMap: "See opportunities on the map",
    ctaPdf: "Download profile (PDF)",
    trust: "Data updated on {d} · Official sources: IBGE, RAIS, Caged, Federal Revenue",
  },
  kpi: {
    title: "Contagem in numbers",
    labels: { pib: "GDP", populacao: "inhabitants", empregos: "formal jobs", empresas: "active companies", investimento: "investment attracted", localizacao: "from BH and Confins Airport" },
    ctx: { pib: "{v} largest GDP in Minas Gerais", populacao: "{v}", empregos: "{v}", empresas: "{v}", investimento: "{v}", localizacao: "{v}" },
  },
  why: {
    title: "The three most-searched indicators",
    items: [
      { q: "Workforce availability", a: "A consolidated industrial base and technical training in town, with SENAI, SENAC and SENAT units.", link: "See Labor dashboard", to: "/trabalho" },
      { q: "Types of areas available", a: "Mapped lots and warehouses, with zoning and infrastructure described in each listing.", link: "See on the Map", to: "/mapa", unit: "mapped lots" },
      { q: "Average licensing time", a: "Average permit and licensing times tracked by the City.", link: "See Infrastructure dashboard", to: "/infraestrutura", unit: "days on average" },
    ],
    who: "Who is already here",
    whoLink: "See companies and supply chains",
    logo: "Company logo",
  },
  compare: {
    title: "Contagem next to the alternatives",
    sub: "Discover where Contagem leads in attracting investment",
    indicator: "Indicator",
    rows: { pib: "GDP", pibPc: "GDP per capita", pop: "Population", empregos: "Formal jobs", salario: "Average wage", empresas: "Active companies", crescEmprego: "Job growth (12 months)", clp: "Competitiveness ranking (CLP)" },
    with: "Compare with",
    csv: "Download comparison (CSV)",
    best: "Best value",
    pending: "Data for other cities being consolidated.",
  },
  sectors: { title: "Main economic sectors of Contagem", examples: "Companies on site", cta: "See sector thesis" },
  explore: { title: "Go deeper by topic", axis: "Axis", open: "Open dashboard" },
  map: {
    title: "Find the right place for your company",
    text: "Lots, warehouses, zoning, infrastructure and incentives in one map, with a sheet for each property and a contact person.",
    labels: { lotes: "mapped lots", galpoes: "available warehouses", areaPronta: "Ready Area certified sites" },
    cta: "Open the Opportunity Map",
    alt: "Preview of the Contagem map with marked opportunities",
  },
  close: {
    take: "Take the profile with you",
    pdfPt: "Perfil de Investimento (PDF, português)",
    pdfEn: "Investment Profile (PDF, English)",
    sheet: "All data in spreadsheet",
    talk: "Talk to SUPGEST",
    expand: "Already in Contagem and want to grow? Talk to us.",
    f: { name: "Name", company: "Company", email: "Email", phone: "Phone", sector: "Industry", interest: "Type of interest", message: "Message", send: "Send", select: "Select" },
    interests: ["New facility", "Expansion of an existing company", "Partnership", "Other"],
    sectorsList: ["Industry", "Logistics", "Trade", "Services", "Technology", "Other"],
    ok: "Message sent! SUPGEST will get back to you soon.",
    direct: "Direct contact",
    org: "Management Superintendency (SUPGEST) · City of Contagem",
  },
  footer: { updated: "Last data update", open: "Open data for reuse with source attribution", copy: "© 2026 Municipality of Contagem/MG" },
  wip: { title: "Under construction", text: "This Observatory page is being prepared.", back: "Back to home" },
};
