import React, { useState, useMemo, Fragment } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import {
    MapPinIcon, // Asegúrate de que esta esté importada
    TruckIcon,
    XMarkIcon,
    WifiIcon,
    SignalSlashIcon,
    ArrowRightIcon,
    IdentificationIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    PhoneIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';


const StatItem = ({ title, value, icon: Icon, color }) => (
    <div className="relative flex items-center p-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full`} style={{ backgroundColor: `${color}1A` }}>
            <Icon className="h-6 w-6" style={{ color: color }} aria-hidden="true" />
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);


const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `Hace ${seconds}s`;
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
};

const UnitCard = ({ unit, onClick }) => {
    const statusInfo = {
        moving: { text: 'En Movimiento', color: 'text-blue-600', ring: 'ring-blue-500/20', icon: <ArrowRightIcon className="w-4 h-4 mr-1 animate-pulse" /> },
        online: { text: 'En Línea', color: 'text-green-600', ring: 'ring-green-500/20', icon: <WifiIcon className="w-4 h-4 mr-1" /> },
        offline: { text: 'Sin Conexión', color: 'text-gray-500', ring: 'ring-gray-500/20', icon: <SignalSlashIcon className="w-4 h-4 mr-1" /> },
    }[unit.status] || { text: 'Desconocido', color: 'text-gray-400', ring: 'ring-gray-400/20' };

    return (
        <button
            onClick={onClick}
            className={`group w-full text-left bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 ${unit.is_panic_active ? 'ring-4 ring-red-500 animate-pulse' : ''}`}
        >
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-kng-purple">{unit.name}</h3>
                    {unit.is_panic_active ? (
                         <div className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-100 ring-2 ring-inset ring-red-600/20">
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1"/>
                            PÁNICO
                         </div>
                    ) : (
                        <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.color} bg-white ring-2 ring-inset ${statusInfo.ring}`}>
                           {statusInfo.icon} {statusInfo.text}
                        </div>
                    )}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 truncate">
                    <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    {unit.telefono || 'Teléfono no disponible'}
                </p>
            </div>
            <div className="bg-gray-50 px-5 py-3 text-xs text-gray-500 rounded-b-xl">
                Último reporte: <span className="font-medium text-gray-700">{formatTimeAgo(unit.last_report_at)}</span>
            </div>
        </button>
    );
};

const UnitDetailModal = ({ unit, show, onClose }) => {
    // Función para abrir Google Maps
    const openGoogleMaps = () => {
        if (unit?.latitude && unit?.longitude) {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${unit.latitude},${unit.longitude}`;
            window.open(mapsUrl, '_blank');
        } else {
            alert('Coordenadas de ubicación no disponibles para esta unidad.');
        }
    };

    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="flex items-center gap-3 text-xl font-bold leading-6 text-gray-900">
                                    <TruckIcon className="w-8 h-8 p-1.5 rounded-full bg-kng-purple/10 text-kng-purple" />
                                    {unit?.name}
                                </Dialog.Title>
                                <div className="mt-4 space-y-4">
                                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                        <dl className="divide-y divide-gray-200">
                                            <div className="py-3 flex justify-between items-center text-sm"><dt className="font-medium text-gray-500 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5"/>Estado</dt><dd className="text-gray-900 font-semibold">{unit?.status}</dd></div>
                                            <div className="py-3 flex justify-between items-center text-sm"><dt className="font-medium text-gray-500 flex items-center gap-2"><IdentificationIcon className="w-5 h-5"/>Placas</dt><dd className="text-gray-900">{unit?.plates || 'N/A'}</dd></div>
                                            <div className="py-3 flex justify-between items-center text-sm">
                                                <dt className="font-medium text-gray-500 flex items-center gap-2"><PhoneIcon className="w-5 h-5"/>Teléfono</dt>
                                                <dd>
                                                    {unit?.telefono ? (
                                                        <a href={`tel:${unit.telefono}`} className="font-semibold text-kng-purple hover:underline focus:outline-none focus:ring-2 focus:ring-kng-purple rounded">
                                                            {unit.telefono}
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-900">N/A</span>
                                                    )}
                                                </dd>
                                            </div>
                                            <div className="py-3 flex justify-between items-center text-sm"><dt className="font-medium text-gray-500 flex items-center gap-2"><ClockIcon className="w-5 h-5"/>Último Reporte</dt><dd className="text-gray-900">{formatTimeAgo(unit?.last_report_at)}</dd></div>
                                        </dl>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3"> {/* Añadido 'gap-3' para espacio entre botones */}
                                    {/* Botón "Ver en Mapa" - Solo se muestra si hay latitud y longitud */}
                                    {(unit?.latitude && unit?.longitude) && (
                                        <button
                                            type="button"
                                            onClick={openGoogleMaps}
                                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-kng-purple focus:ring-offset-2"
                                        >
                                            <MapPinIcon className="h-5 w-5 mr-2" />
                                            Ver en Mapa
                                        </button>
                                    )}
                                    <button type="button" className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-kng-purple focus:ring-offset-2" onClick={onClose}>
                                        Cerrar
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// --- COMPONENTE PRINCIPAL DEL DASHBOARD ---

export default function Dashboard({ auth, units }) {
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = (unit) => {
        setSelectedUnit(unit);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedUnit(null), 300);
    };

    const kpiData = useMemo(() => ({
        totalUnits: units.length,
        online: units.filter(u => u.status === 'online' || u.status === 'moving').length,
        moving: units.filter(u => u.status === 'moving').length,
        alerts: units.filter(u => u.is_panic_active).length,
    }), [units]);

    const filteredUnits = useMemo(() => {
        if (!searchTerm) return units;
        return units.filter(unit =>
            (unit.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (unit.plates || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, units]);

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Unidades</h2>}>
            <Head title="Dashboard" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo, {auth.user.name}!</h1>
                    <p className="mt-1 text-md text-gray-600">Aquí tienes un resumen del estado de tu flota.</p>
                </div>

               <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-gray-200 sm:divide-y-0">
                    <div className="border-r border-gray-200">
                        <StatItem title="Total de Unidades" value={kpiData.totalUnits} icon={TruckIcon} color="#642869" />
                    </div>
                    <div className="lg:border-r border-gray-200">
                        <StatItem title="Unidades en Línea" value={kpiData.online} icon={WifiIcon} color="#16a34a" />
                    </div>
                    <div>
                        <StatItem title="En Movimiento" value={kpiData.moving} icon={ArrowRightIcon} color="#2563eb" />
                    </div>
                </dl>
            </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Mis Unidades</h2>
                        <div className="mt-3 sm:mt-0 sm:ml-4">
                            <label htmlFor="unit-search" className="sr-only">Buscar unidad</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="search" id="unit-search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-kng-purple sm:text-sm"
                                    placeholder="Buscar por nombre o placas..." />
                            </div>
                        </div>
                    </div>

                    {filteredUnits.length > 0 ? (
                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredUnits.map(unit => (
                                <UnitCard key={unit.id} unit={unit} onClick={() => openModal(unit)} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <TruckIcon className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No se encontraron unidades</h3>
                            <p className="mt-1 text-sm text-gray-500">Ajusta tu búsqueda o contacta al administrador si crees que es un error.</p>
                        </div>
                    )}
                </div>
            </div>

            <UnitDetailModal unit={selectedUnit} show={isModalOpen} onClose={closeModal} />
        </AuthenticatedLayout>
    );
}