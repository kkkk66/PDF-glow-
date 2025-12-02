import { PDFDocument, degrees as pdfDegrees, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import * as pdfjsLibProxy from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Handle ESM import quirks for pdfjs-dist
// We explicitly check which object contains the library methods we need
const pdfjsLib = (pdfjsLibProxy as any).GlobalWorkerOptions 
  ? pdfjsLibProxy 
  : (pdfjsLibProxy as any).default;

// Set worker source for PDF.js
if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
  // Use CDNJS for the worker script as it is highly reliable and supports CORS correctly for workers
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const handlePdfError = (error: any, defaultMessage: string) => {
  console.error(error);
  const msg = error.message || error.toString();
  
  if (msg.includes('Password') || msg.includes('Encrypted')) {
    throw new Error("One or more files are password protected. Please remove the password and try again.");
  }
  if (msg.includes('Invalid PDF') || msg.includes('FormatError')) {
    throw new Error("One or more files seem to be corrupted or invalid PDF files.");
  }
  throw new Error(`${defaultMessage} ${msg}`);
};

/**
 * Merges multiple PDF ArrayBuffers into a single PDF Document.
 * This is a 100% client-side operation with NO AI involved.
 */
export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  try {
    // Create a new PDF Document
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      // Read the file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      try {
        // Load the source PDF
        const srcPdf = await PDFDocument.load(arrayBuffer);
        
        // Copy all pages from source PDF
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        
        // Add copied pages to the merged PDF
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (e) {
         // Catch individual file errors to identify which file failed
         const msg = (e as any).message || '';
         if (msg.includes('Password') || msg.includes('Encrypted')) {
             throw new Error(`File "${file.name}" is password protected. Please unlock it first.`);
         }
         throw e;
      }
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
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
 * Returns an array of objects containing filename and data.
 */
export const splitPdf = async (file: File): Promise<{ filename: string; data: Uint8Array }[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(arrayBuffer);
    const pageCount = srcPdf.getPageCount();
    const result: { filename: string; data: Uint8Array }[] = [];

    // Loop through each page
    for (let i = 0; i < pageCount; i++) {
      // Create a new document for this single page
      const newPdf = await PDFDocument.create();
      
      // Copy the specific page
      const [page] = await newPdf.copyPages(srcPdf, [i]);
      newPdf.addPage(page);
      
      // Save
      const pdfBytes = await newPdf.save();
      
      // Add to result
      result.push({
        filename: `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`,
        data: pdfBytes
      });
    }

    return result;
  } catch (error) {
    handlePdfError(error, "Failed to split PDF.");
    return []; // Unreachable but satisfies TS
  }
};

/**
 * Compresses a PDF file by rendering pages to images and re-saving them.
 * This is effective for shrinking scanned documents or image-heavy PDFs.
 * 
 * @param file The input PDF file
 * @param quality Compression quality (0.0 to 1.0). Lower is smaller size.
 * @param scale Scale factor for resolution. 1.0 is standard, 0.8 reduces dimensions.
 */
export const compressPdf = async (file: File, quality: number = 0.5, scale: number = 0.8): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const originalSize = arrayBuffer.byteLength;
    
    // Load document using PDF.js for rendering
    // Ensure we use the resolved pdfjsLib object
    if (!pdfjsLib) throw new Error("PDF Library not initialized correctly");
    
    // Use Uint8Array for PDF.js. 
    // Note: Passing data to PDF.js worker often transfers the buffer, detaching the original arrayBuffer.
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    // Create a new PDF Document to hold compressed pages
    const newPdf = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: scale }); 
      
      // Create a canvas to render the page
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) throw new Error("Canvas context not available");

      // Render PDF page to canvas
      await page.render({ canvasContext: context, viewport: viewport }).promise;

      // Convert canvas to JPEG blob with specified quality
      const imageBlob = await new Promise<Blob | null>(resolve => 
        canvas.toBlob(resolve, 'image/jpeg', quality)
      );

      if (!imageBlob) throw new Error(`Failed to compress page ${i}`);

      // Embed the JPEG into the new PDF
      const imageArrayBuffer = await imageBlob.arrayBuffer();
      const jpgImage = await newPdf.embedJpg(imageArrayBuffer);

      // Add a page with the image
      const newPage = newPdf.addPage([viewport.width, viewport.height]);
      newPage.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });
      
      // Cleanup page resources
      page.cleanup();
    }

    const compressedBytes = await newPdf.save();

    // STRICT CHECK: If compressed file is larger than original, return original.
    // This happens often with text-only PDFs vs Image PDFs.
    if (compressedBytes.byteLength >= originalSize) {
        console.warn("Compression resulted in larger file. Returning original.");
        
        // RELOAD the buffer because the initial arrayBuffer might be detached by the worker
        const originalBuffer = await file.arrayBuffer();
        return new Uint8Array(originalBuffer); 
    }

    return compressedBytes;
  } catch (error) {
    handlePdfError(error, "Failed to compress PDF.");
    return new Uint8Array(); // Unreachable
  }
};


