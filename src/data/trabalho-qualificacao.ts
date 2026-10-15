import { comparadores, comparacaoPadrao, type LocalText, type Metadata, type ChartData, type Point } from './economia-territorio';
import { setores } from './empresas-cadeias';
export { comparadores, comparacaoPadrao, setores };
export const atualizadoEm = '15/10/2026';
export const metadata = (fonte: string, unidade = '', dataReferencia = '', periodicidade: Metadata['periodicidade'] = 'annual'): Metadata => ({ fonte, unidade, dataReferencia, periodicidade, atualizadoEm });
export type SectionId = 'mercado' | 'movimento' | 'bacia' | 'tecnica' | 'superior' | 'demanda';
export const sectionOrder: SectionId[] = ['mercado', 'movimento', 'bacia', 'tecnica', 'superior', 'demanda'];
export type Slice = { setor?: string; cnae?: string; cbo?: string; escolaridade?: string };
export type Filters = { setor: string; cnae: string; cbo: string; escolaridade: string; inicio: string; fim: string };
export const defaultFilters: Filters = { setor: 'all', cnae: 'all', cbo: 'all', escolaridade: 'all', inicio: '', fim: '' };
export function sourced(row: Metadata) { return Boolean(row.fonte.trim() && row.dataReferencia.trim() && row.atualizadoEm.trim()); }
export function matchesFilters(row: Slice, filters: Filters) {
  return (filters.setor === 'all' || row.setor === filters.setor) && (filters.cnae === 'all' || row.cnae === filters.cnae) && (filters.cbo === 'all' || row.cbo === filters.cbo) && (filters.escolaridade === 'all' || row.escolaridade === filters.escolaridade);
}
export function inPeriod(period: string, filters: Filters) {
  const normalized = period.length === 4 ? `${period}-12` : period.slice(0, 7);
  return (!filters.inicio || normalized >= filters.inicio) && (!filters.fim || (period.length === 4 ? `${period}-01` : normalized) <= filters.fim);
}
export const ocupacoes: Array<{ id: string; cbo: string; nome: LocalText }> = [
  ['empilhadeira', 'Operador de empilhadeira', 'Forklift operator'], ['estoquista', 'Auxiliar de logística / estoquista', 'Logistics assistant / stock clerk'], ['motorista', 'Motorista de caminhão', 'Truck driver'], ['maquinas', 'Operador de máquinas', 'Machine operator'], ['soldador', 'Soldador', 'Welder'], ['mecanico', 'Mecânico de manutenção industrial', 'Industrial maintenance mechanic'], ['eletricista', 'Eletricista industrial', 'Industrial electrician'], ['automacao', 'Técnico em automação', 'Automation technician'], ['analista', 'Analista de logística', 'Logistics analyst'], ['engenheiro', 'Engenheiro de produção', 'Production engineer'], ['vendedor', 'Vendedor do comércio atacadista', 'Wholesale salesperson'], ['administrativo', 'Assistente administrativo', 'Administrative assistant'],
].map(([id, pt, en]) => ({ id: id ?? '', cbo: '', nome: { pt: pt ?? '', en: en ?? '' } }));
export type Indicator = Metadata & Slice & { id: 'empregos' | 'salario' | 'saldo' | 'alcance' | 'formandos'; valor: number | null; contexto: LocalText | null; salarioTipo?: 'contratacao' | 'estoque' };
export const indicadores: Indicator[] = [
  // The brief supplies this value but explicitly leaves its official source unconfirmed.
  { id: 'empregos', valor: 183100, contexto: null, ...metadata('', 'empregos', '2025') },
  { id: 'salario', valor: null, contexto: null, salarioTipo: 'estoque', ...metadata('RAIS', 'R$/mês') },
  { id: 'saldo', valor: null, contexto: null, ...metadata('Novo Caged', 'empregos', '', 'monthly') },
  { id: 'alcance', valor: null, contexto: null, ...metadata('Censo 2022 / RAIS', 'pessoas', '', 'census') },
  { id: 'formandos', valor: null, contexto: null, ...metadata('Sistec/MEC e Sistema S', 'formandos') },
];
export type LaborPoint = Point & Slice;
export type LaborChart = Omit<ChartData, 'section' | 'serie'> & Slice & { section: SectionId; serie: LaborPoint[]; salarioTipo?: 'contratacao' | 'estoque'; drilldown?: Record<string, LaborChart> };
const cities = [{ id: 'contagem', nome: { pt: 'Contagem', en: 'Contagem' }, cidade: 'contagem' }, ...comparadores.map(c => ({ id: c.id, nome: { pt: c.nome, en: c.nome }, cidade: c.id }))];
const chart = (id: string, section: SectionId, tipo: ChartData['tipo'], pt: string, en: string, fonte: string, unidade: string, extra: Partial<LaborChart> = {}): LaborChart => ({ id, section, tipo, titulo: { pt, en }, metrica: { pt, en }, serie: [], chaves: cities, ...metadata(fonte, unidade), ...extra });
export const graficos: LaborChart[] = [
  chart('emprego-setor', 'mercado', 'horizontal', 'Emprego formal por setor', 'Formal employment by sector', 'RAIS', 'empregos'),
  chart('estoque-historico', 'mercado', 'line', 'Evolução do emprego formal em 10 anos', 'Formal employment over 10 years', 'RAIS', 'empregos'),
  chart('distribuicao-salarial', 'mercado', 'horizontal', 'Distribuição por faixa salarial', 'Employment by wage bracket', 'RAIS', '%'),
  chart('escolaridade', 'mercado', 'stacked', 'Escolaridade dos trabalhadores', 'Workforce educational attainment', 'RAIS', '%', { modos: ['percentage'] }),
  chart('perfil', 'mercado', 'pyramid', 'Perfil dos empregados formais', 'Formal workforce age and sex profile', 'RAIS', 'empregos', { chaves: [{ id: 'homens', nome: { pt: 'Homens', en: 'Men' }, negative: true }, { id: 'mulheres', nome: { pt: 'Mulheres', en: 'Women' } }] }),
  chart('admissoes', 'movimento', 'trade', 'Admissões, desligamentos e saldo mensal', 'Monthly hires, separations and net jobs', 'Novo Caged', 'empregos', { periodicidade: 'monthly', chaves: [{ id: 'admissoes', nome: { pt: 'Admissões', en: 'Hires' } }, { id: 'desligamentos', nome: { pt: 'Desligamentos', en: 'Separations' }, negative: true }, { id: 'saldo', nome: { pt: 'Saldo', en: 'Net jobs' } }] }),
  chart('saldo-setor', 'movimento', 'horizontal', 'Saldo de empregos em 12 meses por setor', '12-month net job creation by sector', 'Novo Caged', 'empregos', { periodicidade: 'monthly' }),
  chart('salario-admissao', 'movimento', 'line', 'Evolução do salário médio de contratação', 'Average hiring wage over time', 'Novo Caged', 'R$/mês', { periodicidade: 'monthly', salarioTipo: 'contratacao' }),
  chart('formandos-tecnicos', 'tecnica', 'stacked', 'Formandos técnicos por eixo tecnológico', 'Technical graduates by technology area', 'Sistec/MEC', 'formandos'),
  chart('graduados', 'superior', 'horizontal', 'Concluintes por área de formação', 'Graduates by field of study', 'INEP', 'concluintes'),
  chart('graduados-tendencia', 'superior', 'line', 'Engenharias e TI: concluintes nos últimos 5 anos', 'Engineering and IT graduates over 5 years', 'INEP', 'concluintes'),
];
export function filteredChart(chart: LaborChart, filters: Filters): LaborChart {
  const serie = chart.serie.filter(p => matchesFilters({ ...chart, ...p }, filters) && inPeriod(/^\d{4}/.test(p.periodo) ? p.periodo : p.recorte ?? chart.dataReferencia, filters));
  return { ...chart, serie };
}
export function hasChart(chart: LaborChart) { return sourced(chart) && chart.serie.some(p => chart.chaves.some(k => typeof p.valores[k.id] === 'number' && Number.isFinite(p.valores[k.id]))); }
export type LaborRow = Metadata & Slice & { id: string; nome: LocalText; valores: Record<string, number | null>; salarioTipo?: 'contratacao' | 'estoque' };
export const salarios: LaborRow[] = [];
export const rotatividade: LaborRow[] = [];
export const ocupacoesEmFalta: Array<Metadata & Slice & { id: string; nome: LocalText; valor: number; salario: number | null }> = [];
export const alcance: Array<Metadata & Slice & { minutos: number; valor: number | null; desocupados: number | null; escolaridade: LocalText | null }> = [30, 45].map(minutos => ({ minutos, valor: null, desocupados: null, escolaridade: null, ...metadata('Censo 2022 / RAIS', 'pessoas', '', 'census') }));
export const baciaIndicadores: Array<Metadata & Slice & { id: 'saldoDeslocamento' | 'desocupacao' | 'disponiveis' | 'aprendizes'; valor: number | null }> = [];
export type Commute = Metadata & Slice & { geoId: string; municipio: string; entram: number | null; saem: number | null };
export const deslocamentos: Commute[] = [];
export type Institution = Metadata & { id: string; nome: string; nivel: 'tecnica' | 'superior'; url: string; logo: string; logoAutorizado: boolean; unidades: LocalText | null; areas: LocalText | null; matriculas: number | null; formandos: number | null; latitude: number | null; longitude: number | null };
// Names requested in the brief. No local campuses, offerings or graduate counts are inferred.
export const instituicoes: Institution[] = [
  ['senai', 'SENAI', 'tecnica', 'https://www.fiemg.com.br/senai/'], ['senac', 'SENAC', 'tecnica', 'https://www.mg.senac.br/'], ['senat', 'SENAT', 'tecnica', 'https://www.sestsenat.org.br/'], ['sesi', 'SESI', 'tecnica', 'https://www.fiemg.com.br/sesi/'], ['cefet-tecnico', 'CEFET-MG', 'tecnica', 'https://www.cefetmg.br/'], ['ifmg', 'IFMG', 'tecnica', 'https://www.ifmg.edu.br/'], ['puc', 'PUC Minas', 'superior', 'https://www.pucminas.br/'], ['una', 'UNA', 'superior', 'https://www.una.br/'], ['ufmg', 'UFMG', 'superior', 'https://ufmg.br/'], ['cefet-superior', 'CEFET-MG', 'superior', 'https://www.cefetmg.br/'],
].map(([id, nome, nivel, url]) => ({ id: id ?? '', nome: nome ?? '', nivel: nivel === 'superior' ? 'superior' : 'tecnica', url: url ?? '', logo: '', logoAutorizado: false, unidades: null, areas: null, matriculas: null, formandos: null, latitude: null, longitude: null, ...metadata(nome ?? '', '', '2026', 'variable') }));
export const fontes: Array<{ nome: string; url: string; periodicidade: Metadata['periodicidade']; atualizadoEm: string }> = [
  { nome: 'RAIS', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/rais', periodicidade: 'annual', atualizadoEm: '' },
  { nome: 'Novo Caged', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/novo-caged', periodicidade: 'monthly', atualizadoEm: '' },
  { nome: 'Censo 2022', url: 'https://censo2022.ibge.gov.br/', periodicidade: 'census', atualizadoEm: '' },
  { nome: 'PNAD Contínua', url: 'https://www.ibge.gov.br/estatisticas/sociais/trabalho/9171-pesquisa-nacional-por-amostra-de-domicilios-continua-mensal.html', periodicidade: 'variable', atualizadoEm: '' },
  { nome: 'Sistec/MEC', url: 'https://sistec.mec.gov.br/', periodicidade: 'annual', atualizadoEm: '' },
  { nome: 'INEP', url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-da-educacao-superior', periodicidade: 'annual', atualizadoEm: '' },
  { nome: 'Sistema S', url: 'https://www.fiemg.com.br/', periodicidade: 'variable', atualizadoEm: '' },
];