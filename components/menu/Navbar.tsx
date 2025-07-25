"use client";

// Componentes
import Logo from "@/components/ui/Logo";
// Hooks
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useProfileById } from "@/hooks/useProfileById";
// Iconos
import { AlignJustify, X, ChevronDown } from "lucide-react";
// Next.js
import Link from "next/link";
import Image from "next/image";


export default function Navbar() {
    // Estados para manejar la apertura del menú y el dropdown
    const [isOpen, setIsOpen] = useState(false);
    // Estado para manejar la apertura del dropdown del perfil
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Obtener la sesión actual y el perfil del usuario
    const { data: session } = useSession();
    const { profile } = useProfileById(session?.user?.id || "");

    return (
        <nav className="w-full bg-[#e63946] shadow-md">
            <div className="container mx-auto px-4 py-2">
                <div className="flex items-center justify-between">
                    {/* Logo y título de la aplicación */}
                    <div className="flex items-center">
                        <Link href="/">
                            <div className="flex items-center">
                                <Logo />
                                <h1 className="ml-2 text-2xl text-white font-bold">LootList</h1>
                            </div>
                        </Link>
                    </div>
                    {/* Menú de navegación */}
                    <ul className="hidden md:flex space-x-4 items-center">
                        {session ? (
                            <>
                                <li className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center text-[#f1faee] hover:text-[#1d3557] transition-colors"
                                    >
                                        {profile?.profileImage && (
                                            <Image
                                                src={profile.profileImage}
                                                width={30}
                                                height={30}
                                                alt="Avatar"
                                                className="rounded-full object-cover mx-2"
                                            />
                                        )}
                                        {session.user?.username}
                                        <ChevronDown className="ml-1 w-4 h-4" />
                                    </button>
                                    {dropdownOpen && (
                                        <ul
                                            className="absolute right-0 mt-2 w-48 bg-[#1d3557] rounded shadow-lg z-50"
                                            style={{ top: "100%" }}
                                        >
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Perfil
                                                </Link>
                                            </li>
                                            <hr className="border-white/20" />
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}/likes`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Me Gustas
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}/reviews`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Reseñas
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}/played`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Jugados
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}/playing`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Jugando
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}/wishlist`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Lista de Deseos
                                                </Link>
                                            </li>
                                            <hr className="border-white/20" />
                                            <li>
                                                <Link
                                                    href="/settings/profile"
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Configuración
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        href="/auth/login"
                                        className="text-[#f1faee] hover:text-[#1d3557] transition-colors"
                                    >
                                        Iniciar sesión
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/auth/signup"
                                        className="text-[#f1faee] hover:text-[#1d3557] transition-colors"
                                    >
                                        Crear cuenta
                                    </Link>
                                </li>
                            </>
                        )}
                        <li>
                            <Link
                                href="/games"
                                className="text-[#f1faee] hover:text-[#1d3557] transition-colors"
                            >
                                Juegos
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="text-[#f1faee] hover:text-[#1d3557] transition-colors"
                            >
                                Sobre nosotros
                            </Link>
                        </li>
                    </ul>
                    {/* Botón de menú para dispositivos móviles */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-[#1d3557] focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6 text-[#1d3557]" />
                            ) : (
                                <AlignJustify className="w-6 h-6 text-[#1d3557]" />
                            )}
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <ul className="md:hidden mt-2 space-y-2 pb-2">
                        {session ? (
                            <>
                                <li>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center text-[#f1faee] hover:text-[#1d3557] transition-colors"
                                    >
                                        {profile?.profileImage && (
                                            <Image
                                                src={profile.profileImage}
                                                width={30}
                                                height={30}
                                                alt="Avatar"
                                                className="rounded-full object-cover mx-2"
                                            />
                                        )}
                                        {session.user?.username}
                                        <ChevronDown className="ml-1 w-4 h-4" />
                                    </button>
                                    {dropdownOpen && (
                                        <ul className="mt-2 bg-[#1d3557] rounded shadow-lg">
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Perfil
                                                </Link>
                                            </li>
                                            <hr className="border-white/20" />
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}/likes`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Me Gustas
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}/reviews`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Reseñas
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}/played`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Jugados
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}/playing`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Jugando
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/user/${session.user?.username}/wishlist`}
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Lista de Deseos
                                                </Link>
                                            </li>
                                            <hr className="border-white/20" />
                                            <li>
                                                <Link
                                                    href="/settings/profile"
                                                    className="block px-4 py-2 text-sm text-[#f1faee] hover:bg-[#457b9d] hover:text-[#f1faee]"
                                                >
                                                    Configuración
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        href="/auth/login"
                                        className="block py-2 text-[#f1faee] hover:text-[#1d3557] transition-colors"
                                    >
                                        Iniciar sesión
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/auth/signup"
                                        className="block py-2 text-[#f1faee] hover:text-[#1d3557] transition-colors"
                                    >
                                        Crear cuenta
                                    </Link>
                                </li>
                            </>
                        )}
                        <li>
                            <Link
                                href="/games"
                                className="block py-2 text-[#f1faee] hover:text-[#1d3557] transition-colors"
                            >
                                Juegos
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="block py-2 text-[#f1faee] hover:text-[#1d3557] transition-colors"
                            >
                                Sobre nosotros
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
}