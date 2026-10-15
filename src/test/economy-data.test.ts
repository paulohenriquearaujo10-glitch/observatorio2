import { describe, expect, it } from "vitest";
import { defaultPeriod, graficos, hasSeries, indicadores } from "@/data/economia-territorio";
import { allRows, csvText } from "@/components/economy/exports";
import { filteredPoints } from "@/components/economy/ChartPanel";

describe("Economy dashboard data", () => {
  it("publishes only the supplied GDP and keeps empty charts hidden", () => {
    expect(indicadores.filter(d => d.valor !== null).map(d => d.id)).toEqual(["pib"]);
    expect(graficos.filter(hasSeries)).toHaveLength(0);
    expect(defaultPeriod()).toEqual([2023, 2023]);
  });
  it("exports no fabricated values and escapes CSV correctly", () => {
    expect(allRows().every(r => r.valor !== null)).toBe(true);
    expect(csvText([{ text: 'a;"b"' }])).toContain('"a;""b"""');
    expect(allRows().some(r => r.valor === 45.1 && r.fonte === "IBGE")).toBe(true);
  });
  it("filters years and supported scopes without affecting municipal-only series", () => {
    const base = { ...graficos[0], serie: [{ periodo: "2022", valores: { contagem: 1 } }, { periodo: "2023", valores: { contagem: 2 } }] };
    expect(filteredPoints(base, [2023, 2023], "polo")).toHaveLength(1);
    const sliced = { ...base, recortes: ["CINCO"], serie: [{ periodo: "2023", recorte: "CINCO", valores: { contagem: 3 } }, { periodo: "2023", recorte: "municipio", valores: { contagem: 4 } }] };
    expect(filteredPoints(sliced, [2023, 2023], "CINCO")[0].valores.contagem).toBe(3);
  });
});