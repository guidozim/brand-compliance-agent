import { NextRequest, NextResponse } from 'next/server';
import { AuditRequestPayload, AuditReport } from '@/types/audit';
import {
  auditWithOpenAI,
  auditWithGemini,
  generateSmartAuditReport,
} from '@/lib/aiAudit';
import { generateId } from '@/lib/utils';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60s timeout for vision AI processing

export async function POST(req: NextRequest) {
  try {
    const payload: AuditRequestPayload = await req.json();

    const {
      image,
      fileName,
      fileType,
      fileSize,
      brand,
      contextNote,
      apiKey,
      provider = 'auto',
      pageImages,
    } = payload;

    if (!image) {
      return NextResponse.json(
        { error: 'Nenhuma imagem ou arquivo fornecido para auditoria.' },
        { status: 400 }
      );
    }

    if (!brand) {
      return NextResponse.json(
        { error: 'Nenhum Brand Guide de referência fornecido.' },
        { status: 400 }
      );
    }

    let report: AuditReport;

    const openAiKey = apiKey || process.env.OPENAI_API_KEY;
    const geminiKey = apiKey || process.env.GEMINI_API_KEY;

    // Tentativa 1: OpenAI se solicitado ou se houver chave
    if ((provider === 'openai' || (provider === 'auto' && openAiKey)) && openAiKey) {
      try {
        const rawReport = await auditWithOpenAI(image, brand, contextNote, openAiKey);
        report = {
          ...rawReport,
          id: rawReport.id || generateId(),
          brandId: brand.id,
          brandName: brand.name,
          timestamp: new Date().toISOString(),
          fileName: fileName || 'arte-criativa.png',
          fileType: fileType || 'image/png',
          fileSize: fileSize || 0,
          previewUrl: image,
          contextNote,
        };
      } catch (err: unknown) {
        console.warn('Falha no processamento com OpenAI Vision, acionando fallback inteligente:', err);
        report = generateSmartAuditReport(fileName || 'arte-criativa.png', brand, contextNote, pageImages);
        report.previewUrl = image;
      }
    }
    // Tentativa 2: Gemini
    else if ((provider === 'gemini' || (provider === 'auto' && geminiKey)) && geminiKey) {
      try {
        const rawReport = await auditWithGemini(image, brand, contextNote, geminiKey);
        
        // Constrói pagePreviews a partir das páginas reais extraídas do PDF, se disponíveis
        const pagePreviews = pageImages && pageImages.length > 0
          ? pageImages.map((p) => ({
              pageNumber: p.pageNumber,
              title: p.pageNumber === 1 ? 'Capa / Lâmina 1' : `Lâmina ${p.pageNumber}`,
              previewUrl: p.dataUrl,
              deviationsCount: (rawReport.deviations || []).filter((d) => d.pageNumber === p.pageNumber).length,
            }))
          : rawReport.pagePreviews;

        report = {
          ...rawReport,
          id: rawReport.id || generateId(),
          brandId: brand.id,
          brandName: brand.name,
          timestamp: new Date().toISOString(),
          fileName: fileName || 'arte-criativa.png',
          fileType: fileType || 'image/png',
          fileSize: fileSize || 0,
          previewUrl: image,
          totalPages: pageImages && pageImages.length > 0 ? pageImages.length : (rawReport.totalPages || 1),
          pagePreviews,
          contextNote,
          isSimulation: false,
        };
      } catch (err: unknown) {
        console.error('Falha no processamento com Gemini Vision:', err);
        const errMsg = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
          { error: `Falha na chamada da API Gemini do Google: ${errMsg}` },
          { status: 502 }
        );
      }
    }
    // Tentativa 3: Motor Inteligente Embutido (Pronto para Uso Imediato)
    else {
      report = generateSmartAuditReport(fileName || 'arte-criativa.png', brand, contextNote, pageImages);
      report.previewUrl = image;
    }

    return NextResponse.json(report);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Erro interno no servidor de auditoria';
    console.error('Audit Error:', error);
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}

