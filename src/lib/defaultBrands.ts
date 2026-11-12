import { BrandGuide } from '@/types/brand';

export const ANDRITZ_BRAND_GUIDE: BrandGuide = {
  id: 'andritz-official',
  name: 'ANDRITZ AG',
  industry: 'Engenharia de Plantas Industriais & Tecnologia',
  tagline: 'ENGINEERED SUCCESS',
  portalUrl: 'https://brandportal.andritz.com/hub/5',
  isDefault: true,
  lastUpdated: new Date().toISOString(),
  colors: [
    {
      id: 'c1',
      name: 'ANDRITZ Blue (Primária Oficial)',
      hex: '#005A9C',
      usage: 'Logotipo principal, títulos de destaque, elementos estruturais chave da marca.',
      type: 'primary',
    },
    {
      id: 'c2',
      name: 'ANDRITZ Deep Navy',
      hex: '#002B49',
      usage: 'Fundos de alto contraste, rodapés corporativos, textos de alta legibilidade.',
      type: 'primary',
    },
    {
      id: 'c3',
      name: 'Industrial Cyan (Destaque)',
      hex: '#00A3E0',
      usage: 'Infográficos, gráficos técnicos, CTAs e linhas de acento secundárias.',
      type: 'secondary',
    },
    {
      id: 'c4',
      name: 'Clean White',
      hex: '#FFFFFF',
      usage: 'Áreas de respiro generosas, fundos claros, tipografia sobre fundo azul.',
      type: 'neutral',
    },
    {
      id: 'c5',
      name: 'Engineering Slate / Dark Grey',
      hex: '#333F48',
      usage: 'Textos corridos técnicos, especificações e legendas.',
      type: 'neutral',
    },
    {
      id: 'c6',
      name: 'Cool Grey 1 (Fundo Suave)',
      hex: '#F4F5F7',
      usage: 'Cards técnicos, tabelas comparativas e planos de fundo secundários.',
      type: 'neutral',
    },
  ],
  typography: {
    primaryFont: 'Aptos / Helvetica Neue / Arial',
    secondaryFont: 'Arial / Segoe UI (para documentação técnica e body text)',
    hierarchyRules: 'Headings com peso Bold ou Semibold em Aptos / Helvetica / Arial. É 100% PERMITIDO e recomendado o uso de títulos em Branco (#FFFFFF) sobre fundos em ANDRITZ Blue (#005A9C), Deep Navy (#002B49) ou fotos industriais escuras de capa. Em fundos claros, títulos utilizam ANDRITZ Blue (#005A9C) ou Deep Navy (#002B49). Subtítulos em Slate Grey (#333F48). Manter espaçamento entre-linhas (leading) proporcional (130% a 150%) e entre-letras (kerning/tracking) padrão de fábrica sem expansão ou compressão exagerada. Proibido sublinhar títulos.',
    forbiddenFonts: [
      'Comic Sans',
      'Papyrus',
      'Times New Roman (em peças modernas)',
      'Fontes cursivas / manuscritas',
      'Fontes ultra condensadas não autorizadas'
    ],
  },
  logoRules: {
    clearSpaceRule: "A área de proteção (Clear Space) mínima em torno do logotipo ANDRITZ corresponde à altura exata da letra 'A' do logotipo em todos os quatro lados. Nenhum elemento gráfico, texto ou margem de corte pode invadir esse perímetro.",
    minWidthPrint: '25 mm de largura mínima',
    minWidthDigital: '100 pixels de largura mínima em telas digitais',
    allowedVariations: [
      'Versão Positiva: ANDRITZ Blue sobre fundo branco/claro',
      'Versão Negativa: Branco puro sobre fundo ANDRITZ Blue ou fotos industriais escuras de alto contraste',
      'Signet Isolado (Símbolo do "A"): Homologado para posts de Redes Sociais / LinkedIn, ícones e aplicações digitais compactas, posicionado conforme templates oficiais do Brand Portal.',
      'Versão Monocromática preta: Apenas para impressões técnicas PB'
    ],
    forbiddenPractices: [
      'Nunca esticar, comprimir ou distorcer as proporções do logotipo.',
      'Nunca aplicar sombras projetadas (drop shadow), chanfros (bevel) ou efeitos 3D.',
      'Nunca alterar as cores oficiais da tipografia do logotipo.',
      'Nunca utilizar o logotipo com transparência inferior a 100%.',
      'Nunca posicionar o logotipo sobre fundos visuais poluídos que prejudiquem o contraste.',
      'Nunca redigir "Andritz" em minúsculas nas assinaturas corporativas — a marca nominal é sempre grafada em caixa alta: "ANDRITZ".'
    ],
  },
  toneOfVoice: {
    archetype: 'O Especialista Visionário Industrial (Pioneering, Precise, Reliable)',
    styleKeywords: [
      'Engenharia de precisão',
      'Sustentabilidade industrial',
      'Performance e eficiência',
      'Inovação comprovada',
      'Confiabilidade técnica'
    ],
    mandatories: [
      'Sempre escrever o nome corporativo em caixa alta: ANDRITZ.',
      'O slogan "ENGINEERED SUCCESS" deve ser utilizado prioritariamente em caixa alta e associado a mensagens de inovação/resultado.',
      'Termos técnicos e métricas devem ser factuais e precisos (ex: redução de emissões, eficiência térmica, uptime).'
    ],
    forbiddenWords: [
      'Barato / Preço baixo',
      'Milagre',
      'Revolucionário sem evidência técnica',
      'Gírias informais ou linguagem excessivamente coloquial'
    ],
  },
  customRulesText: `DIRETRIZES COMPLEMENTARES ANDRITZ:
- Em peças de Social Media / LinkedIn (posts e carrosséis): É permitida e oficial a aplicação isolada do SIGNET (símbolo 'A' da ANDRITZ) no topo/centro, sem necessidade do logotipo nominal completo, desde que respeitado o alinhamento do template oficial do Brand Portal.
- Layouts devem priorizar clareza geométrica, fotografias de engenharia real (usinas, maquinário industrial de grande porte, técnicos com EPI correto).
- As margens da peça devem ser limpas e respiradas, evitando poluição visual.
- Gráficos e tabelas devem seguir rigorosamente a paleta oficial (Blue #005A9C e Cyan #00A3E0).
- Todos os materiais publicitários internacionais devem incluir o copyright oficial e URL corporativa (andritz.com).`,
};

