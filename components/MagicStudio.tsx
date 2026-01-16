
import React, { useState } from 'react';
import { Wand2, X, Download, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { geminiService } from '../services/gemini';
import { Product } from '../types';

interface MagicStudioProps {
  product: Product;
  onClose: () => void;
}

const MagicStudio: React.FC<MagicStudioProps> = ({ product, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [currentImage, setCurrentImage] = useState(product.imagen);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>([product.imagen]);

  const handleApply = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    
    // Convert current image to base64 if it's a URL
    // For MVP, we assume we can fetch it or it's provided. 
    // In a real app, you'd need to handle CORS if fetching remote URLs.
    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64: string = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const edited = await geminiService.editImage(base64, prompt);
      if (edited) {
        setCurrentImage(edited);
        setHistory(prev => [...prev, edited]);
        setPrompt('');
      }
    } catch (error) {
      console.error("Magic Studio Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto shadow-2xl">
        {/* Left: Preview */}
        <div className="flex-1 bg-gray-50 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black">Magic <span className="text-via-red">Studio</span></h3>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = currentImage;
                  link.download = `via-optics-${product.nombre}-ai.png`;
                  link.click();
                }}
                className="p-3 bg-white border rounded-full hover:bg-gray-100 transition-all"
              >
                <Download size={20} />
              </button>
              <button onClick={onClose} className="p-3 bg-white border rounded-full hover:bg-gray-100 transition-all">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="relative flex-1 bg-white rounded-3xl overflow-hidden shadow-inner border flex items-center justify-center">
            <img 
              src={currentImage} 
              alt="Preview" 
              className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${isProcessing ? 'opacity-30' : 'opacity-100'}`} 
            />
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-[2px]">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-via-red/20 border-t-via-red rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-via-red animate-pulse" size={32} />
                </div>
                <p className="font-bold text-via-red animate-pulse">Gemini está recreando tu visión...</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {history.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentImage(img)}
                className={`w-16 h-16 rounded-xl border-2 flex-shrink-0 overflow-hidden transition-all ${currentImage === img ? 'border-via-red scale-105 shadow-md' : 'border-transparent opacity-50'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full md:w-80 p-8 bg-gray-900 text-white flex flex-col">
          <div className="flex-1">
            <span className="text-xs font-bold text-via-red uppercase tracking-widest mb-2 block">IA Creativa</span>
            <h4 className="text-xl font-bold mb-4">Personaliza con IA</h4>
            <p className="text-sm text-gray-400 mb-8">Escribe lo que quieres cambiar. Prueba: "Añade un filtro retro", "Ponle un fondo de Cuenca", o "Cambia el color a rojo".</p>
            
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Tu instrucción</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Añade un estilo minimalista..."
                className="w-full bg-white/10 border-white/20 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-via-red border-none min-h-[120px]"
              />
              <div className="flex flex-wrap gap-2">
                {["Filtro Retro", "Fondo Urbano", "Luz Natural"].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setPrompt(s)}
                    className="text-[10px] bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            disabled={isProcessing || !prompt.trim()}
            onClick={handleApply}
            className="w-full bg-via-red text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-via-red transition-all mt-8 disabled:opacity-30"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
            Aplicar Magia IA
          </button>
        </div>
      </div>
    </div>
  );
};

export default MagicStudio;
