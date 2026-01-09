import React, { useMemo } from 'react';
import { Payment } from '@mercadopago/sdk-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; 

export const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate(); 

  const amount = useMemo(() => {
    return Number.isFinite(total) && total > 0 ? total : null;
  }, [total]);

  const initialization = useMemo(() => {
    if (!amount) return null;

    return {
      amount,
      payer: {
        email: 'test_user_123@testuser.com',
      },
    };
  }, [amount]);

  const onSubmit = async ({ formData }) => {
    const paymentData = {
      token: formData.token,
      issuer_id: formData.issuer_id,
      payment_method_id: formData.payment_method_id,
      transaction_amount: amount,
      installments: Number(formData.installments),
      description: 'Compra en Orilla Mates',
      payer: formData.payer,
      items: cart.map(item => ({
        id: String(item.id),
        title: item.nombre,
        quantity: Number(item.cantidad),
        unit_price: Number(item.precio),
        description: item.colorSeleccionado, 
        category_id: "mates" 
      })),
    };

    try {
      const response = await fetch('https://orilla-mates-backend.onrender.com/process_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      if (result.status === 'approved') {
          const itemsComprados = cart; 
          const totalFinal = total;
          
          clearCart();
          
          navigate('/compra-exitosa', { 
              state: { 
                  paymentId: result.id,
                  items: itemsComprados,
                  total: totalFinal     
              } 
          });
      } else if (result.status === 'in_process') {
        clearCart(); 
        alert("⏳ El pago está pendiente de aprobación.");
        navigate('/');
      } else {
        alert(`⚠️ El pago fue rechazado. Motivo: ${result.status_detail}`);
      }

    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("❌ Hubo un error de conexión con el servidor.");
    }
  };

  if (!initialization) {
    return <div className="text-center p-10 font-bold">Cargando pago... (Asegurate de tener productos en el carrito)</div>;
  }

  return (
    <section className="bg-[#F2E4C9] min-h-[calc(100dvh-80px)]  flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto p-4 bg-[#2F4A2F]  shadow-md my-10 border border-gray-200">
        <h2 className="text-2xl text-center mb-6 font-medium text-[#E8D6B3] ">
          Total a pagar: ${amount}
        </h2>

      <Payment
        initialization={initialization}
        customization={{
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            mercadoPago: 'all',
          },
          visual: {
            style: {
              theme: 'default',
              
            }
          }
        }}
        onSubmit={onSubmit}
        onError={(error) => console.error('Error Brick:', error)}
        onReady={() => console.log('Payment Brick listo')}
      />
    </div>
    </section>
    
  );
};