import { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import InputError from '@/Components/InputError';
import {
    KeyIcon,
    LockClosedIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const inputClass = "block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-kng-purple focus:ring-kng-purple sm:text-sm";
    const labelClass = "block text-sm font-medium text-slate-700";

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <KeyIcon className="w-6 h-6 text-kng-purple" />
                    Actualizar Contraseña
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Asegúrate de que tu cuenta utilice una contraseña larga y aleatoria para mantenerla segura.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="current_password" className={labelClass}>Contraseña Actual</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className={inputClass}
                            autoComplete="current-password"
                        />
                    </div>
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password" className={labelClass}>Nueva Contraseña</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className={inputClass}
                            autoComplete="new-password"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className={labelClass}>Confirmar Nueva Contraseña</label>
                     <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className={inputClass}
                            autoComplete="new-password"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-kng-purple px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-kng-purple/90 focus:outline-none focus:ring-2 focus:ring-kng-purple focus:ring-offset-2 disabled:opacity-50 transition-colors"
                        disabled={processing}
                    >
                        {processing ? 'Guardando...' : 'Guardar'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                             <CheckCircleIcon className="w-5 h-5 text-green-500"/>
                             Guardado.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
