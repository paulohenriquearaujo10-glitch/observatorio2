import type { Feature, FeatureCollection } from "geojson";

const norm = (v: unknown) => String(v ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const distritosOrdem = ["Cinco", "Cinquinho", "Cincão", "Hélio Pentagna", "Riacho das Pedras", "Cidade Industrial"] as const;
export function districtLabel(name: unknown): string | null {
  const n = norm(name);
  if (n.startsWith("jardim ") || n.startsWith("parque ")) return null;
  if (n.includes("cinquinho")) return "Cinquinho";
  if (n.includes("cincao")) return "Cincão";
  if (n.includes("pentagna")) return "Hélio Pentagna";
  if (n.includes("riacho das pedras")) return "Riacho das Pedras";
  if (n.includes("cidade industrial")) return "Cidade Industrial";
  if (n.includes("cinco") || n.includes("centro industrial de contagem")) return "Cinco";
  return null;
}

export const corredoresOrdem = ["BR-040", "BR-381 (Fernão Dias)", "Anel Rodoviário", "Via Expressa", "Av. João César de Oliveira", "Av. Babita Camargos", "Av. Maracanã", "Av. Amazonas", "Outras rodovias", "Outras vias arteriais"] as const;
export type CorridorKind = "federal" | "avenida" | "arterial";
export function corridorKind(group: string): CorridorKind {
  if (["BR-040", "BR-381 (Fernão Dias)", "Anel Rodoviário", "Outras rodovias"].includes(group)) return "federal";
  return group === "Outras vias arteriais" ? "arterial" : "avenida";
}
export function corridorGroup(props: Record<string, unknown> | null | undefined): string | null {
  const ref = norm(props?.["ref"]); const name = norm(props?.["name"]); const hw = norm(props?.["highway"]);
  if (ref.includes("br-040")) return "BR-040";
  if (ref.includes("br-381") || name.includes("fernao dias")) return "BR-381 (Fernão Dias)";
  if (ref.includes("br-262") || name.includes("anel rodoviario")) return "Anel Rodoviário";
  if (name.includes("via expressa") || name.includes("juscelino kubitschek")) return "Via Expressa";
  if (name.includes("joao cesar de oliveira")) return "Av. João César de Oliveira";
  if (name.includes("babita camargos")) return "Av. Babita Camargos";
  if (name.includes("maracana")) return "Av. Maracanã";
  if (name.includes("amazonas")) return "Av. Amazonas";
  if (hw === "motorway" || hw === "trunk") return "Outras rodovias";
  if (hw === "primary" || hw === "secondary" || hw === "tertiary") return "Outras vias arteriais";
  return null;
}

/** Agrupa feições do tipo aceito por rótulo, na ordem dada; grupos sem feição ficam fora. */
export function groupFeatures(fc: FeatureCollection, types: string[], label: (f: Feature) => string | null, order: readonly string[]) {
  const map = new Map<string, Feature[]>();
  for (const f of fc.features ?? []) {
    if (!f?.geometry || !types.includes(f.geometry.type)) continue;
    const key = label(f); if (!key) continue;
    map.set(key, [...(map.get(key) ?? []), f]);
  }
  return order.flatMap(key => {
    const features = map.get(key);
    return features ? [{ key, features }] : [];
  });
}
