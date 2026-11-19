import { describe, expect, it } from "vitest";
import { corridorGroup, districtLabel } from "@/components/economy/map-layers";
describe("map layer grouping", () => {
  it("normalizes district names", () => {
    expect(districtLabel("Distrito Industrial do CINQUINHO")).toBe("Cinquinho");
    expect(districtLabel("Cincao")).toBe("Cincão");
    expect(districtLabel("Distrito Industrial Dr. Hélio Pentagna Guimarães")).toBe("Hélio Pentagna");
    expect(districtLabel("Centro Industrial de Contagem")).toBe("Cinco");
    expect(districtLabel("Parque Qualquer")).toBeNull();
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
