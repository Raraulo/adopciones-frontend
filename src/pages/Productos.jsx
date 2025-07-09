import { useEffect, useState } from "react";
import axios from "axios";
import CrearProductoModal from "../components/CrearProductoModal";
import EditarProductoModal from "../components/EditarProductoModal";

export default function Productos({ esAdmin, token, usuario, onAgregarCarrito }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
// 🔥 Importa la URL base del backend desde el .env
const API_URL = import.meta.env.VITE_API_URL;

  // 🔥 Cargar productos desde el backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos`);
        setProductos(res.data.productos); // Ajusta según la respuesta de tu API
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // ✅ Función para eliminar producto (solo admin)
  const eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await axios.delete(`${API_URL}/api/productos/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},

      });
      setProductos(productos.filter((p) => p.id !== id));
      alert("✅ Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("❌ No se pudo eliminar el producto");
    }
  };

  // 🔄 Mostrar mientras carga
  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Cargando productos...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Productos</h1>

      {/* Botón crear producto (solo admin) */}
      {esAdmin && (
        <div className="mb-6">
          <button
            onClick={() => setShowCrearModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Crear Producto
          </button>
        </div>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
          <img
  src={producto.imagen_url}
  alt={producto.nombre}
  className="w-full h-48 object-cover rounded mb-3"
/>
<h2 className="text-xl font-bold text-gray-800 mb-2">
  {producto.nombre}
</h2>

            <p className="text-gray-600 mb-2">
          Precio: ${Number(producto.precio).toFixed(2)}

            </p>
            <p
              className={`mb-4 ${
                producto.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {producto.stock > 0 ? "En stock" : "Agotado"}
            </p>

            {/* Botones según el rol */}
            {esAdmin ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setProductoActual(producto);
                    setShowEditarModal(true);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarProducto(producto.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!usuario) {
                    alert("⚠️ Debes iniciar sesión para añadir al carrito");
                    // Puedes redirigir al login aquí, si usas react-router-dom
                    // navigate("/login");
                  } else {
                    onAgregarCarrito(producto);
                  }
                }}
                className={`w-full px-3 py-2 rounded text-white ${
                  producto.stock > 0
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={producto.stock === 0}
              >
                {producto.stock > 0 ? "Añadir al carrito" : "No disponible"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal para crear producto */}
      {showCrearModal && (
        <CrearProductoModal
          token={token}
          onClose={() => setShowCrearModal(false)}
          onProductoCreado={(nuevoProducto) => {
            setProductos([nuevoProducto, ...productos]); // Agrega el nuevo producto
          }}
        />
      )}

      {/* Modal para editar producto */}
      {showEditarModal && productoActual && (
        <EditarProductoModal
          token={token}
          producto={productoActual}
          onClose={() => setShowEditarModal(false)}
          onProductoActualizado={(productoActualizado) => {
            setProductos(
              productos.map((p) =>
                p.id === productoActualizado.id ? productoActualizado : p
              )
            );
          }}
        />
      )}
    </div>
  );
}
