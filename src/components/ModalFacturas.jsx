import { useEffect, useState } from "react";
import axios from "axios";

export default function ModalFacturas({ token, onClose }) {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detalleFactura, setDetalleFactura] = useState(null);
// 🔥 Importa la URL base del backend desde el .env
const API_URL = import.meta.env.VITE_API_URL;

  // Cargar todas las facturas (solo admin)
  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/facturas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFacturas(res.data.facturas);
      } catch (error) {
        console.error("❌ Error al cargar facturas:", error);
        alert("Error al cargar facturas");
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, [token]);

  // Ver detalle de factura
  const verDetalle = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/facturas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetalleFactura(res.data.factura);
    } catch (error) {
      console.error("❌ Error al cargar detalle de factura:", error);
      alert("Error al cargar detalle de factura");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-5xl relative">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          🧾 Gestión de Facturas
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando facturas...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Cliente</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((fac) => (
                  <tr
                    key={fac.id}
                    className="hover:bg-gray-50 border-t border-gray-200"
                  >
                    <td className="px-4 py-2">{fac.id}</td>
                    <td className="px-4 py-2">{fac.nombre_completo}</td>
                    <td className="px-4 py-2">
                      ${parseFloat(fac.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(fac.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => verDetalle(fac.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal detalle de factura */}
        {detalleFactura && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl relative">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                Detalles de Factura #{detalleFactura.id}
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Nombre del Cliente:</span>{" "}
                  {detalleFactura.nombre_completo}
                </p>
                <p>
                  <span className="font-semibold">Total + IVA:</span>{" "}
                  ${parseFloat(detalleFactura.total).toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Fecha de compra:</span>{" "}
                  {new Date(detalleFactura.fecha).toLocaleDateString()}
                </p>
                <h4 className="mt-4 font-semibold"> Productos:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {detalleFactura.detalle?.map((item, idx) => (
                    <li key={idx}>
                      {item.nombre} x{item.cantidad} - $
                      {parseFloat(item.precio_unitario).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setDetalleFactura(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Cerrar modal principal */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
