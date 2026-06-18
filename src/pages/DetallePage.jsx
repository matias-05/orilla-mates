import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import ProdDetalle from "../components/DetallePage/ProdDetalle";
import { ArrowLeft } from "lucide-react";

export default function DetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerProducto = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "catalogo", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProducto({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("El producto no existe en la base de datos.");
          setProducto(null);
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) obtenerProducto();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F2E4C9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4A2F]"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#F2E4C9] px-4">
        <h2 className="font-belleza text-[#2F4A2F] text-3xl mb-4">
          Producto no encontrado
        </h2>
        <Link
          to="/#productos"
          className="inline-flex items-center gap-2 bg-[#2F4A2F] text-[#E8D6B3] px-8 py-4 font-bold tracking-widest uppercase hover:bg-[#1f331f] transition-colors"
        >
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#2F4A2F] h-[calc(100dvh-80px)] flex flex-col overflow-hidden">
      <div className="pt-4 px-4 sm:px-8 max-w-6xl mx-auto w-full shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#E8D6B3] hover:text-white transition-colors text-sm font-bold tracking-wider uppercase cursor-pointer"
        >
          <ArrowLeft size={16} /> Volver
        </button>
      </div>
      <ProdDetalle producto={producto} />
    </div>
  );
}
