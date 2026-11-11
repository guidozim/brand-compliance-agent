'use client';

import React, { useState } from 'react';
import { X, Key, Sparkles, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  provider: 'auto' | 'openai' | 'gemini';
  onSaveSettings: (settings: { apiKey: string; provider: 'auto' | 'openai' | 'gemini' }) => void;
}

export function ApiSettingsModal({
  isOpen,
  onClose,
  apiKey,
  provider,
  onSaveSettings,
}: ApiSettingsModalProps) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localProvider, setLocalProvider] = useState<'auto' | 'openai' | 'gemini'>(provider);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      apiKey: localApiKey.trim(),
      provider: localProvider,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs sm:p-6">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Configurações do Agente de IA
              </h2>
              <p className="text-xs text-slate-500">
                Modelos de Visão Multimodal & Chaves de Acesso
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

        <div className="mt-5 space-y-4">
          {/* Provider Select */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Provedor de Visão Computacional
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLocalProvider('auto')}
                className={`rounded-lg border p-2.5 text-center text-xs font-semibold transition ${
                  localProvider === 'auto'
                    ? 'border-brand-600 bg-brand-50 text-brand-800 ring-1 ring-brand-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="mx-auto h-4 w-4 mb-1 text-brand-600" />
                Automático / Híbrido
              </button>

              <button
                type="button"
                onClick={() => setLocalProvider('openai')}
                className={`rounded-lg border p-2.5 text-center text-xs font-semibold transition ${
                  localProvider === 'openai'
                    ? 'border-brand-600 bg-brand-50 text-brand-800 ring-1 ring-brand-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Key className="mx-auto h-4 w-4 mb-1 text-slate-700" />
                OpenAI (GPT-4o)
              </button>

              <button
                type="button"
                onClick={() => setLocalProvider('gemini')}
                className={`rounded-lg border p-2.5 text-center text-xs font-semibold transition ${
                  localProvider === 'gemini'
                    ? 'border-brand-600 bg-brand-50 text-brand-800 ring-1 ring-brand-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="mx-auto h-4 w-4 mb-1 text-blue-600" />
                Google Gemini
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Chave da API (OpenAI ou Gemini)
            </label>
            <div className="mt-1 relative">
              <input
                type="password"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="sk-... ou AIza..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              A chave é salva apenas no seu navegador (localStorage) e transmitida diretamente às APIs oficiais.
            </p>
          </div>

          {/* Fallback info card */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-950">
            <span className="font-bold flex items-center gap-1.5 text-emerald-800 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Modo Autônomo Embutido Ativo
            </span>
            <p className="leading-relaxed text-[11.5px] text-emerald-900/90">
              Caso você não insira uma chave externa neste momento, o sistema utiliza automaticamente o motor analítico embutido com as regras pré-carregadas da ANDRITZ, permitindo que sua equipe teste e use a interface sem bloqueios!
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Salvo!
              </>
            ) : (
              'Salvar Configurações'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

