import { useState, useEffect } from "react";
import axios from "axios";
// 🔥 Importa la URL base del backend desde el .env
const API_URL = import.meta.env.VITE_API_URL;

export default function EditarPerroModal({ token, perro, onClose, onPerroActualizado }) {
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState(0);
  const [imagenUrl, setImagenUrl] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  // Inicializa los datos del perro cuando el modal abre
  useEffect(() => {
    if (perro) {
      setNombre(perro.nombre || "");
      setRaza(perro.raza || "");
      setEdad(perro.edad || 0);
      setImagenUrl(perro.imagen_url || "");
      setDescripcion(perro.descripcion || "");
    }
  }, [perro]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosActualizados = {
      nombre,
      raza,
      edad,
      imagen_url: imagenUrl,
      descripcion,
    };

    try {
      setLoading(true);

      const res = await axios.put(
        `${API_URL}/api/perros/${perro.id}`,
        datosActualizados,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onPerroActualizado(res.data.perro); // Actualiza la lista en Perros.jsx
      setExito(true);

      setTimeout(() => {
        setExito(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar perro:", error);
      alert("Hubo un error al actualizar el perro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Editar Perro
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Raza</label>
              <input
                type="text"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Edad (años)</label>
              <input
                type="number"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block font-medium">Imagen URL</label>
              <input
                type="text"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-medium">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows="4"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 ${
                loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded`}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>

        {/* Mensaje de éxito */}
        {exito && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex justify-center items-center rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Actualizado correctamente
              </h3>
              <p className="text-gray-700">
                Los datos del perro fueron modificados.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
