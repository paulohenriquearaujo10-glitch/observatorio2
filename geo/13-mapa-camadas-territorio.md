# 13. Camadas do mapa da página Economia e Território

**Para que serve.** O mapa da seção Território (https://contagem.life/economia-territorio) passa a ter três camadas reais no lugar das de exemplo: **Distritos industriais** (Cinco, Cincão, Cinquinho, Hélio Pentagna, Riacho das Pedras e Cidade Industrial), **Corredores viários** e **Zoneamento do Plano Diretor**. As camadas **Regionais administrativas** e **Vazios urbanos e áreas de expansão** saem do mapa.

**De onde vêm os contornos.**
- **Zoneamento:** arquivo `zoneamento-plano-diretor-2023.geojson`, que eu gerei a partir do PDF oficial do Anexo III da Lei Complementar nº 362/2023. O PDF foi feito no QGIS em SIRGAS 2000 / UTM 23S e traz a grade de coordenadas impressa; usei essa grade para posicionar o mapa no terreno (precisão de cerca de 5 a 10 metros) e separei as 11 zonas pela cor da legenda. A área total somou 191,9 km², contra 194,7 km² do IBGE (a diferença é a Lagoa Vargem das Flores, que fica fora das zonas). Como é uma vetorização de imagem, a camada é **ilustrativa**: a consulta oficial de zoneamento continua sendo a da Prefeitura. Se a SMDUH puder enviar o shapefile original, ele substitui este arquivo com o mesmo nome, sem mudar nada no site.
- **Distritos industriais e corredores viários:** OpenStreetMap, exportado pelo Overpass Turbo (passo a passo abaixo). O ambiente onde eu trabalho não consegue acessar o OpenStreetMap, por isso a exportação precisa ser feita no seu navegador. Leva uns 5 minutos.

---

## Antes de colar

### 1. Gerar os dois arquivos do OpenStreetMap

**a) Distritos industriais**

1. Abra https://overpass-turbo.eu
2. Apague o texto do painel da esquerda e cole a consulta abaixo:

```
[out:json][timeout:90];
area["name"="Contagem"]["boundary"="administrative"]["admin_level"="8"]->.c;
(
  nwr(area.c)["landuse"="industrial"]["name"~"Industrial|Riacho das Pedras|Pentagna|CINCO|Cinco|Cinc[aã]o|Cinquinho",i];
  nwr(area.c)["place"~"suburb|neighbourhood|quarter"]["name"~"Industrial|Riacho das Pedras|Pentagna|CINCO|Cinco|Cinc[aã]o|Cinquinho",i];
  relation(area.c)["boundary"~"administrative|place"]["name"~"Industrial|Riacho das Pedras|Pentagna|CINCO|Cinco|Cinc[aã]o|Cinquinho",i];
  nwr(area.c)["industrial"]["name"~"Distrito|Centro Industrial",i];
);
out geom;
```

3. Clique em **Executar**. O mapa da direita mostra o que o OpenStreetMap tem.
4. Clique em cada forma e confira o nome. Fique só com **polígonos** (contornos fechados) dos seis distritos. Pontos soltos não servem como delimitação.
5. Clique em **Exportar › GeoJSON › baixar** e salve como `distritos-industriais.geojson`.

Se algum dos seis distritos **não aparecer como polígono**, é porque o OpenStreetMap não tem o contorno dele. Nesse caso o melhor é pedir o limite oficial à Prefeitura (SMDUH) ou à Codemge, em shapefile, KML ou GeoJSON, e me mandar: eu junto tudo num arquivo só.

**b) Corredores viários**

Repita os passos com esta consulta e salve como `corredores-viarios.geojson`:

```
[out:json][timeout:120];
area["name"="Contagem"]["boundary"="administrative"]["admin_level"="8"]->.c;
(
  way(area.c)["highway"~"^(motorway|trunk|motorway_link|trunk_link)$"];
  way(area.c)["highway"="primary"];
  way(area.c)["highway"~"^(secondary|tertiary)$"]["name"~"Babita Camargos|João César de Oliveira|David Sarnoff|Maracanã|Severino Ballesteros|Amazonas|Juscelino Kubitschek|Via Expressa|Teleférico",i];
);
out geom;
```

### 2. Colocar os arquivos no projeto do Lovable

Os três arquivos vão para a pasta `public/geo/` do projeto:

- `public/geo/zoneamento-plano-diretor-2023.geojson` (o arquivo que eu enviei, 1,3 MB)
- `public/geo/distritos-industriais.geojson`
- `public/geo/corredores-viarios.geojson`

