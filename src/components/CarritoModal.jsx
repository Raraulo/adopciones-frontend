import { XMarkIcon, TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function CarritoModal({
  carrito,
  onClose,
  onEliminar,
  onVaciar,
  onComprar,
  onActualizarCantidad,
}) {
  // Calcular subtotal (sin IVA)
  const subtotal = carrito.reduce(
    (acc, item) => acc + (Number(item.precio) / 1.15) * item.cantidad,
    0
  );
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  return (
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Panel carrito */}
      <div
        className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 transform translate-x-0 transition-transform duration-300 flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">Tu carrito</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            title="Cerrar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Lista productos */}
        <div className="p-4 overflow-y-auto flex-1">
          {carrito.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">🛒 Tu carrito está vacío.</p>
          ) : (
            <ul className="space-y-4">
              {carrito.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-start border-b pb-2"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.nombre}</p>
                    <p className="text-gray-500 text-sm">
                      Unitario: ${(Number(item.precio) / 1.15).toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Total: ${(Number(item.precio) * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {/* Selector cantidad */}
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        onActualizarCantidad(item.id, parseInt(e.target.value))
                      }
                      className="w-16 border rounded p-1 text-center text-gray-700"
                    />
                    <button
                      onClick={() => onEliminar(item.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Totales */}
        {carrito.length > 0 && (
          <div className="border-t p-4 space-y-1 text-right">
            <p className="text-gray-600">Subtotal: ${subtotal.toFixed(2)}</p>
            <p className="text-gray-600">IVA (15%): ${iva.toFixed(2)}</p>
            <p className="font-bold text-gray-800 text-lg">
              Total: ${total.toFixed(2)}
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="border-t p-4 flex justify-between gap-2">
          <button
            onClick={onVaciar}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Vaciar
          </button>
          <button
            onClick={onComprar}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Comprar
          </button>
        </div>
      </div>
    </>
  );
}
