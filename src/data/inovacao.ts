// Eixo 6 · Inovação e transformação produtiva — única fonte de dados da página /inovacao.
// Regra: nada é publicado sem fonte, dataReferencia e atualizadoEm. Valores vazios ficam ocultos.
export type Meta = { fonte: string; dataReferencia: string; atualizadoEm: string };
export type LocalText = { pt: string; en: string };
export const sourced = (m?: Partial<Meta> | null) => !!m && !!m.fonte && !!m.dataReferencia && !!m.atualizadoEm;

export type SectionId = 'industria' | 'universidades' | 'startups' | 'financiamento' | 'pi' | 'verde';
export const sectionOrder: SectionId[] = ['industria', 'universidades', 'startups', 'financiamento', 'pi', 'verde'];
export const ultimaAtualizacao = '19/10/2026';

export const areasTecnologicas = ['automacao', 'digitalizacao', 'materiais', 'logistica', 'energia', 'quimica', 'saude', 'alimentos'] as const;
export const tiposParceiro = ['instituto', 'universidade', 'laboratorio', 'startup', 'hub', 'financiador'] as const;
export const localizacoes = ['contagem', 'rmbh', 'mg'] as const;
export type AreaTec = typeof areasTecnologicas[number];
export type TipoParceiro = typeof tiposParceiro[number];
export type Localizacao = typeof localizacoes[number];

export type Filters = { area: string; tipo: string; local: string };
export const defaultFilters: Filters = { area: 'all', tipo: 'all', local: 'all' };
export const isFiltered = (f: Filters) => f.area !== 'all' || f.tipo !== 'all' || f.local !== 'all';

export type Kpi = Meta & { id: 'industria40' | 'startups' | 'financiados' | 'patentes' | 'grupos'; valor: string | number | null; contexto: LocalText | null };
const vazio: Meta = { fonte: '', dataReferencia: '', atualizadoEm: '' };
export const kpisInovacao: Kpi[] = [
  { id: 'industria40', valor: null, contexto: null, ...vazio, fonte: 'SENAI/FIEMG' },
  { id: 'startups', valor: null, contexto: null, ...vazio, fonte: 'StartupBase / Sebrae' },
  { id: 'financiados', valor: null, contexto: null, ...vazio, fonte: 'Finep, Embrapii, Fapemig' },
  { id: 'patentes', valor: null, contexto: null, ...vazio, fonte: 'INPI' },
  { id: 'grupos', valor: null, contexto: null, ...vazio, fonte: 'CNPq' },
];
export const kpiPublished = (k: Kpi) => sourced(k) && k.valor !== null && k.valor !== '';

export type Parceiro = Meta & {
  id: string; secao: SectionId; nome: string; tipo: TipoParceiro; cidade: string; local: Localizacao;
  distanciaKm: number | null; tempoMin: number | null; areas: AreaTec[]; site: string;
  oferta: LocalText | null; publico: LocalText | null; custo: LocalText | null; contato: string; apoio?: 'credito' | 'subvencao' | 'fiscal' | 'cofinanciamento';
  logoAutorizado: boolean; logoUrl?: string;
};
// Fonte: site oficial de cada instituição. Distâncias, áreas, custos e contatos aguardam confirmação e ficam ocultos.
const site: Meta = { fonte: 'Site oficial da instituição', dataReferencia: '2026', atualizadoEm: ultimaAtualizacao };
const p = (x: Omit<Parceiro, keyof Meta | 'distanciaKm' | 'tempoMin' | 'areas' | 'oferta' | 'publico' | 'custo' | 'contato' | 'logoAutorizado'> & Partial<Parceiro>): Parceiro =>
  ({ distanciaKm: null, tempoMin: null, areas: [], oferta: null, publico: null, custo: null, contato: '', logoAutorizado: false, ...site, ...x });
