import { useState } from "react";
import axios from "axios";

// 🔥 Importa la URL base del backend desde el .env
const API_URL = import.meta.env.VITE_API_URL;

export default function CrearPerroModal({
  token,
  onClose,
  onPerroCreado,
  perroEditar,
  onPerroActualizado,
}) {
  const [nombre, setNombre] = useState(perroEditar ? perroEditar.nombre : "");
  const [raza, setRaza] = useState(perroEditar ? perroEditar.raza : "");
  const [edad, setEdad] = useState(perroEditar ? perroEditar.edad : "");
  const [imagenUrl, setImagenUrl] = useState(perroEditar ? perroEditar.imagen_url : "");
  const [descripcion, setDescripcion] = useState(perroEditar ? perroEditar.descripcion : "");
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoPerro = {
      nombre,
      raza,
      edad,
      imagen_url: imagenUrl,
      descripcion,
    };

    try {
      setLoading(true);
      if (perroEditar) {
        // 🔄 Editar perro
        const res = await axios.put(
          `${API_URL}/api/perros/${perroEditar.id}`,
          nuevoPerro,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (onPerroActualizado) {
          onPerroActualizado(res.data.perro);
        }
        setExito(true);
      } else {
        // 🆕 Crear perro
        const res = await axios.post(`${API_URL}/api/perros`, nuevoPerro, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (onPerroCreado) {
          onPerroCreado(res.data.perro);
        }
        setExito(true);
      }

      setTimeout(() => {
        setExito(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error al guardar perro:", error);
      alert("❌ Hubo un error al guardar el perro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          {perroEditar ? "Editar Perro" : "Crear Nuevo Perro"}
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
                loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
              } text-white rounded`}
            >
              {loading ? "Guardando..." : perroEditar ? "Guardar Cambios" : "Crear Perro"}
            </button>
          </div>
        </form>

        {/* Éxito */}
        {exito && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex justify-center items-center rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-2">¡Guardado correctamente!</h3>
              <p className="text-gray-700">
                El perro ha sido {perroEditar ? "actualizado" : "creado"}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
