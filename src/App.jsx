import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CarritoModal from "./components/CarritoModal";
import NotificacionesModal from "./components/NotificacionesModal";
import Productos from "./pages/Productos";
import Perros from "./pages/Perros";
import Perfil from "./pages/Perfil";
import Home from "./pages/Home"; // 👈 NUEVA página de inicio
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import ConfirmModal from "./components/ConfirmModal";

// 🔥 URL base del backend
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [usuario, setUsuario] = useState(() => {
    const savedUser = localStorage.getItem("usuario");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [carrito, setCarrito] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [showCarrito, setShowCarrito] = useState(false);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [view, setView] = useState("home"); // 👈 Por defecto abre el Home
  const [hayNotificaciones, setHayNotificaciones] = useState(false); // 🔔
  const [hayProductoNuevo, setHayProductoNuevo] = useState(false);    // 🛒

  const esAdmin = usuario?.rol === "admin";

  // 🔔 Cargar notificaciones
  useEffect(() => {
    if (!token) return;

    const fetchNotificaciones = async () => {
      try {
        const res = await axios.get(`${API_URL}/notificaciones`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotificaciones(res.data.notificaciones);

        const nuevas = res.data.notificaciones.some((n) => !n.leida);
        setHayNotificaciones(nuevas); // 🔥 Muestra badge si hay no leídas
      } catch (error) {
        console.error("❌ Error al cargar notificaciones:", error);
      }
    };

    fetchNotificaciones();
  }, [token]);

  // 🛒 Añadir productos al carrito
  const agregarAlCarrito = (producto) => {
    if (!usuario) {
      setShowLoginModal(true);
      return;
    }

    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setConfirmMessage("Este producto ya está en el carrito");
      setConfirmAction(() => () => {});
      setShowConfirmModal(true);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      setConfirmMessage("✅ Producto añadido al carrito");
      setConfirmAction(() => () => {});
      setShowConfirmModal(true);
    }
  };

  // 🆕 Detecta nuevo producto creado por el admin
  const handleProductoCreado = () => {
    setHayProductoNuevo(true);
  };

  // 🆕 Cambiar cantidad
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const nuevoCarrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    setCarrito(nuevoCarrito);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setConfirmMessage("✅ Carrito vaciado correctamente");
    setConfirmAction(() => () => {});
    setShowConfirmModal(true);
  };

  const comprar = () => {
    if (!usuario) {
      setShowLoginModal(true);
      return;
    }

    if (carrito.length === 0) {
      setConfirmMessage("El carrito está vacío");
      setConfirmAction(() => () => {});
      setShowConfirmModal(true);
      return;
    }

    setConfirmMessage("¿Deseas confirmar la compra?");
    setConfirmAction(() => async () => {
      try {
        await axios.post(
          `${API_URL}/compras`,
          { productos: carrito },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCarrito([]);
        setShowCarrito(false);
        setConfirmMessage("🎉 Compra realizada con éxito");
        setConfirmAction(() => () => {});
        setShowConfirmModal(true);
      } catch (error) {
        console.error("❌ Error al realizar la compra:", error);
        setConfirmMessage("❌ Hubo un error al procesar la compra");
        setConfirmAction(() => () => {});
        setShowConfirmModal(true);
      }
    });
    setShowConfirmModal(true);
  };

  const cerrarSesion = () => {
    setConfirmMessage("¿Seguro que deseas cerrar sesión?");
    setConfirmAction(() => () => {
      setUsuario(null);
      setToken("");
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      setView("home"); // 👈 Vuelve al Home al cerrar sesión
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const handlePerfilClick = () => {
    if (!usuario) {
      setShowLoginModal(true);
    } else {
      setView("perfil");
    }
  };

  const handleLoginSuccess = (user, jwt) => {
    setUsuario(user);
    setToken(jwt);
    localStorage.setItem("usuario", JSON.stringify(user));
    localStorage.setItem("token", jwt);
    setShowLoginModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        perfil={usuario ? usuario.nombre_completo : "Invitado"}
        onCarritoClick={() => setShowCarrito(true)}
        onNotificacionesClick={() => {
          setShowNotificaciones(true);
          setHayNotificaciones(false); // 🔔 Quita badge
        }}
        onChangeView={(vista) => {
          setView(vista);
          if (vista === "productos") setHayProductoNuevo(false); // 🛒 Quita badge
        }}
        activeView={view}
        onPerfilClick={handlePerfilClick}
        onLogout={cerrarSesion}
        nuevasNotificaciones={hayNotificaciones} // 🔥
        nuevoProducto={hayProductoNuevo}         // 🔥
        isLoggedIn={!!usuario}
      />

      {/* Contenido */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {view === "home" && <Home />}

        {view === "productos" && (
          <Productos
            esAdmin={esAdmin}
            token={token}
            usuario={usuario}
            onAgregarCarrito={agregarAlCarrito}
            onProductoCreado={handleProductoCreado} // 🆕
          />
        )}

        {view === "perros" && (
          <Perros
            esAdmin={esAdmin}
            token={token}
            usuario={usuario}
            onSolicitarAdopcion={() =>
              setConfirmMessage("⚠️ Funcionalidad aún no implementada")
            }
          />
        )}

        {view === "perfil" && (
          <Perfil
            esAdmin={esAdmin}
            usuario={usuario}
            token={token}
            onChangeView={setView}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modales */}
      {showCarrito && (
        <CarritoModal
          carrito={carrito}
          onClose={() => setShowCarrito(false)}
          onEliminar={eliminarDelCarrito}
          onVaciar={vaciarCarrito}
          onComprar={comprar}
          onActualizarCantidad={actualizarCantidad}
        />
      )}

      {showNotificaciones && (
        <NotificacionesModal
          notificaciones={notificaciones}
          onClose={() => setShowNotificaciones(false)}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onShowRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegisterSuccess={(newUser) => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={() => {
            confirmAction();
            setShowConfirmModal(false);
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}

export default App;