Pelo GitHub (recomendado, porque o arquivo de zoneamento é grande demais para colar no chat): abra o repositório do projeto, entre em `public/geo` (ou crie a pasta), clique em **Add file › Upload files**, envie os três arquivos com esses nomes e confirme. Para atualizar no futuro, basta subir uma nova versão com o mesmo nome.

Se ainda não tiver os dois arquivos do OpenStreetMap, pode colar o prompt mesmo assim: as camadas que não tiverem arquivo simplesmente não aparecem até o arquivo chegar.

---
INÍCIO DO PROMPT (copie daqui para baixo, até FIM DO PROMPT)
---
Altere apenas o que este pedido descreve. Não mude textos, cores, o layout nem as outras páginas. Vamos ajustar as camadas do **mapa da seção Território** da página **Economia e Território** (`/economia-territorio`).

## 1. Camadas que saem

- Remova do mapa, do painel de camadas e da legenda as camadas **"Regionais administrativas"** e **"Vazios urbanos e áreas de expansão"**.
- Apague os GeoJSON de exemplo dessas duas camadas em `src/data/geo/` e qualquer código que só elas usavam.
- Remova também a camada de exemplo **"Polos industriais"** e a camada de exemplo de **zoneamento** e de **corredores viários**: elas são substituídas pelas camadas abaixo, que leem arquivos reais.
- O painel lateral do mapa deixa de mostrar campos de regional.

## 2. Como as novas camadas leem os dados

- Os contornos ficam em arquivos na pasta `public/geo/`. Guarde os caminhos numa constante em `src/config/mapa.ts`:
  - `distritosIndustriais: '/geo/distritos-industriais.geojson'`
  - `corredoresViarios: '/geo/corredores-viarios.geojson'`
  - `zoneamento: '/geo/zoneamento-plano-diretor-2023.geojson'`
- Carregue cada arquivo com `fetch` só quando a camada for ligada pela primeira vez (o de zoneamento tem 1,3 MB) e guarde em memória para não baixar de novo.
- Não copie coordenadas para dentro do código: o mapa sempre lê o arquivo. Trocar o arquivo por outro com o mesmo nome atualiza o mapa.
- Se um arquivo não existir ou der erro, a camada correspondente **não aparece** no painel de camadas, sem mensagem de erro na tela (registre o erro só no console).
- Desenhe com o componente `GeoJSON` do react-leaflet sobre o mesmo mapa base OpenStreetMap que já existe.
- Ordem de desenho, de baixo para cima: Zoneamento, Distritos industriais, Corredores viários.

## 3. Camada "Distritos industriais"

- Arquivo: `/geo/distritos-industriais.geojson` (exportado do OpenStreetMap).
- Use só as feições do tipo **Polygon** ou **MultiPolygon**. Ignore pontos e linhas.
- O nome de cada distrito vem da propriedade `name`. Normalize para estes seis rótulos, comparando sem acento e sem diferenciar maiúsculas:
  - contém "Cinquinho" → **Cinquinho**
  - contém "Cincão" ou "Cincao" → **Cincão**
  - contém "Pentagna" → **Hélio Pentagna**
  - contém "Riacho das Pedras" → **Riacho das Pedras**
  - contém "Cidade Industrial" → **Cidade Industrial**
  - contém "CINCO" ou "Centro Industrial de Contagem" (e não for Cincão nem Cinquinho) → **Cinco**
  - Feições com outros nomes ficam fora do mapa.
- Se houver mais de um polígono para o mesmo distrito, junte num item só no painel.
- Estilo: cada distrito com borda de 2,5px na cor `#D9622B` e preenchimento na mesma cor com 25% de opacidade. Ao passar o mouse, a opacidade sobe para 45% e aparece o nome do distrito numa dica.
- Rótulo fixo com o nome do distrito no centro do polígono, visível a partir do zoom 13.
- No painel de camadas, a camada tem um subitem por distrito, com caixa para ligar e desligar cada um. A camada fica **ligada por padrão**.
- Ao clicar num distrito, o painel lateral mostra: nome, **área aproximada em km²** (calcule com `@turf/area`, uma casa decimal) e o link "Ver oportunidades nesta área" (→ `/mapa`). Os demais campos (empresas ativas, empregos) só aparecem quando houver dado; se não houver, ficam ocultos.
- Embaixo do mapa, quando a camada estiver ligada: "Fonte: OpenStreetMap (colaboradores do OSM, licença ODbL) · Atualizado em 19/11/2026".

## 4. Camada "Corredores viários"

