// Todos os números do portal ficam aqui. Valor vazio ("" ou null) = bloco oculto.
export type Dado = {
  valor: string | number | null;
  unidade?: string;
  fonte: string;
  dataReferencia: string;
  atualizadoEm: string; // DD/MM/AAAA
};

export const ultimaAtualizacao = "15/10/2026";

export const pdfs = { pt: "", en: "" }; // URLs dos PDFs; vazio = abre versão para impressão

export const contato = {
  email: "supgest@contagem.mg.gov.br",
  telefone: "",
};

export type KpiId = "pib" | "populacao" | "empregos" | "empresas" | "investimento" | "localizacao";

export const kpis: Array<{
  id: KpiId;
  icon: string;
  dado: Dado;
  contexto: Dado | null;
}> = [
  {
    id: "pib",
    icon: "Landmark",
    dado: { valor: "R$ 45,1 bi", fonte: "IBGE", dataReferencia: "2023", atualizadoEm: ultimaAtualizacao },
    contexto: { valor: "4º", fonte: "IBGE", dataReferencia: "2023", atualizadoEm: ultimaAtualizacao },
  },
  {
    id: "populacao",
    icon: "Users",
    dado: { valor: null, fonte: "IBGE", dataReferencia: "2025", atualizadoEm: ultimaAtualizacao },
    contexto: null,
  },
  {
    id: "empregos",
    icon: "Briefcase",
    dado: { valor: null, fonte: "RAIS / Caged", dataReferencia: "2025", atualizadoEm: ultimaAtualizacao },
    contexto: null,
  },
  {
    id: "empresas",
    icon: "Building2",
    dado: { valor: "39.796", fonte: "Receita Federal (CNPJ)", dataReferencia: "2026", atualizadoEm: ultimaAtualizacao },
    contexto: null,
  },
  {
    id: "investimento",
    icon: "TrendingUp",
    dado: { valor: "R$ 10,5 bi", fonte: "SUPGEST", dataReferencia: "2021–2024", atualizadoEm: ultimaAtualizacao },
    contexto: null,
  },
  {
    id: "localizacao",
    icon: "MapPin",
    dado: { valor: null, unidade: "km", fonte: "Prefeitura de Contagem", dataReferencia: "2026", atualizadoEm: ultimaAtualizacao },
    contexto: { valor: "BR-040 · BR-381 · Anel Rodoviário · Via Expressa", fonte: "Prefeitura de Contagem", dataReferencia: "2026", atualizadoEm: ultimaAtualizacao },
  },
];

export const perguntas = {
  maoDeObra: { valor: "SENAI · SENAC · SENAT", fonte: "RAIS", dataReferencia: "2025", atualizadoEm: ultimaAtualizacao } as Dado,
  terreno: { valor: 31, fonte: "SUPGEST", dataReferencia: "2026", atualizadoEm: ultimaAtualizacao } as Dado,
  licenca: { valor: null, fonte: "Prefeitura de Contagem", dataReferencia: "2026", atualizadoEm: ultimaAtualizacao } as Dado,
};

export const empresasInstaladas: string[] = ["", "", "", "", "", ""]; // logos autorizados (URL); vazio = placeholder

// Comparação — lista configurável
export const cidades = [
  { id: "contagem", nome: "Contagem" },
  { id: "betim", nome: "Betim" },
  { id: "bh", nome: "Belo Horizonte" },
  { id: "sete-lagoas", nome: "Sete Lagoas" },
  { id: "uberlandia", nome: "Uberlândia" },
  { id: "campinas", nome: "Campinas (SP)" },
  { id: "joinville", nome: "Joinville (SC)" },
  { id: "mg", nome: "Minas Gerais" },
  { id: "br", nome: "Brasil" },
];

export type IndicadorId = "pib" | "pibPc" | "pop" | "empregos" | "salario" | "empresas" | "crescEmprego" | "clp";

export const comparacao: Array<{
  id: IndicadorId;
  maiorMelhor: boolean;
  fonte: string;
  dataReferencia: string;
  // valor numérico para ranking + texto exibido
  valores: Partial<Record<string, { num: number; txt: string }>>;
}> = [
  { id: "pib", maiorMelhor: true, fonte: "IBGE", dataReferencia: "2023", valores: { contagem: { num: 45.1, txt: "R$ 45,1 bi" } } },
  { id: "pibPc", maiorMelhor: true, fonte: "IBGE", dataReferencia: "2023", valores: {} },
  { id: "pop", maiorMelhor: true, fonte: "IBGE", dataReferencia: "2025", valores: {} },
  { id: "empregos", maiorMelhor: true, fonte: "RAIS", dataReferencia: "2025", valores: {} },
  { id: "salario", maiorMelhor: true, fonte: "RAIS", dataReferencia: "2025", valores: {} },
  { id: "empresas", maiorMelhor: true, fonte: "Receita Federal", dataReferencia: "2026", valores: { contagem: { num: 39796, txt: "39.796" } } },
  { id: "crescEmprego", maiorMelhor: true, fonte: "Caged", dataReferencia: "12 meses", valores: {} },
  { id: "clp", maiorMelhor: false, fonte: "CLP", dataReferencia: "2025", valores: {} },
];

export const setores: Array<{
  slug: string;
  icon: string;
  nome: { pt: string; en: string };
  numeros: Array<{ rotulo: { pt: string; en: string }; dado: Dado }>;
  exemplos: string[];
}> = [
  {
    slug: "logistica",
    icon: "Truck",
    nome: { pt: "Logística e distribuição", en: "Logistics and distribution" },
    numeros: [],
    exemplos: ["Shopee", "Mercado Livre", "Amazon", "Magalu"],
  },
  {
    slug: "maquinas",
    icon: "Cog",
    nome: { pt: "Máquinas e equipamentos", en: "Machinery and equipment" },
    numeros: [],
    exemplos: ["Sany", "XCMG"],
  },
  {
    slug: "atacado",
    icon: "Store",
    nome: { pt: "Comércio atacadista", en: "Wholesale trade" },
    numeros: [
      {
        rotulo: { pt: "das empresas são do comércio", en: "of companies are in trade" },
        dado: { valor: "≈33%", fonte: "Receita Federal (CNPJ)", dataReferencia: "2026", atualizadoEm: ultimaAtualizacao },
      },
    ],
    exemplos: [],
  },
];

export const mapaNumeros: Array<{ id: "lotes" | "galpoes" | "areaPronta"; dado: Dado }> = [
  { id: "lotes", dado: { valor: 31, fonte: "SUPGEST", dataReferencia: "2026", atualizadoEm: ultimaAtualizacao } },
  { id: "galpoes", dado: { valor: null, fonte: "SUPGEST", dataReferencia: "2026", atualizadoEm: ultimaAtualizacao } },
  { id: "areaPronta", dado: { valor: null, fonte: "SUPGEST", dataReferencia: "2026", atualizadoEm: ultimaAtualizacao } },
];

export const temValor = (d?: Dado | null) => !!d && d.valor !== null && d.valor !== "";