/**
 * Converts a PDF file to a Word (.docx) document.
 * This extracts text content and attempts to preserve basic structure.
 */
export const convertPdfToWord = async (file: File): Promise<Blob> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (!pdfjsLib) throw new Error("PDF Library not initialized correctly");
    
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    // Create a new DOCX document
    const doc = new Document({
      sections: [],
    });

    const children: Paragraph[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Sort text items by Y (top to bottom) then X (left to right)
      // PDF Y coordinates start from bottom, so we invert logic for Y
      const items = textContent.items.map((item: any) => ({
        text: item.str,
        x: item.transform[4],
        y: item.transform[5],
        height: item.height || 0,
        hasEOL: item.hasEOL
      }));

      // Sort items: Higher Y first (top of page), then lower X first (left of page)
      items.sort((a: any, b: any) => {
        const yDiff = b.y - a.y;
        if (Math.abs(yDiff) > 5) return yDiff; // Different lines
        return a.x - b.x; // Same line (approx), sort by X
      });

      // Group into lines/paragraphs
      let currentLineY = -1;
      let currentLineText = "";
      
      items.forEach((item: any) => {
        // If we moved to a new significant Y position, push previous paragraph
        if (currentLineY !== -1 && Math.abs(item.y - currentLineY) > 10) { // 10 units threshold for new line
           if (currentLineText.trim()) {
             children.push(new Paragraph({
               children: [new TextRun(currentLineText)]
             }));
           }
           currentLineText = "";
        }
        
        currentLineY = item.y;
        currentLineText += item.text + " "; // Add space between words
      });

      // Push last line of the page
      if (currentLineText.trim()) {
        children.push(new Paragraph({
          children: [new TextRun(currentLineText)]
        }));
      }

      // Add a page break after each PDF page except the last one
      if (i < numPages) {
         // docx doesn't strictly require explicit page breaks if we just want flow text, 
         // but adding an empty paragraph or break helps separation.
         children.push(new Paragraph({ children: [new TextRun({ break: 1 })] }));
      }
      
      page.cleanup();
    }

    doc.addSection({
      children: children
    });

    // Generate blob
    const blob = await Packer.toBlob(doc);
    return blob;

  } catch (error) {
    handlePdfError(error, "Failed to convert PDF to Word.");
    return new Blob(); // Unreachable
  }
};

/**
 * Converts multiple Image files (JPG/PNG) to a single PDF Document.
 */
export const convertImagesToPdf = async (files: File[]): Promise<Uint8Array> => {
  try {
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      let image;
      
      try {
          // Detect MIME type or extension
          if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
             image = await pdfDoc.embedPng(arrayBuffer);
          } else {
             // Default to JPG for common camera photos (jpeg, jpg)
             image = await pdfDoc.embedJpg(arrayBuffer);
          }
      } catch (e) {
          console.warn(`Failed to embed image ${file.name}. It might be an unsupported format.`, e);
          continue; // Skip images that fail to load
      }

      // Create a page with the same dimensions as the image
      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      
      // Draw image to cover the full page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error converting images to PDF:", error);
    throw new Error("Failed to convert images. Ensure they are valid JPG or PNG files.");
  }
};

/**
 * Converts a PDF file to a set of JPG images (one per page).
 */
export const convertPdfToImages = async (file: File): Promise<{ filename: string; data: Uint8Array }[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (!pdfjsLib) throw new Error("PDF Library not initialized correctly");
    
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const images: { filename: string; data: Uint8Array }[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      // Use a reasonable scale for quality (2.0 is around 144 DPI if standard is 72)
      const viewport = page.getViewport({ scale: 2.0 }); 
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) throw new Error("Canvas context not available");

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

/**
 * Generates a preview image (JPG blob URL) of the first page of the PDF.
 * Used for the Rotate tool UI.
 */
export const getPdfPreview = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    if (!pdfjsLib) throw new Error("PDF Library not initialized");
    
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1); // Get first page
    
    const viewport = page.getViewport({ scale: 0.5 }); // Low scale for thumbnail
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
    return "";
  }
};

/**
 * Generates previews for all pages in a PDF.
 * Returns an array of Blob URLs.
 */
