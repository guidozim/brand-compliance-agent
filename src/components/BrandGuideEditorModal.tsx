'use client';

import React, { useState } from 'react';
import { BrandGuide, BrandColor } from '@/types/brand';
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Palette,
  Type,
  Maximize2,
  MessageSquare,
  FileText,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { ANDRITZ_BRAND_GUIDE } from '@/lib/defaultBrands';
import { generateId } from '@/lib/utils';

interface BrandGuideEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandGuide;
  onSave: (updatedBrand: BrandGuide) => void;
}

export function BrandGuideEditorModal({
  isOpen,
  onClose,
  brand,
  onSave,
}: BrandGuideEditorModalProps) {
  const [formData, setFormData] = useState<BrandGuide>(brand);
  const [activeTab, setActiveTab] = useState<
    'general' | 'colors' | 'typography' | 'logo' | 'tone' | 'rawText'
  >('colors');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Synchronize when brand prop changes
  React.useEffect(() => {
    setFormData(brand);
  }, [brand]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...formData,
      lastUpdated: new Date().toISOString(),
    });
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 800);
  };

  const handleResetToAndritz = () => {
    if (confirm('Deseja restaurar todas as diretrizes padrão oficiais da ANDRITZ?')) {
      setFormData(ANDRITZ_BRAND_GUIDE);
    }
  };

  // Color management
  const handleAddColor = () => {
    const newColor: BrandColor = {
      id: generateId(),
      name: 'Nova Cor Oficial',
      hex: '#005A9C',
      usage: 'Uso primário / secundário',
      type: 'secondary',
    };
    setFormData({
      ...formData,
      colors: [...formData.colors, newColor],
    });
  };

  const handleRemoveColor = (id: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((c) => c.id !== id),
    });
  };

  const handleColorChange = (id: string, field: keyof BrandColor, value: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Base de Conhecimento do Brand Guide
              </h2>
              <p className="text-xs text-slate-500">
                Configure as regras vitais da marca que servirão como o &quot;cérebro&quot; do agente de compliance
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
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 text-xs font-semibold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 whitespace-nowrap transition ${
              activeTab === 'colors'
                ? 'border-brand-600 text-brand-700 bg-white font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Palette className="h-4 w-4" />
            Cores Oficiais (HEX)
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 whitespace-nowrap transition ${
              activeTab === 'typography'
                ? 'border-brand-600 text-brand-700 bg-white font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Type className="h-4 w-4" />
            Tipografia
          </button>

          <button
            onClick={() => setActiveTab('logo')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 whitespace-nowrap transition ${
              activeTab === 'logo'
                ? 'border-brand-600 text-brand-700 bg-white font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Maximize2 className="h-4 w-4" />
            Logo & Respiro (Clear Space)
          </button>

          <button
            onClick={() => setActiveTab('tone')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 whitespace-nowrap transition ${
              activeTab === 'tone'
                ? 'border-brand-600 text-brand-700 bg-white font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Tom de Voz & Redação
          </button>

          <button
            onClick={() => setActiveTab('rawText')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 whitespace-nowrap transition ${
              activeTab === 'rawText'
                ? 'border-brand-600 text-brand-700 bg-white font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            Trechos do Portal Protegido
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 whitespace-nowrap transition ${
              activeTab === 'general'
                ? 'border-brand-600 text-brand-700 bg-white font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ExternalLink className="h-4 w-4" />
            Geral & Links
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CORES */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Paleta Cromática Oficial</h3>
                  <p className="text-xs text-slate-500">
                    O agente verificará se as peças usam rigorosamente os códigos HEX configurados abaixo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Plus className="h-3.5 w-3.5" /> Adicionar Cor
                </button>
              </div>

              <div className="space-y-3">
                {formData.colors.map((color) => (
                  <div
                    key={color.id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => handleColorChange(color.id, 'hex', e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded-lg border border-slate-300 p-0.5 shadow-sm"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="text"
                          value={color.hex}
                          onChange={(e) => handleColorChange(color.id, 'hex', e.target.value)}
                          className="w-full rounded border border-slate-300 bg-white px-2 py-1 font-mono text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => handleColorChange(color.id, 'name', e.target.value)}
                        placeholder="Nome da cor (ex: ANDRITZ Blue)"
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800"
                      />
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={color.usage}
                        onChange={(e) => handleColorChange(color.id, 'usage', e.target.value)}
                        placeholder="Regra de uso (ex: Apenas em logotipos e títulos)"
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600"
                      />
                    </div>

                    <div className="w-28">
                      <select
                        value={color.type}
                        onChange={(e) =>
                          handleColorChange(color.id, 'type', e.target.value as BrandColor['type'])
                        }
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                      >
                        <option value="primary">Primária</option>
                        <option value="secondary">Secundária</option>
                        <option value="neutral">Neutra</option>
                        <option value="accent">Destaque</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color.id)}
                      className="text-slate-400 hover:text-rose-600 self-center"
                      title="Excluir cor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TIPOGRAFIA */}
          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Família Tipográfica Primária
                </label>
                <input
                  type="text"
                  value={formData.typography.primaryFont}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      typography: { ...formData.typography, primaryFont: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
                  placeholder="Ex: Aptos / Helvetica Neue / Arial"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Fonte padrão utilizada em títulos corporativos, cabeçalhos e elementos principais.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Família Tipográfica Secundária
                </label>
                <input
                  type="text"
                  value={formData.typography.secondaryFont}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      typography: { ...formData.typography, secondaryFont: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
                  placeholder="Ex: Arial / Segoe UI"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Regras de Hierarquia e Formatação
                </label>
                <textarea
                  rows={3}
                  value={formData.typography.hierarchyRules}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      typography: { ...formData.typography, hierarchyRules: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                  placeholder="Descreva pesos, entrelinha, caixas e regras de hierarquia..."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Fontes Expressamente Proibidas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.typography.forbiddenFonts.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      typography: {
                        ...formData.typography,
                        forbiddenFonts: e.target.value.split(',').map((f) => f.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                  placeholder="Ex: Comic Sans, Papyrus, Times New Roman, Fontes Manuscritas"
                />
              </div>
            </div>
          )}

          {/* TAB 3: LOGO & CLEAR SPACE */}
          {activeTab === 'logo' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Regra Oficial de Respiro / Clear Space
                </label>
                <textarea
                  rows={3}
                  value={formData.logoRules.clearSpaceRule}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      logoRules: { ...formData.logoRules, clearSpaceRule: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                  placeholder="Ex: A área de proteção mínima em torno do logotipo ANDRITZ corresponde à altura da letra 'A'..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tamanho Mínimo (Digital)
                  </label>
                  <input
                    type="text"
                    value={formData.logoRules.minWidthDigital}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        logoRules: { ...formData.logoRules, minWidthDigital: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tamanho Mínimo (Impresso)
                  </label>
                  <input
                    type="text"
                    value={formData.logoRules.minWidthPrint}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        logoRules: { ...formData.logoRules, minWidthPrint: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Usos e Práticas Estritamente Proibidas (uma por linha)
                </label>
                <textarea
                  rows={4}
                  value={formData.logoRules.forbiddenPractices.join('\n')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      logoRules: {
                        ...formData.logoRules,
                        forbiddenPractices: e.target.value.split('\n').filter(Boolean),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 font-mono"
                  placeholder="Nunca distorcer o logotipo&#10;Nunca aplicar sombra projetada&#10;Nunca alterar as cores originais"
                />
              </div>
            </div>
          )}

          {/* TAB 4: TOM DE VOZ */}
          {activeTab === 'tone' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Arquétipo & Personalidade da Marca
                </label>
                <input
                  type="text"
                  value={formData.toneOfVoice.archetype}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      toneOfVoice: { ...formData.toneOfVoice, archetype: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  placeholder="Ex: O Especialista Visionário Industrial"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Regras Obrigatórias de Grafia e Redação (Mandatories - uma por linha)
                </label>
                <textarea
                  rows={4}
                  value={formData.toneOfVoice.mandatories.join('\n')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      toneOfVoice: {
                        ...formData.toneOfVoice,
                        mandatories: e.target.value.split('\n').filter(Boolean),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                  placeholder="Sempre escrever o nome corporativo em caixa alta: ANDRITZ.&#10;O slogan ENGINEERED SUCCESS deve ser em caixa alta."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Termos e Linguagem Proibida (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.toneOfVoice.forbiddenWords.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      toneOfVoice: {
                        ...formData.toneOfVoice,
                        forbiddenWords: e.target.value.split(',').map((w) => w.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                  placeholder="Barato, Milagroso, Revolucionário sem comprovação"
                />
              </div>
            </div>
          )}

          {/* TAB 5: TRECHOS COPIADOS DO PORTAL */}
          {activeTab === 'rawText' && (
            <div className="space-y-3">
              <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                <span className="font-bold">Dica para Brand Guides Protegidos:</span> Como o portal oficial da marca fica protegido por link direto, copie trechos textuais, especificações ou notas diretamente do portal e cole-os no campo abaixo. O agente incluirá essas instruções diretamente no prompt de auditoria.
              </div>

              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Texto Livre de Diretrizes do Brand Portal
              </label>
              <textarea
                rows={8}
                value={formData.customRulesText || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customRulesText: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Cole aqui qualquer trecho do Brand Guide oficial (diretrizes de fotografia, grid, diagramação, padrões de assinatura, etc.)..."
              />
            </div>
          )}

          {/* TAB 6: GERAL & LINKS */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Nome da Marca / Cliente
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Segmento / Indústria
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Slogan Oficial
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                  placeholder="Ex: ENGINEERED SUCCESS"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Link de Referência do Brand Portal Protegido (URL)
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="url"
                    value={formData.portalUrl || ''}
                    onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-brand-700 font-mono"
                    placeholder="https://brandportal.andritz.com/hub/5"
                  />
                  {formData.portalUrl && (
                    <a
                      href={formData.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-700 hover:bg-slate-200"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Abrir
                    </a>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Permite à equipe de design abrir o portal oficial protegido em um clique direto do cabeçalho.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/90 px-6 py-4">
          <button
            type="button"
            onClick={handleResetToAndritz}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restaurar Padrão ANDRITZ
          </button>

          <div className="flex items-center gap-3">
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
              className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800"
            >
              {showSavedFeedback ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Salvo com Sucesso!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Diretrizes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

