'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileImage,
  FileText,
  X,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  Eye,
  Scan,
} from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import { BrandGuide } from '@/types/brand';

interface UploadSectionProps {
  currentBrand: BrandGuide;
  onAuditStart: (fileData: {
    base64: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    contextNote: string;
  }) => void;
  isAuditing: boolean;
}

export function UploadSection({
  currentBrand,
  onAuditStart,
  isAuditing,
}: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    file: File | null;
    preview: string;
    name: string;
    type: string;
    size: number;
  } | null>(null);
  const [contextNote, setContextNote] = useState('');
  const [auditStep, setAuditStep] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor, envie um arquivo de imagem (.png, .jpg) ou documento (.pdf).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setSelectedFile({
        file,
        preview: base64,
        name: file.name,
        type: file.type,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleAuditClick = () => {
    if (!selectedFile) return;

    // Simulate visual audit steps for rich feedback
    setAuditStep('Iniciando análise multimodal e extração visual...');
    const timer1 = setTimeout(
      () => setAuditStep('Confrontando dimensões e clear space do logotipo...'),
      800
    );
    const timer2 = setTimeout(
      () => setAuditStep('Checando paleta HEX e hierarquia tipográfica oficial...'),
      1700
    );
    const timer3 = setTimeout(
      () => setAuditStep('Compilando checklist cirúrgico de conformidade...'),
      2600
    );

    onAuditStart({
      base64: selectedFile.preview,
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      contextNote,
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  // Quick preset test samples so the user can test the app with 1-click
  const loadDemoSample = (type: 'violation' | 'approved') => {
    // Canvas generated sample visual representation
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (type === 'violation') {
        // Background with non-compliant dark blue
        ctx.fillStyle = '#0D47A1'; // Incorrect blue (#005A9C is official)
        ctx.fillRect(0, 0, 800, 450);

        // Header banner
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('Andritz Engineering Tech', 50, 80); // Lowercase violation

        // Close to border violation
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(720, 10, 70, 30);
        ctx.fillStyle = '#005A9C';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('ANDRITZ', 725, 30); // Violates clear space at border

        // Content
        ctx.fillStyle = '#E0E0E0';
        ctx.font = 'italic 20px serif'; // Serif font violation
        ctx.fillText('Soluções industriais milagrosas e com menor preço', 50, 180);

        ctx.fillStyle = '#00E5FF';
        ctx.fillRect(50, 240, 300, 140);
        ctx.fillStyle = '#002B49';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Eficiência Térmica: +35%', 70, 310);
      } else {
        // Fully compliant sample
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 800, 450);

        // Official ANDRITZ Blue stripe
        ctx.fillStyle = '#005A9C';
        ctx.fillRect(0, 0, 800, 16);

        // Logo with generous clear space
        ctx.fillStyle = '#005A9C';
        ctx.font = '900 38px Arial';
        ctx.fillText('ANDRITZ', 60, 90);

        // Official Tagline
        ctx.fillStyle = '#333F48';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('ENGINEERED SUCCESS', 60, 125);

        // High quality headline in Aptos/Helvetica
        ctx.fillStyle = '#002B49';
        ctx.font = 'bold 32px Arial';
        ctx.fillText('Tecnologia de Descarbonização para Usinas', 60, 210);

        // Industrial Cyan accent
        ctx.fillStyle = '#00A3E0';
        ctx.fillRect(60, 235, 120, 4);

        // Body text
        ctx.fillStyle = '#333F48';
        ctx.font = '16px Arial';
        ctx.fillText('Sistemas integrados de captura e eletrificação sustentável.', 60, 275);
        ctx.fillText('Consulte nossos engenheiros especialistas: andritz.com', 60, 310);

        // Footer
        ctx.fillStyle = '#F4F5F7';
        ctx.fillRect(0, 390, 800, 60);
        ctx.fillStyle = '#718096';
        ctx.font = '12px Arial';
        ctx.fillText('© 2026 ANDRITZ AG. All rights reserved. Confidential.', 60, 425);
      }

      const dataUrl = canvas.toDataURL('image/png');
      setSelectedFile({
        file: null,
        preview: dataUrl,
        name:
          type === 'violation'
            ? 'peça-teste-desvios-andritz.png'
            : 'peça-teste-100-conforme-andritz.png',
        type: 'image/png',
        size: 345000,
      });
      setContextNote(
        type === 'violation'
          ? 'Arte proposta para anúncio de revista técnica com desvios para teste do agente.'
          : 'Arte de anúncio corporativo institucional seguindo diretrizes oficiais.'
      );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Scan className="h-5 w-5 text-brand-700" />
          Upload de Material para Auditoria
        </h2>
        <p className="text-xs text-slate-500">
          Envie o layout criativo para que o agente confronte o arquivo contra o Brand Guide da{' '}
          <strong className="text-slate-700">{currentBrand.name}</strong>.
        </p>
      </div>

      {/* Drop Zone */}
      <div className="mt-5">
        {!selectedFile ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
              dragActive
                ? 'border-brand-600 bg-brand-50/50 scale-[1.01]'
                : 'border-slate-300 bg-slate-50/50 hover:border-brand-500 hover:bg-slate-50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleChange}
              className="hidden"
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 text-brand-700">
              <UploadCloud className="h-7 w-7" />
            </div>
            <p className="mt-3 text-sm font-bold text-slate-800">
              Arraste e solte o arquivo aqui, ou <span className="text-brand-700 underline">clique para selecionar</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Suporta imagens de layouts (PNG, JPG, JPEG) e documentos gráficos (PDF) até 25MB
            </p>

            <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Análise de Logotipo & Respiro
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Cores HEX
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Tipografia
              </span>
            </div>
          </div>
        ) : (
          /* File Preview Card */
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xs">
                  {selectedFile.type.includes('image') ? (
                    <img
                      src={selectedFile.preview}
                      alt="Prévia do material"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-rose-50 text-rose-600">
                      <FileText className="h-8 w-8" />
                      <span className="text-[10px] font-bold">PDF</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{selectedFile.name}</span>
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 uppercase">
                      {selectedFile.type.split('/')[1]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tamanho: {formatFileSize(selectedFile.size)} • Pronto para auditoria de marca
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-brand-700">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Layout carregado em memória</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-rose-600"
                >
                  <X className="h-4 w-4" /> Trocar Peça
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preset demo buttons for instant testing */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>Ou teste rapidamente com peças de simulação da Andritz:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadDemoSample('violation')}
            className="rounded border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 hover:bg-amber-100 transition"
          >
            Peça com Desvios (Exemplo Crítico)
          </button>
          <button
            type="button"
            onClick={() => loadDemoSample('approved')}
            className="rounded border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100 transition"
          >
            Peça 100% Conforme (Exemplo Homologado)
          </button>
        </div>
      </div>

      {/* Optional Context Input */}
      <div className="mt-5">
        <label
          htmlFor="context-note"
          className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
        >
          <span>Contexto da Peça Criativa (Opcional)</span>
          <span className="text-[10px] font-normal text-slate-500 lowercase">
            (canal, suporte ou regras pontuais desta campanha)
          </span>
        </label>
        <input
          id="context-note"
          type="text"
          value={contextNote}
          onChange={(e) => setContextNote(e.target.value)}
          placeholder="Ex: Anúncio de página dupla para revista técnica industrial, formato impresso."
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Action Button & Status Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <div className="text-xs text-slate-500">
          {isAuditing ? (
            <div className="flex items-center gap-2 text-brand-700 font-medium">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{auditStep || 'Processando auditoria com IA multimodal...'}</span>
            </div>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" />
              Análise cruzada com regras de logotipo, tipografia e cores oficiais.
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!selectedFile || isAuditing}
          onClick={handleAuditClick}
          className={`relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all ${
            !selectedFile || isAuditing
              ? 'cursor-not-allowed bg-slate-300 shadow-none text-slate-500'
              : 'bg-brand-700 hover:bg-brand-800 active:scale-[0.99] shadow-brand-700/25'
          }`}
        >
          {isAuditing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Auditando Material...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Auditar Material com IA</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

