/**
 * Gerador de miniaturas visuais vetoriais para páginas de documentos e brochuras
 * Permite que a navegação multi-página mostre layouts gráficos fiéis para cada página.
 */

export function getPagePreviewUrl(
  pageNumber: number,
  originalUploadUrl?: string,
  brandName = 'ANDRITZ'
): string {
  // Página 1 sempre prioriza a imagem enviada pelo usuário (capa)
  if (pageNumber === 1 && originalUploadUrl && originalUploadUrl.startsWith('data:image')) {
    return originalUploadUrl;
  }

  switch (pageNumber) {
    case 1:
      // Capa da Brochura (se não tiver imagem original em data:image)
      return generateCoverSvg(originalUploadUrl, brandName);

    case 2:
      // Página 2 (Miolo - Visão do Sistema DCS & Engenharia Operacional)
      return generatePage2Svg(brandName);

    case 3:
      // Página 3 (Miolo - Infográficos de Performance e Gráficos de Eficiência)
      return generatePage3Svg(brandName);

    case 4:
      // Página 4 (Contracapa - Fechamento Corporativo & Assinatura)
      return generatePage4Svg(brandName);

    default:
      return generateGenericPageSvg(pageNumber, brandName);
  }
}

function svgToDataUrl(svgString: string): string {
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  }
  // Fallback para SSR
  return `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
}

function generateCoverSvg(originalUploadUrl?: string, brandName = 'ANDRITZ'): string {
  if (originalUploadUrl && originalUploadUrl.startsWith('data:image')) {
    return originalUploadUrl;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1130" width="800" height="1130">
    <defs>
      <linearGradient id="coverGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00182E" />
        <stop offset="60%" stop-color="#002B49" />
        <stop offset="100%" stop-color="#005A9C" />
      </linearGradient>
    </defs>

    <!-- Fundo de Capa Editorial Escura -->
    <rect width="800" height="1130" fill="url(#coverGrad)" />

    <!-- Grid de linhas arquitetônicas sutis -->
    <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
      <line x1="60" y1="0" x2="60" y2="1130" />
      <line x1="200" y1="0" x2="200" y2="1130" />
      <line x1="400" y1="0" x2="400" y2="1130" />
      <line x1="600" y1="0" x2="600" y2="1130" />
      <line x1="740" y1="0" x2="740" y2="1130" />
    </g>

    <!-- Barra de Margem Superior -->
    <rect x="0" y="0" width="800" height="12" fill="#00A3E0" />

    <!-- Logotipo ANDRITZ na Capa (Posicionado perto da margem - Desvio do Clear Space) -->
    <g transform="translate(560, 40)">
      <rect x="0" y="0" width="180" height="60" rx="4" fill="rgba(255,255,255,0.95)" />
      <text x="90" y="42" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="30" fill="#005A9C" text-anchor="middle">ANDRITZ</text>
    </g>

    <!-- Badge Editorial -->
    <g transform="translate(60, 180)">
      <rect x="0" y="0" width="160" height="28" rx="4" fill="rgba(0,163,224,0.2)" stroke="#00A3E0" stroke-width="1.5" />
      <text x="80" y="19" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#00A3E0" text-anchor="middle">DIGITAL TWIN &amp; DCS</text>
    </g>

    <!-- Título Principal da Brochura (Desvio: 'Andritz' em minúsculas) -->
    <text x="60" y="270" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="44" fill="#FFFFFF">Andritz Digital Twin</text>
    <text x="60" y="325" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="44" fill="#FFFFFF">Control Platform</text>

    <!-- Linha de Destaque -->
    <rect x="60" y="360" width="120" height="5" fill="#00A3E0" />

    <!-- Subtítulo -->
    <text x="60" y="415" font-family="Arial, sans-serif" font-size="20" fill="#E2E8F0">Next-Generation Distributed Control &amp; Predictive Asset Management</text>

    <!-- Arte/Ilustração Conceitual Central da Capa -->
    <g transform="translate(60, 470)">
      <rect x="0" y="0" width="680" height="420" rx="12" fill="#00182A" stroke="#005A9C" stroke-width="2" />
      <!-- Círculos de telemetria / Twin digital -->
      <circle cx="340" cy="210" r="140" fill="none" stroke="#00A3E0" stroke-width="2" stroke-dasharray="8 6" />
      <circle cx="340" cy="210" r="90" fill="none" stroke="#005A9C" stroke-width="3" />
      <circle cx="340" cy="210" r="40" fill="#005A9C" opacity="0.6" />
      <text x="340" y="217" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF" text-anchor="middle">PLANT TWIN</text>

      <!-- Linhas de conexão visual -->
      <line x1="100" y1="210" x2="200" y2="210" stroke="#00A3E0" stroke-width="2" />
      <circle cx="100" cy="210" r="6" fill="#00A3E0" />
      <text x="100" y="235" font-family="Arial, sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">BOILER SENSORS</text>

      <line x1="580" y1="210" x2="480" y2="210" stroke="#00A3E0" stroke-width="2" />
      <circle cx="580" cy="210" r="6" fill="#00A3E0" />
      <text x="580" y="235" font-family="Arial, sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">TURBINE TELEMETRY</text>
    </g>

    <!-- Rodapé da Capa -->
    <g transform="translate(60, 1020)">
      <line x1="0" y1="0" x2="680" y2="0" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
      <text x="0" y="45" font-family="Arial, sans-serif" font-size="14" fill="#94A3B8">PÁGINA 1 — CAPA DA BROCHURA</text>
      <text x="680" y="45" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#00A3E0" text-anchor="end">andritz.com</text>
    </g>
  </svg>`;

  return svgToDataUrl(svg);
}

