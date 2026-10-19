import { distancias as economyDistances, type LocalText } from './economia-territorio';

const text = (pt: string, en: string): LocalText => ({ pt, en });
export const revisadoEm = '19/10/2026';
export const meiRules = { maxEmployees: 1, formalizationCost: 0 };
export const links = {
  empreendedor: 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor',
  formalizar: 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei',
  mei: 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/ja-sou-mei',
  prefeitura: 'https://www.contagem.mg.gov.br/',
  junta: 'https://www.jucemg.mg.gov.br/',
  receita: 'https://www.gov.br/receitafederal/pt-br',
  sef: 'https://www.fazenda.mg.gov.br/',
  bombeiros: 'https://www.bombeiros.mg.gov.br/',
  nfse: 'https://www.nfse.gov.br/EmissorNacional/',
  simples: 'https://www8.receita.fazenda.gov.br/SimplesNacional/',
  sebrae: 'https://sebrae.com.br/sites/PortalSebrae/cursosonline',
};
export type SourceMeta = { fonte: string; dataReferencia: string; atualizadoEm: string };
export function sourced(row: SourceMeta) { return [row.fonte, row.dataReferencia, row.atualizadoEm].every(s => s.trim().length > 0); }
export type Metric = SourceMeta & { id: string; label: LocalText; valor: number | null; unidade: string };
export function metricPublished(row: Metric) { return row.valor !== null && Number.isFinite(row.valor) && sourced(row); }
export const numeros: Metric[] = [
  ['pequenos', 'Pequenos negócios ativos', 'Active small businesses', 'Receita Federal (CNPJ)', ''],
  ['meis', 'MEIs ativos', 'Active MEIs', 'Portal do Empreendedor', ''],
  ['aberturas', 'Novos negócios em 12 meses', 'New businesses in 12 months', 'Receita Federal', ''],
  ['emprego', 'Participação no emprego', 'Share of employment', 'RAIS / Sebrae', '%'],
].map(([id, pt, en, fonte, unidade]) => ({ id, label: text(pt, en), fonte, unidade, valor: null, dataReferencia: '', atualizadoEm: '' }));
export const distancias = economyDistances;
export const fornecedores: Metric[] = [
  { id: 'atacado', label: text('Atacadistas', 'Wholesalers'), valor: null, unidade: '', fonte: 'Receita Federal', dataReferencia: '', atualizadoEm: '' },
  { id: 'transporte', label: text('Empresas de transporte e logística', 'Transport and logistics companies'), valor: null, unidade: '', fonte: 'Receita Federal', dataReferencia: '', atualizadoEm: '' },
];
export const glossary = {
  CNAE: text('Código que identifica a atividade econômica da empresa.', 'Code identifying a company’s economic activity.'),
  CNPJ: text('Número de identificação da empresa na Receita Federal.', 'Company identification number issued by Brazil’s Federal Revenue Service.'),
  'alvará': text('Autorização de funcionamento. As exigências e dispensas dependem da atividade e do risco.', 'Operating permit. Requirements and exemptions depend on the activity and its risk.'),
  'inscrição municipal': text('Cadastro da empresa na Prefeitura para obrigações locais, como o imposto sobre serviços.', 'Company registration with the municipality for local obligations, such as service tax.'),
  'NFS-e': text('Nota Fiscal de Serviço eletrônica: documento de uma prestação de serviço.', 'Electronic service invoice: a document recording a service transaction.'),
};
export type SectionId = 'vantagens' | 'caso' | 'passos' | 'atendimento' | 'cursos' | 'digital' | 'aglomerados' | 'fornecedores' | 'faq';
export const sectionOrder: SectionId[] = ['vantagens', 'caso', 'passos', 'atendimento', 'cursos', 'digital', 'aglomerados', 'fornecedores', 'faq'];
export const headings: Record<SectionId, LocalText> = {
  vantagens: text('Vantagens de ter o seu negócio aqui', 'Why base your business here'),
  caso: text('Por onde começar', 'Where to start'),
  passos: text('O caminho da formalização em Contagem', 'The path to a registered business in Contagem'),
  atendimento: text('Atendimento presencial e gratuito em Contagem', 'Free in-person business support in Contagem'),
  cursos: text('Aprenda a gerir e fazer crescer o seu negócio', 'Learn to manage and grow your business'),
  digital: text('Leve o seu negócio para o digital', 'Take your business online'),
  aglomerados: text('Onde os negócios se encontram', 'Where businesses meet'),
  fornecedores: text('Tudo o que o seu negócio precisa, por perto', 'What your business needs, nearby'),
  faq: text('Perguntas frequentes', 'Frequently asked questions'),
};
export const indexLabels: Record<SectionId, LocalText> = {
  vantagens: text('Por que empreender aqui', 'Why start here'), caso: text('Qual é o seu caso', 'Your starting point'), passos: text('Passo a passo', 'Step by step'), atendimento: text('Onde ser atendido', 'Where to get help'), cursos: text('Cursos e capacitação', 'Courses and training'), digital: text('Vender pela internet', 'Selling online'), aglomerados: text('Aglomerados empresariais', 'Business clusters'), fornecedores: text('Fornecedores e transportadoras', 'Suppliers and carriers'), faq: headings.faq,
};
export const vantagens = [
  { id: 'atendimento', icon: 'Handshake', title: text('Atendimento gratuito e perto de você', 'Free support close to you'), description: text('Comece pela Sala Mineira do Empreendedor e consulte os canais da Prefeitura para orientação sobre abertura e regularização.', 'Start with Sala Mineira do Empreendedor and consult City channels for help with registering your business.'), target: 'atendimento' },
  { id: 'cursos', icon: 'GraduationCap', title: text('Cursos e capacitação', 'Courses and training'), description: text('Aprenda gestão, finanças, vendas e formalização. Consulte as oportunidades da Prefeitura e do Sebrae.', 'Learn management, finance, sales and registration. Check opportunities from the City and Sebrae.'), target: 'cursos' },
  { id: 'digital', icon: 'Smartphone', title: text('Vender pela internet', 'Selling online'), description: text('Redes sociais, lojas virtuais e pagamentos digitais podem ampliar o alcance do seu negócio.', 'Social networks, online stores and digital payments can expand your business’s reach.'), target: 'digital' },
  { id: 'aglomerados', icon: 'Store', title: text('Aglomerados empresariais', 'Business clusters'), description: text('A proximidade de outros negócios ajuda a encontrar clientes, parceiros e oportunidades de compras conjuntas.', 'Being near other businesses helps you find customers, partners and joint purchasing opportunities.'), target: 'aglomerados' },
  { id: 'fornecedores', icon: 'Truck', title: text('Fornecedores e transportadoras por perto', 'Suppliers and carriers nearby'), description: text('Explore a base de comércio e logística de Contagem para comprar insumos e enviar seus produtos.', 'Explore Contagem’s trade and logistics base to buy supplies and ship your products.'), target: 'fornecedores' },
  { id: 'mercado', icon: 'Users', title: text('Um grande mercado consumidor', 'A broad consumer market'), description: text('Contagem integra a Região Metropolitana de Belo Horizonte. Conheça os dados de mercado e território.', 'Contagem is part of Greater Belo Horizonte. Explore the market and territory data.'), target: '/economia-territorio' },
] as const;
export type Step = { title: LocalText; description: LocalText; where?: LocalText; url?: string; documents?: LocalText; cost?: LocalText; deadline?: LocalText };
const step = (pt: string, en: string, dpt: string, den: string, where?: string, url?: string, extra: Partial<Step> = {}): Step => ({ title: text(pt, en), description: text(dpt, den), ...(where ? { where: text(where, where) } : {}), ...(url ? { url } : {}), ...extra });
export const caminhos: Array<{ id: string; title: LocalText; intro: LocalText; steps: Step[] }> = [
  { id: 'a', title: text('Quero abrir um MEI', 'I want to register as a MEI'), intro: text('Para quem atua por conta própria, sem sócios, com até 1 empregado e dentro do limite anual do MEI. Confira também as demais condições no Portal do Empreendedor.', 'For a self-employed person with no partners, up to 1 employee and revenue within the MEI annual limit. Check all other conditions on the official portal.'), steps: [
    step('Verifique se a atividade pode ser MEI', 'Check whether your activity is eligible', 'Consulte as ocupações permitidas. A atividade escolhida deve corresponder ao trabalho que você realmente faz.', 'Check the permitted occupations. Choose the activity that matches your actual work.', 'Portal do Empreendedor', links.formalizar),
    step('Confira se o endereço permite a atividade', 'Check whether your address permits the activity', 'Antes de alugar ou adaptar um imóvel, consulte a Prefeitura sobre o uso do solo e as exigências do endereço.', 'Before renting or adapting premises, ask the City about land use and address requirements.', 'Prefeitura de Contagem', links.prefeitura),
    step('Faça a formalização gratuita', 'Register free of charge', 'Use sua conta gov.br no Portal do Empreendedor. Ao concluir, você recebe o CNPJ e o Certificado da Condição de MEI (CCMEI).', 'Use your gov.br account on the official portal. After registration, you receive your CNPJ and MEI certificate (CCMEI).', 'Portal do Empreendedor', links.formalizar, { cost: text('Gratuito (R$ 0) no portal oficial.', 'Free (R$ 0) on the official portal.'), documents: text('Conta gov.br, dados pessoais, atividade e endereço do negócio.', 'gov.br account, personal details, activity and business address.') }),
    step('Confira a regularização na Prefeitura', 'Check municipal registration requirements', 'Consulte a inscrição municipal e a licença de funcionamento ou dispensa aplicável. Ser MEI não elimina as regras sanitárias, ambientais e de uso do imóvel.', 'Check municipal registration and any required operating permit or exemption. MEI status does not remove health, environmental or property-use rules.', 'Prefeitura de Contagem', links.prefeitura),
    step('Emita notas fiscais', 'Issue invoices', 'Para serviços do MEI, use o emissor nacional de NFS-e. Para venda de mercadorias, consulte a SEF-MG. Confira quando a emissão é obrigatória.', 'For MEI services, use the national NFS-e issuer. For goods, consult SEF-MG. Check when an invoice is required.', 'Emissor Nacional de NFS-e', links.nfse),
    step('Mantenha o MEI em dia', 'Keep your MEI up to date', 'Pague o DAS mensal e entregue a declaração anual DASN-SIMEI, inclusive se não teve faturamento. Consulte o calendário oficial para vencimentos e eventuais prorrogações.', 'Pay monthly DAS contributions and submit the annual DASN-SIMEI return, even with no revenue. Check the official calendar for due dates and any extensions.', 'Portal do Empreendedor', links.mei),
  ] },
  { id: 'b', title: text('Quero abrir uma microempresa ou empresa de pequeno porte', 'I want to open a micro or small enterprise'), intro: text('Para quem tem sócios, precisa de mais empregados ou não se enquadra nas condições do MEI. Um contador ajuda a escolher o caminho.', 'For businesses with partners, more employees or outside MEI conditions. An accountant can help choose the right path.'), steps: [
    step('Defina a atividade e o tipo de empresa', 'Choose the activity and company structure', 'Com um contador, defina o CNAE, a forma jurídica e o regime de tributação, como Simples Nacional ou Lucro Presumido, quando cabíveis.', 'With an accountant, choose the CNAE, legal structure and applicable tax regime, such as Simples Nacional or Lucro Presumido.'),
    step('Faça a consulta de viabilidade', 'Check business feasibility', 'Verifique o nome empresarial e se o endereço permite a atividade, pelo sistema integrado da Redesim/JUCEMG e pela Prefeitura.', 'Check the business name and whether the address allows the activity through Redesim/JUCEMG and the City.', 'JUCEMG', links.junta),
    step('Registre a empresa e obtenha o CNPJ', 'Register the company and obtain a CNPJ', 'Siga o processo integrado de registro. Empresas empresárias usam a Junta Comercial; outras formas jurídicas podem ter registro próprio.', 'Follow the integrated registration process. Commercial companies use the Trade Board; other legal structures may use a different registry.', 'JUCEMG', links.junta),
    step('Confira as inscrições necessárias', 'Check required tax registrations', 'Consulte a inscrição municipal para prestação de serviços e a inscrição estadual para atividades sujeitas ao ICMS, como comércio e indústria.', 'Check municipal registration for services and state registration for activities subject to ICMS, such as trade and industry.', 'SEF-MG', links.sef),
    step('Consulte o alvará de funcionamento', 'Check operating permit requirements', 'Peça à Prefeitura orientação sobre alvará, dispensa e enquadramento de risco da atividade antes de iniciar a operação.', 'Ask the City about operating permits, exemptions and activity risk classification before starting operations.', 'Prefeitura de Contagem', links.prefeitura),
    step('Verifique as licenças específicas', 'Check activity-specific licences', 'Vigilância sanitária: atividades com risco à saúde. Licença ambiental: atividades com impacto ambiental. Bombeiros: segurança contra incêndio e documento aplicável, como AVCB. As exigências variam conforme a atividade e o imóvel.', 'Health approval: activities involving health risks. Environmental licence: activities with environmental impact. Fire service: fire safety and applicable certificates, such as AVCB. Requirements depend on the activity and premises.', 'Corpo de Bombeiros de Minas Gerais', links.bombeiros),
    step('Organize notas fiscais e tributos', 'Organise invoices and taxes', 'Com o contador, habilite a NFS-e para serviços ou a NF-e para mercadorias e organize as obrigações mensais do regime escolhido.', 'With your accountant, enable service invoices (NFS-e) or goods invoices (NF-e) and organise monthly tax obligations.', 'Prefeitura de Contagem', links.prefeitura),
  ] },
  { id: 'c', title: text('Já trabalho, mas não estou regularizado', 'I am trading but not fully registered'), intro: text('Para quem funciona sem CNPJ, sem licenças exigidas ou com pendências na Prefeitura.', 'For businesses without a CNPJ, required licences or with outstanding municipal issues.'), steps: [
    step('Comece com um diagnóstico', 'Start with an assessment', 'Procure a Sala Mineira do Empreendedor para identificar o que falta: cadastro, inscrição, alvará, licenças ou débitos. Consulte os canais da Prefeitura para o atendimento.', 'Contact Sala Mineira do Empreendedor to identify missing registration, permits, licences or outstanding debts. Check City channels for service arrangements.', 'Prefeitura de Contagem', links.prefeitura),
    step('Escolha a forma jurídica', 'Choose the legal structure', 'Confira se você pode ser MEI ou se precisa abrir uma ME/EPP. Siga o Caminho A ou B, aproveitando o que já estiver regularizado.', 'Check whether you qualify as MEI or need a micro/small enterprise. Follow Path A or B, retaining registrations already in order.'),
    step('Regularize o endereço e as licenças', 'Regularise your address and licences', 'Consulte a Prefeitura sobre o endereço e as autorizações exigidas para a atividade que já funciona no local.', 'Ask the City about your address and the authorisations required for the activity already operating there.', 'Prefeitura de Contagem', links.prefeitura),
    step('Consulte e negocie débitos', 'Check and arrange outstanding payments', 'Débitos municipais são tratados com a Prefeitura. DAS e débitos do Simples devem ser consultados nos canais oficiais; a forma de parcelamento depende de onde a dívida está registrada.', 'Municipal debts are handled by the City. Consult official channels for DAS and Simples debts; repayment options depend on where the debt is registered.', 'Simples Nacional', links.simples),
    step('Organize um calendário de obrigações', 'Create an obligations calendar', 'Guarde comprovantes, acompanhe vencimentos e peça orientação quando mudar de atividade, endereço ou faturamento.', 'Keep receipts, track due dates and seek advice when your activity, address or revenue changes.', 'Portal do Empreendedor', links.mei),
  ] },
];
export type Atendimento = { id: string; nome: string; description?: LocalText; endereco?: string; horario?: LocalText; telefone?: string; whatsapp?: string; email?: string; url?: string; maps?: string; foto?: string; latitude?: number; longitude?: number };
export const atendimentos: Atendimento[] = [
  { id: 'sala', nome: 'Sala Mineira do Empreendedor', description: text('Procure orientação para formalização, documentos e regularização do seu negócio. Consulte os canais oficiais da Prefeitura antes de se deslocar.', 'Seek guidance on registration, documents and regularisation. Check official City channels before travelling.'), url: links.prefeitura },
  { id: 'cescon', nome: 'Cescon' },
  { id: 'casa', nome: 'Casa do Empreendimento Sustentável' },
  { id: 'sebrae', nome: 'Sebrae Minas', description: text('Orientação sobre gestão, cursos, acesso a crédito e atendimento ao MEI. Verifique a unidade que atende Contagem e as condições de cada serviço.', 'Advice on management, courses, access to credit and MEI support. Check the unit serving Contagem and the terms of each service.'), url: 'https://sebrae.com.br/sites/PortalSebrae/ufs/mg' },
];
export type Course = SourceMeta & { id: string; nome: LocalText; provider: string; tema: LocalText; formato?: LocalText; carga?: string; gratuito?: boolean; url: string; grupo: 'prefeitura' | 'sebrae' };
export const cursos: Course[] = [];
export function coursePublished(c: Course) { return Boolean(c.url && c.provider && c.nome.pt && c.nome.en && sourced(c)); }
export type Cluster = SourceMeta & { id: string; nome: string; regiao?: string; tipo?: LocalText; quantidade?: number; foto?: string; maps?: string; latitude?: number; longitude?: number };
export const aglomerados: Cluster[] = [];
export function clusterPublished(c: Cluster) { return Boolean(c.nome && sourced(c)); }
export const digitalTopics = [
  { icon: 'Smartphone', title: text('Redes sociais e WhatsApp Business', 'Social networks and WhatsApp Business'), description: text('Divulgue seus produtos, organize o catálogo e responda aos clientes com clareza.', 'Promote products, organise your catalogue and respond clearly to customers.') },
  { icon: 'ShoppingBag', title: text('Marketplaces', 'Marketplaces'), description: text('Compare taxas, regras de venda e prazos antes de escolher uma plataforma.', 'Compare fees, selling rules and deadlines before choosing a platform.') },
  { icon: 'CreditCard', title: text('Pagamentos digitais e Pix', 'Digital payments and Pix'), description: text('Confirme o recebimento na sua conta e proteja os dados do negócio e dos clientes.', 'Confirm receipt in your account and protect business and customer data.') },
  { icon: 'Truck', title: text('Entrega e logística para e-commerce', 'E-commerce delivery and logistics'), description: text('Compare fretes, prazos, embalagem e política de devolução para cada produto.', 'Compare shipping costs, delivery times, packaging and return policies for each product.') },
];
export const faqs = [
  text('Quanto custa abrir um MEI?', 'How much does MEI registration cost?'),
  text('O MEI pode ter empregado?', 'Can a MEI employ someone?'),
  text('Posso abrir uma empresa em casa?', 'Can I register a business at home?'),
  text('Preciso de alvará para trabalhar em casa?', 'Do I need a permit to work from home?'),
  text('Qual a diferença entre MEI, ME e EPP?', 'What is the difference between MEI, ME and EPP?'),
  text('E se eu passar do limite de faturamento?', 'What if I exceed the revenue limit?'),
  text('Como emito nota fiscal?', 'How do I issue an invoice?'),
  text('Estou com o MEI em atraso. Como regularizo?', 'My MEI payments are overdue. What should I do?'),
  text('Onde consigo crédito?', 'Where can I find credit?'),
  text('Todos os cursos são gratuitos?', 'Are all courses free?'),
].map((question, i) => ({ id: String(i), question, answer: [
  text('A formalização no portal oficial é gratuita (R$ 0). Depois da abertura, existem obrigações, como o DAS mensal. Desconfie de cobranças pelo cadastro.', 'Registration on the official portal is free (R$ 0). After registration, obligations include monthly DAS payments. Be wary of registration charges.'),
  text('Sim. O MEI pode contratar até 1 empregado, observando salário e obrigações previstos nas regras oficiais.', 'Yes. A MEI may hire up to 1 employee, observing official wage and employment requirements.'),
  text('Depende da atividade, do uso do solo e das regras do imóvel. Consulte a viabilidade com a Prefeitura antes de informar o endereço.', 'It depends on the activity, land-use rules and premises. Check feasibility with the City before registering the address.'),
  text('Trabalhar em casa não garante dispensa. Consulte o enquadramento da atividade e as regras de licenciamento ou dispensa na Prefeitura.', 'Working from home does not automatically grant an exemption. Check the activity classification and permit or exemption rules with the City.'),
  text('MEI é uma categoria com condições próprias. ME e EPP são portes definidos pelo faturamento, não tipos de sociedade. Um contador pode orientar sobre enquadramento e tributação.', 'MEI is a category with specific conditions. ME and EPP are sizes defined by revenue, not company structures. An accountant can advise on classification and taxes.'),
  text('Você pode precisar sair do MEI e mudar de enquadramento. As consequências dependem do valor excedido e da data. Procure um contador para calcular e regularizar.', 'You may need to leave MEI and change your classification. Consequences depend on the excess revenue and timing. Ask an accountant to calculate and regularise your position.'),
  text('MEI prestador de serviços usa a NFS-e nacional. Para mercadorias ou outras empresas, consulte a SEF-MG e a Prefeitura sobre o emissor e as exigências.', 'A MEI providing services uses national NFS-e. For goods or other businesses, consult SEF-MG and the City about the issuer and requirements.'),
  text('Consulte os DAS e as declarações pendentes no Portal do Empreendedor. Verifique a possibilidade de parcelamento nos canais oficiais e peça ajuda se a dívida já estiver em cobrança.', 'Check outstanding DAS payments and returns on the official portal. Check repayment options through official channels and seek help if collection has started.'),
  text('O Sebrae orienta sobre planejamento e acesso a crédito. Compare juros, garantias e custo total com instituições autorizadas. Crédito depende de análise e não é garantido pelo atendimento.', 'Sebrae advises on planning and access to credit. Compare interest, guarantees and total costs with authorised lenders. Credit is subject to assessment and is not guaranteed.'),
  text('Não necessariamente. Confira o preço e as condições na página de inscrição de cada curso. O catálogo on-line do Sebrae informa as opções disponíveis.', 'Not necessarily. Check each course’s registration page for price and terms. Sebrae’s online catalogue lists available options.'),
][i] ?? text('', '') }));

