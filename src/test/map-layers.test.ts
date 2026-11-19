import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { FeatureCollection } from "geojson";
import { corridorGroup, districtLabel, groupFeatures, distritosOrdem, corredoresOrdem } from "@/components/economy/map-layers";
import { zonasOrdem } from "@/data/economia-territorio";
const geo = (name: string): FeatureCollection => JSON.parse(readFileSync(`public/geo/${name}.geojson`, "utf8"));
describe("map layer grouping", () => {
  it("normalizes district names", () => {
    expect(districtLabel("Distrito Industrial do CINQUINHO")).toBe("Cinquinho");
    expect(districtLabel("Cincao")).toBe("Cincão");
    expect(districtLabel("Distrito Industrial Dr. Hélio Pentagna Guimarães")).toBe("Hélio Pentagna");
    expect(districtLabel("Centro Industrial de Contagem")).toBe("Cinco");
    expect(districtLabel("Parque Qualquer")).toBeNull();
    expect(districtLabel("Jardim Riacho das Pedras")).toBeNull();
    expect(districtLabel("Parque Riacho das Pedras 2ª Seção")).toBeNull();
  });
  it("loads supplied district polygons without inventing a Cinquinho boundary", () => {
    const groups = groupFeatures(geo("distritos-industriais"), ["Polygon", "MultiPolygon"], f => districtLabel(f.properties?.["name"]), distritosOrdem);
    expect(groups.map(g => g.key)).toEqual(["Cinco", "Cincão", "Hélio Pentagna", "Riacho das Pedras", "Cidade Industrial"]);
    expect(groups.flatMap(g => g.features).some(f => String(f.properties?.["name"]).startsWith("Jardim"))).toBe(false);
  });
  it("loads supplied road geometries and all eleven zoning codes", () => {
    const roads = groupFeatures(geo("corredores-viarios"), ["LineString", "MultiLineString"], f => corridorGroup(f.properties), corredoresOrdem);
    expect(roads.map(g => g.key)).toContain("BR-040");
    expect(roads.map(g => g.key)).toContain("BR-381 (Fernão Dias)");
    expect(geo("zoneamento-plano-diretor-2023").features.map(f => f.properties?.["zona"])).toEqual([...zonasOrdem]);
  });
  it("groups corridors", () => {
    expect(corridorGroup({ ref: "BR-262;BR-381" })).toBe("BR-381 (Fernão Dias)");
    expect(corridorGroup({ ref: "BR-262", name: "Anel" })).toBe("Anel Rodoviário");
    expect(corridorGroup({ name: "Avenida João César de Oliveira" })).toBe("Av. João César de Oliveira");
    expect(corridorGroup({ highway: "trunk", name: "X" })).toBe("Outras rodovias");
    expect(corridorGroup({ highway: "secondary" })).toBe("Outras vias arteriais");
    expect(corridorGroup({ highway: "residential" })).toBeNull();
  });
});
