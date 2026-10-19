import { describe, expect, it } from 'vitest';
import { aglomerados, clusterPublished, coursePublished, cursos, distancias, meiRules, metricPublished, numeros, type Course, type Metric } from '@/data/pequenos-negocios';
import { distancias as canonicalDistances } from '@/data/economia-territorio';

describe('Small business publication rules', () => {
  it('limits MEI to one employee', () => { expect(meiRules.maxEmployees).toBe(1); });
  it('keeps formalisation free', () => { expect(meiRules.formalizationCost).toBe(0); });
  it('records the normal monthly DAS due day', () => { expect(meiRules.dasDueDay).toBe(20); });
  it('records the normal annual return deadline', () => { expect([meiRules.annualReturnDueDay, meiRules.annualReturnDueMonth]).toEqual([31, 5]); });
  it('does not publish empty or unsourced statistics', () => {
    expect(numeros.filter(metricPublished)).toHaveLength(0);
    const row: Metric = { ...numeros[0], id: 'test', label: {pt:'',en:''}, unidade: '', fonte: 'Receita Federal', dataReferencia: '2026', atualizadoEm: '19/10/2026', valor: 12 };
    expect(metricPublished(row)).toBe(true);
    expect(metricPublished({ ...row, valor: null })).toBe(false);
    expect(metricPublished({ ...row, dataReferencia: '' })).toBe(false);
  });
  it('requires a sourced course and registration link', () => {
    expect(cursos.filter(coursePublished)).toHaveLength(0);
    const row: Course = {id:'test',nome:{pt:'Gestão',en:'Management'},tema:{pt:'Gestão',en:'Management'},provider:'Sebrae',grupo:'sebrae',url:'https://sebrae.com.br/',fonte:'Sebrae',dataReferencia:'2026',atualizadoEm:'19/10/2026'};
    expect(coursePublished(row)).toBe(true);
    expect(coursePublished({...row,url:''})).toBe(false);
    expect(coursePublished({...row,fonte:''})).toBe(false);
  });
  it('does not publish unverified clusters', () => {
    expect(aglomerados.filter(clusterPublished)).toHaveLength(0);
    expect(clusterPublished({id:'test',nome:'Test',fonte:'',dataReferencia:'2026',atualizadoEm:'19/10/2026'})).toBe(false);
  });
  it('uses the canonical territorial distances', () => { expect(distancias).toBe(canonicalDistances); });
});