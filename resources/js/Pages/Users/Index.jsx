import React, { useState, useEffect, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Transition, Dialog } from '@headlessui/react';
import {
    UserPlusIcon,
    PencilSquareIcon,
    TrashIcon,
    TruckIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';


const ActionModal = ({ show, onClose, title, children }) => (
    <Transition show={show} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
            <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200">
                                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-slate-900">{title}</Dialog.Title>
                                <button type="button" onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-kng-purple"><XMarkIcon className="w-6 h-6" /></button>
                            </div>
                            <div className="p-6">{children}</div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
);

const UserCard = ({ user, onEdit, onManageUnits, onDelete }) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 space-y-4">
        <div className="flex items-start justify-between">
            <div>
                <p className="font-bold text-slate-800 text-lg">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>{user.role}</span>
        </div>
        <div className="text-sm text-slate-600">
            Unidades Asignadas: <span className="font-semibold text-slate-800">{user.assigned_unit_ids?.length || 0}</span>
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100 space-x-2">
            <button onClick={onEdit} className="p-2 text-slate-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors" title="Editar Usuario"><PencilSquareIcon className="w-5 h-5" /></button>
            <button onClick={onManageUnits} className="p-2 text-slate-500 hover:text-kng-purple hover:bg-kng-purple/10 rounded-full transition-colors" title="Gestionar Unidades"><TruckIcon className="w-5 h-5" /></button>
            <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Eliminar Usuario"><TrashIcon className="w-5 h-5" /></button>
        </div>
    </div>
);

const UserTableRow = ({ user, onEdit, onManageUnits, onDelete }) => (
     <tr className="hover:bg-slate-50 transition-colors">
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
            <div className="flex items-center">
                <div className="h-10 w-10 flex-shrink-0">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <span className="font-medium leading-none">{user.name.charAt(0).toUpperCase()}</span>
                    </span>
                </div>
                <div className="ml-4">
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-slate-500">{user.email}</div>
                </div>
            </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500"><span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-sky-800'}`}>{user.role}</span></td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 text-center">{user.assigned_unit_ids?.length || 0}</td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
            <div className="flex justify-end space-x-2">
                <button onClick={onEdit} className="p-2 text-slate-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors" title="Editar Usuario"><span className="sr-only">Editar</span><PencilSquareIcon className="w-5 h-5" /></button>
                <button onClick={onManageUnits} className="p-2 text-slate-500 hover:text-kng-purple hover:bg-kng-purple/10 rounded-full transition-colors" title="Gestionar Unidades"><span className="sr-only">Gestionar Unidades</span><TruckIcon className="w-5 h-5" /></button>
                <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Eliminar Usuario"><span className="sr-only">Eliminar</span><TrashIcon className="w-5 h-5" /></button>
            </div>
        </td>
    </tr>
);

