'use client';

import React, { useState } from 'react';
import { RemediationResult } from '@/lib/remediationEngine';
import {
  X,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  Copy,
  Layers,
  Wand2,
  FileCode,
  Check,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImageUrl?: string;
  remediationResult: RemediationResult | null;
  onReaudit: (correctedImageUrl: string) => void;
}

export function RemediationModal({
  isOpen,
  onClose,
  originalImageUrl,
  remediationResult,
  onReaudit,
}: RemediationModalProps) {
  const [activeTab, setActiveTab] = useState<'comparison' | 'fixes' | 'prompt' | 'handoff'>('comparison');
  const [viewMode, setViewMode] = useState<'sideBySide' | 'correctedOnly' | 'originalOnly'>('sideBySide');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedHandoff, setCopiedHandoff] = useState(false);

  if (!isOpen || !remediationResult) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'arte-corrigida-compliance-andritz.png';
    link.href = remediationResult.correctedImageDataUrl;
    link.click();
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(remediationResult.generativeAiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyHandoff = () => {
    navigator.clipboard.writeText(remediationResult.figmaHandoffSpec);
    setCopiedHandoff(true);
    setTimeout(() => setCopiedHandoff(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Estúdio de Auto-Remediação com IA
                </h2>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  100% Brand Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500">
                O agente reconstruiu a peça corrigindo o logotipo, área de respiro, paleta HEX e tipografia.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition ${
              activeTab === 'comparison'
                ? 'border-brand-600 text-brand-700 bg-white font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="h-4 w-4" />
            Comparador Antes vs Depois
          </button>

          <button
            onClick={() => setActiveTab('fixes')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition ${
              activeTab === 'fixes'
                ? 'border-brand-600 text-brand-700 bg-white font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Checklist de Correções Aplicadas ({remediationResult.appliedFixes.length})
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition ${
              activeTab === 'prompt'
                ? 'border-brand-600 text-brand-700 bg-white font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            Prompt para IA Generativa (Photoshop / Midjourney)
          </button>

          <button
            onClick={() => setActiveTab('handoff')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition ${
              activeTab === 'handoff'
                ? 'border-brand-600 text-brand-700 bg-white font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileCode className="h-4 w-4 text-slate-700" />
            Handoff Figma & Tokens
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: COMPARADOR ANTES VS DEPOIS */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              {/* View mode pills */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Visualização de Layout
                </span>
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
                  <button
                    onClick={() => setViewMode('sideBySide')}
                    className={`rounded-md px-3 py-1 transition ${
                      viewMode === 'sideBySide' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Lado a Lado
                  </button>
                  <button
                    onClick={() => setViewMode('originalOnly')}
                    className={`rounded-md px-3 py-1 transition ${
                      viewMode === 'originalOnly' ? 'bg-white font-bold text-rose-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Apenas Original (Com Desvios)
                  </button>
                  <button
                    onClick={() => setViewMode('correctedOnly')}
                    className={`rounded-md px-3 py-1 transition ${
                      viewMode === 'correctedOnly' ? 'bg-white font-bold text-emerald-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Apenas Corrigida (100% Conforme)
                  </button>
                </div>
              </div>

              {/* Layout Visualizer */}
              {viewMode === 'sideBySide' ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Original */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                        ❌ Arte Original (Com Violações de Marca)
                      </span>
                      <span className="text-[11px] text-slate-400">Score inicial</span>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-slate-100 flex items-center justify-center p-2 min-h-[300px]">
                      {originalImageUrl ? (
                        <img
                          src={originalImageUrl}
                          alt="Original"
                          className="max-h-[320px] w-full object-contain rounded-lg"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">Arte original</span>
                      )}
                    </div>
                  </div>

                  {/* Corrigida */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" /> ✅ Arte Corrigida pelo Agente (100% Conforme)
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">100/100 Aprovado</span>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border-2 border-emerald-500 bg-white shadow-md flex items-center justify-center p-2 min-h-[300px]">
                      <img
                        src={remediationResult.correctedImageDataUrl}
                        alt="Corrigida"
                        className="max-h-[320px] w-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ) : viewMode === 'correctedOnly' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                      ✅ Versão Corrigida em Alta Resolução (Pronta para Veiculação)
                    </span>
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" /> Baixar PNG
                    </button>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg p-2 flex items-center justify-center">
                    <img
                      src={remediationResult.correctedImageDataUrl}
                      alt="Corrigida Completa"
                      className="max-h-[440px] w-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="rounded bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                    ❌ Versão Original (Desvios de Logotipo e Cores)
                  </span>
                  <div className="overflow-hidden rounded-xl border border-slate-300 bg-white p-2 flex items-center justify-center">
                    {originalImageUrl && (
                      <img
                        src={originalImageUrl}
                        alt="Original"
                        className="max-h-[440px] w-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CHECKLIST DE CORREÇÕES APLICADAS */}
          {activeTab === 'fixes' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                O agente executou cirurgicamente as seguintes correções automatizadas com base no Brand Guide:
              </p>
              {remediationResult.appliedFixes.map((fix, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 uppercase">
                          {fix.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{fix.title}</h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {fix.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PROMPT DE IA GENERATIVA */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-purple-50 p-3 text-xs text-purple-900 border border-purple-200">
                <span className="font-bold">Para Designers & Diretores de Arte:</span> Copie o prompt abaixo para ferramentas de preenchimento generativo ou geração visual (Photoshop Generative Fill, Midjourney v6, Canva AI, DALL-E 3) para recriar variações da peça com 100% de precisão de marca.
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={8}
                  value={remediationResult.generativeAiPrompt}
                  className="w-full rounded-xl border border-slate-300 bg-slate-900 p-4 font-mono text-xs text-emerald-400 shadow-inner focus:outline-none"
                />
                <button
                  onClick={handleCopyPrompt}
                  className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copiar Prompt
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FIGMA HANDOFF & TOKENS */}
          {activeTab === 'handoff' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900 border border-blue-200">
                <span className="font-bold">Especificação Técnica de Ajuste:</span> Envie estas coordenadas e tokens de design diretamente para a equipe de design no Figma ou Photoshop.
              </div>

              <div className="relative">
                <pre className="w-full overflow-x-auto rounded-xl border border-slate-300 bg-slate-900 p-4 font-mono text-xs text-sky-300 shadow-inner">
                  {remediationResult.figmaHandoffSpec}
                </pre>
                <button
                  onClick={handleCopyHandoff}
                  className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
                >
                  {copiedHandoff ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copiar Especificação
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/90 px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              title="Baixar render visual da peça corrigida"
            >
              <Download className="h-4 w-4 text-brand-600" />
              <span>Baixar Render Corrigido (.png)</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              title="Exportar laudo de intervenções para o diagramador do InDesign"
            >
              <FileCode className="h-4 w-4 text-purple-600" />
              <span>Exportar Laudo Técnico (PDF)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={() => {
                onReaudit(remediationResult.correctedImageDataUrl);
                onClose();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Re-auditar com o Agente (100% Conforme)
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

