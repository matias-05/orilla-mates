import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import PaginaProductos from './pages/ProductosPage';

function App() {
  return (
    <div className="min-h-screen bg-[#fcf9f5]"> 
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos/:categoria" element={<PaginaProductos />} />
      </Routes>
    </div>
  )
}

export default App;
