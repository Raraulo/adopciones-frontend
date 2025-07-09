import { useEffect, useState } from "react";
import axios from "axios";
import ModalUsuarios from "../components/ModalUsuarios";
import ModalFacturas from "../components/ModalFacturas";
import ModalSolicitudes from "../components/ModalSolicitudes";


// 🔥 Importa la URL base del backend desde el .env
const API_URL = import.meta.env.VITE_API_URL;

export default function Perfil({ esAdmin, usuario, token, onChangeView }) {
  const [adopciones, setAdopciones] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showModalUsuarios, setShowModalUsuarios] = useState(false);
  const [showModalFacturas, setShowModalFacturas] = useState(false);
  const [showModalSolicitudes, setShowModalSolicitudes] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: "",
    correo: "",
    cedula: "",
    sexo: "",
    telefono: "",
  });
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [detalleFactura, setDetalleFactura] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      if (!usuario || !token) return;

      try {
        setFormData({
          nombre_completo: usuario.nombre_completo,
          correo: usuario.correo,
          cedula: usuario.cedula || "",
          sexo: usuario.sexo || "",
          telefono: usuario.telefono || "",
        });

        if (esAdmin) {
          setLoading(false); // Admin no necesita cargar adopciones/facturas
        } else {
          const [resAdopciones, resFacturas] = await Promise.all([
            axios.get(`${API_URL}/api/solicitudes/mis-solicitudes`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/api/facturas/mis-facturas`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setAdopciones(resAdopciones.data.solicitudes);
          setFacturas(resFacturas.data.facturas || []);
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos del perfil:", error);
        setLoading(false);
      }
    };

    fetchDatos();
  }, [usuario, token, esAdmin]);

  const guardarCambiosUsuario = async () => {
    try {
      await axios.put(
        `${API_URL}/api/users/${usuario.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Datos actualizados correctamente");
      setEditMode(false);
    } catch (error) {
      console.error("❌ Error al actualizar datos:", error);
      alert("Error al actualizar datos");
    }
  };

  const abrirModalFactura = async (factura) => {
    try {
      setLoadingDetalle(true);
      setSelectedFactura(factura);

      const res = await axios.get(
        `${API_URL}/api/facturas/${factura.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDetalleFactura(res.data.factura.detalle || []);
    } catch (error) {
      console.error("❌ Error al cargar detalle de factura:", error);
      alert("Error al cargar detalle de factura");
      setDetalleFactura([]);
    } finally {
      setLoadingDetalle(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Cargando datos del perfil...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Perfil de {usuario?.nombre_completo}
      </h1>

      {/* 🆕 Botones exclusivos para admin */}
      {esAdmin && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setShowModalUsuarios(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            👥 Gestionar Usuarios
          </button>
          <button
            onClick={() => setShowModalFacturas(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            📄 Gestionar Facturas
          </button>
          <button
            onClick={() => setShowModalSolicitudes(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📋 Gestionar Solicitudes
          </button>
        </div>
      )}

      {/* Mostrar datos o formulario de edición */}
      {!editMode ? (
        <>
          <p className="mb-2 text-gray-600">Correo: {usuario?.correo}</p>
          <p className="mb-2 text-gray-600">Cédula: {formData.cedula}</p>
          <p className="mb-2 text-gray-600">Sexo: {formData.sexo}</p>
          <p className="mb-2 text-gray-600">Teléfono: {formData.telefono}</p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Editar datos
          </button>
        </>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={formData.nombre_completo}
            onChange={(e) =>
              setFormData({ ...formData, nombre_completo: e.target.value })
            }
            placeholder="Nombre completo"
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            value={formData.correo}
            onChange={(e) =>
              setFormData({ ...formData, correo: e.target.value })
            }
            placeholder="Correo"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            value={formData.cedula}
            onChange={(e) =>
              setFormData({ ...formData, cedula: e.target.value })
            }
            placeholder="Cédula"
            className="w-full border p-2 rounded"
          />
          <select
            value={formData.sexo}
            onChange={(e) =>
              setFormData({ ...formData, sexo: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="">Selecciona tu sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          <input
            type="text"
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
            placeholder="Teléfono"
            className="w-full border p-2 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={guardarCambiosUsuario}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Mostrar solo a usuarios normales */}
      {!esAdmin && (
        <>
          {/* Mis facturas */}
          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-700">
            Mis Facturas
          </h2>
          {facturas.length === 0 ? (
            <p className="text-gray-600">No tienes facturas registradas.</p>
          ) : (
            <ul className="space-y-2">
              {facturas.map((fac) => (
                <li
                  key={fac.id}
                  className="border p-3 rounded shadow-sm bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-gray-800">📄 Factura #{fac.id}</p>
                    <p className="text-gray-600">Total: ${parseFloat(fac.total).toFixed(2)}</p>
                    <p className="text-gray-600">
                      Fecha: {new Date(fac.fecha).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => abrirModalFactura(fac)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Ver Detalles
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Mis solicitudes */}
          <h2 className="text-2xl font-semibold mt-6 mb-2 text-gray-700">
            Mis Solicitudes
          </h2>
          {adopciones.length === 0 ? (
            <p className="text-gray-600">No tienes solicitudes enviadas.</p>
          ) : (
            <ul className="space-y-2">
              {adopciones.map((sol) => (
                <li
                  key={sol.id}
                  className="border p-3 rounded shadow-sm bg-gray-50"
                >
                  <p className="font-bold text-gray-800">🐾 {sol.perro_nombre}</p>
                  <p className="text-gray-600">Mensaje: {sol.mensaje}</p>
                  <p className="text-gray-600">
                    Estado:{" "}
                    <span
                      className={`font-semibold ${
                        sol.estado === "pendiente"
                          ? "text-yellow-500"
                          : sol.estado === "aprobada"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {sol.estado}
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm">
                    Fecha: {new Date(sol.fecha_solicitud).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Botón volver */}
      <div className="mt-6">
        <button
          onClick={() => onChangeView("productos")}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Volver a productos
        </button>
      </div>

      {/* Modal detalle factura usuario */}
      {selectedFactura && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <h3 className="text-xl font-bold mb-3">
              Detalles de Factura #{selectedFactura.id}
            </h3>
            <p>
              <strong>Total:</strong> ${parseFloat(selectedFactura.total).toFixed(2)}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(selectedFactura.fecha).toLocaleDateString()}
            </p>
            <p className="mt-3 font-semibold">Productos:</p>

            {loadingDetalle ? (
              <p className="text-gray-600">Cargando detalle...</p>
            ) : (
              <ul className="list-disc list-inside">
                {detalleFactura?.map((item, idx) => (
                  <li key={idx}>
                    {item.nombre} x{item.cantidad} - ${parseFloat(item.precio_unitario).toFixed(2)}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => {
                setSelectedFactura(null);
                setDetalleFactura(null);
              }}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modals para admin */}
      {showModalUsuarios && (
        <ModalUsuarios
          token={token}
          onClose={() => setShowModalUsuarios(false)}
        />
      )}
      {showModalFacturas && (
        <ModalFacturas
          token={token}
          onClose={() => setShowModalFacturas(false)}
        />
      )}
      {showModalSolicitudes && (
        <ModalSolicitudes
          token={token}
          onClose={() => setShowModalSolicitudes(false)}
        />
      )}
    </div>
  );
}
