import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import DetallePage from "./pages/DetallePage";

const Inicio = lazy(() => import("./pages/InicioPage"));
const PaginaProductos = lazy(() => import("./pages/ProductosPage"));
const CarritoPage = lazy(() => import("./pages/CarritoPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const Checkout = lazy(() =>
  import("./components/Checkout").then((module) => ({
    default: module.Checkout,
  })),
);
const CompraExitosa = lazy(
  () => import("./components/CarritoPage/CompraExitosa"),
);
const PageLoader = () => (
  <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#fcf9f5]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F4A2F]"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "0px",
              border: "1px solid #E8D6B3",
              backgroundColor: "#2F4A2F",
              color: "#E8D6B3",
              fontFamily: "Quicksand, sans-serif",
            },
            className: "my-toast-class",
          }}
        />
        <div className="min-h-screen bg-[#fcf9f5]">
          <Navbar />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route
                path="/productos/:categoria"
                element={<PaginaProductos />}
              />
              <Route path="/producto/:id" element={<DetallePage />} />
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
          </Suspense>
        </div>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