export const parceiros: Parceiro[] = [
  p({ id: 'senai-isi', secao: 'industria', nome: 'Institutos SENAI de Inovação e de Tecnologia (FIEMG)', tipo: 'instituto', cidade: 'Belo Horizonte', local: 'rmbh', site: 'https://www.fiemg.com.br/senai/' }),
  p({ id: 'b-mais-produtivo', secao: 'industria', nome: 'Brasil Mais Produtivo', tipo: 'instituto', cidade: 'Programa federal', local: 'mg', site: 'https://www.gov.br/mdic/pt-br/assuntos/brasil-mais-produtivo' }),
  p({ id: 'fiemg', secao: 'industria', nome: 'FIEMG', tipo: 'instituto', cidade: 'Belo Horizonte', local: 'rmbh', site: 'https://www.fiemg.com.br/' }),
  p({ id: 'ufmg', secao: 'universidades', nome: 'UFMG', tipo: 'universidade', cidade: 'Belo Horizonte', local: 'rmbh', site: 'https://ufmg.br/' }),
  p({ id: 'puc', secao: 'universidades', nome: 'PUC Minas', tipo: 'universidade', cidade: 'Belo Horizonte', local: 'rmbh', site: 'https://www.pucminas.br/' }),
  p({ id: 'cefet', secao: 'universidades', nome: 'CEFET-MG', tipo: 'universidade', cidade: 'Belo Horizonte', local: 'rmbh', site: 'https://www.cefetmg.br/' }),
  p({ id: 'uemg', secao: 'universidades', nome: 'UEMG', tipo: 'universidade', cidade: 'Belo Horizonte', local: 'rmbh', site: 'https://www.uemg.br/' }),
  p({ id: 'bhtec', secao: 'startups', nome: 'BH-TEC · Parque Tecnológico de Belo Horizonte', tipo: 'hub', cidade: 'Belo Horizonte', local: 'rmbh', site: 'https://www.bhtec.org.br/' }),
  p({ id: 'spv', secao: 'startups', nome: 'San Pedro Valley', tipo: 'hub', cidade: 'Belo Horizonte', local: 'rmbh', site: 'https://sanpedrovalley.org/' }),
  p({ id: 'finep', secao: 'financiamento', nome: 'Finep', tipo: 'financiador', cidade: 'Programa federal', local: 'mg', site: 'https://www.finep.gov.br/' }),
  p({ id: 'embrapii', secao: 'financiamento', nome: 'Embrapii', tipo: 'financiador', cidade: 'Programa federal', local: 'mg', site: 'https://embrapii.org.br/' }),
  p({ id: 'fapemig', secao: 'financiamento', nome: 'Fapemig', tipo: 'financiador', cidade: 'Belo Horizonte', local: 'rmbh', site: 'https://fapemig.br/' }),
  p({ id: 'bndes', secao: 'financiamento', nome: 'BNDES Mais Inovação', tipo: 'financiador', cidade: 'Programa federal', local: 'mg', site: 'https://www.bndes.gov.br/' }),
  p({ id: 'leidobem', secao: 'financiamento', nome: 'Lei do Bem (Lei nº 11.196/2005)', tipo: 'financiador', cidade: 'Programa federal', local: 'mg', apoio: 'fiscal', site: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/lei-do-bem' }),
];
export const parceiroPublished = (x: Parceiro) => !!x.nome && !!x.site && sourced(x);

// Filtros: só passam registros com a dimensão correspondente (área vazia não casa com área escolhida).
export function matchesParceiro(x: Parceiro, f: Filters) {
  if (f.area !== 'all' && !x.areas.includes(f.area as AreaTec)) return false;
  if (f.tipo !== 'all' && x.tipo !== f.tipo) return false;
  if (f.local === 'contagem' && x.local !== 'contagem') return false;
  if (f.local === 'rmbh' && !(x.local === 'contagem' || x.local === 'rmbh')) return false;
  return true;
}
export const parceirosFiltrados = (f: Filters, secao?: SectionId) => parceiros.filter(x => parceiroPublished(x) && (!secao || x.secao === secao) && matchesParceiro(x, f));

// Dados ainda não fornecidos — ficam ocultos.
export type Laboratorio = Meta & { id: string; instituicao: string; laboratorio: string; area: AreaTec; servicos: string; contato: string };
export const laboratorios: Laboratorio[] = [];
export type Edital = Meta & { id: string; nome: string; financiador: string; prazo: string; link: string };
export const editais: Edital[] = [];
export function editaisAbertos(hoje: Date, lista: Edital[] = editais) {
  const iso = hoje.toISOString().slice(0, 10);
  return lista.filter(e => sourced(e) && e.prazo >= iso).sort((a, b) => a.prazo.localeCompare(b.prazo));
}
export type CasoVerde = Meta & { id: string; empresa: string; resultado: LocalText };
export const casosVerdes: CasoVerde[] = [];
export type Startup = Meta & { id: string; nome: string; vertical: string; descricao: LocalText; site: string };
export const startupsContagem: Startup[] = [];

export const jornada = ['diagnostico', 'plano', 'piloto', 'implantacao'] as const;

export const fontes = [
  { nome: 'SENAI/FIEMG e Brasil Mais Produtivo', url: 'https://www.fiemg.com.br/senai/', periodicidade: { pt: 'Anual (depende de acordo)', en: 'Annual (subject to agreement)' } },
  { nome: 'CNPq · Diretório de Grupos de Pesquisa', url: 'https://lattes.cnpq.br/web/dgp', periodicidade: { pt: 'Censo periódico', en: 'Periodic census' } },
  { nome: 'INPI', url: 'https://www.gov.br/inpi/', periodicidade: { pt: 'Mensal', en: 'Monthly' } },
  { nome: 'Finep', url: 'https://www.finep.gov.br/', periodicidade: { pt: 'Contínua', en: 'Continuous' } },
  { nome: 'Embrapii', url: 'https://embrapii.org.br/', periodicidade: { pt: 'Contínua', en: 'Continuous' } },
  { nome: 'Fapemig', url: 'https://fapemig.br/', periodicidade: { pt: 'Por edital', en: 'Per call' } },
  { nome: 'BNDES', url: 'https://www.bndes.gov.br/', periodicidade: { pt: 'Contínua', en: 'Continuous' } },
  { nome: 'StartupBase', url: 'https://startupbase.com.br/', periodicidade: { pt: 'Contínua', en: 'Continuous' } },
  { nome: 'Sebrae', url: 'https://sebrae.com.br/', periodicidade: { pt: 'Anual', en: 'Annual' } },
  { nome: 'Aneel', url: 'https://www.gov.br/aneel/', periodicidade: { pt: 'Mensal', en: 'Monthly' } },
];
