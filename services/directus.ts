
import { Product, Appointment } from '../types';

const GITHUB_USER = "joel-d-IAya";
const GITHUB_REPO = "optics_app";
const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/assets`;

export const directusService = {
  async getProducts(): Promise<Product[]> {
    return [
      {
        id: "v1",
        nombre: "Clubmaster Heritage Black",
        descripcion: "Montura icónica de los años 50 con acabados modernos en acetato negro mate.",
        precio: 165,
        imagen: `${BASE_URL}/input_file_0.png`,
        imagenAR: `${BASE_URL}/input_file_20.png`,
        categoria: 'sol',
        marca: 'VIA ELITE'
      },
      {
        id: "v2",
        nombre: "Aviador Blue Temples",
        descripcion: "Clásico estilo aviador con un toque contemporáneo en varillas azul cobalto.",
        precio: 185,
        imagen: `${BASE_URL}/input_file_1.png`,
        imagenAR: `${BASE_URL}/input_file_24.png`,
        categoria: 'sol',
        marca: 'VIA HERITAGE'
      },
      {
        id: "v3",
        nombre: "Catedral Tortoise Tech",
        descripcion: "Montura oftálmica en acabado carey, diseñada para uso prolongado frente a pantallas.",
        precio: 145,
        imagen: `${BASE_URL}/input_file_15.png`,
        imagenAR: `${BASE_URL}/input_file_30.png`,
        categoria: 'oftalmico',
        marca: 'VIA TECH'
      },
      {
        id: "v4",
        nombre: "Round Retro Gold",
        descripcion: "Diseño minimalista circular en metal dorado, ligero y resistente.",
        precio: 135,
        imagen: `${BASE_URL}/input_file_9.png`,
        imagenAR: `${BASE_URL}/input_file_21.png`,
        categoria: 'oftalmico',
        marca: 'VIA ELITE'
      },
      {
        id: "v5",
        nombre: "Modern Square Matte",
        descripcion: "Estructura rectangular robusta, ideal para rostros redondos u ovalados.",
        precio: 125,
        imagen: `${BASE_URL}/input_file_8.png`,
        imagenAR: `${BASE_URL}/input_file_28.png`,
        categoria: 'oftalmico',
        marca: 'VIA TECH'
      },
      {
        id: "v6",
        nombre: "Panto Ocean Gradient",
        descripcion: "Degradado azul translúcido con varillas de titanio ultra ligeras.",
        precio: 155,
        imagen: `${BASE_URL}/input_file_10.png`,
        imagenAR: `${BASE_URL}/input_file_22.png`,
        categoria: 'oftalmico',
        marca: 'VIA LUXE'
      }
    ];
  },

  async createAppointment(appointment: Appointment): Promise<boolean> {
    console.log('Cita registrada en sistema:', appointment);
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }
};