export default function UserIndex({ auth, users: initialUsers, allUnits: initialAllUnits }) {
    const { flash } = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 10; // Número de usuarios por página

    const { data, setData, post, put, delete: inertiaDelete, processing, errors, reset, clearErrors } = useForm({
        name: '', email: '', password: '', password_confirmation: '', role: 'user', unit_ids: [],
    });

    useEffect(() => {
        if (flash?.success) console.log("Éxito:", flash.success);
        if (flash?.error) console.error("Error:", flash.error);
    }, [flash]);

    useEffect(() => {
        if (isModalOpen) {
            clearErrors();
            if (modalMode === 'edit' && selectedUser) {
                setData({ name: selectedUser.name, email: selectedUser.email, role: selectedUser.role, password: '', password_confirmation: '', unit_ids: [] });
            } else if (modalMode === 'units' && selectedUser) {
                setData({ ...data, unit_ids: selectedUser.assigned_unit_ids || [] });
            } else {
                reset();
            }
        }
    }, [isModalOpen, modalMode, selectedUser]);

    const openModal = (mode, user = null) => {
        setModalMode(mode);
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedUser(null);
            reset();
        }, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                closeModal();
                // Opcional: Si eliminas un usuario de la última página y queda vacía, retrocede una página
                // Esta lógica ya está cubierta por el useEffect que ajusta currentPage vs totalPages
            },
            preserveScroll: true
        };
        switch (modalMode) {
            case 'create': post(route('admin.users.store'), options); break;
            case 'edit': put(route('admin.users.update', selectedUser.id), options); break;
            case 'units': post(route('admin.users.sync_units', selectedUser.id), options); break;
            case 'delete': inertiaDelete(route('admin.users.destroy', selectedUser.id), options); break;
        }
    };

    // Usuarios filtrados por término de búsqueda (base para la paginación)
    const filteredUsers = useMemo(() => {
        // Al cambiar el término de búsqueda, siempre volvemos a la primera página
        setCurrentPage(1);
        if (!searchTerm) return initialUsers;
        const lowerCaseSearch = searchTerm.toLowerCase();

        return initialUsers.filter(user =>
            (user.name || '').toLowerCase().includes(lowerCaseSearch) ||
            (user.email || '').toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchTerm, initialUsers]);

    // Lógica de paginación
    const totalPages = useMemo(() => {
        return Math.ceil(filteredUsers.length / PER_PAGE);
    }, [filteredUsers, PER_PAGE]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * PER_PAGE;
        const endIndex = startIndex + PER_PAGE;
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage, PER_PAGE]);

    // Ajusta la página actual si se vuelve inválida (ej. al eliminar el último usuario de una página)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0 && currentPage !== 1) { // Si no hay usuarios, asegúrate de estar en la página 1
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Nombre', 'Email', 'Rol', 'Unidades Asignadas'];
        const rows = filteredUsers.map(user => [ // Exporta TODOS los usuarios filtrados, no solo los paginados
            user.id, `"${user.name}"`, `"${user.email}"`, `"${user.role}"`, user.assigned_unit_ids?.length || 0
        ]);
        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "lista_usuarios.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const inputClass = "block w-full rounded-md border-slate-300 shadow-sm focus:border-kng-purple focus:ring-kng-purple sm:text-sm";
    const labelClass = "block text-sm font-medium text-slate-700";
    const primaryButtonClass = "inline-flex justify-center rounded-md border border-transparent bg-kng-purple px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-kng-purple/90 focus:outline-none focus:ring-2 focus:ring-kng-purple focus:ring-offset-2 disabled:opacity-50";
    const secondaryButtonClass = "inline-flex justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-kng-purple focus:ring-offset-2";

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Usuarios</h2>}>
            <Head title="Gestión de Usuarios" />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Usuarios</h1>
                        <p className="mt-2 text-sm text-gray-700">Una lista de todos los usuarios de tu cuenta.</p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-2">
                         <button type="button" onClick={exportToCSV} className="inline-flex items-center gap-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            <ArrowDownTrayIcon className="-ml-0.5 h-5 w-5" />
                            Exportar
                        </button>
                        <button type="button" onClick={() => openModal('create')} className="inline-flex items-center gap-x-2 rounded-md bg-kng-purple px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-kng-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kng-purple">
                            <UserPlusIcon className="-ml-0.5 h-5 w-5" />
                            Crear Usuario
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="user-search" className="sr-only">Buscar usuarios</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="search" id="user-search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-kng-purple sm:text-sm" placeholder="Buscar por nombre o email..."/>
                    </div>
                </div>

                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="lg:hidden mt-4 space-y-4">
                            {/* Renderiza los usuarios paginados para la vista móvil */}
                            {paginatedUsers.map(user => (
                                <UserCard key={user.id} user={user} onEdit={() => openModal('edit', user)} onManageUnits={() => openModal('units', user)} onDelete={() => openModal('delete', user)} />
                            ))}
                        </div>

                        <div className="hidden lg:inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nombre</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rol</th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Unidades</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Acciones</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {/* Renderiza los usuarios paginados para la vista de escritorio */}
                                    {paginatedUsers.map((user) => (
                                       <UserTableRow key={user.id} user={user} onEdit={() => openModal('edit', user)} onManageUnits={() => openModal('units', user)} onDelete={() => openModal('delete', user)} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Muestra el mensaje de "No se encontraron usuarios" si filteredUsers está vacío */}
                         {filteredUsers.length === 0 && (
                            <div className="text-center py-16">
                                <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">No se encontraron usuarios</h3>
                                <p className="mt-1 text-sm text-gray-500">Intenta ajustar tu búsqueda o crea un nuevo usuario.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controles de paginación */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8 pb-4">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className={secondaryButtonClass}
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-slate-700">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={secondaryButtonClass}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>

            <ActionModal show={isModalOpen && (modalMode === 'create' || modalMode === 'edit')} onClose={closeModal} title={modalMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className={labelClass}>Nombre</label>
                        <input type="text" id="name" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} required />
                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                    </div>
                     <div>
                        <label htmlFor="email" className={labelClass}>Email</label>
                        <input type="email" id="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} required />
                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className={labelClass}>Contraseña {modalMode === 'edit' && '(Opcional)'}</label>
                        <input type="password" id="password" value={data.password} onChange={e => setData('password', e.target.value)} className={inputClass} required={modalMode === 'create'} />
                        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="password_confirmation" className={labelClass}>Confirmar Contraseña</label>
                        <input type="password" id="password_confirmation" onChange={e => setData('password_confirmation', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="role" className={labelClass}>Rol</label>
                        <select id="role" value={data.role} onChange={e => setData('role', e.target.value)} className={inputClass}>
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                         {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
                    </div>
                    <div className="pt-6 flex justify-end gap-4">
                        <button type="button" onClick={closeModal} className={secondaryButtonClass}>Cancelar</button>
                        <button type="submit" disabled={processing} className={primaryButtonClass}>{processing ? 'Guardando...' : 'Guardar Cambios'}</button>
                    </div>
                </form>
            </ActionModal>

            <ActionModal show={isModalOpen && modalMode === 'units'} onClose={closeModal} title={`Asignar Unidades a ${selectedUser?.name}`}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        {initialAllUnits.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (data.unit_ids.length === initialAllUnits.length) {
                                        setData('unit_ids', []);
                                    } else {
                                        setData('unit_ids', initialAllUnits.map(unit => unit.id));
                                    }
                                }}
                                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-kng-purple focus:ring-offset-2"
                            >
                                {data.unit_ids.length === initialAllUnits.length ? 'Deseleccionar Todas' : 'Seleccionar Todas'}
                            </button>
                        )}
                         {initialAllUnits.length === 0 && (
                            <p className="text-sm text-slate-500">No hay unidades disponibles para asignar.</p>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {initialAllUnits.map(unit => (
                            <label key={unit.id} htmlFor={`unit-${unit.id}`} className="flex items-center p-3 space-x-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                <input id={`unit-${unit.id}`} type="checkbox" value={unit.id} checked={data.unit_ids.includes(unit.id)} onChange={(e) => { const unitId = parseInt(e.target.value); if(e.target.checked) { setData('unit_ids', [...data.unit_ids, unitId]); } else { setData('unit_ids', data.unit_ids.filter(id => id !== unitId)); }}} className="h-5 w-5 rounded border-gray-300 text-kng-purple focus:ring-kng-purple" />
                                <span className="text-sm font-medium text-slate-900">{unit.nombre}</span>
                            </label>
                        ))}
                    </div>
                     <div className="pt-6 mt-6 border-t border-slate-200 flex justify-end gap-4">
                        <button type="button" onClick={closeModal} className={secondaryButtonClass}>Cancelar</button>
                        <button type="submit" disabled={processing} className={primaryButtonClass}>{processing ? 'Asignando...' : 'Asignar Unidades'}</button>
                    </div>
                </form>
            </ActionModal>

            <ActionModal show={isModalOpen && modalMode === 'delete'} onClose={closeModal} title="Confirmar Eliminación">
                 <div className="text-center">
                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">¿Eliminar usuario?</h3>
                    <p className="mt-2 text-sm text-gray-500">¿Estás seguro de que quieres eliminar a <span className="font-bold">{selectedUser?.name}</span>? Esta acción es irreversible.</p>
                </div>
                 <form onSubmit={handleSubmit} className="mt-6 flex justify-center gap-4">
                    <button type="button" onClick={closeModal} className={secondaryButtonClass}>Cancelar</button>
                    <button type="submit" disabled={processing} className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50">
                        {processing ? 'Eliminando...' : 'Sí, Eliminar'}
                    </button>
                </form>
            </ActionModal>
        </AuthenticatedLayout>
    );
}