import React, { useState, useEffect, Fragment } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Dialog, Transition, Menu } from '@headlessui/react';
import { Toaster } from 'react-hot-toast';

import {
    Bars3Icon,
    UsersIcon,
    XMarkIcon,
    ChevronDownIcon,
    ArrowLeftOnRectangleIcon,
    Cog6ToothIcon,
    TruckIcon,
    BellIcon
} from '@heroicons/react/24/outline';
import { Alarm } from '@mui/icons-material';

function ApplicationLogo({ className = '', ...props }) {
    return <img src="/img/kng.png" alt="Logo de KNG" className={className} {...props} />;
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const WhatsAppIcon = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M12.01 2.04C6.5 2.04 2.04 6.5 2.04 12.01c0 1.75.45 3.38 1.24 4.84L2 22l5.27-1.38c1.42.73 3 1.15 4.73 1.15 5.51 0 9.97-4.46 9.97-9.97S17.52 2.04 12.01 2.04zm0 18.24c-1.49 0-2.91-.39-4.14-1.09l-.3-.18-3.07.81.83-3-.2-.32c-.79-1.29-1.22-2.79-1.22-4.39 0-4.54 3.69-8.23 8.23-8.23 4.54 0 8.23 3.69 8.23 8.23S16.55 20.28 12.01 20.28zm5.28-5.83c-.22-.11-1.29-.64-1.49-.71s-.35-.11-.49.11c-.15.22-.56.71-.69.86s-.26.17-.49.06c-.22-.11-.95-.35-1.8-1.11-.67-.59-1.11-1.33-1.24-1.55s-.01-.34.1-.45c.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39s-.49-1.19-.68-1.62c-.18-.42-.37-.36-.49-.37-.11 0-.26 0-.41 0s-.39.06-.59.28c-.2.22-.77.75-.77 1.84s.79 2.13.9 2.28c.11.15 1.54 2.34 3.74 3.28.53.23.95.36 1.28.46.54.17 1.04.15 1.43.09.43-.07 1.29-.52 1.47-1.03.18-.5.18-.93.13-1.03s-.13-.14-.35-.25z" />
    </svg>
);

const UserAvatar = ({ user }) => (
    <div className="relative shrink-0">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-kng-purple/10 text-kng-purple">
            <span className="font-semibold leading-none">{user.name.charAt(0).toUpperCase()}</span>
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" title="Online" aria-hidden="true" />
    </div>
);

const MainNavigation = ({ navigation }) => (
    <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
                <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <Link href={item.href} className={classNames( item.current ? 'bg-kng-purple/10 text-kng-purple' : 'text-slate-700 hover:text-kng-purple hover:bg-kng-purple/5', 'group relative flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200' )}>
                                <span className={classNames( item.current ? 'bg-kng-purple' : 'bg-transparent', 'absolute inset-y-0 left-0 w-1 rounded-r-full transition-colors duration-200' )}></span>
                                <item.icon className={classNames( item.current ? 'text-kng-purple' : 'text-slate-400 group-hover:text-kng-purple', 'h-6 w-6 shrink-0 transition-colors duration-200' )} aria-hidden="true" />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </li>
            <li className="mt-auto">
                <a href="https://wa.me/5214776674467" target="_blank" rel="noopener noreferrer" className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-green-700 bg-green-50 hover:bg-green-100">
                    <WhatsAppIcon className="h-6 w-6 shrink-0 text-green-600" />
                    Soporte SATECH
                </a>
            </li>
        </ul>
    </nav>
);

export default function AuthenticatedLayout({ user, header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth: authData, url } = usePage().props; // <-- Obtenemos 'url' directamente
    const authUser = user || authData.user;
    const [hasNewAlerts, setHasNewAlerts] = useState(true);

    // --- CORRECCIÓN ---
    // Escuchamos los cambios en la 'url' de la página, que es más seguro que 'ziggy.location'.
    useEffect(() => {
        if (route().current('alerts.index')) {
            setHasNewAlerts(false);
        }
    }, [url]); // <-- El array de dependencias ahora usa 'url'

    const navigation = [
        { name: 'Unidades', href: route('dashboard'), icon: TruckIcon, current: route().current('dashboard') },
        { name: 'Alertas', href: route('alerts.index'), icon: Alarm, current: route().current('alerts.index') },
    ];

    if (authUser.role === 'admin') {
        navigation.push({
            name: 'Usuarios',
            href: route('admin.users.index'),
            icon: UsersIcon,
            current: route().current('admin.users.index')
        });
    }

    const userNavigation = [
        { name: 'Mi Perfil', href: route('profile.edit'), icon: Cog6ToothIcon },
        { name: 'Cerrar Sesión', href: route('logout'), method: 'post', as: 'button', icon: ArrowLeftOnRectangleIcon },
    ];

    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />

            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                    <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-gray-900/80" /></Transition.Child>
                    <div className="fixed inset-0 flex">
                        <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5"><button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}><span className="sr-only">Cerrar menú</span><XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" /></button></div>
                                </Transition.Child>
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                    <div className="flex h-16 shrink-0 items-center"><Link href="/"><ApplicationLogo className="block h-9 w-auto" /></Link></div>
                                    <MainNavigation navigation={navigation} />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                    <div className="flex h-16 shrink-0 items-center"><Link href="/"><ApplicationLogo className="block h-10 w-auto" /></Link></div>
                    <MainNavigation navigation={navigation} />
                    <div className="mt-auto -mx-6">
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center gap-x-4 w-full px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 focus:outline-none transition-colors duration-200">
                                <UserAvatar user={authUser} />
                                <span className="flex-1 text-left"><span className="sr-only">Tu perfil</span><span aria-hidden="true">{authUser.name}</span></span>
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </Menu.Button>
                            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                <Menu.Items className="absolute bottom-full mb-2.5 w-full origin-bottom-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                    {userNavigation.map((item) => (
                                        <Menu.Item key={item.name}>
                                            {({ active }) => (<Link href={item.href} method={item.method} as={item.as} className={classNames(active ? 'bg-gray-50' : '', 'group flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50')}><item.icon className="h-5 w-5 text-gray-400 group-hover:text-kng-purple" />{item.name}</Link>)}
                                        </Menu.Item>
                                    ))}
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>

            <div className="lg:pl-72">
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}><span className="sr-only">Abrir menú</span><Bars3Icon className="h-6 w-6" aria-hidden="true" /></button>
                    <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex items-center flex-1">{header}</div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <Link href={route('alerts.index')} className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Ver alertas</span>
                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                {hasNewAlerts && (
                                    <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true" />
                                )}
                            </Link>

                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

                            <div className="lg:hidden">
                                <Menu as="div" className="relative">
                                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                        <span className="sr-only">Abrir menú de usuario</span>
                                        <UserAvatar user={authUser} />
                                    </Menu.Button>
                                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                            {userNavigation.map((item) => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <Link href={item.href} method={item.method} as={item.as} className={classNames(active ? 'bg-gray-100' : '', 'group flex w-full items-center gap-x-3 px-4 py-2 text-sm font-semibold leading-6 text-gray-700')}>
                                                            <item.icon className="h-5 w-5 text-gray-400 group-hover:text-kng-purple" />
                                                            {item.name}
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
