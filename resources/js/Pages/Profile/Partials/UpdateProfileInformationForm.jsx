import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    UserCircleIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon,
    PaperAirplaneIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const inputClass = "block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-kng-purple focus:ring-kng-purple sm:text-sm";
    const labelClass = "block text-sm font-medium text-slate-700";

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <UserCircleIcon className="w-6 h-6 text-kng-purple" />
                    Información del Perfil
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Actualiza la información de tu cuenta y tu dirección de correo electrónico.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="name" className={labelClass}>Nombre</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="name"
                            className={inputClass}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <label htmlFor="email" className={labelClass}>Correo Electrónico</label>
                     <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                           <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            className={inputClass}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Tu dirección de correo no está verificada.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kng-purple"
                            >
                                Haz clic aquí para reenviar el correo de verificación.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                Se ha enviado un nuevo enlace de verificación a tu correo.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                     <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-kng-purple px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-kng-purple/90 focus:outline-none focus:ring-2 focus:ring-kng-purple focus:ring-offset-2 disabled:opacity-50 transition-colors"
                        disabled={processing}
                    >
                        {processing ? 'Guardando...' : 'Guardar Cambios'}
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
