import React, { useMemo } from "react";
import { Payment } from "@mercadopago/sdk-react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export const Checkout = () => {
  const { cart = [], total = 0, clearCart } = useCart() || {};
  const navigate = useNavigate();

  const amount = useMemo(() => {
    if (typeof total !== "number" || isNaN(total) || total <= 0) return null;
    if (!cart || cart.length === 0) return null;

    return total;
  }, [total, cart]);

  const initialization = useMemo(() => {
    if (!amount) return null;
    return {
      amount: amount,
    };
  }, [amount]);

  const onSubmit = async ({ formData }) => {
    const paymentData = {
      token: formData.token,
      issuer_id: formData.issuer_id,
      payment_method_id: formData.payment_method_id,
      transaction_amount: amount,
      installments: Number(formData.installments),
      description: "Compra en Orilla Mates",
      payer: formData.payer,
      items: cart.map((item) => ({
        id: String(item.id),
        title: item.nombre,
        quantity: Number(item.cantidad),
        unit_price: Number(item.precio),
        description: item.colorSeleccionado || "Unico",
        category_id: item.categoria || "Otros",
      })),
    };

    try {
      const response = await fetch(
        "https://orilla-mates-backend.onrender.com/process_payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      if (result.status === "approved") {
        const itemsComprados = cart;
        const totalFinal = total;

        navigate("/compra-exitosa", {
          state: {
            paymentId: result.id,
            items: itemsComprados,
            total: totalFinal,
          },
        });
        clearCart();
      } else if (result.status === "in_process") {
        clearCart();
        alert("⏳ El pago está pendiente de aprobación.");
        navigate("/");
      } else {
        alert(`⚠️ El pago fue rechazado. Motivo: ${result.status_detail}`);
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("❌ Hubo un error de conexión con el servidor.");
    }
  };

  if (!initialization) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-[#F2E4C9] px-4">
        <div className="max-w-md w-full bg-[#2F4A2F] p-10 text-center shadow-2xl border border-[#E8D6B3]/20">
          <ShoppingBag
            size={48}
            className="text-[#E8D6B3] mx-auto mb-6 opacity-50"
          />
          <h2 className="font-belleza text-[#E8D6B3] text-2xl tracking-widest uppercase mb-4">
            No hay productos
          </h2>
          <p className="text-[#E8D6B3]/60 text-xs tracking-widest uppercase mb-8 leading-relaxed">
            Parece que no hay una compra activa para mostrar en este momento.
          </p>
          <Link
            to="/#productos"
            className="inline-flex items-center gap-2 bg-[#E8D6B3] text-[#2F4A2F] px-8 py-4 font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-colors"
          >
            <ArrowLeft size={14} /> Volver al inicio
          </Link>
        </div>
      </div>
    );
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
              creditCard: "all",
              debitCard: "all",
              mercadoPago: "all",
            },
            visual: {
              style: {
                theme: "default",
              },
            },
          }}
          onSubmit={onSubmit}
          onError={(error) => console.error("Error Brick:", error)}
          onReady={() => console.log("Payment Brick listo")}
        />
      </div>
    </section>
  );
};
