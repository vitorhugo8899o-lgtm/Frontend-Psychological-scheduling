import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarButton({
    icon: Icon,
    label,
    onClick,
    isActive = false,
    to
}) {

    const className = `
        flex items-center gap-3.5 px-6 py-3.5 text-sm text-left border-l-4 transition-all w-full
        ${isActive
            ? 'border-[#A60321] bg-white/10 text-[#FAF5EC]'
            : 'border-transparent text-[#FAF5EC]/80 hover:text-[#FAF5EC] hover:bg-white/5 hover:border-[#A60321]'
        }
    `;


    if (to) {
        return (
            <Link
                to={to}
                className={className}
            >
                <Icon
                    className={`w-5 h-5 ${isActive
                            ? 'text-[#A60321]'
                            : 'text-gray-400'
                        }`}
                />

                <span>{label}</span>
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className={className}
        >
            <Icon
                className={`w-5 h-5 ${isActive
                        ? 'text-[#A60321]'
                        : 'text-gray-400'
                    }`}
            />

            <span>{label}</span>
        </button>
    );
}