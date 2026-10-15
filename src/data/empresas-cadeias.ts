import { comparadores, comparacaoPadrao, type LocalText, type Metadata, type ChartData } from './economia-territorio';
export { comparadores, comparacaoPadrao };
export const atualizadoEm = '15/10/2026';
export const metadata = (fonte: string, unidade = '', dataReferencia = '', periodicidade: Metadata['periodicidade'] = 'monthly'): Metadata => ({ fonte, unidade, dataReferencia, periodicidade, atualizadoEm });
export type SectionId = 'base' | 'ancoras' | 'vocacoes' | 'cadeias' | 'fornecedores' | 'dinamica';
export const sectionOrder: SectionId[] = ['base', 'ancoras', 'vocacoes', 'cadeias', 'fornecedores', 'dinamica'];
export const setores = [
  { id: 'industria', nome: { pt: 'Indústria', en: 'Industry' }, divisoes: [] as Array<{ id: string; nome: LocalText }> },
  { id: 'comercio', nome: { pt: 'Comércio', en: 'Trade' }, divisoes: [] as Array<{ id: string; nome: LocalText }> },
  { id: 'servicos', nome: { pt: 'Serviços', en: 'Services' }, divisoes: [] as Array<{ id: string; nome: LocalText }> },
  { id: 'construcao', nome: { pt: 'Construção', en: 'Construction' }, divisoes: [] as Array<{ id: string; nome: LocalText }> },
  { id: 'agropecuaria', nome: { pt: 'Agropecuária', en: 'Agriculture' }, divisoes: [] as Array<{ id: string; nome: LocalText }> },
];
export const portes = [
  { id: 'mei', nome: { pt: 'MEI', en: 'Individual microentrepreneur' } }, { id: 'micro', nome: { pt: 'Microempresa', en: 'Microenterprise' } },
  { id: 'pequena', nome: { pt: 'Pequena', en: 'Small' } }, { id: 'media', nome: { pt: 'Média', en: 'Medium' } }, { id: 'grande', nome: { pt: 'Grande', en: 'Large' } },
];
export const territorios = { regionais: [] as string[], distritos: [] as string[], polos: ['CINCO', 'Cidade Industrial', 'Jardim Industrial'] };
export type Filters = { setor: string; cnae: string; porte: string; territorio: string };
export const defaultFilters: Filters = { setor: 'all', cnae: 'all', porte: 'all', territorio: 'municipio' };
export type Slice = { setor?: string; cnae?: string; porte?: string; territorio?: string };
export function matchesFilters(row: Slice, filters: Filters): boolean {
  return (filters.setor === 'all' || row.setor === filters.setor) && (filters.cnae === 'all' || row.cnae === filters.cnae) && (filters.porte === 'all' || row.porte === filters.porte) && (filters.territorio === 'municipio' || row.territorio === filters.territorio);
}
export type Indicator = Metadata & Slice & { id: 'empresas' | 'empregos' | 'industrias' | 'saldoEmpresas' | 'saldoEmpregos'; valor: number | null; contexto: LocalText | null };
export const indicadores: Indicator[] = [
  { id: 'empresas', valor: 39796, contexto: null, ...metadata('Receita Federal (CNPJ)', 'empresas', '2026') },
  { id: 'empregos', valor: null, contexto: null, ...metadata('RAIS', 'empregos', '', 'annual') },
  { id: 'industrias', valor: null, contexto: null, ...metadata('Receita Federal / RAIS', 'empresas') },
  { id: 'saldoEmpresas', valor: null, contexto: null, ...metadata('Receita Federal', 'empresas') },
  { id: 'saldoEmpregos', valor: null, contexto: null, ...metadata('Novo Caged', 'empregos') },
];
export type Company = Metadata & Slice & {
  slug: string; nome: string; grupo: LocalText; logo: string; logoAutorizado: boolean;
  empregados: LocalText | null; ano: number | null; investimento: number | null; empregosGerados: number | null;
  motivo: LocalText | null; citacao: LocalText | null; historia: LocalText | null;
};
export const empresas: Company[] = [
  ...['Shopee', 'Mercado Livre', 'Amazon', 'Magalu'].map(nome => ({ slug: nome.toLowerCase().replaceAll(' ', '-'), nome, grupo: { pt: 'Logística e distribuição', en: 'Logistics and distribution' }, setor: 'servicos', logo: '', logoAutorizado: false, empregados: null, ano: null, investimento: nome === 'Shopee' ? 350000000 : null, empregosGerados: null, motivo: null, citacao: null, historia: null, ...metadata('Documento fornecido · Empresas instaladas', 'R$') })),
  ...['Sany', 'XCMG'].map(nome => ({ slug: nome.toLowerCase(), nome, grupo: { pt: 'Máquinas e equipamentos', en: 'Machinery and equipment' }, setor: 'industria', logo: '', logoAutorizado: false, empregados: null, ano: null, investimento: null, empregosGerados: null, motivo: null, citacao: null, historia: null, ...metadata('Documento fornecido · Empresas instaladas') })),
];
export function hasCase(company: Company) { return company.investimento !== null || company.historia !== null || company.motivo !== null || company.citacao !== null || company.empregosGerados !== null; }
export type CompanyChart = Omit<ChartData, 'section' | 'tipo'> & Slice & { section: SectionId; tipo: ChartData['tipo'] | 'donut' | 'scatter'; drilldown?: Record<string, CompanyChart> };
const chart = (id: string, section: SectionId, tipo: CompanyChart['tipo'], titulo: LocalText, fonte: string, unidade: string): CompanyChart => ({ id, section, tipo, titulo, metrica: titulo, serie: [], chaves: [], ...metadata(fonte, unidade) });
export const graficos: CompanyChart[] = [
  chart('setores', 'base', 'donut', { pt: 'Distribuição das empresas por setor', en: 'Companies by sector' }, 'Receita Federal (CNPJ)', 'empresas'),
  chart('porte-regime', 'base', 'stacked', { pt: 'Porte e regime tributário das empresas', en: 'Company size and tax regime' }, 'Receita Federal (CNPJ)', 'empresas'),
  chart('emprego-setores', 'vocacoes', 'horizontal', { pt: 'Setores que mais empregam em Contagem', en: 'Largest employment sectors in Contagem' }, 'RAIS', 'empregos'),
  chart('ql-mg', 'vocacoes', 'horizontal', { pt: 'Especialização setorial em relação a Minas Gerais', en: 'Sector specialization relative to Minas Gerais' }, 'RAIS', 'QL'),
  chart('ql-br', 'vocacoes', 'horizontal', { pt: 'Especialização setorial em relação ao Brasil', en: 'Sector specialization relative to Brazil' }, 'RAIS', 'QL'),
  chart('matriz-vocacoes', 'vocacoes', 'scatter', { pt: 'Especialização e crescimento do emprego', en: 'Specialization and employment growth' }, 'RAIS', 'QL / %'),
  chart('aberturas-fechamentos', 'dinamica', 'trade', { pt: 'Aberturas, fechamentos e saldo de empresas', en: 'Company openings, closures and net change' }, 'Receita Federal (CNPJ)', 'empresas'),
  chart('saldo-empregos', 'dinamica', 'horizontal', { pt: 'Saldo de empregos por setor', en: 'Net job creation by sector' }, 'Novo Caged', 'empregos'),
];
export const matrizFilial: Array<Metadata & Slice & { id: string; nome: LocalText; valor: number | null }> = [];
export const baseTerritorial: Array<Metadata & Slice & { id: string; nome: string; valor: number; geoId: string }> = [];
export const cobertura: (Metadata & { valor: number; percentual: number }) | null = null;
export const complexidade: Metadata & { valor: number | null; atividades: LocalText | null; url: string } = { valor: null, atividades: null, url: 'https://www.dataviva.info/', ...metadata('DataViva', 'índice', '', 'variable') };
export type ChainLink = Metadata & { id: string; nome: LocalText; etapa: 'insumos' | 'producao' | 'distribuicao' | 'apoio'; status: 'presente' | 'fraco' | 'faltante'; valor: number | null; empregos: number | null; comprasExternas: LocalText | null };
export type Chain = { id: string; nome: LocalText; elos: ChainLink[] };
export const cadeias: Chain[] = [
  ['logistica', 'Logística e distribuição', 'Logistics and distribution'], ['metalmecanica', 'Metalmecânica e máquinas', 'Metalworking and machinery'], ['alimentos', 'Alimentos e bebidas', 'Food and beverages'], ['quimica', 'Química e plásticos', 'Chemicals and plastics'], ['atacado', 'Comércio atacadista', 'Wholesale trade'], ['saude', 'Saúde', 'Healthcare'],
].map(([id, pt, en]) => ({ id: id ?? '', nome: { pt: pt ?? '', en: en ?? '' }, elos: [] }));
export type Activity = Metadata & Slice & { id: string; nome: LocalText; valor: number | null; empregos: number | null; salario: number | null; industrial: boolean };
export const atividades: Activity[] = [];
export const fontes = [
  { nome: 'Receita Federal (CNPJ)', url: 'https://dados.gov.br/dados/conjuntos-dados/cadastro-nacional-da-pessoa-juridica---cnpj', periodicidade: 'monthly' },
  { nome: 'RAIS', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/rais', periodicidade: 'annual' },
  { nome: 'Novo Caged', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/novo-caged', periodicidade: 'monthly' },
  { nome: 'DataViva', url: 'https://www.dataviva.info/', periodicidade: 'variable' },
  { nome: 'Cadastro municipal', url: 'https://www.contagem.mg.gov.br/', periodicidade: 'variable' },
] as const;
export function hasChart(chart: CompanyChart) { return chart.serie.some(p => Object.values(p.valores).some(v => typeof v === 'number' && Number.isFinite(v))); }
