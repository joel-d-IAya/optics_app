
import { Product, Appointment } from '../types';

// Configuración para el repositorio joel-d-IAya/optics_app
const GITHUB_USER = "joel-d-IAya";
const GITHUB_REPO = "optics_app";
const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/assets`;

export const directusService = {
  async getProducts(): Promise<Product[]> {
    return [
      {
        id: "v1",
        nombre: "Clubmaster Heritage",
        descripcion: "El clásico reinventado con acabados en acetato premium y lentes polarizados.",
        precio: 165,
        imagen: `${BASE_URL}/clubmaster.jpg`,
        imagenAR: `${BASE_URL}/clubmaster-ar.png`,
        categoria: 'sol',
        marca: 'VIA ELITE'
      },
      {
        id: "v2",
        nombre: "Aviador Tomebamba",
        descripcion: "Montura metálica ultra ligera con diseño icónico y protección UV400.",
        precio: 185,
        imagen: `${BASE_URL}/aviador.jpg`,
        imagenAR: `${BASE_URL}/aviador-ar.png`,
        categoria: 'sol',
        marca: 'VIA HERITAGE'
      },
      {
        id: "v3",
        nombre: "Catedral Tortoise",
        descripcion: "Estilo intelectual con acabado carey de alta resistencia y varillas flexibles.",
        precio: 145,
        imagen: `${BASE_URL}/carey.jpg`,
        imagenAR: `${BASE_URL}/carey-ar.png`,
        categoria: 'oftalmico',
        marca: 'VIA TECH'
      },
      {
        id: "v4",
        nombre: "Round Retro Black",
        descripcion: "Minimalismo puro en formato circular, ideal para rostros angulares.",
        precio: 135,
        imagen: `${BASE_URL}/round-black.jpg`,
        imagenAR: `${BASE_URL}/round-black-ar.png`,
        categoria: 'oftalmico',
        marca: 'VIA ELITE'
      }
    ];
  },

  async createAppointment(appointment: Appointment): Promise<boolean> {
    console.log('Cita registrada en sistema:', appointment);
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }
};
