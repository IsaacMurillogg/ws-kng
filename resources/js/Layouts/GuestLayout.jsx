// resources/js/Layouts/GuestLayout.jsx
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    // Definimos kngPurple aquí si no está en tu config de Tailwind,
    // o mejor, configúralo en tailwind.config.js y usa 'border-kng-purple'
    const kngPurpleColor = '#642869';

    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center px-4 pt-8 pb-12 sm:px-6 lg:px-8"
            // Fondo moderno tipo "Aurora" o degradado suave
            style={{
                background: 'linear-gradient(160deg, #f0f4f8 0%, #dde4ec 100%)', // Modo claro
                // Para modo oscuro, podrías tener una lógica o clases diferentes.
                // Ejemplo simple para modo oscuro (requiere setup de dark mode en Tailwind):
                // className: "dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800"
            }}
        >
            {/* Contenedor del Logo */}
            <div className="mb-6 sm:mb-8">
                <Link href="/">
                    <img
                        src="/img/kng.png" // Asegúrate que esta ruta sea correcta
                        alt="KNG Logo"
                        className="mx-auto h-auto w-28 sm:w-32 transition-all hover:opacity-90"
                    />
                </Link>
            </div>

            {/* Contenedor del Formulario "Glassmorphic" */}
            <div
                className="w-full max-w-md overflow-hidden rounded-xl shadow-2xl border"
                style={{
                    // Efecto Glassmorphism
                    backgroundColor: 'rgba(255, 255, 255, 0.75)', // Ajusta la opacidad según el fondo
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)', // Para Safari
                    borderColor: 'rgba(209, 213, 219, 0.3)', // Borde muy sutil para definir el vidrio
                    // Borde superior de marca KNG
                    borderTopWidth: '4px',
                    borderTopColor: kngPurpleColor,
                }}
                // Para modo oscuro, podrías cambiar backgroundColor y borderColor:
                // className="dark:bg-slate-800/70 dark:border-slate-700/50 ..."
            >
                <div className="px-6 py-8 sm:px-8 sm:py-10"> {/* Padding interno del card */}
                    {children}
                </div>
            </div>

            {/* Pie de página opcional */}
            <footer className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} KNG. Todos los derechos reservados.
            </footer>
        </div>
    );
}
