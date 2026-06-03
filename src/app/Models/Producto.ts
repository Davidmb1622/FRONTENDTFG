import {Evento} from "./Evento";
import {Talla} from "./Talla";
import {Tallanumerica} from "./Tallanumerica";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string[];
  stock: number;
  fechaCreacion: string;

  tipo: string[];
  color: string[];
  tallas: string[];
  tallasNumericas: string[]

}
