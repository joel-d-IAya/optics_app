
import { Product, Appointment } from '../types';

// REEMPLAZA ESTOS VALORES con tu usuario y repo de GitHub
const GITHUB_USER = "TU_USUARIO_GITHUB";
const GITHUB_REPO = "TU_REPOSITORIO";
const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/assets`;

export const directusService = {
  async getProducts(): Promise<Product[]> {
    return [
      {
        id: "v1",
        nombre: "Clubmaster Heritage",
        descripcion: "El clásico reinventado con acabados en acetato premium.",
        precio: 165,
        imagen: `${BASE_URL}/clubmaster.jpg`,
        imagenAR: `${BASE_URL}/clubmaster-ar.png`,
        categoria: 'sol',
        marca: 'VIA ELITE'
      },
      {
        id: "v2",
        nombre: "Aviador Tomebamba",
        descripcion: "Montura metálica ultra ligera con protección UV400.",
        precio: 185,
        imagen: `${BASE_URL}/aviador.jpg`,
        imagenAR: `${BASE_URL}/aviador-ar.png`,
        categoria: 'sol',
        marca: 'VIA HERITAGE'
      },
      {
        id: "v3",
        nombre: "Catedral Tortoise",
        descripcion: "Estilo intelectual con acabado carey de alta resistencia.",
        precio: 145,
        imagen: `${BASE_URL}/carey.jpg`,
        imagenAR: `${BASE_URL}/carey-ar.png`,
        categoria: 'oftalmico',
        marca: 'VIA TECH'
      },
      {
        id: "v4",
        nombre: "Round Retro Black",
        descripcion: "Minimalismo puro en formato circular para rostros angulares.",
        precio: 135,
        imagen: `${BASE_URL}/round-black.jpg`,
        imagenAR: `${BASE_URL}/round-black-ar.png`,
        categoria: 'oftalmico',
        marca: 'VIA ELITE'
      },
      {
        id: "v5",
        nombre: "Butterfly Fashion",
        descripcion: "Diseño sobredimensionado para un look audaz y elegante.",
        precio: 195,
        imagen: `${BASE_URL}/butterfly.jpg`,
        imagenAR: `${BASE_URL}/butterfly-ar.png`,
        categoria: 'sol',
        marca: 'VIA LUXE'
      },
      {
        id: "v6",
        nombre: "Panto Blue Gradient",
        descripcion: "Degradado de azul a transparente con varillas de titanio.",
        precio: 155,
        imagen: `${BASE_URL}/panto-blue.jpg`,
        imagenAR: `${BASE_URL}/panto-blue-ar.png`,
        categoria: 'oftalmico',
        marca: 'VIA TECH'
      }
    ];
  },

  async createAppointment(appointment: Appointment): Promise<boolean> {
    // Simulación de envío a base de datos
    console.log('Cita registrada en sistema:', appointment);
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }
};
