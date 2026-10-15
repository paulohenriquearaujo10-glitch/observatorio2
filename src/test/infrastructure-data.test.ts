import { describe, it, expect } from 'vitest';
import { indicadores, graficos, metricPublished, hasChart, comparacaoPadrao, calculateCosts, canSimulate, metadata, matchesFilters, defaultFilters, distancias, type SimulationData, type SimulationInput } from '@/data/infraestrutura';
import { distancias as canonicalDistances } from '@/data/economia-territorio';
import { pt } from '@/i18n/pt';
import { en } from '@/i18n/en';
const input: SimulationInput = { atividade: 'servicos', area: 1200, energia: 10, agua: 20, empregados: 5, faturamento: 100000 };
const fixture: SimulationData = { iss: [{ id: 'test', nome: { pt: 'Teste', en: 'Test' }, codigo: 'fixture', atividade: 'servicos', cidade: 'contagem', valor: 3, ...metadata('Fixture', '%', '2026') }], iptu: [{ id: 'property-test', nome: { pt: 'Teste', en: 'Test' }, codigo: 'fixture', atividade: 'servicos', cidade: 'contagem', valor: 1, valorVenalM2: 1000, ...metadata('Fixture', '%', '2026') }], tarifas: [{ id: 'energia-a4', nome: { pt: 'Teste', en: 'Test' }, cidade: 'contagem', valor: 400, ...metadata('Fixture', 'R$/MWh', '2026') }], salario: { valor: 2500, ...metadata('Fixture', 'R$/mês', '2026') } };
describe('Infrastructure publication and operating estimates', () => {
  it('does not publish missing statistics or an empty simulator', () => {
    expect(indicadores.filter(metricPublished)).toEqual([]);
    expect(graficos.filter(g => hasChart(g, comparacaoPadrao))).toEqual([]);
    expect(canSimulate()).toBe(false);
    expect(calculateCosts(input)).toEqual([]);
  });
  it('shares canonical distances and the menu/home question', () => {
    expect(distancias).toBe(canonicalDistances);
    expect(pt.panels.find(p => p.slug === '/infraestrutura')?.q).toBe(pt.infrastructure.question);
    expect(en.panels.find(p => p.slug === '/infraestrutura')?.q).toBe(en.infrastructure.question);
  });
  it('uses activity-specific ISS and sourced tariffs, assessed property value and stock wages', () => {
    expect(calculateCosts(input, fixture).map(r => [r.id, r.valor])).toEqual([['iss', 3000], ['iptu', 1000], ['energia', 4000], ['folha', 12500]]);
    expect(calculateCosts({ ...input, atividade: 'industria' }, fixture).some(r => r.id === 'iss')).toBe(false);
    expect(calculateCosts(input, { ...fixture, iss: fixture.iss.map(r => ({ ...r, valor: 5 })) }).find(r => r.id === 'iss')?.valor).toBe(5000);
    expect(calculateCosts(input, { ...fixture, salario: undefined, tarifas: fixture.tarifas.map(r => ({ ...r, fonte: '' })) }).map(r => r.id)).toEqual(['iss', 'iptu']);
    expect(calculateCosts({ ...input, energia: -1 }, fixture)).toEqual([]);
  });
  it('does not apply municipal totals to unavailable regional/activity breakdowns', () => {
    expect(matchesFilters({}, { ...defaultFilters, territorio: 'CINCO' })).toBe(false);
    expect(matchesFilters({}, { ...defaultFilters, atividade: 'industria' })).toBe(false);
    expect(matchesFilters({ territorio: 'CINCO', atividade: 'industria' }, { territorio: 'CINCO', atividade: 'industria' })).toBe(true);
  });
});