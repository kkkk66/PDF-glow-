
import { PDFDocument, degrees as pdfDegrees, rgb, LineCapStyle, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import * as pdfjsLibProxy from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// --- ROBUST PDF.JS INITIALIZATION ---
// We need to handle different export structures (ESM vs CJS vs Browser Globals)
let pdfjs: any;
try {
  // Check for default export (common in ESM)
  if (pdfjsLibProxy && (pdfjsLibProxy as any).default) {
      pdfjs = (pdfjsLibProxy as any).default;
  } else if (pdfjsLibProxy) {
      // Fallback to the proxy itself (common in some bundlers or CJS)
      pdfjs = pdfjsLibProxy;
  } else {
      console.error("PDF.js library could not be imported.");
  }
} catch (e) {
  console.error("Error initializing PDF.js proxy:", e);
}

export const pdfjsLib = pdfjs;

// --- WORKER CONFIGURATION ---
try {
  if (typeof window !== 'undefined' && pdfjsLib) {
    // Only configure if not already configured
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        // Use a stable version known to work with the library.
        // We prefer the version from package.json/importmap which is 3.11.174
        const version = pdfjsLib.version || '3.11.174'; 
        console.log(`Initializing PDF.js Worker v${version}`);
        
        // Use unpkg as a reliable CDN. 
        // Important: pdfjs-dist v3+ uses pdf.worker.min.js in the build folder
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`;
    }
  }
} catch (e) {
  console.warn("Failed to initialize PDF Worker:", e);
}

const handlePdfError = (error: any, defaultMessage: string) => {
  console.error(error);
  const msg = error.message || error.toString();
  
  if (msg.includes('Password') || msg.includes('Encrypted')) {
    throw new Error("This file is password protected. Please unlock it using the Unlock PDF tool or enter the password.");
  }
  if (msg.includes('Invalid PDF') || msg.includes('FormatError') || msg.includes('worker') || msg.includes('fetch')) {
    throw new Error("File appears corrupted or PDF worker failed to load. Please refresh and try again.");
  }
  throw new Error(`${defaultMessage} ${msg}`);
};

/**
 * Merges multiple PDF ArrayBuffers into a single PDF Document.
 */
export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      try {
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (e) {
         const msg = (e as any).message || '';
         if (msg.includes('Password') || msg.includes('Encrypted')) {
             throw new Error(`File "${file.name}" is password protected. Please unlock it first.`);
         }
         throw e;
      }
    }

    const pdfBytes = await mergedPdf.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error merging PDFs:", error);
    if ((error as Error).message.includes('password')) throw error;
    throw new Error("Failed to merge PDF files. Ensure all files are valid and not password protected.");
  }
};

/**
 * Splits a single PDF into individual files for each page.
 */
export const splitPdf = async (file: File): Promise<{ filename: string; data: Uint8Array }[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(arrayBuffer);
    const pageCount = srcPdf.getPageCount();
    const result: { filename: string; data: Uint8Array }[] = [];

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(srcPdf, [i]);
      newPdf.addPage(page);
      const pdfBytes = await newPdf.save();
      
      result.push({
        filename: `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`,
        data: pdfBytes
      });
    }

    return result;
  } catch (error) {
    handlePdfError(error, "Failed to split PDF.");
    return []; 
  }
};

/**
 * Compresses a PDF file by rendering pages to images and re-saving them.
 */
export const compressPdf = async (file: File, quality: number = 0.7, scale: number = 1.0): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const originalSize = arrayBuffer.byteLength;
    
    if (!pdfjsLib) throw new Error("PDF Library not initialized correctly.");
    
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const newPdf = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: scale }); 
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) throw new Error("Canvas context not available");

      await page.render({ canvasContext: context, viewport: viewport }).promise;

      const imageBlob = await new Promise<Blob | null>(resolve => 
        canvas.toBlob(resolve, 'image/jpeg', quality)
      );

      if (!imageBlob) throw new Error(`Failed to compress page ${i}`);

      const imageArrayBuffer = await imageBlob.arrayBuffer();
      const jpgImage = await newPdf.embedJpg(imageArrayBuffer);

      const newPage = newPdf.addPage([viewport.width, viewport.height]);
      newPage.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });
      
      page.cleanup();
    }

    const compressedBytes = await newPdf.save();

    if (compressedBytes.byteLength >= originalSize) {
        console.warn("Compression resulted in larger file. Returning original.");
        const originalBuffer = await file.arrayBuffer();
        return new Uint8Array(originalBuffer); 
    }

    return compressedBytes;
  } catch (error) {
    handlePdfError(error, "Failed to compress PDF.");
    return new Uint8Array();
  }
};

/**
 * Converts a PDF file to a Word (.docx) document.
 */
export const convertPdfToWord = async (file: File): Promise<Blob> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (!pdfjsLib) throw new Error("PDF Library not initialized correctly");
    
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const children: Paragraph[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Typesafe check for items
      const items = textContent.items.map((item: any) => ({
        text: item.str || "",
        x: (item.transform && item.transform[4]) ? item.transform[4] : 0,
        y: (item.transform && item.transform[5]) ? item.transform[5] : 0,
        height: item.height || 0,
        hasEOL: item.hasEOL
      }));

      items.sort((a: any, b: any) => {
        const yDiff = b.y - a.y;
        if (Math.abs(yDiff) > 5) return yDiff; 
        return a.x - b.x; 
      });

      let currentLineY = -1;
      let currentLineText = "";
      
      items.forEach((item: any) => {
        if (currentLineY !== -1 && Math.abs(item.y - currentLineY) > 10) { 
           if (currentLineText.trim()) {
             children.push(new Paragraph({
               children: [new TextRun(currentLineText)]
             }));
           }
           currentLineText = "";
        }
        
        currentLineY = item.y;
        currentLineText += item.text + " "; 
      });

      if (currentLineText.trim()) {
        children.push(new Paragraph({
          children: [new TextRun(currentLineText)]
        }));
      }

      if (i < numPages) {
         children.push(new Paragraph({ children: [new TextRun({ break: 1 })] }));
      }
      
      page.cleanup();
    }

    const doc = new Document({
      sections: [{
          children: children
      }],
    });

    return await Packer.toBlob(doc);

  } catch (error) {
    handlePdfError(error, "Failed to convert PDF to Word.");
    return new Blob();
  }
};

/**
 * Converts multiple Image files to a single PDF.
 */
export const convertImagesToPdf = async (files: File[]): Promise<Uint8Array> => {
  try {
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      let image;
      try {
          if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
             image = await pdfDoc.embedPng(arrayBuffer);
          } else {
             image = await pdfDoc.embedJpg(arrayBuffer);
          }
      } catch (e) {
          console.warn(`Failed to embed image ${file.name}`, e);
          continue; 
      }

      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error converting images to PDF:", error);
    throw new Error("Failed to convert images.");
  }
};

/**
 * Converts a PDF file to JPG images.
 */
export const convertPdfToImages = async (file: File): Promise<{ filename: string; data: Uint8Array }[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    if (!pdfjsLib) throw new Error("PDF Library not initialized");
    
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const images: { filename: string; data: Uint8Array }[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); 
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) throw new Error("Canvas context missing");

      await page.render({ canvasContext: context, viewport: viewport }).promise;

      const blob = await new Promise<Blob | null>(resolve => 
        canvas.toBlob(resolve, 'image/jpeg', 0.9)
      );

      if (blob) {
        const buffer = await blob.arrayBuffer();
        images.push({
            filename: `${file.name.replace('.pdf', '')}_page_${i}.jpg`,
            data: new Uint8Array(buffer)
        });
      }
      page.cleanup();
    }
    return images;
  } catch (error) {
    handlePdfError(error, "Failed to convert PDF to images.");
    return [];
  }
};

export const getPdfPreview = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    if (!pdfjsLib) throw new Error("PDF Library not initialized");
    
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    if (!context) throw new Error("Canvas context not available");

    await page.render({ canvasContext: context, viewport: viewport }).promise;
    
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
    if (!blob) throw new Error("Failed to generate preview");
    
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Preview generation failed", error);
    // Throwing error allows components to handle the loading state failure
    throw new Error("Preview generation failed. Please refresh or try another file.");
  }
};

export const getPdfPagePreviews = async (file: File): Promise<string[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    if (!pdfjsLib) throw new Error("PDF Library not initialized");

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const previews: string[] = [];
    const maxPages = 50; // Limit pages to prevent browser crash
    const pagesToProcess = Math.min(numPages, maxPages);

    for (let i = 1; i <= pagesToProcess; i++) {
      try {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.7));
          if (blob) {
            previews.push(URL.createObjectURL(blob));
          } else {
             previews.push(""); // Placeholder for failed blob
          }
        }
        page.cleanup();
      } catch (pageErr) {
        console.warn(`Failed to render page ${i}`, pageErr);
        previews.push(""); // Placeholder
      }
    }
    
    return previews;
  } catch (error) {
    console.error("Multi-page preview generation failed", error);
    throw new Error("Failed to generate page previews.");
  }
};

export const rotatePdf = async (file: File, rotationDegrees: number): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(pdfDegrees(currentRotation + rotationDegrees));
    });

    return await pdfDoc.save();
  } catch (error) {
    handlePdfError(error, "Failed to rotate PDF.");
    return new Uint8Array();
  }
};

export const deletePdfPages = async (file: File, pageIndicesToDelete: number[]): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(arrayBuffer);
    const numPages = srcPdf.getPageCount();

    const newPdf = await PDFDocument.create();
    const pagesToKeep = [];

    for (let i = 0; i < numPages; i++) {
        if (!pageIndicesToDelete.includes(i)) {
            pagesToKeep.push(i);
        }
    }

    if (pagesToKeep.length === 0) {
        throw new Error("You cannot delete all pages from the PDF.");
    }
    
    const copiedPages = await newPdf.copyPages(srcPdf, pagesToKeep);
    copiedPages.forEach(page => newPdf.addPage(page));

    return await newPdf.save();
  } catch (error) {
    handlePdfError(error, "Failed to delete pages.");
    return new Uint8Array();
  }
};

export const reorderPdfPages = async (file: File, newOrder: number[]): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();
    
    const copiedPages = await newPdf.copyPages(srcPdf, newOrder);
    copiedPages.forEach(page => newPdf.addPage(page));

    return await newPdf.save();
  } catch (error) {
    handlePdfError(error, "Failed to reorder pages.");
    return new Uint8Array();
  }
};

export const unlockPdf = async (file: File, password?: string): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Try loading. If it throws "Password required", we need password.
    // If password provided, pass it.
    const options = password ? { password } : undefined;
    const pdfDoc = await PDFDocument.load(arrayBuffer, options as any);
    
    // Saving without options removes encryption
    return await pdfDoc.save();
  } catch (error) {
    // Re-throw with handled message via helper if possible, or just throw
    // handlePdfError will catch in component
    throw error;
  }
};

export const addWatermark = async (
  file: File, 
  text: string, 
  opacity: number = 0.5, 
  size: number = 50
): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const helveticaFont = await pdfDoc.embedFont("Helvetica-Bold");

    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2 - (text.length * size * 0.3), 
        y: height / 2,
        size: size,
        font: helveticaFont,
        color: rgb(0.7, 0.7, 0.7), 
        opacity: opacity,
        rotate: pdfDegrees(45),
      });
    });

    return await pdfDoc.save();
  } catch (error) {
    handlePdfError(error, "Failed to add watermark.");
    return new Uint8Array();
  }
};

export const addPageNumbers = async (
  file: File, 
  position: 'bottom-center' | 'bottom-right' | 'top-right' | 'top-center',
  startFrom: number = 1
): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const pageNumber = index + startFrom;
      const text = `${pageNumber}`;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);
      const margin = 20;

      let x = 0;
      let y = 0;

      switch(position) {
        case 'bottom-center':
            x = (width / 2) - (textWidth / 2);
            y = margin;
            break;
        case 'bottom-right':
            x = width - textWidth - margin;
            y = margin;
            break;
        case 'top-center':
            x = (width / 2) - (textWidth / 2);
            y = height - margin - textHeight;
            break;
        case 'top-right':
            x = width - textWidth - margin;
            y = height - margin - textHeight;
            break;
      }

      page.drawText(text, {
        x, y, size: fontSize, font: font, color: rgb(0, 0, 0),
      });
    });

    return await pdfDoc.save();
  } catch (error) {
    handlePdfError(error, "Failed to add page numbers.");
    return new Uint8Array();
  }
};

// --- PDF EDITOR TYPES & FUNCTIONS ---

export type AnnotationPoint = { x: number; y: number };
export type AnnotationPath = {
  type: 'freehand';
  points: AnnotationPoint[];
  color: string;
  width: number;
  opacity: number;
};
export type AnnotationText = {
  type: 'text';
  x: number;
  y: number;
  text: string;
  size: number;
  color: string;
};
export type PageAnnotations = {
  paths: AnnotationPath[];
  texts: AnnotationText[];
  viewportWidth: number;
  viewportHeight: number;
};

export const saveAnnotatedPdf = async (
  file: File, 
  annotations: Record<number, PageAnnotations>
): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont("Helvetica");

    for (const [pageIndexStr, pageAnnotation] of Object.entries(annotations)) {
      const pageIndex = parseInt(pageIndexStr);
      if (pageIndex >= pages.length) continue;
      
      const page = pages[pageIndex];
      const { width: pdfWidth, height: pdfHeight } = page.getSize();
      
      const viewportWidth = pageAnnotation.viewportWidth || pdfWidth; 
      const viewportHeight = pageAnnotation.viewportHeight || pdfHeight;

      const scaleX = pdfWidth / viewportWidth;
      const scaleY = pdfHeight / viewportHeight;

      for (const path of pageAnnotation.paths) {
        if (path.points.length < 2) continue;
        
        const r = parseInt(path.color.slice(1, 3), 16) / 255;
        const g = parseInt(path.color.slice(3, 5), 16) / 255;
        const b = parseInt(path.color.slice(5, 7), 16) / 255;
        const color = rgb(r, g, b);

        const pdfPoints = path.points.map(p => ({
            x: p.x * scaleX,
            y: pdfHeight - (p.y * scaleY)
        }));

        for (let i = 1; i < pdfPoints.length; i++) {
           page.drawLine({
             start: { x: pdfPoints[i-1].x, y: pdfPoints[i-1].y },
             end: { x: pdfPoints[i].x, y: pdfPoints[i].y },
             thickness: path.width * scaleX, 
             color: color,
             opacity: path.opacity,
             lineCap: LineCapStyle.Round
           });
        }
      }

      for (const textItem of pageAnnotation.texts) {
        const x = textItem.x * scaleX;
        const y = pdfHeight - (textItem.y * scaleY) - (textItem.size * scaleY * 0.8); 
        
        const r = parseInt(textItem.color.slice(1, 3), 16) / 255;
        const g = parseInt(textItem.color.slice(3, 5), 16) / 255;
        const b = parseInt(textItem.color.slice(5, 7), 16) / 255;

        page.drawText(textItem.text, {
            x: x,
            y: y,
            size: textItem.size * scaleX, 
            font: font,
            color: rgb(r, g, b)
        });
      }
    }

    return await pdfDoc.save();
  } catch (error) {
    handlePdfError(error, "Failed to save edited PDF.");
    return new Uint8Array();
  }
};

export const createZip = async (files: { filename: string; data: Uint8Array }[]): Promise<Blob> => {
  const zip = new JSZip();
  files.forEach(file => {
    zip.file(file.filename, file.data);
  });
  return await zip.generateAsync({ type: 'blob' });
};

export const downloadBlob = (blob: Blob | Uint8Array, filename: string) => {
  const urlBlob = blob instanceof Uint8Array ? new Blob([blob], { type: 'application/pdf' }) : blob;
  const url = window.URL.createObjectURL(urlBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadPdfBlob = (data: Uint8Array, filename: string = 'merged-document.pdf') => {
  downloadBlob(data, filename);
};
