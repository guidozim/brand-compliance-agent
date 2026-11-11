/**
 * Renderizador de arquivos PDF no navegador usando Mozilla PDF.js
 * Extrai cada página do PDF como imagem PNG real (Data URL) para permitir
 * auditoria visual real, miniaturas fiéis e navegação página a página.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

let pdfjsLoadingPromise: Promise<any> | null = null;

export async function loadPdfJs(): Promise<any> {
  if (typeof window === 'undefined') return null;
  const win = window as any;
  if (win.pdfjsLib) return win.pdfjsLib;

  if (pdfjsLoadingPromise) return pdfjsLoadingPromise;

  pdfjsLoadingPromise = new Promise((resolve, reject) => {
    // Verifica se já existe a tag de script
    const existing = document.querySelector('script[data-pdfjs]');
    if (existing) {
      existing.addEventListener('load', () => resolve((window as any).pdfjsLib));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.setAttribute('data-pdfjs', 'true');
    script.async = true;

    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(pdfjs);
      } else {
        reject(new Error('PDF.js inicializado sem objeto global'));
      }
    };

    script.onerror = () => {
      pdfjsLoadingPromise = null;
      reject(new Error('Falha ao carregar motor de renderização de PDF'));
    };

    document.head.appendChild(script);
  });

  return pdfjsLoadingPromise;
}

export interface ExtractedPdfPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Converte todas as páginas de um arquivo PDF em imagens PNG reais de alta resolução
 */
export async function extractPagesFromPdf(
  fileOrBase64: File | string,
  maxPages = 12
): Promise<ExtractedPdfPage[]> {
  try {
    const pdfjs = await loadPdfJs();
    if (!pdfjs) throw new Error('PDF.js não disponível');

    let pdfData: ArrayBuffer | Uint8Array;

    if (typeof fileOrBase64 === 'string') {
      const base64Data = fileOrBase64.includes(',')
        ? fileOrBase64.split(',')[1]
        : fileOrBase64;
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      pdfData = bytes;
    } else {
      pdfData = await fileOrBase64.arrayBuffer();
    }

    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    const total = Math.min(pdf.numPages, maxPages);
    const pages: ExtractedPdfPage[] = [];

    for (let pageNum = 1; pageNum <= total; pageNum++) {
      const page = await pdf.getPage(pageNum);
      // Escala 1.5 para boa nitidez sem estourar memória
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        pages.push({
          pageNumber: pageNum,
          dataUrl: canvas.toDataURL('image/png'),
          width: viewport.width,
          height: viewport.height,
        });
      }
    }

    return pages;
  } catch (error) {
    console.error('Erro ao extrair páginas do PDF:', error);
    return [];
  }
}
