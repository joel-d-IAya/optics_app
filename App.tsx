
import React, { useEffect, useState, useMemo } from 'react';
import { Eye, ShieldCheck, Zap, ArrowRight, Instagram, Facebook, MapPin, Phone, Calendar, Wand2, Sparkles, Search, Filter, ShoppingBag } from 'lucide-react';
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await directusService.getProducts();
        setProducts(data);
        if (data.length > 0) setSelectedProduct(data[0]);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => categoryFilter === 'Todos' || p.categoria === categoryFilter);
  }, [products, categoryFilter]);

  if (isInitialLoading) {
    return (
      <div className="h-screen w-full bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-via-red/20 border-t-via-red rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Via Optic's Cuenca</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <GeminiAssistant />
      
      {editingProduct && (
        <MagicStudio product={editingProduct} onClose={() => setEditingProduct(null)} />
      )}

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556103255-4443dbae8e5a?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-10"
            alt="Fondo"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 mb-10 text-[9px] font-black tracking-[0.4em] text-via-red uppercase bg-red-50 rounded-full border border-red-100 animate-bounce">
            <Sparkles size={12} />
            Nueva Colección 2025
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-10 leading-[0.8] text-black">
            Tu mirada, <br/><span className="text-via-red">nuestro arte.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-14 max-w-xl mx-auto font-medium leading-relaxed">
            Fusionamos la calidez de Cuenca con la tecnología visual más avanzada del mundo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#probador" className="w-full sm:w-auto px-14 py-6 bg-via-red text-white rounded-2xl font-black hover:bg-black transition-all shadow-[0_20px_50px_rgba(227,6,19,0.3)] flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest active:scale-95">
              Probador Virtual
              <Eye size={20} />
            </a>
            <a href="#productos" className="w-full sm:w-auto px-14 py-6 bg-black text-white rounded-2xl font-black hover:bg-via-red transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest active:scale-95">
              Ver Catálogo
              <ShoppingBag size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Virtual Try-On Section */}
      <section id="probador" className="py-32 bg-[#080808] text-white scroll-mt-20 rounded-t-[5rem] shadow-[-20px_-20px_80px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-6 xl:col-span-5 relative">
              <div className="absolute -inset-10 bg-via-red/10 blur-[100px] rounded-full" />
              <AROverlay glassesImageUrl={selectedProduct?.imagenAR || selectedProduct?.imagen || ""} />
            </div>
            
            <div className="lg:col-span-6 xl:col-span-7 space-y-14 relative">
              <div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">Espejo <br/><span className="text-via-red italic">Inteligente.</span></h2>
                <p className="text-gray-400 text-xl leading-relaxed max-w-lg font-medium">
                  Nuestro probador utiliza Face Mesh 3D para un ajuste perfecto. Prueba cada modelo desde la comodidad de tu casa.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`group relative flex flex-col gap-4 p-5 rounded-[2.5rem] border transition-all text-left overflow-hidden ${selectedProduct?.id === p.id ? 'border-via-red bg-via-red/10 ring-1 ring-via-red' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className="aspect-square w-full rounded-[1.5rem] overflow-hidden bg-white/5">
                      <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[11px] tracking-tight leading-none text-white/90">{p.nombre}</h4>
                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">{p.marca}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="productos" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
            <div className="max-w-2xl">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-black uppercase">Via <span className="text-via-red">Collection</span></h2>
              <p className="text-gray-400 text-xl font-medium">Curaduría de marcas globales y diseños propios inspirados en el Tomebamba.</p>
            </div>
            <div className="flex bg-gray-50 p-2.5 rounded-[2rem] border border-gray-100 self-start lg:self-auto">
              {(['Todos', 'oftalmico', 'sol'] as const).map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-via-red text-white shadow-xl shadow-via-red/20' : 'text-gray-400 hover:text-black'}`}
                >
                  {cat === 'oftalmico' ? 'Médicos' : cat === 'sol' ? 'Sol' : 'Todos'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((p) => (
              <div key={p.id} className="group flex flex-col bg-white rounded-[3rem] border border-gray-100 overflow-hidden hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-700">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                  <img src={p.imagen} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                    <button onClick={() => { setSelectedProduct(p); document.getElementById('probador')?.scrollIntoView({behavior: 'smooth'}); }} className="bg-white p-5 rounded-3xl text-black hover:bg-via-red hover:text-white transition-all transform hover:scale-110 shadow-2xl"><Eye size={24}/></button>
                    <button onClick={() => setEditingProduct(p)} className="bg-via-red p-5 rounded-3xl text-white hover:bg-black transition-all transform hover:scale-110 shadow-2xl"><Wand2 size={24}/></button>
                  </div>
                </div>
                <div className="p-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-black text-via-red uppercase tracking-[0.3em] mb-2 block">{p.marca}</span>
                      <h3 className="text-2xl font-bold tracking-tight text-black">{p.nombre}</h3>
                    </div>
                    <span className="text-2xl font-black text-black tracking-tighter">${p.precio}</span>
                  </div>
                  <button 
                    onClick={() => document.getElementById('citas')?.scrollIntoView({behavior: 'smooth'})}
                    className="w-full py-5 border-2 border-black text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95"
                  >
                    Agendar Prueba
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="citas" className="py-40 bg-gray-50 scroll-mt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-14">
              <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.85] text-black">Visión <br/><span className="text-via-red italic tracking-normal">Elite.</span></h2>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">Reserva un espacio con nuestros especialistas y vive la experiencia Via Optic's en el corazón de Cuenca.</p>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center gap-8 p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-105">
                  <div className="bg-red-50 p-5 rounded-2xl text-via-red"><MapPin size={28}/></div>
                  <div>
                    <h4 className="font-black text-black text-xs uppercase tracking-widest">Ubicación</h4>
                    <p className="text-sm text-gray-400 mt-2 font-medium">Av. Remigio Crespo y Agustín Cueva</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-105">
                  <div className="bg-red-50 p-5 rounded-2xl text-via-red"><Phone size={28}/></div>
                  <div>
                    <h4 className="font-black text-black text-xs uppercase tracking-widest">Atención Directa</h4>
                    <p className="text-sm text-gray-400 mt-2 font-medium">(07) 288-4532 / 099 123 4567</p>
                  </div>
                </div>
              </div>
            </div>
            <AppointmentForm />
          </div>
        </div>
      </section>

      <footer className="bg-black text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-16">
              <h2 className="text-4xl font-black tracking-tighter mb-4">VIA OPTIC'S</h2>
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em]">La mejor óptica de Cuenca</p>
            </div>
            <div className="flex justify-center gap-12 mb-20">
              <a href="#" className="p-4 bg-white/5 rounded-2xl hover:bg-via-red hover:text-white transition-all"><Instagram size={20}/></a>
              <a href="#" className="p-4 bg-white/5 rounded-2xl hover:bg-via-red hover:text-white transition-all"><Facebook size={20}/></a>
            </div>
            <div className="w-full h-px bg-white/10 mb-16" />
            <div className="flex flex-col md:flex-row justify-between w-full gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
              <p>© 2025 VIA OPTIC'S CUENCA. TODOS LOS DERECHOS RESERVADOS.</p>
              <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                <a href="#" className="hover:text-white transition-colors">Términos</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
