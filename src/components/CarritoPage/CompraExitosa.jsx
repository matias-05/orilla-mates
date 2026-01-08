import { Link, useLocation } from 'react-router-dom';

const CompraExitosa = () => {
  const location = useLocation();
  const { paymentId } = location.state || { paymentId: 'desconocido' };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fcf9f5] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 relative overflow-hidden">
        

        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-[#2F4A2F]"></div>


        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6 animate-bounce-slow">
          <svg className="h-12 w-12 text-[#2F4A2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-[#2F4A2F] mb-3 font-serif">¡Pago Exitoso!</h2>
        <p className="text-gray-600 mb-8 font-sans">
          Muchas gracias por tu compra. Ya estamos preparando tus mates para el envío.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-100">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Código de Operación</p>
          <p className="text-lg font-mono font-medium text-gray-800 select-all">
            {paymentId}
          </p>
        </div>

        <div className="space-y-3">
          <Link 
            to="/" 
            className="block w-full bg-[#2F4A2F] hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md transform hover:-translate-y-0.5"
          >
            Volver a la Tienda
          </Link>
        
        </div>

      </div>
    </div>
  );
};

export default CompraExitosa;