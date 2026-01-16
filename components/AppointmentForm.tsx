
import React, { useState } from 'react';
// Added Loader2 to imports
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { directusService } from '../services/directus';

const AppointmentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    mensaje: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const success = await directusService.createAppointment(formData);
    if (success) {
      setStatus('success');
      setFormData({ nombre: '', email: '', telefono: '', fecha: '', mensaje: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="text-green-500" size={64} />
        </div>
        <h3 className="text-2xl font-bold text-green-800">¡Cita Solicitada!</h3>
        <p className="text-green-600">Nos pondremos en contacto contigo pronto para confirmar tu horario.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-sm font-semibold text-green-700 underline"
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nombre Completo</label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-via-red focus:outline-none transition-all"
            placeholder="Juan Perez"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Correo Electrónico</label>
          <input
            required
            type="email"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-via-red focus:outline-none transition-all"
            placeholder="juan@ejemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Teléfono</label>
          <input
            required
            type="tel"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-via-red focus:outline-none transition-all"
            placeholder="099 123 4567"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Fecha Preferida</label>
          <input
            required
            type="date"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-via-red focus:outline-none transition-all"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
          />
        </div>
        <div className="col-span-full space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">¿Cómo podemos ayudarte?</label>
          <textarea
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-via-red focus:outline-none transition-all min-h-[120px]"
            placeholder="Deseo realizarme un examen visual computarizado..."
            value={formData.mensaje}
            onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
          />
        </div>
      </div>
      
      {status === 'error' && (
        <div className="mt-4 flex items-center gap-2 text-via-red text-sm font-medium">
          <AlertCircle size={16} />
          Hubo un error al enviar. Por favor intente de nuevo.
        </div>
      )}

      <button
        disabled={status === 'submitting'}
        type="submit"
        className="mt-8 w-full bg-via-red text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all transform active:scale-[0.98] disabled:opacity-50"
      >
        {status === 'submitting' ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Send size={18} />
            Agendar Examen Visual
          </>
        )}
      </button>
    </form>
  );
};

export default AppointmentForm;
