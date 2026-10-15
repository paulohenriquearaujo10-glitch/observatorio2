// Only supplied statistics are populated. Empty series never produce a chart.
export type LocalText = { pt: string; en: string };
export type SectionId = "economia" | "mercado" | "comercio" | "territorio" | "qualidade" | "competitividade";
export type Metadata = { unidade: string; fonte: string; dataReferencia: string; periodicidade: "annual" | "monthly" | "census" | "variable"; atualizadoEm: string };
export const atualizadoEm = "15/10/2026";
export const comparadores = [
  { id: "betim", nome: "Betim" }, { id: "bh", nome: "Belo Horizonte" }, { id: "sete-lagoas", nome: "Sete Lagoas" },
  { id: "uberlandia", nome: "Uberlândia" }, { id: "campinas", nome: "Campinas (SP)" }, { id: "joinville", nome: "Joinville (SC)" },
  { id: "juiz-de-fora", nome: "Juiz de Fora" }, { id: "ribeirao-das-neves", nome: "Ribeirão das Neves" }, { id: "mg", nome: "Minas Gerais" }, { id: "br", nome: "Brasil" },
];
export const comparacaoPadrao = ["mg", "br", "betim", "bh"];
export const meta = (fonte: string, unidade: string, periodicidade: Metadata["periodicidade"] = "annual", dataReferencia = ""): Metadata => ({ fonte, unidade, periodicidade, dataReferencia, atualizadoEm });
export const indicadores: Array<Metadata & { id: "pib" | "pibPc" | "populacao" | "mercado" | "exportacoes"; valor: number | null; contexto?: LocalText; variacao?: LocalText }> = [
  { id: "pib", valor: 45.1, ...meta("IBGE", "R$ bi", "annual", "2023"), contexto: { pt: "4º maior PIB de Minas Gerais", en: "4th largest GDP in Minas Gerais" } },
  { id: "pibPc", valor: null, ...meta("IBGE", "R$") },
  { id: "populacao", valor: null, ...meta("IBGE", "habitantes", "annual", "2025") },
  { id: "mercado", valor: null, ...meta("IBGE / RAIS", "milhões de pessoas") },
  { id: "exportacoes", valor: null, ...meta("Comex Stat (MDIC)", "US$", "monthly") },
];
export type Point = { periodo: string; valores: Record<string, number | null>; recorte?: string };
export type SeriesKey = { id: string; nome: LocalText; cidade?: string; negative?: boolean };
export type ChartData = Metadata & {
  id: string; section: SectionId; titulo: LocalText; metrica: LocalText;
  tipo: "line" | "stacked" | "horizontal" | "trade" | "pyramid" | "radar" | "sparkline";
  modos?: Array<"value" | "index" | "percentage">; serie: Point[]; chaves: SeriesKey[]; recortes?: string[];
};
const cities: SeriesKey[] = [{ id: "contagem", nome: { pt: "Contagem", en: "Contagem" }, cidade: "contagem" }, ...comparadores.map(c => ({ id: c.id, nome: { pt: c.nome, en: c.nome }, cidade: c.id }))];
const chart = (id: string, section: SectionId, tipo: ChartData["tipo"], pt: string, en: string, fonte: string, unidade: string, extra: Partial<ChartData> = {}): ChartData => ({ id, section, tipo, titulo: { pt, en }, metrica: { pt, en }, ...meta(fonte, unidade), serie: [], chaves: cities, ...extra });
export const graficos: ChartData[] = [
  chart("pib", "economia", "line", "Evolução do PIB", "GDP over time", "IBGE / Fundação João Pinheiro", "R$", { modos: ["value", "index"] }),
  chart("pib-per-capita", "economia", "line", "Evolução do PIB per capita", "GDP per capita over time", "IBGE", "R$", { modos: ["value", "index"] }),
  chart("valor-adicionado", "economia", "stacked", "Estrutura do valor adicionado", "Value added structure", "IBGE / Fundação João Pinheiro", "R$", { modos: ["value", "percentage"], chaves: [
    { id: "industria", nome: { pt: "Indústria", en: "Industry" } }, { id: "servicos", nome: { pt: "Comércio e Serviços", en: "Trade and Services" } }, { id: "administracao", nome: { pt: "Administração pública", en: "Public administration" } }, { id: "agropecuaria", nome: { pt: "Agropecuária", en: "Agriculture" } },
  ] }),
  chart("ranking-pib", "economia", "horizontal", "Os maiores PIBs de Minas Gerais", "Largest GDPs in Minas Gerais", "IBGE", "R$"),
  chart("icms", "economia", "sparkline", "ICMS arrecadado", "ICMS revenue", "SEF-MG", "R$"),
  chart("vaf", "economia", "sparkline", "Valor Adicionado Fiscal", "Fiscal value added", "SEF-MG", "R$"),
  chart("receita-propria", "economia", "sparkline", "Receita própria / receita total", "Own revenue / total revenue", "Siconfi", "%"),
  chart("populacao", "mercado", "line", "Evolução da população", "Population over time", "IBGE", "habitantes"),
  chart("piramide", "mercado", "pyramid", "Estrutura etária da população", "Population age structure", "IBGE", "pessoas", { periodicidade: "census", chaves: [{ id: "homens", nome: { pt: "Homens", en: "Men" }, negative: true }, { id: "mulheres", nome: { pt: "Mulheres", en: "Women" } }] }),
  chart("salario", "mercado", "line", "Salário médio formal", "Average formal wage", "RAIS", "R$"),
  chart("massa-salarial", "mercado", "line", "Massa salarial anual", "Annual payroll", "RAIS", "R$"),
  chart("comercio-exterior", "comercio", "trade", "Exportações, importações e saldo", "Exports, imports and balance", "Comex Stat (MDIC)", "US$", { periodicidade: "monthly", chaves: [{ id: "exportacao", nome: { pt: "Exportações", en: "Exports" } }, { id: "importacao", nome: { pt: "Importações", en: "Imports" }, negative: true }, { id: "saldo", nome: { pt: "Saldo", en: "Balance" } }] }),
  chart("produtos", "comercio", "horizontal", "Principais produtos exportados (SH4)", "Main exported products (HS4)", "Comex Stat (MDIC)", "US$", { modos: ["value", "percentage"], periodicidade: "monthly" }),
  chart("destinos", "comercio", "horizontal", "Principais destinos de exportação", "Main export destinations", "Comex Stat (MDIC)", "US$", { periodicidade: "monthly" }),
  ...([
    ["seguranca", "Taxa de homicídios por 100 mil habitantes", "Homicides per 100,000 inhabitants", "Atlas da Violência / SEJUSP", "por 100 mil"],
    ["leitos", "Leitos por mil habitantes", "Hospital beds per 1,000 inhabitants", "DataSUS", "por mil"],
    ["medicos", "Médicos por mil habitantes", "Doctors per 1,000 inhabitants", "DataSUS", "por mil"],
    ["ideb-iniciais", "IDEB · anos iniciais", "IDEB · primary years", "INEP", "índice"],
    ["ideb-finais", "IDEB · anos finais", "IDEB · lower secondary years", "INEP", "índice"],
    ["moradia", "Preço médio residencial por m²", "Average residential price per m²", "", "R$/m²"],
    ["agua", "Domicílios com água", "Households with water", "SNIS", "%"],
    ["esgoto", "Domicílios com esgoto", "Households with sewerage", "SNIS", "%"],
    ["ifdm", "Índice Firjan de Desenvolvimento Municipal", "Firjan Municipal Development Index", "Firjan", "índice"],
  ] as const).map(([id, pt, en, fonte, unidade]) => chart(id, "qualidade", "sparkline", pt, en, fonte, unidade)),
  chart("clp", "competitividade", "radar", "Pilares da competitividade", "Competitiveness pillars", "CLP", "pontos"),
];
export const recortes = { regionais: [] as string[], polos: ["CINCO", "Cidade Industrial", "Jardim Industrial"] };
export const alcance: Array<Metadata & { minutos: number; valor: number | null; renda: number | null }> = [30, 60, 120].map(minutos => ({ minutos, valor: null, renda: null, ...meta("IBGE / RAIS", "pessoas") }));
export const distancias: Array<Metadata & { destino: string; valor: number | null; tempo: number | null; acessos: string[] }> = ["Belo Horizonte", "Aeroporto de Confins", "Betim", "São Paulo", "Rio de Janeiro", "Vitória", "Porto de Vitória"].map(destino => ({ destino, valor: null, tempo: null, acessos: [], ...meta("Prefeitura de Contagem", "km") }));
export const polos: Array<Metadata & { nome: string; valor: number | null; empresas: number | null; setores: LocalText | null; acessos: string[] }> = recortes.polos.map(nome => ({ nome, valor: null, empresas: null, setores: null, acessos: [], ...meta("Prefeitura de Contagem", "km²") }));
export const documentos = { planoDiretor: "", usoSolo: "" };
export const historia: Array<{ ano: string; texto: LocalText; fonte: string }> = [];
export const linhasComparacao: Array<Metadata & { id: string; nome: LocalText; maiorMelhor: boolean; valores: Record<string, number | null> }> = [
  { id: "pib", nome: { pt: "PIB", en: "GDP" }, maiorMelhor: true, valores: { contagem: 45.1 }, ...meta("IBGE", "R$ bi", "annual", "2023") },
  ...([ ["pibPc", "PIB per capita", "GDP per capita", "IBGE", "R$"], ["pop", "População", "Population", "IBGE", "habitantes"], ["crescimento", "Crescimento do PIB em 10 anos", "GDP growth over 10 years", "IBGE", "%"], ["salario", "Salário médio", "Average wage", "RAIS", "R$"], ["exportacoes", "Exportações", "Exports", "Comex Stat (MDIC)", "US$"], ["ideb", "IDEB", "IDEB", "INEP", "índice"], ["ifdm", "IFDM", "IFDM", "Firjan", "índice"], ["clp", "Ranking de Competitividade (CLP)", "Competitiveness ranking (CLP)", "CLP", "posição"] ] as const).map(([id, pt, en, fonte, unidade]) => ({ id, nome: { pt, en }, maiorMelhor: id !== "clp", valores: {}, ...meta(fonte, unidade) })),
];
export const fontes = [
  { nome: "IBGE", url: "https://www.ibge.gov.br/", periodicidade: "annual" }, { nome: "Fundação João Pinheiro", url: "https://fjp.mg.gov.br/", periodicidade: "annual" },
  { nome: "Comex Stat (MDIC)", url: "https://comexstat.mdic.gov.br/", periodicidade: "monthly" }, { nome: "SEF-MG", url: "https://www.fazenda.mg.gov.br/", periodicidade: "annual" }, { nome: "Siconfi", url: "https://siconfi.tesouro.gov.br/", periodicidade: "annual" },
  { nome: "Firjan", url: "https://www.firjan.com.br/ifdm/", periodicidade: "annual" }, { nome: "CLP", url: "https://rankingdecompetitividade.org.br/", periodicidade: "annual" }, { nome: "INEP", url: "https://www.gov.br/inep/", periodicidade: "annual" }, { nome: "DataSUS", url: "https://datasus.saude.gov.br/", periodicidade: "variable" }, { nome: "SNIS", url: "https://www.gov.br/cidades/", periodicidade: "annual" }, { nome: "Prefeitura de Contagem", url: "https://www.contagem.mg.gov.br/", periodicidade: "variable" }, { nome: "RAIS", url: "https://www.gov.br/trabalho-e-emprego/", periodicidade: "annual" },
] as const;
export const anosDisponiveis = (): number[] => [...new Set([...indicadores.filter(d => d.valor !== null).map(d => Number(d.dataReferencia)), ...graficos.flatMap(g => g.serie.map(p => Number(p.periodo.slice(0, 4))))].filter(Number.isFinite))].sort((a, b) => a - b);
export function defaultPeriod(): [number, number] { const anos = anosDisponiveis(); const ultimo = anos.at(-1) ?? 2023; return [Math.max(anos[0] ?? ultimo, ultimo - 9), ultimo]; }
export function hasSeries(g: ChartData) { return g.serie.some(p => Object.values(p.valores).some(v => v !== null)); }