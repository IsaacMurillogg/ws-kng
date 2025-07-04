import React, { useEffect, useState } from 'react'; // Eliminado useRef, Fragment ya que no se necesitan
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    ExclamationTriangleIcon,
    BellAlertIcon,
    MapPinIcon, // MapPinIcon se mantiene porque se usa en alertTypeInfo
    WrenchScrewdriverIcon,
    ClockIcon,
    InboxIcon,
    TagIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    CalendarDaysIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    // Eliminados: TruckIcon, PhoneIcon, IdentificationIcon ya no se usan
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString).fromNow();
};

const formatFullDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
};

const alertTypeInfo = {
    panic: {
        label: 'Pánico',
        value: 'panic',
        Icon: ExclamationTriangleIcon,
        colorClass: 'text-red-700',
        bgClass: 'bg-red-50',
        borderClass: 'border-red-500',
    },
    speeding: {
        label: 'Exceso Velocidad',
        value: 'speeding',
        Icon: BellAlertIcon,
        colorClass: 'text-yellow-700',
        bgClass: 'bg-yellow-50',
        borderClass: 'border-yellow-500',
    },
    geofence_enter: {
        label: 'Entrada a Geocerca',
        value: 'geofence_enter',
        Icon: MapPinIcon,
        colorClass: 'text-blue-700',
        bgClass: 'bg-blue-50',
        borderClass: 'border-blue-500',
    },
    geofence_exit: {
        label: 'Salida de Geocerca',
        value: 'geofence_exit',
        Icon: MapPinIcon,
        colorClass: 'text-gray-700',
        bgClass: 'bg-gray-50',
        borderClass: 'border-gray-400',
    },
    sensor_change: {
        label: 'Cambio de Sensor',
        value: 'sensor_change',
        Icon: WrenchScrewdriverIcon,
        colorClass: 'text-indigo-700',
        bgClass: 'bg-indigo-50',
        borderClass: 'border-indigo-500',
    },
    default: {
        label: 'Notificación',
        value: 'default',
        Icon: BellAlertIcon,
        colorClass: 'text-gray-700',
        bgClass: 'bg-gray-50',
        borderClass: 'border-gray-400',
    },
};

const AlertBadge = ({ type }) => {
    const { label, colorClass, bgClass } = alertTypeInfo[type] || alertTypeInfo.default;
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${bgClass} ${colorClass} ring-1 ring-inset ring-current/20`}>
            {label}
        </span>
    );
};

const AlertItem = ({ evento, isLast }) => {
    const { Icon, colorClass, borderClass } = alertTypeInfo[evento.type] || alertTypeInfo.default;

    // Eliminados: isExpanded state y toggleExpansion function

    // Eliminado: handleViewOnMap function ya que el botón no se mostrará

    return (
        <li className="relative flex gap-x-4 p-0 m-0">
            {!isLast && (
                <div className="absolute left-4 top-0 flex w-px justify-center h-full">
                    <div className="w-px bg-gray-200"></div>
                </div>
            )}
            <div className="relative flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white ring-1 ring-gray-200 z-10">
                <Icon className={`h-5 w-5 ${colorClass}`} aria-hidden="true" />
            </div>
            {/* Se elimina el onClick, y se mantienen los estilos de hover para una estética consistente */}
            <div className={`flex-auto rounded-md p-4 ring-1 ring-gray-200 bg-white border-l-4 ${borderClass} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
                <div className="flex justify-between items-start gap-x-2 sm:gap-x-4">
                    <div className="flex-1 min-w-0">
                        <div className="py-0.5 text-md leading-5 font-semibold text-gray-800 flex flex-wrap items-center">
                            {evento.unit_name}
                            {evento.unit_id && (
                                <span className="ml-2 mt-1 sm:mt-0 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 whitespace-nowrap">
                                    <TagIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                                    ID: {evento.unit_id}
                                </span>
                            )}
                        </div>
                    </div>
                    <time dateTime={evento.timestamp} className="flex-none py-0.5 text-xs leading-5 text-gray-500 text-right min-w-[60px] sm:min-w-[80px]">
                        {formatTimeAgo(evento.timestamp)}
                        <br />
                        <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">{formatFullDateTime(evento.timestamp)}</span>
                    </time>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <AlertBadge type={evento.type} />
                </div>

                {/* Eliminado: Todo el bloque de contenido expandible */}
            </div>
        </li>
    );
};

