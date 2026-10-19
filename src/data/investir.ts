import { kpis, mapaNumeros, setores as setoresPerfil, ultimaAtualizacao } from './perfil';
import { empresas, hasCase, setores as setoresCnae, territorios } from './empresas-cadeias';
import type { LocalText } from './economia-territorio';
import { oportunidadesExemplo, type Oportunidade, type TipoOportunidade } from './imoveis-exemplo';

export { ultimaAtualizacao, setoresCnae };
export type Meta = { fonte: string; dataReferencia: string; atualizadoEm: string };
export const sourced = (m?: Partial<Meta> | null) => !!m && !!m.fonte && !!m.dataReferencia && !!m.atualizadoEm;

export type SectionId = 'areas' | 'incentivos' | 'monitor' | 'estruturantes' | 'teses' | 'casos' | 'expandir';
export const sectionOrder: SectionId[] = ['areas', 'incentivos', 'monitor', 'estruturantes', 'teses', 'casos', 'expandir'];

// Filtros
export const tiposOportunidade: TipoOportunidade[] = ['lotePublico', 'terrenoPrivado', 'galpaoAluguel', 'galpaoVenda'];
export const faixasArea = [
  { id: 'ate1000', min: 0, max: 1000 }, { id: '1000a5000', min: 1000, max: 5000 },
  { id: '5000a20000', min: 5000, max: 20000 }, { id: 'acima20000', min: 20000, max: Infinity },
] as const;
export const polos = territorios.polos;
export type Filters = { setor: string; territorio: string; area: string; tipo: string };
export const defaultFilters: Filters = { setor: 'all', territorio: 'municipio', area: 'all', tipo: 'all' };
export const isFiltered = (f: Filters) => JSON.stringify(f) !== JSON.stringify(defaultFilters);
export function matchesOpportunity(o: Oportunidade, f: Filters): boolean {
  const faixa = faixasArea.find(x => x.id === f.area);
  return (f.setor === 'all' || o.setores.includes(f.setor))
    && (f.territorio === 'municipio' || o.polo === f.territorio)
    && (f.area === 'all' || (!!faixa && o.area >= faixa.min && o.area < faixa.max))
    && (f.tipo === 'all' || o.tipo === f.tipo);
}
export const oportunidades = oportunidadesExemplo;
export const filterOpportunities = (f: Filters) => oportunidades.filter(o => matchesOpportunity(o, f));

// Números-chave: reaproveitam os mesmos campos da página inicial (um número, um valor).
const inv = kpis.find(k => k.id === 'investimento')!.dado;
const lotes = mapaNumeros.find(m => m.id === 'lotes')!.dado;
const galpoes = mapaNumeros.find(m => m.id === 'galpoes')!.dado;
export type Kpi = Meta & { id: 'investimento' | 'projetos' | 'lotes' | 'galpoes' | 'incentivos'; valor: string | number | null; contexto: LocalText | null };
export const kpisInvestir: Kpi[] = [
  { id: 'investimento', valor: inv.valor, contexto: { pt: 'Período 2021 a 2024', en: '2021 to 2024' }, fonte: inv.fonte, dataReferencia: inv.dataReferencia, atualizadoEm: inv.atualizadoEm },
  { id: 'projetos', valor: null, contexto: null, fonte: 'SUPGEST', dataReferencia: '', atualizadoEm: '' },
  { id: 'lotes', valor: lotes.valor, contexto: null, fonte: lotes.fonte, dataReferencia: lotes.dataReferencia, atualizadoEm: lotes.atualizadoEm },
  { id: 'galpoes', valor: galpoes.valor, contexto: null, fonte: 'Imobiliárias parceiras', dataReferencia: '', atualizadoEm: '' },
  { id: 'incentivos', valor: null, contexto: null, fonte: 'Legislação', dataReferencia: '', atualizadoEm: '' },
];
export const kpiPublished = (k: Kpi) => sourced(k) && k.valor !== null && k.valor !== '';

