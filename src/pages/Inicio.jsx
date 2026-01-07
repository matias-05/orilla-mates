import SectionInicio from '../components/SectionInicio';
import SectionProductos from '../components/SectionProductos'; 
import SectionSobre from '../components/SectionSobre';
import SectionContacto from '../components/SectionContacto';

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