const EmptyState = ({ onRefresh }) => (
    <div className="text-center py-20 px-6">
        <InboxIcon className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Sin Actividad Reciente</h3>
        <p className="mt-1 text-sm text-gray-500">
            No se encontraron eventos con los filtros actuales.
        </p>
        <p className="mt-6">
            <button
                onClick={onRefresh}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                <ClockIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                Limpiar filtros y refrescar
            </button>
        </p>
    </div>
);

export default function Index({ auth, eventos, initialSearch = '', initialType = '', initialStartDate = '', initialEndDate = '' }) {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [selectedType, setSelectedType] = useState(initialType || '');
    const [startDate, setStartDate] = useState(initialStartDate || '');
    const [endDate, setEndDate] = useState(initialEndDate || '');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const refreshInterval = 15000;

        const intervalId = setInterval(() => {
            router.reload({ only: ['eventos'], preserveState: true, preserveScroll: true });
        }, refreshInterval);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const applyFilters = () => {
        router.get(route('alerts.index'), {
            search: searchTerm,
            type: selectedType,
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('');
        setStartDate('');
        setEndDate('');
        router.get(route('alerts.index'), {}, {
            preserveState: false,
            preserveScroll: true,
            replace: true,
        });
    };

    const allAlertTypes = [
        { label: 'Todos los tipos', value: '' },
        ...Object.values(alertTypeInfo).filter(type => type.value !== 'default')
    ];

    const isAnyFilterActive = searchTerm || selectedType || startDate || endDate;

    return (
        <AuthenticatedLayout auth={auth} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Alertas</h2>}>
            <Head title="Alertas" />

            <div className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Historial de Actividad de la Flota</h1>
                    <p className="mt-1 text-md text-gray-600">
                        Monitorea todos los eventos importantes generados por tus unidades.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Alertas Recientes</h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-200"
                        >
                            <FunnelIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                            Filtrar
                            {isAnyFilterActive && (
                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                    Filtro(s) Activo(s)
                                </span>
                            )}
                            {showFilters ? <ChevronUpIcon className="h-5 w-5 ml-2" /> : <ChevronDownIcon className="h-5 w-5 ml-2" />}
                        </button>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                        style={{
                            border: showFilters ? '1px solid #e5e7eb' : 'none',
                            borderRadius: '0.5rem',
                            padding: showFilters ? '1rem' : '0',
                            backgroundColor: showFilters ? '#f9fafb' : 'transparent',
                        }}
                    >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Ajustar Filtros</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700">Buscar (Unidad, ID)</label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Nombre o ID de unidad..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        type="date"
                                        id="start_date"
                                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        type="date"
                                        id="end_date"
                                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-x-2 gap-y-2 mt-6">
                            {isAnyFilterActive && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Limpiar
                                </button>
                            )}
                            <button
                                onClick={applyFilters}
                                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>

                    {eventos.data.length === 0 ? (
                        <div className="mt-8">
                            <EmptyState onRefresh={clearFilters} />
                        </div>
                    ) : (
                        <>
                            <div className="mt-8 grid grid-cols-1 gap-6">
                                <ul role="list" className="space-y-6">
                                    {eventos.data.map((evento, index) => (
                                        <AlertItem
                                            key={evento.id}
                                            evento={evento}
                                            isLast={index === eventos.data.length - 1}
                                        />
                                    ))}
                                </ul>
                            </div>

                            <nav className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-md shadow-sm">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    <Link
                                        href={eventos.prev_page_url || '#'}
                                        disabled={!eventos.prev_page_url}
                                        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${!eventos.prev_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Anterior
                                    </Link>
                                    <Link
                                        href={eventos.next_page_url || '#'}
                                        disabled={!eventos.next_page_url}
                                        className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${!eventos.next_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Siguiente
                                    </Link>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Mostrando <span className="font-medium">{eventos.from}</span> a <span className="font-medium">{eventos.to}</span> de{' '}
                                            <span className="font-medium">{eventos.total}</span> resultados
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                            {eventos.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    onClick={(e) => {
                                                        if (!link.url) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                                        link.active
                                                            ? 'z-10 bg-indigo-600 text-white focus-visible:outline-indigo-600'
                                                            : 'text-gray-900 hover:bg-gray-50 focus-visible:outline-gray-600'
                                                    } ${
                                                        index === 0 ? 'rounded-l-md' : ''
                                                    } ${
                                                        index === eventos.links.length - 1 ? 'rounded-r-md' : ''
                                                    } ${
                                                        !link.url ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </nav>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}