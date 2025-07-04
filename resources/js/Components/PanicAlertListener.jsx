// resources/js/Components/PanicAlertListener.jsx

import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PanicAlertListener = () => {
    const { auth } = usePage().props;

    useEffect(() => {
        if (auth.user) {
            const channel = window.Echo.private(`user.${auth.user.id}`);

            console.log(`[Co-piloto] Escuchando en canal privado: user.${auth.user.id}`);

            const listener = (data) => {
                console.log('[Co-piloto] ¡ALERTA DE PÁNICO RECIBIDA!', data);

                const message = `¡Pánico! Unidad: ${data.unit.nombre} (${data.unit.plates})`;

                toast.error(message, {
                    toastId: `alert-${data.alert.id}`,
                    position: "top-center",
                    autoClose: false,
                    closeOnClick: true,
                    onClick: () => {
                        window.location.href = data.alert.url;
                    }
                });

            };

            channel.listen('.panic.alert', listener);

            return () => {
                console.log(`[Co-piloto] Dejando de escuchar en el canal: user.${auth.user.id}`);
                channel.stopListening('.panic.alert', listener);
            };
        }
    }, [auth.user]);
    return null;
};

export default PanicAlertListener;
