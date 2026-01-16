
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, MapPin, Search, Loader2, ExternalLink } from 'lucide-react';
import { geminiService } from '../services/gemini';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, sources?: any[] }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (type: 'search' | 'maps' = 'search') => {
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    let response;
    if (type === 'maps') {
      // Try to get location
      let lat, lng;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (e) {
        console.log("Location denied, using default");
      }
      response = await geminiService.findNearby(userMsg, lat, lng);
    } else {
      response = await geminiService.chatWithSearch(userMsg);
    }

    setMessages(prev => [...prev, { 
      role: 'ai', 
      content: response.text || "No obtuve respuesta.", 
      sources: response.sources 
    }]);
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-via-red text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-4 border-white"
      >
        <Sparkles size={28} />
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-[60] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 bg-via-red text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <h3 className="font-bold">Consultor Visual IA</h3>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={24} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-via-red">
                  <Sparkles size={32} />
                </div>
                <p className="text-sm text-gray-500 px-8">
                  Hola, soy tu asistente de Via Optic's. Pregúntame sobre tendencias, ubicaciones o salud visual.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => setQuery('¿Cuáles son las tendencias en lentes para 2025?')} className="text-xs bg-white border px-3 py-2 rounded-lg hover:border-via-red transition-all">Tendencias 2025</button>
                  <button onClick={() => setQuery('Ópticas Via Optic\'s cerca de mí')} className="text-xs bg-white border px-3 py-2 rounded-lg hover:border-via-red transition-all">Tiendas cercanas</button>
                </div>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-via-red text-white' : 'bg-white border shadow-sm'}`}>
                  {m.content}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                      {m.sources.map((s: any, idx: number) => (
                        s.web && (
                          <a key={idx} href={s.web.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] bg-gray-100 px-2 py-1 rounded text-via-red hover:underline">
                            <ExternalLink size={10} /> {s.web.title?.substring(0, 15)}...
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border p-4 rounded-2xl flex items-center gap-2">
                  <Loader2 className="animate-spin text-via-red" size={16} />
                  <span className="text-xs text-gray-500 italic font-medium">Gemini está pensando...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <div className="relative mb-2">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe tu consulta..."
                className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-via-red resize-none text-sm"
                rows={2}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <button 
                onClick={() => handleSend('search')}
                className="absolute right-3 bottom-3 text-via-red hover:scale-110 transition-transform"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleSend('search')} className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-bold uppercase tracking-wider bg-gray-900 text-white rounded-xl hover:bg-via-red transition-all">
                <Search size={12} /> Búsqueda Google
              </button>
              <button onClick={() => handleSend('maps')} className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-bold uppercase tracking-wider bg-gray-900 text-white rounded-xl hover:bg-via-red transition-all">
                <MapPin size={12} /> Google Maps
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;
