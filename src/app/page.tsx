'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BrandSelector } from '@/components/BrandSelector';
import { UploadSection } from '@/components/UploadSection';
import { AuditReportView } from '@/components/AuditReportView';
import { BrandGuideEditorModal } from '@/components/BrandGuideEditorModal';
import { AuditHistoryDrawer } from '@/components/AuditHistoryDrawer';
import { ApiSettingsModal } from '@/components/ApiSettingsModal';
import { RemediationModal } from '@/components/RemediationModal';
import { generateCorrectedCreative, RemediationResult } from '@/lib/remediationEngine';
import { INITIAL_BRANDS } from '@/lib/defaultBrands';
import { BrandGuide } from '@/types/brand';
import { AuditReport } from '@/types/audit';
import { ShieldAlert, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [brands, setBrands] = useState<BrandGuide[]>(INITIAL_BRANDS);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('andritz-official');
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);
  const [history, setHistory] = useState<AuditReport[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  // Modals & Drawers
  const [isRulesEditorOpen, setIsRulesEditorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRemediationOpen, setIsRemediationOpen] = useState(false);
  const [remediationResult, setRemediationResult] = useState<RemediationResult | null>(null);

  // AI Settings
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'auto' | 'openai' | 'gemini'>('auto');

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedBrands = localStorage.getItem('brand_compliance_brands');
      if (savedBrands) {
        setBrands(JSON.parse(savedBrands));
      }

      const savedHistory = localStorage.getItem('brand_compliance_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      const savedApiKey = localStorage.getItem('brand_compliance_apikey');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }

      const savedProvider = localStorage.getItem('brand_compliance_provider');
      if (savedProvider && ['auto', 'openai', 'gemini'].includes(savedProvider)) {
        setProvider(savedProvider as 'auto' | 'openai' | 'gemini');
      }
    } catch (e) {
      console.error('Failed to load local storage:', e);
    }
  }, []);

  const activeBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];

  // Save updated brand guide
  const handleSaveBrand = (updatedBrand: BrandGuide) => {
    const newBrands = brands.map((b) => (b.id === updatedBrand.id ? updatedBrand : b));
    setBrands(newBrands);
    localStorage.setItem('brand_compliance_brands', JSON.stringify(newBrands));
  };

  // Save AI Settings
  const handleSaveSettings = (settings: {
    apiKey: string;
    provider: 'auto' | 'openai' | 'gemini';
  }) => {
    setApiKey(settings.apiKey);
    setProvider(settings.provider);
    localStorage.setItem('brand_compliance_apikey', settings.apiKey);
    localStorage.setItem('brand_compliance_provider', settings.provider);
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('brand_compliance_history');
  };

  // Run Audit
  const handleStartAudit = async (fileData: {
    base64: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    contextNote: string;
    pageImages?: { pageNumber: number; dataUrl: string }[];
  }) => {
    setIsAuditing(true);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: fileData.base64,
          fileName: fileData.fileName,
          fileType: fileData.fileType,
          fileSize: fileData.fileSize,
          brand: activeBrand,
          contextNote: fileData.contextNote,
          apiKey,
          provider,
          pageImages: fileData.pageImages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha ao processar auditoria.');
      }

      const report: AuditReport = await response.json();
      setCurrentReport(report);

      // Save to history safely (prevent browser localStorage quota exceeded)
      const newHistory = [report, ...history.filter((h) => h.id !== report.id)].slice(0, 30);
      setHistory(newHistory);
      try {
        const sanitizedHistory = newHistory.map((item) => ({
          ...item,
          previewUrl: item.previewUrl && item.previewUrl.length > 5000 ? '' : item.previewUrl,
        }));
        localStorage.setItem('brand_compliance_history', JSON.stringify(sanitizedHistory));
      } catch (storageErr) {
        console.warn('LocalStorage limit reached; history kept in memory:', storageErr);
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Erro ao realizar a auditoria';
      alert(`Falha na auditoria: ${errMessage}`);
    } finally {
      setIsAuditing(false);
    }
  };

  // Direct download of the remediated creative
  const handleDownloadRemediated = async () => {
    if (!currentReport) return;
    try {
      const result = await generateCorrectedCreative(
        currentReport.previewUrl || '',
        currentReport,
        activeBrand
      );
      const link = document.createElement('a');
      link.download = `arte-corrigida-${activeBrand.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = result.correctedImageDataUrl;
      link.click();
    } catch (e) {
      console.error('Erro ao baixar arte:', e);
      alert('Não foi possível gerar o arquivo para download.');
    }
  };

  // Launch Auto-Remediation Studio modal
  const handleStartRemediation = async () => {
    if (!currentReport) return;
    try {
      const result = await generateCorrectedCreative(
        currentReport.previewUrl || '',
        currentReport,
        activeBrand
      );
      setRemediationResult(result);
      setIsRemediationOpen(true);
    } catch (e) {
      console.error('Erro na remediação:', e);
      alert('Não foi possível abrir o estúdio de remediação.');
    }
  };

  // Re-audit corrected version
  const handleReauditCorrected = (correctedImageUrl: string) => {
    handleStartAudit({
      base64: correctedImageUrl,
      fileName: 'peça-andritz-100-conforme-remediada.png',
      fileType: 'image/png',
      fileSize: 420000,
      contextNote: 'Arte re-auditada após auto-remediação de conformidade de marca.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Header */}
      <Header
        currentBrand={activeBrand}
        onOpenRulesEditor={() => setIsRulesEditorOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* If report is ready, show full audit report view */}
        {currentReport ? (
          <AuditReportView
            report={currentReport}
            onReset={() => setCurrentReport(null)}
            onStartRemediation={handleStartRemediation}
            onDownloadRemediated={handleDownloadRemediated}
          />
        ) : (
          /* Operator Dashboard (Setup & Upload) */
          <div className="space-y-6">
            {/* Brand Guide Selector & Snapshot */}
            <BrandSelector
              brands={brands}
              selectedBrandId={selectedBrandId}
              onSelectBrand={(id) => setSelectedBrandId(id)}
              onOpenRulesEditor={() => setIsRulesEditorOpen(true)}
            />

            {/* Upload Area & Audit Trigger */}
            <UploadSection
              currentBrand={activeBrand}
              onAuditStart={handleStartAudit}
              isAuditing={isAuditing}
            />

            {/* Feature and Governance Explanatory Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 mb-3">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Base de Conhecimento Editável
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Para brand guides protegidos (como o portal da ANDRITZ), copie os trechos de cores, fontes e respiro diretamente para a base interna do agente.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 mb-3">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Visão Multimodal Precisa
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Confronta a arte pixel a pixel com as zonas de exclusão do logotipo, proporções, contraste e códigos HEX reais utilizados no layout.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 mb-3">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Checklist Cirúrgico para Designers
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Retorna orientações claras apontando o que está em desacordo e como corrigir a arte para alcançar 100% de conformidade técnica.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Brand Compliance Agent • Sistema de Governança de Marca Industrial
          </p>
          <p className="text-slate-400">
            Focado em grandes marcas industriais (ANDRITZ AG e parceiros)
          </p>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <BrandGuideEditorModal
        isOpen={isRulesEditorOpen}
        onClose={() => setIsRulesEditorOpen(false)}
        brand={activeBrand}
        onSave={handleSaveBrand}
      />

      <AuditHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectAudit={(report) => setCurrentReport(report)}
        onClearHistory={handleClearHistory}
      />

      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        provider={provider}
        onSaveSettings={handleSaveSettings}
      />

      <RemediationModal
        isOpen={isRemediationOpen}
        onClose={() => setIsRemediationOpen(false)}
        originalImageUrl={currentReport?.previewUrl}
        remediationResult={remediationResult}
        onReaudit={handleReauditCorrected}
      />
    </div>
  );
}

