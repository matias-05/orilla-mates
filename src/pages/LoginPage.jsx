import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError("Credenciales incorrectas. Verifica el acceso.");
    }
  };

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-[#F2E4C9] flex items-center justify-center p-6 font-quicksand">
      <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo-orilla.webp" alt="Logo" className="w-24 h-24 mx-auto mb-4 object-contain" />
          <h1 className="font-belleza text-3xl text-[#2F4A2F]">Acceso Admin</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#2F4A2F]/50 font-bold">Orilla Mates Paraná</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-[#2F4A2F]/30" size={18} />
            <input 
              type="email" placeholder="Email" required
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#2F4A2F]/10 outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-[#2F4A2F]/30" size={18} />
            <input 
              type="password" placeholder="Contraseña" required
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#2F4A2F]/10 outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center font-bold uppercase">{error}</p>}
          <button className="w-full bg-[#2F4A2F] text-[#F2E4C9] py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#8B5E3C] transition-all">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}