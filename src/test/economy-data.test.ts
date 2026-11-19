import { describe, expect, it } from "vitest";
import { atualizadoEm, censos, defaultPeriod, gdpGrowth, graficos, hasSeries, indicadores, linhasComparacao, pibSerie, seguranca } from "@/data/economia-territorio";
import { allRows, chartRows, csvText } from "@/components/economy/exports";
import { chartValue, filteredPoints } from "@/components/economy/ChartPanel";

describe("Economy dashboard data", () => {
  it("publishes the three supplied KPIs and six charts, hiding missing data", () => {
    expect(indicadores.filter(d => d.valor !== null).map(d => d.id)).toEqual(["pib", "pibPc", "populacao"]);
    expect(graficos.filter(hasSeries)).toHaveLength(6);
    expect(defaultPeriod()).toEqual([2010, 2026]);
    expect(indicadores.find(d => d.id === "populacao")?.valor).toBe(652973);
  });
  it("exports no fabricated values and escapes CSV correctly", () => {
    expect(allRows().every(r => r["valor"] !== null)).toBe(true);
    expect(csvText([{ text: 'a;"b"' }])).toContain('"a;""b"""');
    expect(allRows().some(r => r["valor"] === 45092393 && r["fonte"] === "IBGE")).toBe(true);
  });
  it("retains GDP in thousand BRL and converts it to billions with a fixed 2010 index", () => {
    const chart = graficos.find(g => g.id === "pib");
    const point = pibSerie.at(-1);
    if (!chart || !point) throw new Error("Missing GDP data");
    expect(pibSerie.map(p => Number(p.periodo))).toEqual(Array.from({length: 14}, (_,i) => 2010+i));
    expect(point.valores["contagem"]).toBe(45092393);
    expect(chartValue(chart,point,"contagem","value",["contagem"])).toBeCloseTo(45.092393,6);
    expect(chartValue(chart,point,"contagem","index",["contagem"])).toBeCloseTo(45092393/19142636*100,6);
    expect(point.valores["joinville"]).toBeUndefined();
  });
  it("calculates 2013–2023 growth from the raw GDP series", () => {
    expect(gdpGrowth("contagem")).toBeCloseTo((45092393/24358358-1)*100,5);
    expect(gdpGrowth("betim")).toBeCloseTo((52614325/22006690-1)*100,6);
    expect(gdpGrowth("joinville")).toBeNull();
    expect(linhasComparacao.filter(r => r.valores["contagem"] != null)).toHaveLength(4);
  });
  it("uses VAB total as the sector percentage denominator and includes totals in CSV", () => {
    const chart = graficos.find(g => g.id === "valor-adicionado");
    const point = chart?.serie.at(-1);
    if (!chart || !point) throw new Error("Missing VAB data");
    expect(chartValue(chart,point,"servicos","percentage",["servicos"])).toBeCloseTo(17512659/29628361*100,6);
    expect(chartRows(chart).some(r => r["serie"] === "impostosLiquidos" && r["valor"] === 6850150)).toBe(true);
    expect(chart.serie.at(-1)?.periodo).toBe("2021");
  });
  it("preserves population, safety and update values supplied in the document", () => {
    expect(censos[0]?.pop2022).toBe(621863);
    expect(censos[0]?.area).toBe(194.746);
    expect(seguranca.valor).toBe(14.5);
    expect(seguranca.vitimas).toBe(90);
    expect(atualizadoEm).toBe("19/11/2026");
    expect(graficos.filter(hasSeries).every(g => g.atualizadoEm === "19/11/2026")).toBe(true);
  });
  it("retains both census pyramids and the supplied 2022 sex totals", () => {
    const chart = graficos.find(g => g.id === "piramide");
    if (!chart) throw new Error("Missing census pyramid");
    expect(filteredPoints(chart,[2024,2026],"municipio")).toHaveLength(42);
    const points = chart.serie.filter(p => p.recorte === "2022");
    expect(points.reduce((n,p) => n+(p.valores["homens"] ?? 0),0)).toBe(297729);
    expect(points.reduce((n,p) => n+(p.valores["mulheres"] ?? 0),0)).toBe(324134);
  });
  it("filters years and supported scopes without affecting municipal-only series", () => {
    const first = graficos[0]; if (!first) throw new Error("Missing chart definition");
    const base = { ...first, serie: [{ periodo: "2022", valores: { contagem: 1 } }, { periodo: "2023", valores: { contagem: 2 } }] };
    expect(filteredPoints(base, [2023, 2023], "polo")).toHaveLength(1);
    const sliced = { ...base, recortes: ["CINCO"], serie: [{ periodo: "2023", recorte: "CINCO", valores: { contagem: 3 } }, { periodo: "2023", recorte: "municipio", valores: { contagem: 4 } }] };
    expect(filteredPoints(sliced, [2023, 2023], "CINCO")[0]?.valores["contagem"]).toBe(3);
  });
});