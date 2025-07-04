import { useRef, useState, Fragment } from 'react'; 
import { useForm } from '@inertiajs/react';
import { Transition, Dialog } from '@headlessui/react';
import InputError from '@/Components/InputError';
import {
    TrashIcon,
    ExclamationTriangleIcon,
    LockClosedIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
        clearErrors();
    };

    const secondaryButtonClass = "inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-kng-purple focus:ring-offset-2 sm:w-auto";
    const dangerButtonClass = "inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto";


    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                    Zona de Peligro
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Una vez que tu cuenta sea eliminada, todos sus recursos y datos serán borrados permanentemente.
                </p>
            </header>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
                Eliminar Cuenta
            </button>

            <Transition show={confirmingUserDeletion} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                    <form onSubmit={deleteUser} className="p-6 space-y-6">
                                        <div className="text-center">
                                            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
                                            <h3 className="mt-2 text-lg font-semibold text-gray-900">
                                                ¿Seguro que quieres eliminar tu cuenta?
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Esta acción no se puede deshacer. Ingresa tu contraseña para confirmar.
                                            </p>
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="password-delete" className="sr-only">Contraseña</label>
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="password-delete"
                                                ref={passwordInput}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                type="password"
                                                className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                                placeholder="Contraseña"
                                                required
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-4 gap-3">
                                            <button type="button" onClick={closeModal} className={secondaryButtonClass}>
                                                Cancelar
                                            </button>
                                            <button type="submit" className={dangerButtonClass} disabled={processing}>
                                                {processing ? 'Eliminando...' : 'Eliminar Cuenta'}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </section>
    );
}