// Incentivos: só aparecem com nome, base legal e órgão responsável.
export type Incentivo = Meta & { id: string; nivel: 'municipal' | 'estadual' | 'federal'; nome: string; baseLegal: string; baseLegalUrl: string; orgao: string; contato: string; beneficio: LocalText | null; publico: LocalText | null; setores: string[]; investimentoMinimo: number | null; empregosMinimos: number | null };
export const incentivos: Incentivo[] = [];
export const incentivoPublished = (i: Incentivo) => !!i.nome && !!i.baseLegal && !!i.orgao && sourced(i);
export const incentivosPublicados = () => incentivos.filter(incentivoPublished);
export type WizardAnswer = { setor: string; investimento: number; empregos: number };
export const incentivosAplicaveis = (a: WizardAnswer, list = incentivosPublicados()) => list.filter(i =>
  (!i.setores.length || a.setor === 'all' || i.setores.includes(a.setor))
  && (i.investimentoMinimo === null || a.investimento >= i.investimentoMinimo)
  && (i.empregosMinimos === null || a.empregos >= i.empregosMinimos));

// Monitor de investimentos
export type Estagio = 'anunciado' | 'implantacao' | 'operacao';
export type Projeto = Meta & { id: string; empresa: string; setor: string; valor: number | null; empregos: number | null; estagio: Estagio; ano: number; regional: string; lat: number | null; lng: number | null; caso?: string };
export const projetos: Projeto[] = []; // cadastro SUPGEST / Renai pendente
export const projetosPublicados = () => projetos.filter(p => sourced(p) && p.valor !== null);
export const serieAnual: Array<Meta & { ano: number; valor: number | null; empregos: number | null }> = [];
export const dadosAte = '';

// Projetos estruturantes
export type Estruturante = Meta & { id: string; grupo: 'viarias' | 'ppp' | 'requalificacao'; nome: LocalText; descricao: LocalText; valor: number | null; estagio: 'estudo' | 'licitacao' | 'obra' | 'concluido'; conclusao: number | null; impacto: LocalText | null; abertoPrivado: boolean; editalUrl: string };
export const estruturantes: Estruturante[] = [];
export const estruturantesPublicados = () => estruturantes.filter(sourced);

// Teses por setor (cada uma com âncora #setor-<slug> usada na página inicial).
const capitalize = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
export type Tese = { slug: string; nome: LocalText; titulo: LocalText; argumentos: Array<{ rotulo: LocalText; valor: string } & Meta>; ancoras: string[]; elosFaltantes: LocalText[]; setorCnae: string };
export const teses: Tese[] = setoresPerfil.slice(0, 6).map(s => ({
  slug: s.slug, nome: s.nome,
  titulo: { pt: `Por que ${capitalize(s.nome.pt)} em Contagem`, en: `Why ${capitalize(s.nome.en)} in Contagem` },
  argumentos: s.numeros.filter(n => n.dado.valor !== null && n.dado.valor !== '' && sourced(n.dado)).map(n => ({ rotulo: n.rotulo, valor: String(n.dado.valor), fonte: n.dado.fonte, dataReferencia: n.dado.dataReferencia, atualizadoEm: n.dado.atualizadoEm })),
  ancoras: s.exemplos, elosFaltantes: [],
  setorCnae: s.slug === 'maquinas' ? 'industria' : s.slug === 'atacado' ? 'comercio' : 'servicos',
}));

// Casos: mesma fonte da seção Empresas âncora.
export const casos = empresas.filter(hasCase);
export const findCaso = (slug: string) => casos.find(c => c.slug === slug);

// Relatório de resultados da SUPGEST
export const resultados: (Meta & { ano: number; atendidos: number; confirmados: number; empregos: number; tempoMedio: number; pdf: string }) | null = null;

export const fontes = [
  { nome: 'SUPGEST · Cadastro de investimentos', url: 'https://www.contagem.mg.gov.br/', periodicidade: { pt: 'Contínua', en: 'Ongoing' } },
  { nome: 'Renai (MDIC)', url: 'https://www.gov.br/mdic/pt-br/assuntos/competitividade-industrial/renai', periodicidade: { pt: 'Trimestral', en: 'Quarterly' } },
  { nome: 'INDI · Invest Minas', url: 'https://www.indi.mg.gov.br/', periodicidade: { pt: 'Variável', en: 'Variable' } },
  { nome: 'Legislação de incentivos (municipal, estadual e federal)', url: 'https://www.contagem.mg.gov.br/', periodicidade: { pt: 'Quando houver alteração', en: 'When amended' } },
  { nome: 'Cadastro municipal de lotes e imobiliárias parceiras', url: 'https://www.contagem.mg.gov.br/', periodicidade: { pt: 'Mensal', en: 'Monthly' } },
];
