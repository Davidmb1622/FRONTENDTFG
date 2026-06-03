import { CarritoItem } from './CarritoItem';

export interface Carrito {
  id: number;
  usuarioId: number;
  items: CarritoItem[];
}
