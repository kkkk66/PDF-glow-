import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, File as FileIcon, PenTool, Highlighter, Type, Eraser, Download, ChevronLeft, ChevronRight, Save, Loader2, Undo, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadedFile, MergeStatus } from '../types';
import { saveAnnotatedPdf, AnnotationPath, AnnotationText, PageAnnotations, downloadPdfBlob, pdfjsLib } from '../utils/pdfHelpers';

type Tool = 'pen' | 'highlighter' | 'text' | 'eraser';

export const PdfEditor: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<MergeStatus>(MergeStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Editor State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2); 
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [color, setColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(2);
  
  // Annotations Store: Key is page index (0-based)
  const [annotations, setAnnotations] = useState<Record<number, PageAnnotations>>({});
  
  // Interactive State
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<AnnotationPath | null>(null);
  const [textInput, setTextInput] = useState<{x: number, y: number, text: string} | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null); // For PDF rendering (Background)
  const drawCanvasRef = useRef<HTMLCanvasElement>(null); // For Drawing (Foreground)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Responsive Scale Adjustment on Load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScale(0.6);
      } else if (window.innerWidth < 1024) {
        setScale(0.8);
      } else {
        setScale(1.2);
      }
    };
    handleResize(); 
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile({
        id: Math.random().toString(36).substring(7),
        file: selectedFile
      });
      
      setStatus(MergeStatus.IDLE);
      setErrorMessage(null);
      setAnnotations({});
      setCurrentPage(1);
      
      // Load PDF to get info
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        if (!pdfjsLib) throw new Error("PDF Library not initialized");
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        setTotalPages(pdf.numPages);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load PDF. Please try again.");
      }
      
      event.target.value = '';
    }
  };

  // Render PDF Page
  useEffect(() => {
    const renderPage = async () => {
      if (!file || !canvasRef.current || !pdfjsLib) return;
      
      try {
        const arrayBuffer = await file.file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        const page = await pdf.getPage(currentPage);
        
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Also size the drawing canvas
        if (drawCanvasRef.current) {
            drawCanvasRef.current.width = viewport.width;
            drawCanvasRef.current.height = viewport.height;
        }

        await page.render({ canvasContext: context, viewport }).promise;
        
        // Redraw existing annotations for this page
        redrawAnnotations(currentPage - 1);
        
      } catch (err) {
        console.error("Error rendering page:", err);
      }
    };
    
    renderPage();
  }, [file, currentPage, scale]);

  // Redraw annotations on the foreground canvas
  const redrawAnnotations = (pageIndex: number) => {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const pageData = annotations[pageIndex];
      if (!pageData) return;

      // Draw Paths
      pageData.paths.forEach(path => {
          ctx.beginPath();
          ctx.strokeStyle = path.color;
          ctx.lineWidth = path.width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalAlpha = path.opacity;
          
          if (path.points.length > 0) {
              ctx.moveTo(path.points[0].x, path.points[0].y);
              path.points.forEach(p => ctx.lineTo(p.x, p.y));
          }
          ctx.stroke();
          ctx.globalAlpha = 1.0;
      });

      // Draw Texts
      pageData.texts.forEach(text => {
          ctx.font = `${text.size}px Helvetica`;
          ctx.fillStyle = text.color;
          ctx.fillText(text.text, text.x, text.y + text.size); // Adjust for canvas text baseline
      });
  };

  // Trigger redraw when annotations change
  useEffect(() => {
      redrawAnnotations(currentPage - 1);
  }, [annotations]);


  // Mouse Event Handlers for Drawing
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = drawCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      
      let clientX, clientY;
      if ('touches' in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
      } else {
          // Explicit cast to React.MouseEvent
          const mouseEvent = e as React.MouseEvent;
          clientX = mouseEvent.clientX;
          clientY = mouseEvent.clientY;
      }
      
      return {
          x: clientX - rect.left,
          y: clientY - rect.top
      };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      if (activeTool === 'text') {
          // Handle text placement
          if ('touches' in e) e.preventDefault(); // prevent scroll
          const coords = getCanvasCoords(e);
          setTextInput({ x: coords.x, y: coords.y, text: '' });
          return;
      }

      if (activeTool === 'eraser') {
          return;
      }

      setIsDrawing(true);
      const coords = getCanvasCoords(e);
      
      const newPath: AnnotationPath = {
          type: 'freehand',
          points: [coords],
          color: activeTool === 'highlighter' ? '#ffeb3b' : color,
          width: activeTool === 'highlighter' ? 20 : lineWidth,
          opacity: activeTool === 'highlighter' ? 0.4 : 1.0
      };
      setCurrentPath(newPath);
      
      // Visually start
      const ctx = drawCanvasRef.current?.getContext('2d');
      if (ctx) {
          ctx.beginPath();
          ctx.moveTo(coords.x, coords.y);
          ctx.strokeStyle = newPath.color;
          ctx.lineWidth = newPath.width;
          ctx.lineCap = 'round';
          ctx.globalAlpha = newPath.opacity;
      }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || !currentPath) return;
      if ('touches' in e) e.preventDefault(); // Prevent scrolling while drawing

      const coords = getCanvasCoords(e);
      
      // Update visual
      const ctx = drawCanvasRef.current?.getContext('2d');
      if (ctx) {
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();
      }
      
      // Update state data
      currentPath.points.push(coords);
  };

  const stopDrawing = () => {
      if (!isDrawing || !currentPath) return;
      setIsDrawing(false);
      
      const pageIndex = currentPage - 1;
      const canvas = drawCanvasRef.current;
      
      setAnnotations(prev => {
          const pageData = prev[pageIndex] || { paths: [], texts: [], viewportWidth: canvas?.width || 0, viewportHeight: canvas?.height || 0 };
          return {
              ...prev,
              [pageIndex]: {
                  ...pageData,
                  paths: [...pageData.paths, currentPath],
                  // Update viewport dimensions in case they changed (zoom)
                  viewportWidth: canvas?.width || pageData.viewportWidth,
                  viewportHeight: canvas?.height || pageData.viewportHeight
              }
          };
      });
      setCurrentPath(null);
  };

  const addTextAnnotation = () => {
      if (!textInput || !textInput.text.trim()) {
          setTextInput(null);
          return;
      }
      
      const pageIndex = currentPage - 1;
      const canvas = drawCanvasRef.current;
      
      const newText: AnnotationText = {
          type: 'text',
          x: textInput.x,
          y: textInput.y,
          text: textInput.text,
          size: 16,
          color: color
      };
      
      setAnnotations(prev => {
          const pageData = prev[pageIndex] || { paths: [], texts: [], viewportWidth: canvas?.width || 0, viewportHeight: canvas?.height || 0 };
          return {
              ...prev,
              [pageIndex]: {
                  ...pageData,
                  texts: [...pageData.texts, newText],
                  viewportWidth: canvas?.width || pageData.viewportWidth,
                  viewportHeight: canvas?.height || pageData.viewportHeight
              }
          };
      });
      setTextInput(null);
  };

  const handleSave = async () => {
      if (!file) return;
      setStatus(MergeStatus.PROCESSING);
      try {
          const pdfBytes = await saveAnnotatedPdf(file.file, annotations);
          downloadPdfBlob(pdfBytes, `edited-${file.file.name}`);
          setStatus(MergeStatus.SUCCESS);
      } catch (e) {
          console.error(e);
          setErrorMessage("Failed to save PDF");
          setStatus(MergeStatus.ERROR);
      }
  };

  const undoLast = () => {
      const pageIndex = currentPage - 1;
      setAnnotations(prev => {
          const pageData = prev[pageIndex];
          if (!pageData) return prev;
          
          // Try to remove last path, if no paths, try removing last text
          const newPaths = [...pageData.paths];
          const newTexts = [...pageData.texts];
          
          if (newPaths.length > 0) {
              newPaths.pop();
          } else if (newTexts.length > 0) {
              newTexts.pop();
          }
          
          return {
              ...prev,
              [pageIndex]: {
                  ...pageData,
                  paths: newPaths,
                  texts: newTexts
              }
          };
      });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-pink-glow-card border border-glow-100 overflow-hidden relative min-h-[600px] flex flex-col">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        
        {!file ? (
             <div className="flex-grow flex flex-col items-center justify-center p-8 md:p-12 relative z-10">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6">
                    <PenTool className="text-cyan-500 w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">PDF Editor</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">Draw, highlight, and add text to your PDF files directly in the browser.</p>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    <Upload size={20} /> Upload PDF to Edit
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="application/pdf" 
                />
             </div>
        ) : (
             <div className="flex flex-col h-full relative z-10">
                {/* Responsive Toolbar */}
                <div className="bg-white border-b border-gray-100 p-2 md:p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm z-30 sticky top-0">
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg overflow-x-auto max-w-[50%] md:max-w-none">
                        <button 
                           onClick={() => setActiveTool('pen')}
                           className={`p-2 rounded-md transition-all ${activeTool === 'pen' ? 'bg-white shadow text-cyan-600' : 'text-gray-500 hover:bg-gray-200'}`}
                           title="Pen Tool"
                        >
                            <PenTool size={20} />
                        </button>
                        <button 
                           onClick={() => setActiveTool('highlighter')}
                           className={`p-2 rounded-md transition-all ${activeTool === 'highlighter' ? 'bg-white shadow text-yellow-500' : 'text-gray-500 hover:bg-gray-200'}`}
                           title="Highlighter"
                        >
                            <Highlighter size={20} />
                        </button>
                        <button 
                           onClick={() => setActiveTool('text')}
                           className={`p-2 rounded-md transition-all ${activeTool === 'text' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:bg-gray-200'}`}
                           title="Add Text"
                        >
                            <Type size={20} />
                        </button>
                    </div>

                    {/* Style Controls */}
                    {activeTool !== 'highlighter' && activeTool !== 'eraser' && (
                        <div className="flex items-center gap-2 border-l border-r border-gray-100 px-2 md:px-4">
                            <input 
                                type="color" 
                                value={color} 
                                onChange={(e) => setColor(e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
                            />
                            {activeTool === 'pen' && (
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="10" 
                                    value={lineWidth} 
                                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                                    className="hidden md:block w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                                    title="Line Width"
                                />
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                        <button 
                            onClick={undoLast}
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Undo Last Action"
                        >
                            <Undo size={20} />
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={status === MergeStatus.PROCESSING}
                            className="flex items-center gap-2 bg-cyan-600 text-white px-3 py-2 md:px-4 rounded-lg font-medium hover:bg-cyan-700 transition-colors shadow-sm text-sm md:text-base"
                        >
                            {status === MergeStatus.PROCESSING ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            <span className="hidden sm:inline">Save</span>
                        </button>
                         <button 
                            onClick={() => setFile(null)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Editor Area with Scroll */}
                <div className="flex-grow bg-gray-100 overflow-auto flex justify-center p-4 md:p-8 relative touch-pan-x touch-pan-y">
                    <div className="relative shadow-xl" style={{ width: 'fit-content', height: 'fit-content' }}>
                        {/* Background PDF Layer */}
                        <canvas ref={canvasRef} className="bg-white block max-w-none" />
                        
                        {/* Foreground Drawing Layer */}
                        <canvas 
                            ref={drawCanvasRef}
                            className={`absolute top-0 left-0 max-w-none ${activeTool === 'text' ? 'cursor-text' : 'cursor-crosshair'} touch-none`}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />

                        {/* Text Input Overlay */}
                        {textInput && (
                            <input
                                autoFocus
                                value={textInput.text}
                                onChange={(e) => setTextInput({...textInput, text: e.target.value})}
                                onBlur={addTextAnnotation}
                                onKeyDown={(e) => e.key === 'Enter' && addTextAnnotation()}
                                style={{
                                    position: 'absolute',
                                    left: textInput.x,
                                    top: textInput.y,
                                    color: color,
                                    fontSize: '16px',
                                    fontFamily: 'Helvetica',
                                    background: 'transparent',
                                    border: '1px dashed #ccc',
                                    outline: 'none',
                                    padding: '2px',
                                    minWidth: '50px',
                                    zIndex: 50
                                }}
                                placeholder="Type..."
                            />
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="bg-white border-t border-gray-100 p-2 md:p-4 flex justify-between items-center relative z-20">
                     <div className="flex items-center gap-2 md:gap-4">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-medium text-gray-600 text-sm md:text-base">
                            Page {currentPage} / {totalPages}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                     </div>

                     <div className="flex items-center gap-2">
                        <button onClick={() => setScale(s => Math.max(0.4, s - 0.1))} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200">-</button>
                        <span className="text-xs md:text-sm w-10 md:w-12 text-center text-gray-600">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(3, s + 0.1))} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200">+</button>
                     </div>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};