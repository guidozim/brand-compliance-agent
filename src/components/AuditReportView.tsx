'use client';

import React, { useState } from 'react';
import {
  AuditReport,
  AuditCategory,
  DeviationSeverity,
} from '@/types/audit';
import { getPagePreviewUrl } from '@/lib/pagePreviews';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Printer,
  RotateCcw,
  Palette,
  Type,
  Maximize2,
  FileCheck,
  Check,
  Sparkles,
  Info,
  Wand2,
  Download,
  MapPin,
  Target,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AuditReportViewProps {
  report: AuditReport;
  onReset: () => void;
  onStartRemediation?: () => void;
  onDownloadRemediated?: () => void;
}

export function AuditReportView({
  report,
  onReset,
  onStartRemediation,
  onDownloadRemediated,
}: AuditReportViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedPage, setSelectedPage] = useState<number | 'ALL'>('ALL');
  const [copied, setCopied] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);

  // Status Styling & Texts
  const statusConfig = {
    APPROVED: {
      label: 'Aprovado para Veiculação',
      icon: CheckCircle2,
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-600/20',
      heroBg: 'bg-emerald-500',
      cardBorder: 'border-emerald-200 bg-emerald-50/30',
      iconColor: 'text-emerald-600',
    },
    APPROVED_WITH_RESERVATIONS: {
      label: 'Aprovado com Ressalvas',
      icon: AlertTriangle,
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-600/20',
      heroBg: 'bg-amber-500',
      cardBorder: 'border-amber-200 bg-amber-50/30',
      iconColor: 'text-amber-600',
    },
    REJECTED: {
      label: 'Reprovado — Ajustes Mandatórios',
      icon: XCircle,
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200 ring-rose-600/20',
      heroBg: 'bg-rose-600',
      cardBorder: 'border-rose-200 bg-rose-50/30',
      iconColor: 'text-rose-600',
    },
  }[report.status];

  const StatusIcon = statusConfig.icon;

  // Filtering
  const filteredDeviations = report.deviations.filter((dev) => {
    const matchesCategory =
      selectedCategory === 'ALL' || dev.category === selectedCategory;
    const matchesSeverity =
      selectedSeverity === 'ALL' || dev.severity === selectedSeverity;
    const matchesPage =
      selectedPage === 'ALL' || dev.pageNumber === selectedPage;
    return matchesCategory && matchesSeverity && matchesPage;
  });

  const criticalCount = report.deviations.filter((d) => d.severity === 'CRITICAL').length;
  const warningCount = report.deviations.filter((d) => d.severity === 'WARNING').length;
  const passCount = report.deviations.filter((d) => d.severity === 'PASS').length;

  // Determina a página ativa para exibição visual (se estiver em 'ALL', exibe a página 1 / capa por padrão)
  const activePageNumber = selectedPage === 'ALL' ? 1 : selectedPage;

  // Busca se há um preview customizado em report.pagePreviews
  const pagePreviewItem = report.pagePreviews?.find((p) => p.pageNumber === activePageNumber);
  const currentPreviewImage =
    pagePreviewItem?.previewUrl ||
    getPagePreviewUrl(activePageNumber, report.previewUrl, report.brandName);

  const handleCopySummary = () => {
    const text = `AUDITORIA DE BRAND COMPLIANCE — ${report.brandName.toUpperCase()}
Arquivo: ${report.fileName}
Status Geral: ${statusConfig.label} (Score: ${report.score}/100)
Resumo: ${report.summary}

CHECKLIST CIRÚRGICO DE DESVIOS:
${report.deviations
  .map(
    (d, i) =>
      `${i + 1}. [${d.severity}] ${d.categoryLabel} — ${d.title}\n   • Identificado: ${d.identified}\n   • Regra Oficial: ${d.rule}\n   • Sugestão para o Designer: ${d.suggestion}\n`
  )
  .join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Executivo */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:shadow-none print:border-none">
        <div className="border-b border-slate-100 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Status & Title */}
            <div className="flex items-start gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${statusConfig.badgeBg} border`}
              >
                <StatusIcon className={`h-8 w-8 ${statusConfig.iconColor}`} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${statusConfig.badgeBg}`}
                  >
                    {statusConfig.label}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    Marca: {report.brandName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(report.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                  Relatório de Governança de Marca
                </h1>
                <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
                  {report.summary}
                </p>

                {onStartRemediation && report.status !== 'APPROVED' && (
                  <div className="mt-3 inline-flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-xs text-emerald-950">
                    <Wand2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      Deseja que o agente gere automaticamente uma versão 100% em compliance corrigindo o logotipo, fontes e paleta?
                    </span>
                    <button
                      type="button"
                      onClick={onStartRemediation}
                      className="rounded bg-emerald-700 px-2.5 py-1 font-bold text-white shadow-xs hover:bg-emerald-800 transition shrink-0"
                    >
                      Corrigir Arte Agora
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Score Ring & Quick Numbers */}
            <div className="flex items-center gap-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Compliance Score
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">{report.score}</span>
                  <span className="text-sm font-semibold text-slate-400">/100</span>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-200" />

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <span className="block font-black text-rose-600 text-lg leading-none">
                    {criticalCount}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    Críticos
                  </span>
                </div>
                <div>
                  <span className="block font-black text-amber-600 text-lg leading-none">
                    {warningCount}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    Ressalvas
                  </span>
                </div>
                <div>
                  <span className="block font-black text-emerald-600 text-lg leading-none">
                    {passCount}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    Conformes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 print:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <FileCheck className="h-4 w-4 text-brand-600" />
              <span>Arquivo auditado: <strong className="text-slate-800">{report.fileName}</strong></span>
              {report.contextNote && (
                <span className="hidden sm:inline italic text-slate-400">
                  • &quot;{report.contextNote}&quot;
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onStartRemediation && (
                <button
                  type="button"
                  onClick={onStartRemediation}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                  title="Abrir estúdio com comparador antes vs depois e ferramentas de IA"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>⚡ Corrigir com IA</span>
                </button>
              )}

              {onDownloadRemediated && (
                <button
                  type="button"
                  onClick={onDownloadRemediated}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-100 transition"
                  title="Baixar render visual da peça corrigida"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Baixar Render Corrigido (.png)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
                title="Exportar Laudo Técnico Completo em PDF para o diagramador do InDesign"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Exportar Laudo (PDF)</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copiar Checklist</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-800 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Auditar Outra Peça</span>
              </button>
            </div>
          </div>

          {report.fileName.toLowerCase().endsWith('.pdf') && (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-950 flex items-start gap-2.5 print:hidden">
              <Info className="h-4 w-4 shrink-0 text-brand-700 mt-0.5" />
              <div>
                <span className="font-bold">Documento em PDF ({report.fileName}):</span>{' '}
                {report.totalPages && report.totalPages > 1
                  ? `Documento multi-páginas (${report.totalPages} lâminas/páginas). O agente sincroniza a navegação visual para cada lâmina e gera o checklist de intervenções com render corrigido.`
                  : 'Documento editorial vetorial fechado.'}
              </div>
            </div>
          )}

          {report.isSimulation && (
            <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50/80 p-3 text-xs text-amber-950 flex items-start gap-2.5 print:hidden">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <span className="font-bold">Modo Simulação Inteligente (Sem Chave de IA Externa):</span>{' '}
                Esta auditoria utilizou o motor de heurística embutido. Para que o agente leia os textos específicos e examine cada pixel inédito com <strong>GPT-4o Vision</strong> ou <strong>Google Gemini Vision</strong>, insira sua chave no ícone de engrenagem ⚙️ (Configurações de IA) no topo.
              </div>
            </div>
          )}
        </div>

        {/* 1.5. Navegador Multi-Páginas da Brochura */}
        {report.totalPages && report.totalPages > 1 && (
          <div className="border-b border-slate-200 bg-slate-100/80 px-6 py-3 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-700" />
                <span className="text-xs font-bold text-slate-800">
                  Navegador de Páginas da Brochura:
                </span>
                <span className="text-xs text-slate-500">
                  Documento com {report.totalPages} páginas auditadas
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSelectedPage('ALL')}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    selectedPage === 'ALL'
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Todas as Páginas ({report.deviations.length})
                </button>

                {report.pagePreviews ? (
                  report.pagePreviews.map((p) => (
                    <button
                      key={p.pageNumber}
                      type="button"
                      onClick={() => setSelectedPage(p.pageNumber)}
                      className={`rounded-lg px-2.5 py-1 transition ${
                        selectedPage === p.pageNumber
                          ? 'bg-brand-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      Pág. {p.pageNumber} ({p.deviationsCount})
                    </button>
                  ))
                ) : (
                  Array.from({ length: report.totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedPage(num)}
                      className={`rounded-lg px-2.5 py-1 transition ${
                        selectedPage === num
                          ? 'bg-brand-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      Pág. {num}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Visual Inspection Breakdown: Preview + Palettes */}
        <div className="grid grid-cols-1 border-b border-slate-100 bg-slate-50/50 p-6 md:grid-cols-12 gap-6">
          {/* Peça Preview com Marcadores de Desvios */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-rose-600" />
                <span>Mapeamento de Desvios</span>
                {report.totalPages && report.totalPages > 1 && (
                  <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-800">
                    Pág. {activePageNumber} {selectedPage === 'ALL' ? '(Capa)' : ''}
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                {report.deviations.some((d) => d.boundingBox) && (
                  <button
                    type="button"
                    onClick={() => setShowHotspots(!showHotspots)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border transition ${
                      showHotspots
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-white border-slate-300 text-slate-600'
                    }`}
                  >
                    {showHotspots ? '✓ Ocultar Pins' : 'Mostrar Pins'}
                  </button>
                )}
              </div>
            </div>

            {/* Navegador Rápido de Miniaturas (quando multi-página) */}
            {report.totalPages && report.totalPages > 1 && (
              <div className="mb-2 flex items-center justify-between rounded-lg bg-slate-200/80 px-2 py-1 text-xs">
                <button
                  type="button"
                  disabled={activePageNumber <= 1}
                  onClick={() => setSelectedPage(Math.max(1, activePageNumber - 1))}
                  className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3 w-3" />
                  <span>Anterior</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                  <span>Página {activePageNumber} de {report.totalPages}</span>
                  {pagePreviewItem?.title && (
                    <span className="hidden sm:inline font-normal text-slate-500">
                      • {pagePreviewItem.title}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={activePageNumber >= report.totalPages}
                  onClick={() => setSelectedPage(Math.min(report.totalPages || 4, activePageNumber + 1))}
                  className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Próxima</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-slate-900/90 shadow-sm flex items-center justify-center min-h-[220px]">
              {currentPreviewImage ? (
                <div className="relative inline-block max-w-full">
                  <img
                    key={`preview-page-${activePageNumber}`}
                    src={currentPreviewImage}
                    alt={`Peça auditada - Página ${activePageNumber}`}
                    className="max-h-72 w-full object-contain block transition-all duration-300"
                  />

                  {/* Overlays / Caixas de destaque com Pins Numerados sincronizados com a página exibida */}
                  {showHotspots &&
                    report.deviations
                      .filter(
                        (d) =>
                          d.boundingBox &&
                          (d.pageNumber ? d.pageNumber === activePageNumber : activePageNumber === 1)
                      )
                      .map((d, index) => {
                        const isActive = activeHotspotId === d.id;
                        const isCritical = d.severity === 'CRITICAL';
                        const isWarning = d.severity === 'WARNING';
                        const b = d.boundingBox!;

                        return (
                          <div
                            key={d.id}
                            onClick={() => {
                              setActiveHotspotId(isActive ? null : d.id);
                              const el = document.getElementById(`deviation-${d.id}`);
                              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            style={{
                              left: `${b.x}%`,
                              top: `${b.y}%`,
                              width: `${b.width}%`,
                              height: `${b.height}%`,
                            }}
                            className={`absolute cursor-pointer rounded transition-all duration-200 border-2 ${
                              isActive
                                ? 'border-white ring-4 ring-rose-500 bg-rose-500/35 scale-[1.02] z-30'
                                : isCritical
                                ? 'border-rose-500 bg-rose-500/20 hover:bg-rose-500/40 z-10'
                                : isWarning
                                ? 'border-amber-400 bg-amber-400/20 hover:bg-amber-400/40 z-10'
                                : 'border-emerald-400 bg-emerald-400/15 z-10'
                            }`}
                            title={`Pin #${index + 1}: ${d.title} (${d.locationLabel || ''})`}
                          >
                            <span
                              className={`absolute -top-3 -left-3 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white shadow-md ${
                                isCritical
                                  ? 'bg-rose-600 ring-2 ring-white'
                                  : isWarning
                                  ? 'bg-amber-600 ring-2 ring-white'
                                  : 'bg-emerald-600 ring-2 ring-white'
                              }`}
                            >
                              {index + 1}
                            </span>
                          </div>
                        );
                      })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  Prévia não disponível
                </div>
              )}
            </div>

            {report.deviations.some((d) => d.boundingBox) && (
              <p className="mt-1.5 text-[10px] text-slate-500 text-center">
                💡 Clique nos números/zonas na imagem para destacar o desvio no relatório abaixo.
              </p>
            )}
          </div>

          {/* Color & Typography Diagnostics */}
          <div className="md:col-span-7 space-y-4">
            {/* Color Detection Bar */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
                <Palette className="h-3.5 w-3.5 text-brand-600" />
                Espectro Cromático Identificado na Peça
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {report.detectedColors && report.detectedColors.length > 0 ? (
                  report.detectedColors.map((color, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 rounded-lg border p-2 bg-white ${
                        color.matchesBrand
                          ? 'border-emerald-200'
                          : 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-200'
                      }`}
                    >
                      <span
                        className="h-7 w-7 shrink-0 rounded-md ring-1 ring-black/10 shadow-xs"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="min-w-0">
                        <span className="block font-mono text-xs font-bold text-slate-900 truncate">
                          {color.hex}
                        </span>
                        <span
                          className={`block text-[10px] font-semibold truncate ${
                            color.matchesBrand ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {color.matchesBrand ? '✓ Oficial' : '✗ Não Homologado'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Cores extraídas no relatório.</p>
                )}
              </div>
            </div>

            {/* Typography Detected */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
                <Type className="h-3.5 w-3.5 text-brand-600" />
                Famílias Tipográficas Mapeadas
              </span>
              <div className="flex flex-wrap gap-2">
                {report.detectedTypography && report.detectedTypography.length > 0 ? (
                  report.detectedTypography.map((font, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                      {font}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">Tipografia identificada.</span>
                )}
              </div>
            </div>

            {/* Quick Governance Note */}
            <div className="rounded-lg bg-blue-50/60 p-3 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 text-brand-600 mt-0.5" />
              <div>
                <span className="font-bold">Diretriz Industrial Rigorosa:</span> Todas as peças externas da ANDRITZ e parceiros industriais requerem área de proteção no logotipo e fontes sans-serif oficiais para garantir leitura em ambientes operacionais e corporativos.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Checklist Cirúrgico de Desvios (Categorias) */}
      <div className="space-y-4">
        {/* Category & Severity Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-700" />
              Checklist Cirúrgico de Desvios & Recomendações
            </h2>
            <p className="text-xs text-slate-500">
              Confrontação ponto a ponto de cada regra do Brand Guide com orientações práticas para o designer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            {/* Page Selector (if multi-page) */}
            {report.totalPages && report.totalPages > 1 && (
              <select
                value={selectedPage}
                onChange={(e) =>
                  setSelectedPage(
                    e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10)
                  )
                }
                className="rounded-lg border border-brand-300 bg-brand-50/50 px-3 py-1.5 text-xs font-bold text-brand-900 shadow-xs focus:border-brand-500 focus:outline-none"
              >
                <option value="ALL">Todas as Páginas ({report.deviations.length})</option>
                {report.pagePreviews ? (
                  report.pagePreviews.map((p) => (
                    <option key={p.pageNumber} value={p.pageNumber}>
                      Pág. {p.pageNumber}: {p.title}
                    </option>
                  ))
                ) : (
                  Array.from({ length: report.totalPages }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Página {num}
                    </option>
                  ))
                )}
              </select>
            )}

            {/* Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:border-brand-500 focus:outline-none"
            >
              <option value="ALL">Todas as Categorias</option>
              <option value="LOGO">Uso do Logo & Respiro</option>
              <option value="TYPOGRAPHY">Tipografia</option>
              <option value="COLORS">Paleta de Cores</option>
              <option value="TONE">Tom de Voz & Redação</option>
              <option value="COMPOSITION">Alinhamento & Composição</option>
            </select>

            {/* Severity Selector */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:border-brand-500 focus:outline-none"
            >
              <option value="ALL">Todas as Severidades</option>
              <option value="CRITICAL">Apenas Críticos (❌)</option>
              <option value="WARNING">Apenas Ressalvas (⚠️)</option>
              <option value="PASS">Apenas Conformes (✅)</option>
            </select>
          </div>
        </div>

        {/* List of Deviations Cards */}
        <div className="space-y-3">
          {filteredDeviations.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-xs">
              Nenhum desvio correspondente aos filtros selecionados.
            </div>
          ) : (
            filteredDeviations.map((item, index) => {
              const severityDetails = {
                CRITICAL: {
                  badge: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
                  label: 'Desvio Crítico (Reprovação)',
                  borderLeft: 'border-l-4 border-l-rose-500',
                  icon: XCircle,
                  color: 'text-rose-600',
                },
                WARNING: {
                  badge: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
                  label: 'Ressalva / Alerta',
                  borderLeft: 'border-l-4 border-l-amber-500',
                  icon: AlertTriangle,
                  color: 'text-amber-600',
                },
                PASS: {
                  badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
                  label: '100% Conforme',
                  borderLeft: 'border-l-4 border-l-emerald-500',
                  icon: CheckCircle2,
                  color: 'text-emerald-600',
                },
              }[item.severity];

              const ItemIcon = severityDetails.icon;
              const isHotspotActive = activeHotspotId === item.id;

              // Calcula o número do Pin correspondente na imagem para este desvio
              const pageItemsWithBox = report.deviations.filter(
                (d) =>
                  d.boundingBox &&
                  (d.pageNumber
                    ? d.pageNumber === (item.pageNumber || activePageNumber)
                    : activePageNumber === 1)
              );
              const pinIndex = pageItemsWithBox.findIndex((d) => d.id === item.id);
              const pinNumber = pinIndex !== -1 ? pinIndex + 1 : null;

              return (
                <div
                  key={item.id}
                  id={`deviation-${item.id}`}
                  className={`overflow-hidden rounded-xl border bg-white p-5 shadow-xs transition duration-200 ${
                    severityDetails.borderLeft
                  } ${
                    isHotspotActive
                      ? 'border-brand-500 ring-2 ring-brand-500/40 bg-brand-50/10 shadow-md'
                      : 'border-slate-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <ItemIcon className={`h-5 w-5 shrink-0 mt-0.5 ${severityDetails.color}`} />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {pinNumber !== null && (
                            <span
                              className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-black text-white shadow-2xs ${
                                item.severity === 'CRITICAL'
                                  ? 'bg-rose-600 ring-1 ring-rose-700'
                                  : item.severity === 'WARNING'
                                  ? 'bg-amber-600 ring-1 ring-amber-700'
                                  : 'bg-emerald-600 ring-1 ring-emerald-700'
                              }`}
                              title={`Corresponde ao Pin #${pinNumber} sinalizado na imagem acima`}
                            >
                              Pin #{pinNumber}
                            </span>
                          )}
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${severityDetails.badge} border`}
                          >
                            {severityDetails.label}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                            {item.categoryLabel}
                          </span>
                          {item.locationLabel && (
                            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-800 border border-slate-200">
                              <MapPin className="h-3 w-3 text-rose-600" />
                              {item.locationLabel}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1 text-sm font-bold text-slate-900">{item.title}</h3>
                      </div>
                    </div>

                    {item.boundingBox && (
                      <button
                        type="button"
                        onClick={() => {
                          if (item.pageNumber && selectedPage !== item.pageNumber) {
                            setSelectedPage(item.pageNumber);
                          }
                          setActiveHotspotId(isHotspotActive ? null : item.id);
                          window.scrollTo({ top: 220, behavior: 'smooth' });
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition shrink-0 ${
                          isHotspotActive
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Destacar a região deste erro na imagem acima"
                      >
                        <Target className="h-3.5 w-3.5" />
                        <span>{isHotspotActive ? 'Focando na Peça' : 'Localizar na Peça'}</span>
                      </button>
                    )}
                  </div>

                  {/* 3-Section Surgical Breakdown */}
                  <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 text-xs md:grid-cols-3">
                    {/* O que foi identificado */}
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/70">
                      <span className="block font-bold text-slate-700 uppercase tracking-wide text-[10px] mb-1">
                        🔍 O Que Foi Identificado na Peça:
                      </span>
                      <p className="text-slate-600 leading-relaxed">{item.identified}</p>
                    </div>

                    {/* Regra Oficial */}
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/70">
                      <span className="block font-bold text-slate-700 uppercase tracking-wide text-[10px] mb-1">
                        📘 Regra Oficial do Brand Guide:
                      </span>
                      <p className="text-slate-600 leading-relaxed">{item.rule}</p>
                    </div>

                    {/* Sugestão Cirúrgica para o Designer */}
                    <div
                      className={`rounded-lg p-3 border ${
                        item.severity === 'PASS'
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                          : 'bg-brand-50/60 border-brand-200 text-brand-950'
                      }`}
                    >
                      <span className="block font-bold uppercase tracking-wide text-[10px] mb-1 text-brand-800">
                        🛠️ Sugestão Cirúrgica de Correção:
                      </span>
                      <p className="font-medium leading-relaxed">{item.suggestion}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

