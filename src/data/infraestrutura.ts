import { comparadores, comparacaoPadrao, recortes, distancias, type LocalText, type Metadata, type ChartData } from './economia-territorio';
import { indicadores as laborIndicators } from './trabalho-qualificacao';
export { comparadores, comparacaoPadrao, recortes, distancias };
export function sourced(row: Pick<Metadata, 'fonte' | 'dataReferencia' | 'atualizadoEm'>) { return Boolean(row.fonte.trim() && row.dataReferencia.trim() && row.atualizadoEm.trim()); }
export const atualizadoEm = '15/10/2026';
export type SectionId = 'logistica' | 'utilidades' | 'imoveis' | 'custos' | 'licencas' | 'seguranca';
export const sectionOrder: SectionId[] = ['logistica', 'utilidades', 'imoveis', 'custos', 'licencas', 'seguranca'];
export const metadata = (fonte = '', unidade = '', dataReferencia = '', periodicidade: Metadata['periodicidade'] = 'variable'): Metadata => ({ fonte, unidade, dataReferencia, periodicidade, atualizadoEm });
export type Slice = { territorio?: string; atividade?: string };
export type Filters = { territorio: string; atividade: string };
export const defaultFilters: Filters = { territorio: 'municipio', atividade: 'all' };
export function matchesFilters(row: Slice, filters: Filters) { return (filters.territorio === 'municipio' ? !row.territorio || row.territorio === 'municipio' : row.territorio === filters.territorio) && (filters.atividade === 'all' || row.atividade === filters.atividade); }
export const atividades = [
  { id: 'industria', nome: { pt: 'Indústria', en: 'Industry' } }, { id: 'logistica', nome: { pt: 'Logística e armazenagem', en: 'Logistics and warehousing' } }, { id: 'atacado', nome: { pt: 'Comércio atacadista', en: 'Wholesale trade' } }, { id: 'servicos', nome: { pt: 'Serviços', en: 'Services' } },
];
export type Metric = Metadata & Slice & { id: string; section: SectionId; nome: LocalText; valor: number | null; contexto?: LocalText };
export const indicadores: Metric[] = [
  { id: 'abertura', section: 'licencas', nome: { pt: 'Tempo para abrir empresa', en: 'Business opening time' }, valor: null, ...metadata('Mapa de Empresas / Redesim', 'dias') },
  { id: 'vacancia', section: 'imoveis', nome: { pt: 'Vacância de galpões', en: 'Warehouse vacancy' }, valor: null, ...metadata('', '%') },
  { id: 'fibra', section: 'utilidades', nome: { pt: 'Cobertura de fibra e 5G', en: 'Fiber and 5G coverage' }, valor: null, ...metadata('Anatel', '%') },
];
export const metricPublished = (row: Metric) => sourced(row) && row.valor !== null && Number.isFinite(row.valor);
export type Tariff = Metadata & Slice & { id: 'energia-a4' | 'energia-livre' | 'gas' | 'agua'; nome: LocalText; valor: number | null; cidade: string };
export const tarifas: Tariff[] = [
  { id: 'energia-a4', nome: { pt: 'Energia industrial A4', en: 'Industrial electricity A4' }, cidade: 'contagem', valor: null, ...metadata('Aneel / Cemig', 'R$/MWh') },
  { id: 'energia-livre', nome: { pt: 'Energia no mercado livre', en: 'Free-market electricity' }, cidade: 'contagem', valor: null, ...metadata('', 'R$/MWh') },
  { id: 'gas', nome: { pt: 'Gás industrial', en: 'Industrial gas' }, cidade: 'contagem', valor: null, ...metadata('Gasmig', 'R$/m³') },
  { id: 'agua', nome: { pt: 'Água industrial', en: 'Industrial water' }, cidade: 'contagem', valor: null, ...metadata('Copasa', 'R$/m³') },
];
export type TaxRate = Metadata & Slice & { id: string; nome: LocalText; codigo: string; valor: number | null; cidade: string };
export const iss: TaxRate[] = [];
export const iptu: Array<TaxRate & { valorVenalM2: number | null }> = [];
export type InfrastructureChart = Omit<ChartData, 'section'> & Slice & { section: SectionId };
const chart = (id: string, section: SectionId, pt: string, en: string, fonte: string, unidade: string, tipo: ChartData['tipo'] = 'line'): InfrastructureChart => ({ id, section, titulo: { pt, en }, metrica: { pt, en }, tipo, serie: [], chaves: [{ id: 'contagem', nome: { pt: 'Contagem', en: 'Contagem' }, cidade: 'contagem' }, ...comparadores.map(c => ({ id: c.id, nome: { pt: c.nome, en: c.nome }, cidade: c.id }))], ...metadata(fonte, unidade) });
export const graficos: InfrastructureChart[] = [
  chart('energia-dec', 'utilidades', 'Duração das interrupções de energia', 'Duration of power outages', 'Aneel / Cemig', 'horas'),
  chart('energia-fec', 'utilidades', 'Frequência das interrupções de energia', 'Frequency of power outages', 'Aneel / Cemig', 'interrupções'),
  chart('galpoes-estoque', 'imoveis', 'Estoque e área vaga de galpões', 'Warehouse stock and vacant area', '', 'm²'),
  chart('galpoes-vacancia', 'imoveis', 'Vacância de galpões por trimestre', 'Quarterly warehouse vacancy', '', '%'),
  chart('galpoes-aluguel', 'imoveis', 'Aluguel de galpões por trimestre', 'Quarterly warehouse rents', '', 'R$/m²'),
  chart('galpoes-entregas', 'imoveis', 'Entregas e previsão de novos galpões', 'New and planned warehouse deliveries', '', 'm²', 'stacked'),
  chart('abertura-historico', 'licencas', 'Tempo para abrir uma empresa', 'Time to open a business', 'Mapa de Empresas / Redesim', 'dias'),
  chart('crimes-violentos', 'seguranca', 'Crimes violentos por 100 mil habitantes', 'Violent crime per 100,000 residents', 'Sejusp-MG', 'por 100 mil'),
  chart('roubo-carga', 'seguranca', 'Roubo de carga por 100 mil habitantes', 'Cargo theft per 100,000 residents', 'Sejusp-MG', 'por 100 mil'),
];
export function hasChart(g: InfrastructureChart, compare: string[]) { return sourced(g) && g.serie.some(p => g.chaves.some(k => (!k.cidade || k.cidade === 'contagem' || compare.includes(k.cidade)) && typeof p.valores[k.id] === 'number' && Number.isFinite(p.valores[k.id]))); }
export type RecordItem = Metadata & Slice & { id: string; section: SectionId; nome: LocalText; texto: LocalText; url: string; valor: number | null; etapa?: LocalText; previsao?: string; codigo?: string; latitude?: number; longitude?: number };
// Official property, utility, licensing, digital-service and project records must be supplied with dates and sources.
export const registros: RecordItem[] = [];
export const alcance: Metric[] = [];
export const concessionarias = [
  { id: 'energia', nome: 'Cemig', url: 'https://www.cemig.com.br/' }, { id: 'gas', nome: 'Gasmig', url: 'https://www.gasmig.com.br/' }, { id: 'agua', nome: 'Copasa', url: 'https://www.copasa.com.br/' }, { id: 'telecom', nome: 'Anatel', url: 'https://www.gov.br/anatel/pt-br' },
];
export type MapLayer = { id: string; section: SectionId; nome: LocalText; geo: string; ilustrativo: boolean; fonte: string; dataReferencia: string; atualizadoEm: string };
export const camadas: MapLayer[] = [
  { id: 'acessos-exemplo', section: 'logistica', nome: { pt: 'Acessos · exemplo ilustrativo', en: 'Access routes · illustrative example' }, geo: 'acessos', ilustrativo: true, fonte: 'Geometria de exemplo', dataReferencia: '2026', atualizadoEm },
  { id: 'polos-exemplo', section: 'logistica', nome: { pt: 'Polos · exemplo ilustrativo', en: 'Industrial hubs · illustrative example' }, geo: 'polos', ilustrativo: true, fonte: 'Geometria de exemplo', dataReferencia: '2026', atualizadoEm },
];
export const fontes: Array<{ nome: string; url: string; periodicidade: Metadata['periodicidade']; atualizadoEm: string }> = [
  { nome: 'Mapa de Empresas / Redesim', url: 'https://www.gov.br/empresas-e-negocios/pt-br/mapa-de-empresas', periodicidade: 'monthly', atualizadoEm: '' },
  { nome: 'Aneel', url: 'https://www.gov.br/aneel/pt-br', periodicidade: 'variable', atualizadoEm: '' },
  ...concessionarias.map(c => ({ nome: c.nome, url: c.url, periodicidade: 'variable' as const, atualizadoEm: '' })),
  { nome: 'Sejusp-MG', url: 'https://www.seguranca.mg.gov.br/', periodicidade: 'monthly', atualizadoEm: '' },
  { nome: 'Prefeitura de Contagem · ISS, IPTU e licenciamento', url: 'https://www.contagem.mg.gov.br/', periodicidade: 'variable', atualizadoEm: '' },
];
export type SimulationInput = { atividade: string; area: number; energia: number; agua: number; empregados: number; faturamento: number };
export type CostLine = { id: 'iss' | 'iptu' | 'energia' | 'agua' | 'folha'; valor: number; fontes: Metadata[] };
export type SimulationData = { iss: TaxRate[]; iptu: typeof iptu; tarifas: Tariff[]; salario: (Metadata & { valor: number | null }) | undefined };
export function simulationData(filters: Filters = defaultFilters): SimulationData { return { iss: iss.filter(r => matchesFilters(r, { ...filters, atividade: 'all' })), iptu: iptu.filter(r => matchesFilters(r, { ...filters, atividade: 'all' })), tarifas: tarifas.filter(r => matchesFilters(r, { ...filters, atividade: 'all' })), salario: filters.territorio === 'municipio' ? laborIndicators.find(r => r.id === 'salario' && r.salarioTipo === 'estoque' && !r.setor && !r.cbo && !r.escolaridade && !r.cnae) : undefined }; }
export function calculateCosts(input: SimulationInput, data: SimulationData = simulationData()): CostLine[] {
  if (Object.values(input).some(v => typeof v === 'number' && (!Number.isFinite(v) || v < 0))) return [];
  const result: CostLine[] = [];
  const rate = data.iss.find(r => r.atividade === input.atividade && r.cidade === 'contagem' && sourced(r) && r.valor !== null);
  if (rate?.valor != null) result.push({ id: 'iss', valor: input.faturamento * rate.valor / 100, fontes: [rate] });
  const property = data.iptu.find(r => r.atividade === input.atividade && r.cidade === 'contagem' && sourced(r) && r.valor !== null && r.valorVenalM2 !== null);
  if (property?.valor != null && property.valorVenalM2 != null) result.push({ id: 'iptu', valor: input.area * property.valorVenalM2 * property.valor / 100 / 12, fontes: [property] });
  for (const [id, tariffId, consumption] of [['energia', 'energia-a4', input.energia], ['agua', 'agua', input.agua]] as const) {
    const tariff = data.tarifas.find(r => r.id === tariffId && r.cidade === 'contagem' && (!r.atividade || r.atividade === input.atividade) && sourced(r) && r.valor !== null);
    if (tariff?.valor != null) result.push({ id, valor: consumption * tariff.valor, fontes: [tariff] });
  }
  if (data.salario && sourced(data.salario) && data.salario.valor !== null) result.push({ id: 'folha', valor: input.empregados * data.salario.valor, fontes: [data.salario] });
  return result;
}
export function canSimulate(filters: Filters = defaultFilters) { return atividades.filter(a => filters.atividade === 'all' || a.id === filters.atividade).some(a => calculateCosts({ atividade: a.id, area: 1, energia: 1, agua: 1, empregados: 1, faturamento: 1 }, simulationData(filters)).length > 0); }
