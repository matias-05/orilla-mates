import CarritoVacio from '../components/CarritoPage/CarritoVacio';
import CarritoLleno from '../components/CarritoPage/CarritoLleno';
import { useCart } from '../context/CartContext';

export default function Carrito() {
  const { cart } = useCart();

  if (cart.length === 0) {
    return (
      <CarritoVacio />
    );
  }

  return (
    <CarritoLleno />
  );
  
}