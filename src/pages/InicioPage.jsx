import SectionInicio from '../components/InicioPage/SectionInicio';
import SectionProductos from '../components/InicioPage/SectionProductos'; 
import SectionSobre from '../components/InicioPage/SectionSobre';
import SectionContacto from '../components/InicioPage/SectionContacto';

export default function Inicio() {
  return (
    <div className="font-quicksand">
      <SectionInicio />
      <SectionProductos />
      <SectionSobre />
      <SectionContacto />
    </div>
  
  );
}