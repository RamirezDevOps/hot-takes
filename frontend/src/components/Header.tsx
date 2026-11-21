import { NavLink } from "react-router-dom";

interface HeaderSimpleProps {
    links: { link: string; label: string }[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 sm:px-8">
                <NavLink to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 no-underline">
                    <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-lg">✦</span>
                    Hot Takes
                </NavLink>

                <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.link}
                            end={link.link === "/"}
                            className={({ isActive }) =>
                                `rounded-lg px-3 py-2 text-sm font-semibold no-underline transition-colors sm:px-4 ${
                                    isActive
                                        ? "bg-orange-50 text-orange-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}
