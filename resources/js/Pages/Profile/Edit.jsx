import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
// import Declaration_ from 'postcss/lib/declaration'; Importacion para elimiar cuenta si es necesario
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mi Perfil</h2>}
        >
            <Head title="Perfil" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Contenedor principal con diseño de cuadrícula */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Columna 1: Información y Contraseña */}
                        <div className="space-y-6">
                            <div className="p-4 sm:p-8 bg-white shadow-lg rounded-lg border border-gray-200">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>

                            <div className="p-4 sm:p-8 bg-white shadow-lg rounded-lg border border-gray-200">
                                <UpdatePasswordForm />
                            </div>
                        </div>
                        {/* Columna 2: Elimiar Cuenta (opcional)
                        <div className="space-y-6">
                            <div className="p-4 sm:p-8 bg-white shadow-lg rounded-lg border border-gray-200">
                                <DeleteUserForm />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

