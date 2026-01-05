import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Mates from './pages/Mates';
function App() {
  return (
    <div className="min-h-screen bg-[#fcf9f5]"> 
      <Navbar/>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="productos/mates" element={<Mates />} />
      </Routes>
    </div>
  )
}

export default App;
