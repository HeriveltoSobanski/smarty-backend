// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        senha
      });
      alert('Login realizado com sucesso!');
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('E-mail ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-400 to-yellow-300">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <img
          src="/logo.png"
          alt="Logo Smarty Entregas"
          className="w-32 h-32 mb-6 object-contain"
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 mb-2 font-semibold text-white bg-orange-600 rounded hover:bg-orange-700 transition"
        >
          Entrar
        </button>

        <button
          className="w-full py-2 mb-4 font-semibold text-orange-700 border border-orange-700 rounded hover:bg-orange-100 transition"
        >
          Registrar-se
        </button>

        <div className="flex flex-col items-center text-sm text-gray-700">
          <a href="#" className="mb-1 underline hover:text-orange-700">Trabalhe conosco</a>
          <a href="#" className="underline hover:text-orange-700">Esqueci minha senha</a>
        </div>
      </div>
    </div>
  );
}
