import { useState } from "react";
import axios from "axios";

// 🔥 URL base del backend
const API_URL = import.meta.env.VITE_API_URL;

export default function LoginModal({ onClose, onLoginSuccess, onShowRegister }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ✅ Usa variable de entorno
      const res = await axios.post(`${API_URL}/users/login`, {
        correo,
        password,
      });
      alert("✅ Inicio de sesión exitoso");
      onLoginSuccess(res.data.usuario, res.data.token);
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 rounded"
          >
            Ingresar
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => {
              onClose();
              onShowRegister();
            }}
            className="text-blue-600 underline"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}
