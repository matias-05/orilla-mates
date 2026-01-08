import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/InicioPage';
import PaginaProductos from './pages/ProductosPage';
import CarritoPage from './pages/CarritoPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Checkout } from './components/Checkout';
import { CartProvider } from './context/CartContext';
import CompraExitosa from './components/CarritoPage/CompraExitosa';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#fcf9f5]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos/:categoria" element={<PaginaProductos />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa" element={<CompraExitosa />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
