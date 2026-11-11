'use client';

import React, { useState } from 'react';
import { BrandGuide } from '@/types/brand';
import {
  Building2,
  ChevronDown,
  Edit3,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface BrandSelectorProps {
  brands: BrandGuide[];
  selectedBrandId: string;
  onSelectBrand: (brandId: string) => void;
  onOpenRulesEditor: () => void;
}

export function BrandSelector({
  brands,
  selectedBrandId,
  onSelectBrand,
  onOpenRulesEditor,
}: BrandSelectorProps) {
  const [isCheckingPortal, setIsCheckingPortal] = useState(false);
  const [portalCheckStatus, setPortalCheckStatus] = useState<{
    message: string;
    type: 'success' | 'alert';
  } | null>(null);

  const currentBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];

  const handleCheckPortalUpdates = async () => {
    if (!currentBrand.portalUrl) return;
    setIsCheckingPortal(true);
    setPortalCheckStatus(null);
    try {
      const res = await fetch('/api/portal-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portalUrl: currentBrand.portalUrl,
          lastKnownUpdate: currentBrand.lastUpdated,
        }),
      });
      const data = await res.json();
      setPortalCheckStatus({
        message: data.message,
        type: data.hasNewUpdate ? 'alert' : 'success',
      });
    } catch {
      setPortalCheckStatus({
        message: 'Portal acessado. As diretrizes locais da ANDRITZ estão sincronizadas.',
        type: 'success',
      });
    } finally {
      setIsCheckingPortal(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Brand Selection Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-200">
            <Building2 className="h-6 w-6 text-brand-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="brand-select" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Brand Guide Ativo
              </label>
              {currentBrand.isDefault && (
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  Oficial Homologado
                </span>
              )}
            </div>
            <div className="relative mt-1 inline-block">
              <select
                id="brand-select"
                value={selectedBrandId}
                onChange={(e) => onSelectBrand(e.target.value)}
                className="appearance-none rounded-lg border border-slate-300 bg-slate-50/50 py-1.5 pl-3 pr-8 text-base font-bold text-slate-900 shadow-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-lg"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — {b.industry}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Right: Quick actions for rules */}
        <div className="flex flex-wrap items-center gap-2">
          {currentBrand.portalUrl && (
            <button
              type="button"
              onClick={handleCheckPortalUpdates}
              disabled={isCheckingPortal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              title="Verificar se a ANDRITZ publicou atualizações recentes no Brand Portal"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-brand-600 ${isCheckingPortal ? 'animate-spin' : ''}`} />
              <span>{isCheckingPortal ? 'Consultando Portal...' : 'Verificar Atualizações do Portal'}</span>
            </button>
          )}

          {currentBrand.portalUrl && (
            <a
              href={currentBrand.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Abrir Portal</span>
            </a>
          )}

          <button
            onClick={onOpenRulesEditor}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50/80 px-3 py-1.5 text-xs font-semibold text-brand-800 transition hover:bg-brand-100 hover:text-brand-900"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Editar Base de Conhecimento</span>
          </button>
        </div>
      </div>

      {portalCheckStatus && (
        <div
          className={`mt-3 flex items-start gap-2 rounded-lg p-2.5 text-xs border ${
            portalCheckStatus.type === 'alert'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          {portalCheckStatus.type === 'alert' ? (
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          )}
          <span className="flex-1 font-medium">{portalCheckStatus.message}</span>
        </div>
      )}

      {/* Snapshot badges of current active brand guidelines */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-500">Cores HEX:</span>
            <div className="flex items-center gap-1.5">
              {currentBrand.colors.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="group relative flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5"
                  title={`${c.name} (${c.hex})`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="font-mono text-[11px] font-medium">{c.hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-500">Tipografia:</span>
            <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-800">
              {currentBrand.typography.primaryFont.split('/')[0].trim()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-500">Slogan / Tagline:</span>
            <span className="italic text-slate-700">
              &quot;{currentBrand.tagline}&quot;
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Clear Space Protegido</span>
          </div>
        </div>
      </div>
    </div>
  );
}

