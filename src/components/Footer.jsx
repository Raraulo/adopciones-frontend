import {
  FaPaw,
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaTelegramPlane,
  FaPinterestP,
  FaTwitter,
  FaTiktok,
  FaSpotify,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-yellow-400 shadow-md mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FaPaw className="h-7 w-7 text-gray-800" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Patitas Felices
          </h1>
        </div>

        {/* Redes sociales */}
        <div className="flex gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600"
            title="Instagram"
          >
            <FaInstagram className="h-6 w-6" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600"
            title="Facebook"
          >
            <FaFacebookF className="h-6 w-6" />
          </a>
          <a
            href="https://wa.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600"
            title="WhatsApp"
          >
            <FaWhatsapp className="h-6 w-6" />
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600"
            title="Telegram"
          >
            <FaTelegramPlane className="h-6 w-6" />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600"
            title="Pinterest"
          >
            <FaPinterestP className="h-6 w-6" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600"
            title="X (Twitter)"
          >
            <FaTwitter className="h-6 w-6" />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600"
            title="TikTok"
          >
            <FaTiktok className="h-6 w-6" />
          </a>
          <a
            href="https://spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600"
            title="Spotify"
          >
            <FaSpotify className="h-6 w-6" />
          </a>
        </div>

        {/* Derechos */}
        <p className="text-sm font-medium text-gray-800 text-center">
          © 2024 Patitas Felices | Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
