import { useState, useRef, useEffect } from "react";
import { BellIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import {
  FaPaw,
  FaDog,
  FaShoppingBag,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

export default function Header({
  perfil,
  onCarritoClick,
  onNotificacionesClick,
  onChangeView,
  activeView,
  onPerfilClick,
  onLogout,
  nuevasNotificaciones,
  nuevoProducto,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); // 👈 Estado del mini-modal
  const userMenuRef = useRef(null);

  // 🔥 Cierra el menú si haces clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-yellow-400 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onChangeView("home")}
        >
          <FaPaw className="h-7 w-7 text-gray-800" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Patitas Felices
          </h1>
        </div>

        {/* Botón hamburguesa para móviles */}
        <button
          className="md:hidden p-2 text-gray-800 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>

        {/* Navegación + Acciones */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } flex-col md:flex md:flex-row gap-3 items-center md:static absolute top-16 left-0 w-full md:w-auto bg-yellow-400 md:bg-transparent z-50 md:z-auto transition-all duration-300`}
        >
          {/* Íconos juntos */}
          <div className="flex gap-2 md:gap-3 items-center">
            {/* Productos */}
            <button
              onClick={() => {
                onChangeView("productos");
                setMenuOpen(false);
              }}
              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                activeView === "productos"
                  ? "bg-white text-gray-800 shadow"
                  : "hover:bg-white hover:shadow text-gray-800"
              }`}
              title="Productos"
            >
              <FaShoppingBag className="h-6 w-6" />
              {nuevoProducto && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  1
                </span>
              )}
            </button>

            {/* Perros */}
            <button
              onClick={() => {
                onChangeView("perros");
                setMenuOpen(false);
              }}
              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                activeView === "perros"
                  ? "bg-white text-gray-800 shadow"
                  : "hover:bg-white hover:shadow text-gray-800"
              }`}
              title="Perros"
            >
              <FaDog className="h-6 w-6" />
            </button>

            {/* Carrito */}
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white hover:shadow"
              onClick={() => {
                onCarritoClick();
                setMenuOpen(false);
              }}
              title="Carrito"
            >
              <FaShoppingCart className="h-6 w-6 text-gray-800" />
            </button>

            {/* Notificaciones */}
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white hover:shadow relative"
              onClick={() => {
                onNotificacionesClick();
                setMenuOpen(false);
              }}
              title="Notificaciones"
            >
              <BellIcon className="h-6 w-6 text-gray-800" />
              {nuevasNotificaciones && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center animate-ping">
                  1
                </span>
              )}
            </button>

            {/* Perfil (icono + nombre debajo + menú desplegable) */}
            <div
              className="relative flex flex-col items-center cursor-pointer w-12"
              ref={userMenuRef}
            >
              <FaUserCircle
                className="h-6 w-6 text-gray-800"
                onClick={() => setShowUserMenu(!showUserMenu)}
              />
              <span className="text-xs text-gray-800 font-medium truncate w-full text-center">
                {perfil}
              </span>

              {/* Mini-modal debajo del usuario */}
              {showUserMenu && (
                <div className="absolute top-12 right-0 bg-white rounded shadow-lg py-2 w-40 z-50">
                  <button
                    onClick={() => {
                      onPerfilClick();
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Ver Mi Perfil
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
