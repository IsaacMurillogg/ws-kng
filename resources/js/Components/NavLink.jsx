import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', activeClassName = '', children, ...props }) {
    const combinedClassName = `${className} ${active ? activeClassName : ''}`.trim();

    return (
        <Link
            {...props}
            className={combinedClassName}
        >
            {children}
        </Link>
    );
}