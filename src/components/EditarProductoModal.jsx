import { useState, useEffect } from "react";
import axios from "axios";
// 🔥 Importa la URL base del backend desde el .env
const API_URL = import.meta.env.VITE_API_URL;

export default function EditarProductoModal({ token, producto, onClose, onProductoActualizado }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen_url: "",
  });
  const [loading, setLoading] = useState(false);

  // Cargar datos del producto en el formulario
  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        imagen_url: producto.imagen_url,
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/productos/${producto.id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Producto actualizado correctamente");
      onProductoActualizado(res.data.producto);
      onClose();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("❌ No se pudo actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  if (!producto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="3"
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={form.precio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="imagen_url"
            placeholder="URL de la imagen"
            value={form.imagen_url}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
