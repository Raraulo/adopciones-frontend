import { useEffect, useState } from "react";
import axios from "axios";
import { PencilSquareIcon, TrashIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function ModalUsuarios({ token, onClose }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre_completo: "",
    correo: "",
    cedula: "",
    sexo: "",
    telefono: "",
    rol: "usuario",
  });
// 🔥 Importa la URL base del backend desde el .env
const API_URL = import.meta.env.VITE_API_URL;

  // Cargar usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data.usuarios);
      } catch (error) {
        console.error("❌ Error al cargar usuarios:", error);
        alert("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [token]);

  // Eliminar usuario
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(usuarios.filter((u) => u.id !== id));
      alert("✅ Usuario eliminado");
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
      alert("Error al eliminar usuario");
    }
  };

  // Guardar cambios del usuario editado
  const guardarCambios = async () => {
    try {
      await axios.put(
        `${API_URL}/users/${editUser.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Usuario actualizado correctamente");
      setUsuarios(
        usuarios.map((u) =>
          u.id === editUser.id ? { ...u, ...formData } : u
        )
      );
      setEditUser(null);
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      alert("Error al actualizar usuario");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
          <UserGroupIcon className="h-6 w-6 text-purple-600" />
          Gestión de Usuarios
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando usuarios...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 border">ID</th>
                    <th className="px-3 py-2 border">Nombre</th>
                    <th className="px-3 py-2 border">Correo</th>
                    <th className="px-3 py-2 border">Rol</th>
                    <th className="px-3 py-2 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-3 py-1 border text-center">{user.id}</td>
                      <td className="px-3 py-1 border">{user.nombre_completo}</td>
                      <td className="px-3 py-1 border">{user.correo}</td>
                      <td className="px-3 py-1 border capitalize">{user.rol}</td>
                      <td className="px-3 py-1 border text-center flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setEditUser(user);
                            setFormData(user);
                          }}
                          className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarUsuario(user.id)}
                          className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal de edición */}
            {editUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                  <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
                    Editar Usuario
                  </h3>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.nombre_completo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_completo: e.target.value,
                        })
                      }
                      placeholder="Nombre completo"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="email"
                      value={formData.correo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          correo: e.target.value,
                        })
                      }
                      placeholder="Correo"
                      className="w-full border p-2 rounded"
                    />
                    <select
                      value={formData.rol}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rol: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="usuario">Usuario</option>
                      <option value="admin">Admin</option>
                    </select>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditUser(null)}
                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={guardarCambios}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Botón cerrar modal */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
