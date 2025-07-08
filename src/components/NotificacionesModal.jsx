import { XMarkIcon } from "@heroicons/react/24/outline";

export default function NotificacionesModal({ notificaciones, onClose }) {
  return (
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
        onClick={onClose} // Cierra al hacer clic afuera
      ></div>

      {/* Panel deslizable */}
      <div
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform translate-x-0 transition-transform duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">🔔 Notificaciones</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            title="Cerrar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Lista de notificaciones */}
        <div className="p-4 overflow-y-auto max-h-[80vh]">
          {notificaciones.length === 0 ? (
            <p className="text-gray-500 text-center">No hay notificaciones.</p>
          ) : (
            <ul className="space-y-3">
              {notificaciones.map((n) => (
                <li
                  key={n.id}
                  className="p-3 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition"
                >
                  <p className="text-gray-700">{n.mensaje}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Botón cerrar */}
        <div className="border-t p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Cerrar panel
          </button>
        </div>
      </div>
    </>
  );
}
