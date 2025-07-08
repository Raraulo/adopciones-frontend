import { useEffect, useState } from "react";
import axios from "axios";
import CrearPerroModal from "../components/CrearPerroModal";
import EditarPerroModal from "../components/EditarPerroModal";

export default function Perros({ esAdmin, token, usuario }) {
  const [perros, setPerros] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCrearModal, setShowCrearModal] = useState(false);
  const [perroEditar, setPerroEditar] = useState(null);

  // Modal de adopción
  const [selectedPerro, setSelectedPerro] = useState(null);
  const [formAdopcion, setFormAdopcion] = useState({
    tipoVivienda: "",
    tieneNinos: "",
    tienePatio: "",
    masDe2Perros: "",
    motivo: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(false);

  // Cargar perros desde backend
  useEffect(() => {
    const fetchPerros = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/perros");
        setPerros(res.data.perros);
      } catch (error) {
        console.error("Error al cargar perros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerros();
  }, []);

  // Admin: eliminar perro
  const eliminarPerro = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este perro?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/perros/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerros(perros.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar perro:", error);
      alert("No se pudo eliminar el perro");
    }
  };

  // Usuario: abrir modal de adopción
  const abrirModalAdopcion = (perro) => {
    if (!usuario) {
      alert("Debes iniciar sesión para solicitar adopción");
      return;
    }
    setSelectedPerro(perro);
  };

  const cerrarModalAdopcion = () => {
    setSelectedPerro(null);
    setFormAdopcion({
      tipoVivienda: "",
      tieneNinos: "",
      tienePatio: "",
      masDe2Perros: "",
      motivo: "",
    });
    setEnviando(false);
    setConfirmacion(false);
  };

  // Usuario: enviar solicitud de adopción
  const enviarSolicitudAdopcion = async () => {
    if (
      !formAdopcion.tipoVivienda ||
      !formAdopcion.tieneNinos ||
      !formAdopcion.tienePatio ||
      !formAdopcion.masDe2Perros ||
      !formAdopcion.motivo
    ) {
      alert("Por favor completa todo el formulario.");
      return;
    }

    const mensaje = `
      Tipo de vivienda: ${formAdopcion.tipoVivienda}
      ¿Tiene niños menores de 10 años?: ${formAdopcion.tieneNinos}
      ¿Tiene patio?: ${formAdopcion.tienePatio}
      ¿Tiene más de 2 perros?: ${formAdopcion.masDe2Perros}
      Motivo: ${formAdopcion.motivo}
    `;

    try {
      setEnviando(true);
      await axios.post(
        "http://localhost:4000/api/solicitudes",
        {
          perro_id: selectedPerro.id,
          mensaje,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConfirmacion(true); // Mostrar mensaje de confirmación
    } catch (error) {
      console.error("Error al enviar solicitud de adopción:", error);
      alert("No se pudo enviar la solicitud");
      setEnviando(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Cargando perros...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Perros en Adopción</h1>

      {/* Botón para crear perro (solo admin) */}
      {esAdmin && (
        <div className="mb-6">
          <button
            onClick={() => setShowCrearModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Crear Perro
          </button>
        </div>
      )}

      {/* Grid de perros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {perros.map((perro) => (
          <div
            key={perro.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={perro.imagen_url}
              alt={perro.nombre}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {perro.nombre} ({perro.raza})
            </h2>
            <p className="text-gray-600 mb-2">{perro.descripcion}</p>
              {/* 👇 Aquí mostramos la edad */}
  <p className="text-gray-500 mb-2">
    Edad: {perro.edad ? `${perro.edad} año${perro.edad > 1 ? "s" : ""}` : "No especificada"}
  </p>
            <p
              className={`mb-4 ${
                perro.adoptado ? "text-red-600" : "text-green-600"
              }`}
            >
              {perro.adoptado ? "Adoptado" : "Disponible"}
            </p>

            {/* Botones según rol */}
            {esAdmin ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setPerroEditar(perro)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarPerro(perro.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            ) : (
              <button
                onClick={() => abrirModalAdopcion(perro)}
                className={`w-full px-3 py-2 rounded text-white ${
                  perro.adoptado
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={perro.adoptado}
              >
                {perro.adoptado ? "No disponible" : "Solicitar adopción"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal para crear perro */}
      {showCrearModal && (
        <CrearPerroModal
          token={token}
          onClose={() => setShowCrearModal(false)}
          onPerroCreado={(nuevoPerro) =>
            setPerros([nuevoPerro, ...perros])
          }
        />
      )}

      {/* Modal para editar perro */}
      {perroEditar && (
        <EditarPerroModal
          token={token}
          perro={perroEditar}
          onClose={() => setPerroEditar(null)}
          onPerroActualizado={(perroActualizado) => {
            setPerros(
              perros.map((p) => (p.id === perroActualizado.id ? perroActualizado : p))
            );
            setPerroEditar(null);
          }}
        />
      )}

      {/* Modal para adopción */}
      {selectedPerro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-2xl">
            {!confirmacion ? (
              <>
                <h3 className="text-2xl font-bold mb-4">
                  Adopción de {selectedPerro.nombre}
                </h3>
                <div className="space-y-3">
                  {/* Formulario de adopción */}
                  <label className="block text-gray-700 font-medium">Tipo de vivienda</label>
                  <select
                    value={formAdopcion.tipoVivienda}
                    onChange={(e) =>
                      setFormAdopcion({ ...formAdopcion, tipoVivienda: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Casa">Casa</option>
                    <option value="Departamento">Departamento</option>
                    <option value="Otro">Otro</option>
                  </select>

                  <label className="block text-gray-700 font-medium">¿Tienes niños menores de 10 años?</label>
                  <select
                    value={formAdopcion.tieneNinos}
                    onChange={(e) =>
                      setFormAdopcion({ ...formAdopcion, tieneNinos: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>

                  <label className="block text-gray-700 font-medium">¿Tienes patio?</label>
                  <select
                    value={formAdopcion.tienePatio}
                    onChange={(e) =>
                      setFormAdopcion({ ...formAdopcion, tienePatio: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>

                  <label className="block text-gray-700 font-medium">¿Tienes más de 2 perros?</label>
                  <select
                    value={formAdopcion.masDe2Perros}
                    onChange={(e) =>
                      setFormAdopcion({ ...formAdopcion, masDe2Perros: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>

                  <label className="block text-gray-700 font-medium">¿Por qué deseas adoptar?</label>
                  <textarea
                    value={formAdopcion.motivo}
                    onChange={(e) =>
                      setFormAdopcion({ ...formAdopcion, motivo: e.target.value })
                    }
                    placeholder="Escribe tu motivo aquí..."
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-5">
                  <button
                    onClick={cerrarModalAdopcion}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    disabled={enviando}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={enviarSolicitudAdopcion}
                    className={`${
                      enviando ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                    } text-white px-4 py-2 rounded`}
                    disabled={enviando}
                  >
                    {enviando ? "Enviando..." : "Enviar Solicitud"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-green-600">
                  Solicitud enviada con éxito
                </h3>
                <p className="text-gray-700 mb-6">
                  Gracias por completar el formulario. Pronto recibirás una respuesta.
                </p>
                <button
                  onClick={cerrarModalAdopcion}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
