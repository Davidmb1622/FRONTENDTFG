import {EstadoReserva} from "./EstadoReserva";

export interface Reserva {
  id: number;
  fechaHora: string;
  comentarios: string;
  estado: EstadoReserva;
  usuarioId: number;
  empleadoId: number;
  productoId: number;
  talla: string;

}
