import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// 🔥 Importa la URL base del backend desde el .env
const API_URL = import.meta.env.VITE_API_URL;
export default function ModalSolicitudes({ token, onClose }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar todas las solicitudes
  const fetchSolicitudes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/solicitudes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSolicitudes(res.data.solicitudes);
    } catch (error) {
      console.error("❌ Error al cargar solicitudes:", error);
      Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, [token]);

  // Aprobar solicitud
  const aprobarSolicitud = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Aprobar solicitud?",
      text: "Esta acción marcará al perro como adoptado y notificará al usuario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aprobar", 
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.patch(
        `${API_URL}/api/solicitudes/${id}/aprobar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("✅ Aprobada", res.data.msg, "success");
      fetchSolicitudes(); // recargar lista
    } catch (error) {
      console.error("❌ Error al aprobar solicitud:", error);
      Swal.fire("Error", "No se pudo aprobar la solicitud", "error");
    }
  };

  // Rechazar solicitud
  const rechazarSolicitud = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Rechazar solicitud?",
      text: "El usuario será notificado del rechazo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, rechazar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.patch(
        `${API_URL}/api/solicitudes/${id}/rechazar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("❌ Rechazada", res.data.msg, "success");
      fetchSolicitudes(); // recargar lista
    } catch (error) {
      console.error("❌ Error al rechazar solicitud:", error);
      Swal.fire("Error", "No se pudo rechazar la solicitud", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          📋 Gestión de Solicitudes
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando solicitudes...</p>
        ) : solicitudes.length === 0 ? (
          <p className="text-center text-gray-500">No hay solicitudes pendientes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-3 py-2 border">ID</th>
                  <th className="px-3 py-2 border">Usuario</th>
                  <th className="px-3 py-2 border">Perro</th>
                  <th className="px-3 py-2 border">Mensaje</th>
                  <th className="px-3 py-2 border">Estado</th>
                  <th className="px-3 py-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => (
                  <tr key={sol.id} className="hover:bg-gray-50">
                    <td className="px-3 py-1 border text-center">{sol.id}</td>
                    <td className="px-3 py-1 border">{sol.usuario_nombre}</td>
                    <td className="px-3 py-1 border">{sol.perro_nombre}</td>
                    <td className="px-3 py-1 border">{sol.mensaje}</td>
                    <td
                      className={`px-3 py-1 border text-center ${
                        sol.estado === "pendiente"
                          ? "text-yellow-600"
                          : sol.estado === "aprobada"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {sol.estado}
                    </td>
                    <td className="px-3 py-1 border flex gap-2 justify-center">
                      {sol.estado === "pendiente" && (
                        <>
                          <button
                            onClick={() => aprobarSolicitud(sol.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          >
                            ✅ Aprobar
                          </button>
                          <button
                            onClick={() => rechazarSolicitud(sol.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            ❌ Rechazar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Cerrar modal */}
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
