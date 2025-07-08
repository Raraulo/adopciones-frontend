import { useState } from "react";
import axios from "axios";
// 🔥 Importa la URL base del backend desde el .env
const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterModal({ onClose, onRegisterSuccess }) {
  const [form, setForm] = useState({
    nombre_completo: "",
    correo: "",
    cedula: "",
    sexo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/users/register`,
        form
      );
      alert("✅ Usuario creado exitosamente");
      onRegisterSuccess(res.data.usuario);
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Error al crear usuario");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Cuenta</h2>
        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            name="nombre_completo"
            placeholder="Nombre completo"
            value={form.nombre_completo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="cedula"
            placeholder="Cédula"
            value={form.cedula}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Selecciona tu sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repite la contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Botón Crear Cuenta */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 rounded"
          >
            Crear Cuenta
          </button>

          {/* Botón Cancelar */}
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded mt-2"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
