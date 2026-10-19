// EXEMPLO ILUSTRATIVO: posições, áreas e tipos são fictícios até o cadastro municipal de lotes
// e as imobiliárias parceiras enviarem registros verificados. Nunca apresentar como oferta real.
export type TipoOportunidade = 'lotePublico' | 'terrenoPrivado' | 'galpaoAluguel' | 'galpaoVenda';
export type Oportunidade = {
  id: string; tipo: TipoOportunidade; area: number; polo: string; setores: string[];
  lat: number; lng: number; zoneamento: string | null; preco: string | null; areaPronta: boolean;
  ilustrativo: true; fonte: string; dataReferencia: string; atualizadoEm: string;
};
const polos = ['CINCO', 'Cidade Industrial', 'Jardim Industrial'];
const centros: Record<string, [number, number]> = { CINCO: [-19.905, -44.085], 'Cidade Industrial': [-19.955, -44.03], 'Jardim Industrial': [-19.935, -44.06] };
const areas = [650, 1200, 2400, 3800, 5200, 7600, 9800, 12500, 18000, 24000, 32000];
const setoresCiclo = [['industria'], ['servicos'], ['comercio'], ['industria', 'servicos']];
const meta = { ilustrativo: true as const, fonte: 'Exemplo ilustrativo (aguardando cadastro municipal)', dataReferencia: '2026', atualizadoEm: '15/10/2026' };
function make(i: number, tipo: TipoOportunidade): Oportunidade {
  const polo = polos[i % 3]!; const [lat, lng] = centros[polo]!;
  return { id: `${tipo === 'lotePublico' ? 'lote' : 'galpao'}-${String(i + 1).padStart(2, '0')}`, tipo, area: areas[i % areas.length]!, polo, setores: setoresCiclo[i % 4]!, lat: lat + ((i * 7) % 11 - 5) * 0.0021, lng: lng + ((i * 5) % 9 - 4) * 0.0024, zoneamento: null, preco: null, areaPronta: false, ...meta };
}
export const lotesExemplo: Oportunidade[] = Array.from({ length: 31 }, (_, i) => make(i, 'lotePublico'));
export const galpoesExemplo: Oportunidade[] = (['galpaoAluguel', 'galpaoVenda', 'galpaoAluguel', 'galpaoVenda'] as const).map((t, i) => ({ ...make(i + 40, t), id: `galpao-${i + 1}` }));
export const oportunidadesExemplo: Oportunidade[] = [...lotesExemplo, ...galpoesExemplo];
