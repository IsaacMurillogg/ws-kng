
import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Toaster, toast } from 'react-hot-toast';

import { AuthContext } from '../context/AuthContext';

const AppLayout = ({ children }) => {
    const { user } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        if (user && user.id) {
            console.log(`Subscribiendo al canal privado: private-user.${user.id}`);

            const channel = window.Echo.private(`user.${user.id}`);

            channel.listen('.panic.alert', (data) => {
                console.log('¡Alerta de pánico recibida por Pusher!', data);

                const { alert } = data;
                toast.error(
                    (t) => (

                        <span>
                            <b>¡ALERTA DE PÁNICO!</b><br />
                            Unidad: <b>{alert.unit.name}</b>
                            <button
                                onClick={() => {
                                    history.push(`/alerts/${alert.id}`);
                                    toast.dismiss(t.id);
                                }}
                                style={{ marginLeft: '10px', padding: '5px 10px', border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
                                Ver Ticket
                            </button>
                        </span>
                    ),
                    {
                        duration: 20000,
                        icon: '🚨',
                    }
                );

            });

            return () => {
                console.log(`Dejando el canal: private-user.${user.id}`);
                channel.stopListening('.panic.alert');
                window.Echo.leave(`user.${user.id}`);
            };
        }
    }, [user]);

    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />

            <main>
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
