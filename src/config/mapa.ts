// Contornos reais do mapa de Economia e Território. Trocar o arquivo (mesmo nome) atualiza o mapa.
export const geoArquivos = {
  distritosIndustriais: '/geo/distritos-industriais.geojson',
  corredoresViarios: '/geo/corredores-viarios.geojson',
  zoneamento: '/geo/zoneamento-plano-diretor-2023.geojson',
} as const;
export type GeoCamada = keyof typeof geoArquivos;