export const INITIAL_BRANDS: BrandGuide[] = [
  ANDRITZ_BRAND_GUIDE,
  {
    id: 'nordic-energy-template',
    name: 'Industrial Tech Partner (Exemplo)',
    industry: 'Energia & Manufatura Automatizada',
    tagline: 'POWERING INDUSTRIAL EVOLUTION',
    portalUrl: 'https://brand.example.com',
    isDefault: false,
    lastUpdated: new Date().toISOString(),
    colors: [
      {
        id: 'ne1',
        name: 'Electric Graphite',
        hex: '#1E293B',
        usage: 'Tom base primário, fundos modernos escuros',
        type: 'primary',
      },
      {
        id: 'ne2',
        name: 'Emerald Kinetic',
        hex: '#059669',
        usage: 'Acento de tecnologia limpa e eficiência sustentável',
        type: 'secondary',
      },
      {
        id: 'ne3',
        name: 'Pure White',
        hex: '#FFFFFF',
        usage: 'Tipografia e contraste',
        type: 'neutral',
      },
    ],
    typography: {
      primaryFont: 'Inter / Roboto',
      secondaryFont: 'Roboto Mono (dados numéricos)',
      hierarchyRules: 'Títulos em Bold geométrico, números de performance em destaque grande.',
      forbiddenFonts: ['Serifadas clássicas para títulos'],
    },
    logoRules: {
      clearSpaceRule: 'Respiro mínimo equivalente ao raio do ícone da marca.',
      minWidthPrint: '20 mm',
      minWidthDigital: '80 px',
      allowedVariations: ['Ícone + Tipografia', 'Versão monocromática'],
      forbiddenPractices: ['Não recortar o símbolo', 'Não aplicar gradiente no logotipo'],
    },
    toneOfVoice: {
      archetype: 'Inovador Sustentável',
      styleKeywords: ['Agilidade', 'Descarbonização', 'Automação'],
      mandatories: ['Evidenciar métricas ESG em todas as campanhas públicas'],
      forbiddenWords: ['Poluidor', 'Tradicional estático'],
    },
    customRulesText: 'Peças voltadas para o mercado B2B europeu.',
  },
];

