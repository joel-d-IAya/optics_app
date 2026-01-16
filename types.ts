
export interface Product {
  id: string | number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  imagenAR?: string; // PNG transparente para el probador
  categoria: 'oftalmico' | 'sol';
  marca: string;
}

export interface Appointment {
  nombre: string;
  email: string;
  telefono: string;
  fecha: string;
  mensaje: string;
}

export interface Landmark {
  x: number;
  y: number;
  z: number;
}
