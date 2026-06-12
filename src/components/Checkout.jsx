import React, { useState, useEffect, useMemo } from "react";
import { Payment } from "@mercadopago/sdk-react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export const Checkout = () => {
  const { cart = [], total = 0, clearCart } = useCart() || {};
  const navigate = useNavigate();
  const location = useLocation();

  const { metodoEntrega = "retiro", direccion = "" } = location.state || {};

  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    const createPreference = async () => {
      if (!cart || cart.length === 0) return;

      try {
        const response = await fetch(
          "https://orilla-mates-backend.onrender.com/create_preference",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cart.map((item) => ({
                id: String(item.id),
                title: item.nombre,
                quantity: Number(item.cantidad),
                unit_price: Number(item.precio),
              })),
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPreferenceId(data.id);
      } catch (error) {
        console.error("Error al obtener preferenceId:", error);
      }
    };

    createPreference();
  }, [cart]);

  const initialization = useMemo(() => {
    if (!preferenceId || !total) return null;
    return {
      amount: total,
      preferenceId: preferenceId,
    };
  }, [preferenceId, total]);

  const onSubmit = async ({ formData }) => {
    if (!formData || !formData.payment_method_id) {
      console.log("Pago iniciado a través de Wallet. Esperando redirección...");
      return;
    }

    const paymentData = {
      token: formData.token,
      issuer_id: formData.issuer_id,
      payment_method_id: formData.payment_method_id,
      transaction_amount: total,
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
        },
      );

      const result = await response.json();

      if (result.status === "approved") {
        navigate("/compra-exitosa", {
          state: {
            paymentId: result.id,
            items: cart,
            total: total,
            esEfectivo: false,
            metodoEntrega: metodoEntrega,
            direccion: direccion,
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
        {cart.length === 0 ? (
          <div className="max-w-md w-full bg-[#2F4A2F] p-10 text-center shadow-2xl border border-[#E8D6B3]/20">
            <ShoppingBag
              size={48}
              className="text-[#E8D6B3] mx-auto mb-6 opacity-50"
            />
            <h2 className="font-belleza text-[#E8D6B3] text-2xl tracking-widest uppercase mb-4">
              No hay productos
            </h2>
            <Link
              to="/#productos"
              className="inline-flex items-center gap-2 bg-[#E8D6B3] text-[#2F4A2F] px-8 py-4 font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-colors"
            >
              <ArrowLeft size={14} /> Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 text-center max-w-sm">
            <div className="relative flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2F4A2F]"></div>
            </div>

            <div className="space-y-2 animate-pulse">
              <p className="font-belleza font-bold text-[#2F4A2F] text-xl tracking-widest ">
                Espere, se están procesando los datos.
              </p>
              <p className="font-quicksand text-[#2F4A2F]/60  italic">
                (Esto puede llevar unos segundos, no salga del navegador.)
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="bg-[#F2E4C9] min-h-[calc(100dvh-80px)] flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto p-4 bg-[#2F4A2F] shadow-md my-10 border border-gray-200">
        <h2 className="text-2xl text-center mb-6 font-medium text-[#E8D6B3] ">
          Total a pagar: ${total?.toLocaleString("es-AR")}
        </h2>
        <Payment
          initialization={initialization}
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              mercadoPago: "all",
            },
            visual: { style: { theme: "default" } },
          }}
          onSubmit={onSubmit}
          onError={(error) => console.error("Error Brick:", error)}
        />
      </div>
    </section>
  );
};