- Arquivo: `/geo/corredores-viarios.geojson` (exportado do OpenStreetMap).
- Use só as feições do tipo **LineString** ou **MultiLineString**.
- Agrupe as vias em corredores pelo `ref` e pelo `name` de cada feição, comparando sem acento e sem diferenciar maiúsculas:
  - `ref` contém "BR-040" → **BR-040**
  - `ref` contém "BR-381" ou `name` contém "Fernão Dias" → **BR-381 (Fernão Dias)**
  - `ref` contém "BR-262" ou `name` contém "Anel Rodoviário" → **Anel Rodoviário**
  - `name` contém "Via Expressa" ou "Juscelino Kubitschek" → **Via Expressa**
  - `name` contém "João César de Oliveira" → **Av. João César de Oliveira**
  - `name` contém "Babita Camargos" → **Av. Babita Camargos**
  - `name` contém "Maracanã" → **Av. Maracanã**
  - `name` contém "Amazonas" → **Av. Amazonas**
  - demais vias com `highway` = motorway ou trunk → **Outras rodovias**
  - demais vias com `highway` = primary, secondary ou tertiary → **Outras vias arteriais**
  - Se um grupo não tiver nenhuma feição no arquivo, ele não aparece no painel.
- Estilo:
  - Rodovias federais (BR-040, BR-381, Anel Rodoviário, Outras rodovias): linha de 5px, cor `#1F3A5F`, com contorno branco de 7px por baixo para destacar do mapa base.
  - Avenidas e Via Expressa: linha de 3,5px, cor `#3E7CB1`.
  - Outras vias arteriais: linha de 2px, cor `#8FA9C4`.
- Ao passar o mouse, a linha engrossa 2px e aparece uma dica com o nome do corredor. Ao clicar, o painel lateral mostra o nome do corredor e a **extensão aproximada dentro de Contagem em km** (some os trechos com `@turf/length`, uma casa decimal).
- No painel de camadas, um subitem por corredor, com caixa para ligar e desligar. A camada fica **ligada por padrão**.
- Fonte embaixo do mapa: "Fonte: OpenStreetMap (colaboradores do OSM, licença ODbL) · Atualizado em 19/11/2026".

## 5. Camada "Zoneamento do Plano Diretor"

- Arquivo: `/geo/zoneamento-plano-diretor-2023.geojson`. São 11 feições (uma por zona), cada uma com as propriedades `zona` (código), `grupo`, `cor` e `fonte`.
- Pinte cada zona com a cor da propriedade `cor` (são as cores da legenda oficial do Anexo III), preenchimento com 55% de opacidade e borda de 0,5px na mesma cor. Ao passar o mouse, a opacidade sobe para 75% e aparece o código da zona.
- A camada fica **desligada por padrão** (ela cobre o município inteiro). Quando for ligada, a camada de distritos continua por cima, só com a borda.
- Legenda da camada, na ordem do mapa oficial, com o quadradinho de cor e o código: ZAE1, ZAE2, ZEIS1, ZEIS2, ZPA1, ZPA2, ZPA3, ZUD1, ZUD2, ZUD3, ZUD4. Agrupe na legenda por `grupo` (ZAE, ZEIS, ZPA, ZUD), com caixa para ligar e desligar cada grupo.
- Ao clicar numa zona, o painel lateral mostra o código da zona, a **área total da zona em km²** (calcule com `@turf/area`) e o aviso: "Contorno vetorizado a partir do mapa oficial em PDF. Para consulta oficial de zoneamento de um lote, procure a Secretaria Municipal de Desenvolvimento Urbano e Habitação."
- Crie em `src/data/economia-territorio.ts` um objeto `descricaoZonas` com uma entrada vazia para cada código (`ZAE1: ''`, …). Enquanto a descrição de uma zona estiver vazia, o painel mostra só o código; quando for preenchida, a descrição aparece abaixo do código.
- Fonte embaixo do mapa: "Fonte: Prefeitura de Contagem, Plano Diretor (Lei Complementar nº 362/2023), Anexo III - Mapa de Zoneamento · Atualizado em 19/11/2026".
- Ligue o link "Plano Diretor (PDF)" da seção Território a esse mesmo documento, se o endereço já estiver configurado.

## 6. Painel de camadas e conferência

- Ordem no painel: **Distritos industriais**, **Corredores viários**, **Zoneamento do Plano Diretor**, seguidas das camadas que já existem e não foram citadas aqui.
- Ao abrir a página, o mapa enquadra o limite de Contagem como hoje. Não mude o zoom inicial.
- No celular, o painel de camadas continua recolhível e a legenda do zoneamento abre num quadro rolável.
- Depois de pronto, confira: (1) as camadas de regionais e de áreas de expansão não aparecem em lugar nenhum; (2) com os três arquivos presentes, as três camadas aparecem e cada clique abre o painel com área ou extensão; (3) apagando um dos arquivos, só aquela camada some e o resto do mapa funciona.
---
FIM DO PROMPT
---