function generatePage2Svg(brandName = 'ANDRITZ'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1130" width="800" height="1130">
    <!-- Fundo Branco Editorial de Miolo -->
    <rect width="800" height="1130" fill="#FFFFFF" />

    <!-- Barra Superior de Navegação da Brochura -->
    <rect x="0" y="0" width="800" height="8" fill="#005A9C" />
    <text x="60" y="55" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B" letter-spacing="1.5">ANDRITZ INDUSTRIAL BROCHURE • TECHNICAL OVERVIEW</text>
    <text x="740" y="55" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#005A9C" text-anchor="end">02</text>
    <line x1="60" y1="70" x2="740" y2="70" stroke="#E2E8F0" stroke-width="1" />

    <!-- Título de Seção (Desvio: Fonte com serifa/condensada não homologada) -->
    <g transform="translate(60, 120)">
      <text x="0" y="0" font-family="'Times New Roman', serif" font-weight="bold" font-size="34" fill="#002B49" font-style="italic">
        Arquitetura Modular do DCS em Usinas de Celulose
      </text>
      <text x="0" y="26" font-family="Arial, sans-serif" font-size="14" fill="#64748B">
        Automação integrada e convergência IT/OT para máxima disponibilidade industrial
      </text>
    </g>

    <!-- Foto Central do Painel Industrial (Desvio: Operadores sem EPI regulamentar) -->
    <g transform="translate(60, 210)">
      <rect x="0" y="0" width="680" height="340" rx="8" fill="#1E293B" stroke="#CBD5E1" stroke-width="1" />
      
      <!-- Simulação de Painel de Sala de Controle -->
      <rect x="30" y="30" width="620" height="180" rx="6" fill="#0F172A" />
      <g fill="#0284C7" opacity="0.8">
        <rect x="50" y="50" width="160" height="60" rx="4" />
        <rect x="230" y="50" width="220" height="60" rx="4" />
        <rect x="470" y="50" width="160" height="60" rx="4" />
        <rect x="50" y="125" width="280" height="65" rx="4" fill="#0369A1" />
        <rect x="350" y="125" width="280" height="65" rx="4" fill="#0369A1" />
      </g>
      <text x="340" y="110" font-family="Arial, sans-serif" font-size="12" fill="#E2E8F0" text-anchor="middle">[Painel de Supervisão SCADA / DCS]</text>

      <!-- Simulação de Silhueta de Operadores na Sala -->
      <rect x="40" y="235" width="600" height="85" rx="6" fill="#334155" />
      <circle cx="200" cy="265" r="16" fill="#E2E8F0" />
      <rect x="180" y="285" width="40" height="35" rx="4" fill="#94A3B8" />
      <text x="250" y="280" font-family="Arial, sans-serif" font-size="12" fill="#F8FAFC">Operador de Painel #01 (Sem capacete visível)</text>

      <circle cx="480" cy="265" r="16" fill="#E2E8F0" />
      <rect x="460" y="285" width="40" height="35" rx="4" fill="#94A3B8" />
      <text x="530" y="280" font-family="Arial, sans-serif" font-size="12" fill="#F8FAFC">Engenheiro Supervisor</text>
    </g>

    <!-- Colunas de Texto Editorial Técnico -->
    <g transform="translate(60, 590)">
      <!-- Coluna 1 -->
      <rect x="0" y="0" width="320" height="420" fill="#F8FAFC" rx="6" />
      <text x="20" y="35" font-family="Arial, sans-serif" font-weight="bold" font-size="16" fill="#002B49">Redundância Crítica de Controladores</text>
      <text x="20" y="70" font-family="Arial, sans-serif" font-size="13" fill="#334155" width="280">
        <tspan x="20" dy="0">O sistema DCS da ANDRITZ adota processadores</tspan>
        <tspan x="20" dy="20">comutados a quente com tolerância a falhas</tspan>
        <tspan x="20" dy="20">inferior a 2 milissegundos. Toda a lógica de</tspan>
        <tspan x="20" dy="20">intertravamento operacional obedece aos mais</tspan>
        <tspan x="20" dy="20">rigorosos padrões internacionais SIL-3.</tspan>
      </text>

      <rect x="20" y="190" width="280" height="90" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
      <text x="35" y="225" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#005A9C">Disponibilidade: 99,99%</text>
      <text x="35" y="250" font-family="Arial, sans-serif" font-size="12" fill="#64748B">Garantia contínua de processamento ininterrupto</text>

      <!-- Coluna 2 -->
      <g transform="translate(360, 0)">
        <rect x="0" y="0" width="320" height="420" fill="#F8FAFC" rx="6" />
        <text x="20" y="35" font-family="Arial, sans-serif" font-weight="bold" font-size="16" fill="#002B49">Integração com Plant Twin</text>
        <text x="20" y="70" font-family="Arial, sans-serif" font-size="13" fill="#334155">
          <tspan x="20" dy="0">Gêmeo digital dinâmico conectado aos</tspan>
          <tspan x="20" dy="20">sensores de campo via barramento Fieldbus</tspan>
          <tspan x="20" dy="20">e protocolos Profinet certificados, garantindo</tspan>
          <tspan x="20" dy="20">diagnóstico preditivo de falhas em caldeiras</tspan>
          <tspan x="20" dy="20">e turbogeradores industriais.</tspan>
        </text>

        <rect x="20" y="190" width="280" height="90" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="35" y="225" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#00A3E0">Tempo de Resposta: &lt; 5ms</text>
        <text x="35" y="250" font-family="Arial, sans-serif" font-size="12" fill="#64748B">Sincronização em tempo real de telemetria</text>
      </g>
    </g>

    <!-- Rodapé da Página 2 -->
    <g transform="translate(60, 1070)">
      <line x1="0" y1="0" x2="680" y2="0" stroke="#E2E8F0" stroke-width="1" />
      <text x="0" y="25" font-family="Arial, sans-serif" font-size="11" fill="#94A3B8">PÁGINA 2 — MIOLO (VISÃO DO SISTEMA DCS)</text>
      <text x="680" y="25" font-family="Arial, sans-serif" font-size="11" fill="#94A3B8" text-anchor="end">ANDRITZ AG</text>
    </g>
  </svg>`;

  return svgToDataUrl(svg);
}

function generatePage3Svg(brandName = 'ANDRITZ'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1130" width="800" height="1130">
    <!-- Fundo Branco -->
    <rect width="800" height="1130" fill="#FFFFFF" />

    <!-- Topo -->
    <rect x="0" y="0" width="800" height="8" fill="#005A9C" />
    <text x="60" y="55" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B" letter-spacing="1.5">ANDRITZ INDUSTRIAL BROCHURE • PERFORMANCE &amp; METRICS</text>
    <text x="740" y="55" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#005A9C" text-anchor="end">03</text>
    <line x1="60" y1="70" x2="740" y2="70" stroke="#E2E8F0" stroke-width="1" />

    <!-- Título Principal da Página de Gráficos -->
    <text x="60" y="125" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="28" fill="#002B49">
      Métricas Comparativas de Eficiência Energética
    </text>
    <text x="60" y="155" font-family="Arial, sans-serif" font-size="14" fill="#64748B">
      Ganhos auditados de rendimento térmico e mitigação de perdas operacionais
    </text>

    <!-- Infográfico de Barras (Desvio: Usando #0D47A1 ao invés de #005A9C) -->
    <g transform="translate(60, 195)">
      <rect x="0" y="0" width="680" height="380" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <text x="30" y="40" font-family="Arial, sans-serif" font-weight="bold" font-size="16" fill="#002B49">Eficiência Térmica Homologada por Fábrica (%)</text>

      <!-- Linhas de grade de fundo -->
      <line x1="120" y1="100" x2="640" y2="100" stroke="#E2E8F0" stroke-dasharray="4 4" />
      <line x1="120" y1="160" x2="640" y2="160" stroke="#E2E8F0" stroke-dasharray="4 4" />
      <line x1="120" y1="220" x2="640" y2="220" stroke="#E2E8F0" stroke-dasharray="4 4" />
      <line x1="120" y1="280" x2="640" y2="280" stroke="#E2E8F0" stroke-dasharray="4 4" />

      <!-- Barra 1 (Desvio de cor: #0D47A1) -->
      <text x="40" y="105" font-family="Arial, sans-serif" font-size="12" fill="#475569">Usina A</text>
      <rect x="120" y="85" width="460" height="32" rx="4" fill="#0D47A1" />
      <text x="590" y="106" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#0D47A1">+35.4%</text>

      <!-- Barra 2 (Desvio de cor: #0D47A1) -->
      <text x="40" y="165" font-family="Arial, sans-serif" font-size="12" fill="#475569">Usina B</text>
      <rect x="120" y="145" width="390" height="32" rx="4" fill="#0D47A1" />
      <text x="520" y="166" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#0D47A1">+29.8%</text>

      <!-- Barra 3 (Desvio de cor: #0D47A1) -->
      <text x="40" y="225" font-family="Arial, sans-serif" font-size="12" fill="#475569">Usina C</text>
      <rect x="120" y="205" width="320" height="32" rx="4" fill="#0D47A1" />
      <text x="450" y="226" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#0D47A1">+24.1%</text>

      <!-- Barra 4 (Referência de Mercado) -->
      <text x="40" y="285" font-family="Arial, sans-serif" font-size="12" fill="#475569">Média Mercado</text>
      <rect x="120" y="265" width="180" height="32" rx="4" fill="#94A3B8" />
      <text x="310" y="286" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#64748B">+12.0%</text>

      <!-- Legenda do Gráfico -->
      <g transform="translate(120, 330)">
        <rect x="0" y="0" width="16" height="16" rx="2" fill="#0D47A1" />
        <text x="25" y="13" font-family="Arial, sans-serif" font-size="12" fill="#334155">Azul Utilizado (#0D47A1 - Desvio Cromático)</text>

        <rect x="340" y="0" width="16" height="16" rx="2" fill="#005A9C" />
        <text x="365" y="13" font-family="Arial, sans-serif" font-size="12" fill="#005A9C" font-weight="bold">ANDRITZ Blue Oficial (#005A9C)</text>
      </g>
    </g>

    <!-- Tabela Comparativa de Especificações Técnicas -->
    <g transform="translate(60, 610)">
      <text x="0" y="0" font-family="Arial, sans-serif" font-weight="bold" font-size="18" fill="#002B49">Resumo das Especificações Homologadas</text>

      <!-- Tabela Header -->
      <rect x="0" y="20" width="680" height="40" fill="#002B49" rx="4" />
      <text x="20" y="45" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#FFFFFF">PARÂMETRO DE OPERAÇÃO</text>
      <text x="280" y="45" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#FFFFFF">CONVENCIONAL</text>
      <text x="480" y="45" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#00A3E0">ANDRITZ DIGITAL TWIN</text>

      <!-- Linhas da Tabela -->
      <g transform="translate(0, 60)">
        <rect x="0" y="0" width="680" height="45" fill="#F8FAFC" />
        <text x="20" y="28" font-family="Arial, sans-serif" font-size="12" fill="#334155">Taxa de Atualização de Lógica</text>
        <text x="280" y="28" font-family="Arial, sans-serif" font-size="12" fill="#64748B">100 ms</text>
        <text x="480" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#005A9C">10 ms (10x mais rápido)</text>
        <line x1="0" y1="45" x2="680" y2="45" stroke="#E2E8F0" />
      </g>

      <g transform="translate(0, 105)">
        <rect x="0" y="0" width="680" height="45" fill="#FFFFFF" />
        <text x="20" y="28" font-family="Arial, sans-serif" font-size="12" fill="#334155">Previsibilidade de Paradas Não Programadas</text>
        <text x="280" y="28" font-family="Arial, sans-serif" font-size="12" fill="#64748B">Reativa</text>
        <text x="480" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#005A9C">Até 48h de antecedência</text>
        <line x1="0" y1="45" x2="680" y2="45" stroke="#E2E8F0" />
      </g>

      <g transform="translate(0, 150)">
        <rect x="0" y="0" width="680" height="45" fill="#F8FAFC" />
        <text x="20" y="28" font-family="Arial, sans-serif" font-size="12" fill="#334155">Consumo Específico de Vapor</text>
        <text x="280" y="28" font-family="Arial, sans-serif" font-size="12" fill="#64748B">1.85 t/t</text>
        <text x="480" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#005A9C">1.42 t/t (-23% de emissões)</text>
      </g>
    </g>

    <!-- Rodapé da Página 3 -->
    <g transform="translate(60, 1070)">
      <line x1="0" y1="0" x2="680" y2="0" stroke="#E2E8F0" stroke-width="1" />
      <text x="0" y="25" font-family="Arial, sans-serif" font-size="11" fill="#94A3B8">PÁGINA 3 — MIOLO (GRÁFICOS DE PERFORMANCE &amp; TABELAS)</text>
      <text x="680" y="25" font-family="Arial, sans-serif" font-size="11" fill="#94A3B8" text-anchor="end">ANDRITZ AG</text>
    </g>
  </svg>`;

  return svgToDataUrl(svg);
}