export const copy = {
  pt: {
    name: 'Pequenos Negócios', axis: 'EIXO 7 DE 7', title: 'Pequenos Negócios em Contagem', question: 'Como abro ou regularizo meu negócio em Contagem, e por que vale a pena estar aqui?', summary: 'Um guia simples para abrir, formalizar e fazer crescer o seu negócio, com os caminhos de formalização, atendimento, capacitação e as vantagens de empreender em Contagem.',
    reviewed: 'Informações revisadas em', print: 'Imprimir ou salvar em PDF', talk: 'Falar com a Sala Mineira do Empreendedor', index: 'Neste guia', more: 'Saiba mais', path: 'Caminho', where: 'Onde fazer', documents: 'Documentos', cost: 'Custo', deadline: 'Prazo médio', warning: 'A formalização do MEI é gratuita. Desconfie de quem cobra para fazer o cadastro.',
    documentTitle: 'Documentos que você vai precisar', documentNote: 'Separe os documentos abaixo. A lista exata depende da atividade e do serviço; confirme antes de solicitar.', documentsList: ['Documento de identidade (RG) e CPF', 'Comprovantes de endereço pessoal e do negócio', 'Dados do imóvel, como IPTU ou contrato de locação', 'Título de eleitor ou recibo do Imposto de Renda, se o serviço solicitar'],
    accountantTitle: 'Quando procurar um contador', accountantText: 'Procure um contador ao abrir ME/EPP, ter sócios, contratar além das condições do MEI, ultrapassar o limite de faturamento ou precisar rever impostos. Para orientação inicial sobre MEI, procure a Sala Mineira.',
    channels: 'Canais oficiais', address: 'Endereço', hours: 'Horário', phone: 'Telefone', email: 'E-mail', directions: 'Como chegar', municipalCourses: 'Cursos da Prefeitura de Contagem', sebraeCourses: 'Cursos do Sebrae', courseCatalog: 'Consultar cursos on-line do Sebrae', trails: 'Trilhas do Sebrae para o MEI', trailsText: 'Consulte o catálogo oficial para encontrar cursos de gestão, finanças e vendas. Verifique formato, duração e condições de inscrição.', free: 'Gratuito', enroll: 'Inscrever-se', courseIntro: 'Consulte os canais de atendimento da Prefeitura para a programação local e o catálogo do Sebrae para as ofertas on-line.',
    digitalIntro: 'Vender on-line pode levar seu produto a mais clientes. Antes de começar, organize preço, atendimento, pagamento e entrega.', training: 'Consultar capacitação no Sebrae', logisticsNote: 'Contagem abriga centros de distribuição do comércio eletrônico. Compare as condições de cada operador: a proximidade não garante frete menor ou atendimento ao pequeno vendedor.',
    clusterIntro: 'Estar perto de negócios do mesmo ramo pode atrair clientes e facilitar parcerias e compras conjuntas.', poles: 'Ver os polos industriais em Economia e Território', supplierTitle: 'Comércio atacadista', supplierText: 'Explore o comércio atacadista para encontrar insumos e comparar condições de compra. Consulte os registros disponíveis no painel de empresas.', supplierLink: 'Buscar fornecedores em Empresas e Cadeias', carrierTitle: 'Transportadoras e operadores logísticos', carrierText: 'Para enviar mercadorias, compare cobertura, prazo, seguro e custo total. Nem todo operador atende todos os tipos de carga.', locationTitle: 'Localização', locationText: 'Contagem integra a Região Metropolitana de Belo Horizonte, com conexões à BR-040, BR-381 e ao Anel Rodoviário. Consulte o painel territorial para os dados disponíveis.', locationLink: 'Ver localização e distâncias',
    help: 'Precisa de ajuda? Procure a Sala Mineira do Empreendedor', growth: 'Sua empresa está crescendo?', growthText: 'Conheça as oportunidades para investir e expandir em Contagem.', invest: 'Conhecer a página Investir', back: '← Inovação', home: 'Voltar ao Início', guidance: 'Guia de orientação geral. Confirme as exigências atuais nos canais oficiais: elas variam conforme a atividade, o endereço e o enquadramento.', map: 'Localização dos atendimentos', clusterMap: 'Localização dos aglomerados',
  },
  en: {
    name: 'Small Business', axis: 'AXIS 7 OF 7', title: 'Small Business in Contagem', question: 'How do I start or regularise my business in Contagem, and why is it worth being here?', summary: 'A simple guide to starting, registering and growing your business, with registration paths, support, training and the advantages of doing business in Contagem.',
    reviewed: 'Information reviewed on', print: 'Print or save as PDF', talk: 'Contact Sala Mineira do Empreendedor', index: 'In this guide', more: 'Learn more', path: 'Path', where: 'Where', documents: 'Documents', cost: 'Cost', deadline: 'Average time', warning: 'MEI registration is free. Be wary of anyone charging to register you.',
    documentTitle: 'Documents you may need', documentNote: 'Prepare the documents below. The exact list depends on the activity and service; check before applying.', documentsList: ['Identity document (RG) and CPF', 'Personal and business address evidence', 'Property details, such as IPTU or a lease', 'Voter registration or income tax receipt, if requested by the service'],
    accountantTitle: 'When to consult an accountant', accountantText: 'Consult an accountant when opening a micro/small enterprise, having partners, hiring beyond MEI conditions, exceeding the revenue limit or reviewing taxes. For initial MEI guidance, contact Sala Mineira.',
    channels: 'Official channels', address: 'Address', hours: 'Opening hours', phone: 'Phone', email: 'Email', directions: 'Directions', municipalCourses: 'City of Contagem courses', sebraeCourses: 'Sebrae courses', courseCatalog: 'Browse Sebrae online courses', trails: 'Sebrae learning paths for MEIs', trailsText: 'Browse the official catalogue for management, finance and sales courses. Check delivery format, duration and registration terms.', free: 'Free', enroll: 'Register', courseIntro: 'Consult City support channels for local schedules and Sebrae’s catalogue for online courses.',
    digitalIntro: 'Selling online can bring your products to more customers. Before starting, organise pricing, customer service, payments and delivery.', training: 'Browse Sebrae training', logisticsNote: 'Contagem hosts e-commerce distribution centres. Compare each operator’s terms: proximity does not guarantee cheaper shipping or access for small sellers.',
    clusterIntro: 'Being near similar businesses can attract customers and facilitate partnerships and joint purchasing.', poles: 'See industrial hubs in Economy & Territory', supplierTitle: 'Wholesale trade', supplierText: 'Explore wholesale trade to find supplies and compare purchasing terms. Consult the records available in the companies dashboard.', supplierLink: 'Find suppliers in Companies & Supply Chains', carrierTitle: 'Carriers and logistics operators', carrierText: 'Compare coverage, delivery time, insurance and total costs. Not every operator handles all types of cargo.', locationTitle: 'Location', locationText: 'Contagem is part of Greater Belo Horizonte, with connections to BR-040, BR-381 and the ring road. Consult the territorial dashboard for available data.', locationLink: 'See location and distances',
    help: 'Need help? Contact Sala Mineira do Empreendedor', growth: 'Is your business growing?', growthText: 'Discover opportunities to invest and expand in Contagem.', invest: 'Explore Invest', back: '← Innovation', home: 'Back to Home', guidance: 'General guidance only. Confirm current requirements through official channels: they vary by activity, address and business classification.', map: 'Support centre locations', clusterMap: 'Business cluster locations',
  },
};