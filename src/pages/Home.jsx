import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Home({ onChangeView }) {
  return (
    <div className="text-gray-800 overflow-x-hidden">
      {/* 🟡 Hero grande */}
      <section className="bg-yellow-500 flex flex-col md:flex-row items-center justify-center w-full min-h-screen pt-20">
        {/* Texto lado izquierdo */}
        <div className="w-full md:w-1/2 px-6 md:px-10 mb-8 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
            Todos los perros merecen un hogar donde se les quiera para siempre.
          </h1>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl">
            Somos defensores de que todos los perros, grandes y pequeños, nos hacen mejores personas y merecen un trato de calidad en hogares donde se les quiera para siempre.
          </p>
        </div>

        {/* Imagen lado derecho con fondo transparente */}
        <div className="w-full md:w-1/2 flex justify-center items-center h-full px-6 md:px-10">
          <img
            src="https://us.images.westend61.de/0001547990pw/adorable-perro-weimaraner-de-pura-raza-con-panuelo-amarillo-en-la-cabeza-sentado-sobre-fondo-amarillo-en-estudio-ADSF22941.jpg"
            className="w-full max-w-xl object-contain"
          />
        </div>
      </section>

      {/* 🟤 Sección de adopciones */}
      <section className="flex flex-col md:flex-row items-center justify-center w-full py-10 bg-white">
        {/* Imagen a la izquierda */}
        <div className="w-full md:w-1/2 flex justify-center px-6 md:px-10 mb-6 md:mb-0">
          <img
            src="https://img.freepik.com/fotos-premium/perro-beagle-sentado-contra-fondo-blanco_191971-25171.jpg"
            alt="Perro en adopción"
            className="w-full max-w-lg md:max-w-xl lg:max-w-2xl object-cover"
          />
        </div>

        {/* Texto a la derecha */}
        <div className="w-full md:w-1/2 px-6 md:px-10 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-500 mb-4">
            Adopciones
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            Los animales rescatados o abandonados en <strong>“Patitas Felices”</strong> que logran ser recuperados y rehabilitados,
            pasan al Programa de Adopciones con el fin de ser reubicados con una familia responsable.
          </p>
        </div>
      </section>

      {/* 🛒 Sección de productos */}
      <section className="flex flex-col md:flex-row-reverse items-center justify-center w-full py-10 bg-gray-50">
        {/* Imagen a la derecha */}
        <div className="w-full md:w-1/2 flex justify-center px-6 md:px-10 mb-6 md:mb-0">
          <img
            src="https://media.istockphoto.com/id/188031432/es/foto/joven-mordedura-de-perro-dachshund-de-peluche-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=06z1Ovsb6dy4I8xHjBs9jJ08B4lzX51JG-y0CS4laXg="
            alt="Perro con producto"
            className="w-full max-w-lg md:max-w-xl lg:max-w-2xl object-cover"
          />
        </div>

        {/* Texto a la izquierda */}
        <div className="w-full md:w-1/2 px-6 md:px-10 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-500 mb-4">
            Productos para tu mascota
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            Descubre nuestra selección de productos para el cuidado, alimentación y entretenimiento de tu perro. Calidad garantizada para que tu mascota sea feliz y saludable.
          </p>
        </div>
      </section>

      {/* ❤️ Sección de donaciones */}
      <section className="flex flex-col md:flex-row items-center justify-center w-full py-10 bg-white">
        {/* Imagen a la izquierda */}
        <div className="w-full md:w-1/2 flex justify-center px-6 md:px-10 mb-6 md:mb-0">
          <img
            src="https://st2.depositphotos.com/1146092/5837/i/450/depositphotos_58371397-stock-photo-donation-box-dog.jpg"
            alt="Donación perros"
            className="w-full max-w-lg md:max-w-xl lg:max-w-2xl object-cover rounded-md shadow-lg"
          />
        </div>

        {/* Texto y botón a la derecha */}
        <div className="w-full md:w-1/2 px-6 md:px-10 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-500 mb-4">
            Ayúdanos a salvar más vidas
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6">
            Con tu donación podemos rescatar, alimentar y dar una segunda oportunidad a más animales necesitados. Cada aporte cuenta para construir un futuro mejor.
          </p>

          {/* 🟢 Botón PayPal */}
          <PayPalScriptProvider options={{ "client-id": "Aa27RxsXHjBfENyf9D721mZz0SU4AwRnlvQDlTtJm3ztvHIkqPxUEN6-tuuomb_4WsfZfkHD6rtyO9cn" }}>
            <PayPalButtons
              style={{
                layout: "vertical",
                color: "gold",
                shape: "pill",
                label: "donate",
              }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: "5.00",
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(function (details) {
                  alert(
                    "🎉 ¡Gracias, " +
                      details.payer.name.given_name +
                      ", por tu donación!"
                  );
                });
              }}
            />
          </PayPalScriptProvider>
        </div>
      </section>
    </div>
  );
}
