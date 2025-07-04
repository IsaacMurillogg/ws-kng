// resources/js/Layouts/ModalLayout.jsx
import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { usePrevious } from 'react-use'; // O tu implementación manual aquí

// Si usas la implementación manual, debe estar así:
// function usePrevious(value) {
//   const ref = React.useRef();
//   React.useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }

export default function ModalLayout({ children, show, onClose, maxWidth = '2xl' }) {
    const page = usePage();
    const flash = page.props.flash;
    const prevFlashSuccess = usePrevious(flash.success);

    useEffect(() => {
        if (flash.success && !prevFlashSuccess) {
            onClose();
        }
    }, [flash.success, prevFlashSuccess, onClose]);

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
            {/* Fondo Oscuro */}
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>

            {/* Contenedor del Modal */}
            <div
                className={`relative bg-white rounded-lg shadow-xl transform transition-all sm:w-full ${maxWidthClass} mx-auto overflow-hidden my-auto`}
                style={{ maxWidth: maxWidthClass ? undefined : 'auto' }}
            >
                {/* Cabecera del Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        aria-label="Cerrar modal"
                    >
                        &times;
                    </button>
                </div>
                {/* Contenido del Modal */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}