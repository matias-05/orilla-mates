import { Link } from 'react-router-dom';
import SectionInicio from '../components/SectionInicio';
import SectionProducotos from '../components/SectionProductos';
export default function Inicio() {
  return (
    <div>
        <SectionInicio />
        <SectionProducotos />
    </div>
  );
}