function generatePage4Svg(brandName = 'ANDRITZ'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1130" width="800" height="1130">
    <defs>
      <linearGradient id="backGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="70%" stop-color="#F8FAFC" />
        <stop offset="100%" stop-color="#E2E8F0" />
      </linearGradient>
    </defs>

    <!-- Fundo de Contracapa -->
    <rect width="800" height="1130" fill="url(#backGrad)" />

    <!-- Barra Superior -->
    <rect x="0" y="0" width="800" height="12" fill="#005A9C" />

    <!-- Cabeçalho Contracapa -->
    <text x="60" y="80" font-family="Arial, sans-serif" font-weight="bold" font-size="24" fill="#002B49">Presença Global &amp; Engenharia de Ponta</text>
    <text x="60" y="110" font-family="Arial, sans-serif" font-size="14" fill="#64748B">Centros de competência técnica para suporte 24/7 em automação industrial</text>

    <!-- Cards de Escritórios Globais -->
    <g transform="translate(60, 160)">
      <!-- Card Graz Headquarter -->
      <rect x="0" y="0" width="320" height="140" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
      <text x="25" y="35" font-family="Arial, sans-serif" font-weight="bold" font-size="15" fill="#005A9C">Graz • Headquarters (Áustria)</text>
      <text x="25" y="65" font-family="Arial, sans-serif" font-size="12" fill="#475569">Stattegger Strasse 18, 8045 Graz</text>
      <text x="25" y="85" font-family="Arial, sans-serif" font-size="12" fill="#475569">Tel: +43 316 6902-0</text>
      <text x="25" y="110" font-family="Arial, sans-serif" font-size="12" fill="#00A3E0">automation@andritz.com</text>

      <!-- Card Brasil -->
      <g transform="translate(360, 0)">
        <rect x="0" y="0" width="320" height="140" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
        <text x="25" y="35" font-family="Arial, sans-serif" font-weight="bold" font-size="15" fill="#005A9C">Curitiba • América Latina (Brasil)</text>
        <text x="25" y="65" font-family="Arial, sans-serif" font-size="12" fill="#475569">Av. Iguaçu, 2820 - Água Verde</text>
        <text x="25" y="85" font-family="Arial, sans-serif" font-size="12" fill="#475569">Curitiba - PR, 80240-031</text>
        <text x="25" y="110" font-family="Arial, sans-serif" font-size="12" fill="#00A3E0">contato.brasil@andritz.com</text>
      </g>
    </g>

    <g transform="translate(60, 320)">
      <!-- Card América do Norte -->
      <rect x="0" y="0" width="320" height="140" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
      <text x="25" y="35" font-family="Arial, sans-serif" font-weight="bold" font-size="15" fill="#005A9C">Atlanta • North America (EUA)</text>
      <text x="25" y="65" font-family="Arial, sans-serif" font-size="12" fill="#475569">5405 Windward Pkwy, Alpharetta</text>
      <text x="25" y="85" font-family="Arial, sans-serif" font-size="12" fill="#475569">GA 30004, United States</text>
      <text x="25" y="110" font-family="Arial, sans-serif" font-size="12" fill="#00A3E0">na.automation@andritz.com</text>

      <!-- Card Ásia -->
      <g transform="translate(360, 0)">
        <rect x="0" y="0" width="320" height="140" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
        <text x="25" y="35" font-family="Arial, sans-serif" font-weight="bold" font-size="15" fill="#005A9C">Xangai • Ásia-Pacífico (China)</text>
        <text x="25" y="65" font-family="Arial, sans-serif" font-size="12" fill="#475569">Pudong New District, Shanghai</text>
        <text x="25" y="85" font-family="Arial, sans-serif" font-size="12" fill="#475569">China 201203</text>
        <text x="25" y="110" font-family="Arial, sans-serif" font-size="12" fill="#00A3E0">apac.automation@andritz.com</text>
      </g>
    </g>

    <!-- Área de Assinatura de Fechamento da Contracapa (Desvio: Slogan "ENGINEERED SUCCESS" Ausente!) -->
    <g transform="translate(60, 780)">
      <rect x="0" y="0" width="680" height="220" rx="12" fill="#FFFFFF" stroke="#005A9C" stroke-width="2" />
      
      <!-- Logotipo ANDRITZ Oficial na Contracapa -->
      <text x="340" y="70" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="44" fill="#005A9C" text-anchor="middle">ANDRITZ</text>
      
      <!-- Falha: Aqui deveria estar o slogan 'ENGINEERED SUCCESS', mas está apenas uma linha de contato simples -->
      <rect x="240" y="95" width="200" height="2" fill="#E2E8F0" />
      <text x="340" y="130" font-family="Arial, sans-serif" font-size="16" fill="#64748B" text-anchor="middle">www.andritz.com</text>
      <text x="340" y="165" font-family="Arial, sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">[Assinatura sem o slogan regulamentar "ENGINEERED SUCCESS"]</text>
    </g>

    <!-- Rodapé Legal -->
    <g transform="translate(60, 1070)">
      <line x1="0" y1="0" x2="680" y2="0" stroke="#CBD5E1" stroke-width="1" />
      <text x="0" y="25" font-family="Arial, sans-serif" font-size="11" fill="#64748B">PÁGINA 4 — CONTRACAPA DA BROCHURA</text>
      <text x="680" y="25" font-family="Arial, sans-serif" font-size="11" fill="#64748B" text-anchor="end">© 2026 ANDRITZ AG</text>
    </g>
  </svg>`;

  return svgToDataUrl(svg);
}

function generateGenericPageSvg(pageNumber: number, brandName: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1130" width="800" height="1130">
    <rect width="800" height="1130" fill="#FFFFFF" />
    <rect x="0" y="0" width="800" height="8" fill="#005A9C" />
    <text x="60" y="55" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#64748B">${brandName.toUpperCase()} DOCUMENT</text>
    <text x="740" y="55" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#005A9C" text-anchor="end">PÁGINA ${pageNumber}</text>
    <line x1="60" y1="70" x2="740" y2="70" stroke="#E2E8F0" stroke-width="1" />
    <g transform="translate(60, 120)">
      <text x="0" y="0" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="#002B49">Página ${pageNumber} do Documento Auditado</text>
      <rect x="0" y="30" width="680" height="800" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
      <text x="340" y="430" font-family="Arial, sans-serif" font-size="16" fill="#94A3B8" text-anchor="middle">Visualização técnica da Página ${pageNumber}</text>
    </g>
  </svg>`;

  return svgToDataUrl(svg);
}