export const getPdfPagePreviews = async (file: File): Promise<string[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    if (!pdfjsLib) throw new Error("PDF Library not initialized");

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const previews: string[] = [];

    // Limit to reasonable number to prevent browser crash on huge PDFs
    const maxPages = 100;
    const pagesToProcess = Math.min(numPages, maxPages);

    for (let i = 1; i <= pagesToProcess; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.3 }); // Low scale for grid view
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) throw new Error("Canvas context not available");

      await page.render({ canvasContext: context, viewport: viewport }).promise;

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.7));
      if (blob) {
        previews.push(URL.createObjectURL(blob));
      }
      page.cleanup();
    }
    return previews;
  } catch (error) {
    console.error("Multi-page preview generation failed", error);
    return [];
  }
};

/**
 * Rotates all pages in a PDF file by the specified degrees.
 * @param file Input PDF file
 * @param rotationDegrees Degrees to rotate (e.g. 90, 180, -90)
 */
export const rotatePdf = async (file: File, rotationDegrees: number): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    // pdf-lib rotation is handled in degrees (0, 90, 180, 270)
    // We add the user's requested rotation to the existing rotation
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

/**
 * Creates a new PDF excluding the specified page numbers (0-based indices).
 */
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
    
    // Using copyPages allows us to selectively pick which pages to include in the new doc
    const copiedPages = await newPdf.copyPages(srcPdf, pagesToKeep);
    copiedPages.forEach(page => newPdf.addPage(page));

    return await newPdf.save();
  } catch (error) {
    handlePdfError(error, "Failed to delete pages.");
    return new Uint8Array();
  }
};

/**
 * Adds a text watermark to every page of the PDF.
 */
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
      
      // Draw text centered and rotated 45 degrees
      page.drawText(text, {
        x: width / 2 - (text.length * size * 0.3), // Rough centering estimate
        y: height / 2,
        size: size,
        font: helveticaFont,
        color: rgb(0.7, 0.7, 0.7), // Gray watermark
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

/**
 * Saves the edited PDF with annotations (drawings/text).
 */
export const saveAnnotatedPdf = async (
  file: File, 
  annotations: Record<number, PageAnnotations>
): Promise<Uint8Array> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont("Helvetica");

    // Iterate through pages that have annotations
    for (const [pageIndexStr, pageAnnotation] of Object.entries(annotations)) {
      const pageIndex = parseInt(pageIndexStr);
      if (pageIndex >= pages.length) continue;
      
      const page = pages[pageIndex];
      const { width: pdfWidth, height: pdfHeight } = page.getSize();
      
      // We rely on the viewport dimensions stored during editing to map coordinates
      const viewportWidth = pageAnnotation.viewportWidth || pdfWidth; 
      const viewportHeight = pageAnnotation.viewportHeight || pdfHeight;

      const scaleX = pdfWidth / viewportWidth;
      const scaleY = pdfHeight / viewportHeight;

      // Draw Paths (Freehand/Highlight)
      for (const path of pageAnnotation.paths) {
        if (path.points.length < 2) continue;
        
        // Convert hex color to rgb
        const r = parseInt(path.color.slice(1, 3), 16) / 255;
        const g = parseInt(path.color.slice(3, 5), 16) / 255;
        const b = parseInt(path.color.slice(5, 7), 16) / 255;
        const color = rgb(r, g, b);

        // Convert canvas points to PDF points
        const pdfPoints = path.points.map(p => ({
            x: p.x * scaleX,
            y: pdfHeight - (p.y * scaleY) // Invert Y because PDF origin is bottom-left
        }));

        // Use lines to approximate the curve
        for (let i = 1; i < pdfPoints.length; i++) {
           page.drawLine({
             start: { x: pdfPoints[i-1].x, y: pdfPoints[i-1].y },
             end: { x: pdfPoints[i].x, y: pdfPoints[i].y },
             thickness: path.width * scaleX, 
             color: color,
             opacity: path.opacity,
             lineCap: 'round'
           });
        }
      }

      // Draw Text
      for (const textItem of pageAnnotation.texts) {
        const x = textItem.x * scaleX;
        // Text Y is usually bottom-left of baseline in PDF. 
        // In Canvas, it's top-left (ish). We subtract font size to align better.
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


/**
 * Creates a ZIP file containing the provided PDF files.
 */
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

// Deprecated alias for backward compatibility if needed, but updated to use generic downloadBlob
export const downloadPdfBlob = (data: Uint8Array, filename: string = 'merged-document.pdf') => {
  downloadBlob(data, filename);
};