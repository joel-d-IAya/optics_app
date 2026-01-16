
import React, { useEffect, useState, useMemo } from 'react';
import { Eye, ShieldCheck, Zap, ArrowRight, Instagram, Facebook, MapPin, Phone, Calendar, Wand2, Sparkles, Search, Filter } from 'lucide-react';
import Navbar from './components/Navbar';
import AROverlay from './components/AROverlay';
import AppointmentForm from './components/AppointmentForm';
import GeminiAssistant from './components/GeminiAssistant';
import MagicStudio from './components/MagicStudio';
import { directusService } from './services/directus';
import { Product } from './types';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'Todos' | 'oftalmico' | 'sol'>('Todos');

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await directusService.getProducts();
      setProducts(data);
      if (data.length > 0) setSelectedProduct(data[0]);
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => categoryFilter === 'Todos' || p.categoria === categoryFilter);
  }, [products, categoryFilter]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <GeminiAssistant />
      
      {editingProduct && (
        <MagicStudio product={editingProduct} onClose={() => setEditingProduct(null)} />
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556103255-4443dbae8e5a?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20"
            alt="Fondo"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-white" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-[10px] font-black tracking-[0.4em] text-via-red uppercase bg-red-50 rounded-full border border-red-100">
            <Sparkles size={12} />
            Probador Virtual 2.5
          </span>
          <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter mb-8 leading-[0.8] text-black">
            Mira el <br/><span className="text-via-red">Futuro</span>.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-xl mx-auto font-medium">
            Personaliza tu salud visual con inteligencia artificial y tecnología AR de última generación.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#probador" className="w-full sm:w-auto px-12 py-5 bg-via-red text-white rounded-2xl font-black hover:bg-black transition-all shadow-[0_20px_40px_rgba(227,6,19,0.3)] flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
              Iniciar Probador
              <Eye size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Virtual Try-On Section */}
      <section id="probador" className="py-24 bg-[#0a0a0a] text-white scroll-mt-20 rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 xl:col-span-5">
              {/* Se pasa la imagenAR para el dibujo en el canvas */}
              <AROverlay glassesImageUrl={selectedProduct?.imagenAR || selectedProduct?.imagen || ""} />
            </div>
            
            <div className="lg:col-span-6 xl:col-span-7 space-y-12">
              <div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Prueba tu <br/><span className="text-via-red italic">Nuevo Look.</span></h2>
                <p className="text-gray-500 text-lg leading-relaxed max-w-md">
                  Selecciona una montura y mírate en tiempo real. Captura tu foto y recibe asesoría inmediata por IA.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`group flex flex-col gap-3 p-4 rounded-3xl border transition-all text-left ${selectedProduct?.id === p.id ? 'border-via-red bg-via-red/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white/5">
                      <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs tracking-tight">{p.nombre}</h4>
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{p.marca}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="productos" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-black uppercase">Catálogo <span className="text-via-red">Elite</span></h2>
              <p className="text-gray-500 text-lg">Modelos exclusivos disponibles hoy en nuestra sede de Cuenca.</p>
            </div>
            <div className="flex bg-gray-50 p-2 rounded-2xl border border-gray-100">
              {(['Todos', 'oftalmico', 'sol'] as const).map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-via-red text-white shadow-xl' : 'text-gray-400'}`}
                >
                  {cat === 'oftalmico' ? 'Médicos' : cat === 'sol' ? 'Sol' : 'Todos'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="group flex flex-col bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img src={p.imagen} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                    <button onClick={() => { setSelectedProduct(p); window.scrollTo({top: document.getElementById('probador')?.offsetTop, behavior: 'smooth'}); }} className="bg-white p-4 rounded-2xl text-black hover:bg-via-red hover:text-white transition-all shadow-xl"><Eye size={20}/></button>
                    <button onClick={() => setEditingProduct(p)} className="bg-via-red p-4 rounded-2xl text-white hover:bg-black transition-all shadow-xl"><Wand2 size={20}/></button>
                  </div>
                </div>
                <div className="p-8">
                  <span className="text-[9px] font-black text-via-red uppercase tracking-[0.25em] mb-2 block">{p.marca}</span>
                  <h3 className="text-lg font-bold mb-4 tracking-tight text-black">{p.nombre}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-black">${p.precio}</span>
                    <a href="#citas" className="bg-black text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Reservar</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="citas" className="py-32 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-6xl font-black tracking-tighter leading-[0.9] text-black">Atención <br/><span className="text-via-red italic tracking-normal">Premium.</span></h2>
              <p className="text-lg text-gray-500 font-medium">Equipos de diagnóstico alemanes y asesoría personalizada para su salud visual.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="bg-red-50 p-4 rounded-2xl text-via-red"><MapPin size={24}/></div>
                  <div>
                    <h4 className="font-bold text-black text-sm uppercase tracking-wide">Cuenca, Ecuador</h4>
                    <p className="text-xs text-gray-400 mt-1">Av. Remigio Crespo Toral y Solano</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="bg-red-50 p-4 rounded-2xl text-via-red"><Phone size={24}/></div>
                  <div>
                    <h4 className="font-bold text-black text-sm uppercase tracking-wide">WhatsApp Directo</h4>
                    <p className="text-xs text-gray-400 mt-1">+593 99 876 5432</p>
                  </div>
                </div>
              </div>
            </div>
            <AppointmentForm />
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black tracking-tighter mb-12">VIA OPTIC'S</h2>
          <div className="flex justify-center gap-8 mb-16 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <a href="#" className="hover:text-via-red transition-all">Instagram</a>
            <a href="#" className="hover:text-via-red transition-all">Facebook</a>
            <a href="#" className="hover:text-via-red transition-all">Soporte</a>
          </div>
          <p className="text-[9px] text-gray-700 font-black tracking-[0.5em] uppercase">Excelencia Visual • 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
