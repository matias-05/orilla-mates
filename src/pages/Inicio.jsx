import SectionInicio from '../components/SectionInicio';
import SectionProducotos from '../components/SectionProductos';
import SectionSobre from '../components/SectionSobre';
import SectionContacto from '../components/SectionContacto';
export default function Inicio() {
  return (
    <div>
        <SectionInicio />
        <SectionProducotos />
        <SectionSobre />
        <SectionContacto />
    </div>
  );
}