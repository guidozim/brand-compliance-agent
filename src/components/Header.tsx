'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, BookOpen, History, Settings, Sparkles } from 'lucide-react';
import { BrandGuide } from '@/types/brand';

interface HeaderProps {
  currentBrand: BrandGuide;
  onOpenRulesEditor: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  historyCount: number;
}

export function Header({
  currentBrand,
  onOpenRulesEditor,
  onOpenHistory,
  onOpenSettings,
  historyCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white shadow-sm ring-1 ring-brand-800/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900">
                BRAND COMPLIANCE AGENT
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-700/10">
                <Sparkles className="h-3 w-3" /> Industrial AI
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Auditoria de Brand Guides & Governança de Layouts Industriais
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {currentBrand.portalUrl && (
            <a
              href={currentBrand.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-brand-700 sm:inline-flex"
              title="Abrir Brand Portal oficial em nova aba"
            >
              <span>Brand Portal ({currentBrand.name})</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          )}

          <button
            onClick={onOpenRulesEditor}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-brand-500 hover:bg-brand-50/50 hover:text-brand-800"
          >
            <BookOpen className="h-4 w-4 text-brand-600" />
            <span className="hidden sm:inline">Base de Regras</span>
            <span className="sm:hidden">Regras</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <History className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Histórico</span>
            {historyCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
            title="Configurações de IA (OpenAI / Gemini)"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

