
import { Product, Appointment } from '../types';

export const directusService = {
  async getProducts(): Promise<Product[]> {
    return [
      {
        id: "v1",
        nombre: "Clubmaster Cuenca",
        descripcion: "Estilo icónico de los años 50 rediseñado con materiales ligeros.",
        precio: 165,
        imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400",
        imagenAR: "https://i.ibb.co/L5QzX0w/glasses-overlay.png", // Usando un PNG transparente de alta calidad
        categoria: 'sol',
        marca: 'VIA ELITE'
      },
      {
        id: "v2",
        nombre: "Aviador Tomebamba",
        descripcion: "Protección clásica con marcos de metal pulido a mano.",
        precio: 180,
        imagen: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400",
        imagenAR: "https://i.ibb.co/3W6qW9z/aviator-ar.png",
        categoria: 'sol',
        marca: 'VIA HERITAGE'
      },
      {
        id: "v3",
        nombre: "Catedral Tortoise",
        descripcion: "Acabado tipo carey para un look intelectual y sofisticado.",
        precio: 145,
        imagen: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=400",
        imagenAR: "https://i.ibb.co/yYVpS6G/tortoise-ar.png",
        categoria: 'oftalmico',
        marca: 'VIA TECH'
      },
      {
        id: "v4",
        nombre: "Black Minimalist",
        descripcion: "Marcos rectangulares negros para una máxima versatilidad.",
        precio: 130,
        imagen: "https://images.unsplash.com/photo-1556103255-4443dbae8e5a?auto=format&fit=crop&q=80&w=400",
        imagenAR: "https://i.ibb.co/VqhZz7D/black-rect-ar.png",
        categoria: 'oftalmico',
        marca: 'VIA ELITE'
      }
    ];
  },

  async createAppointment(appointment: Appointment): Promise<boolean> {
    console.log('Cita enviada:', appointment);
    return true;
  }
};
