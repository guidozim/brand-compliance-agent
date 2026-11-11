'use client';

import React from 'react';
import { AuditReport } from '@/types/audit';
import { X, History, Trash2, ChevronRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface AuditHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AuditReport[];
  onSelectAudit: (report: AuditReport) => void;
  onClearHistory: () => void;
}

export function AuditHistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectAudit,
  onClearHistory,
}: AuditHistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-slate-200 bg-white shadow-2xl">
          {/* Drawer Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
            <div className="flex items-center gap-2 text-slate-900">
              <History className="h-5 w-5 text-brand-700" />
              <h2 className="text-base font-bold">Histórico de Auditorias</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {history.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="h-[calc(100vh-8rem)] overflow-y-auto p-6 space-y-3">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                <History className="h-12 w-12 stroke-1 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-600">Nenhuma auditoria realizada ainda</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Faça o upload de uma imagem ou layout para gerar relatórios de conformidade.
                </p>
              </div>
            ) : (
              history.map((item) => {
                const StatusIcon =
                  item.status === 'APPROVED'
                    ? CheckCircle2
                    : item.status === 'APPROVED_WITH_RESERVATIONS'
                    ? AlertTriangle
                    : XCircle;

                const statusColor =
                  item.status === 'APPROVED'
                    ? 'text-emerald-600'
                    : item.status === 'APPROVED_WITH_RESERVATIONS'
                    ? 'text-amber-600'
                    : 'text-rose-600';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectAudit(item);
                      onClose();
                    }}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition hover:border-brand-500 hover:bg-brand-50/20 hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                        {item.previewUrl ? (
                          <img
                            src={item.previewUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <StatusIcon className={`h-6 w-6 ${statusColor}`} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className={`h-3.5 w-3.5 shrink-0 ${statusColor}`} />
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.fileName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.brandName} • Score: {item.score}/100
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-600" />
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {history.length > 0 && (
            <div className="flex h-16 items-center justify-between border-t border-slate-200 bg-slate-50 px-6">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Deseja limpar todo o histórico de auditorias?')) {
                    onClearHistory();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                <Trash2 className="h-4 w-4" /> Limpar Histórico
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

