import { Link, useLocation } from "react-router-dom"
import { User, Menu, Settings, LogOut, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import EvoeLogo from "@/assets/evoe-logo.png"
import { useAuth, useAuthLogout } from "@/context/authContext"
import clsx from "clsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export const Sidebar = () => {
    const { user } = useAuth()
    const logout = useAuthLogout()
    const { pathname } = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileOpen, setMobileOpen] = useState(false)

    const isActive = (path: string) => pathname === path

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev)
    }

    const toggleMobile = () => {
        setMobileOpen(prev => !prev)
    }

    return (
        <>
            <button
                onClick={toggleMobile}
                className="md:hidden fixed top-4 left-4 z-50 bg-white border p-2 rounded shadow"
            >
                <Menu className="w-5 h-5" />
            </button>


            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={clsx(
                    "fixed md:static top-0 left-0 z-50 bg-white shadow-lg h-screen",
                    "transition-all duration-300 flex flex-col justify-between",
                    sidebarOpen ? "w-64" : "w-20",
                    mobileOpen ? "block" : "hidden md:flex"
                )}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    {sidebarOpen && <img src={EvoeLogo} alt="Logo" className="h-8 w-auto" />}
                    <div className={clsx("flex-1 flex ", sidebarOpen ? "justify-end" : "justify-center")}>
                        <button onClick={toggleSidebar} className="md:inline-flex items-center">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto">
                    <ul className="space-y-2 p-4">
                        <li>
                            <Link
                                to="/dashboard"
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-md transition",
                                    isActive("/dashboard")
                                        ? "bg-gray-950 font-semibold text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                {sidebarOpen && <span>Dashboard</span>}
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t mt-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full flex items-center gap-2 justify-start text-sm"
                            >
                                <User className="w-5 h-5" />
                                {sidebarOpen && (
                                    <div className="text-left">
                                        <p className="font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="start" className="w-48 cursor-pointer">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = "/configuracoes"}>
                                <Settings className="w-4 h-4 mr-2 cursor-pointer" /> Configurações
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                                <LogOut className="w-4 h-4 mr-2 cursor-pointer" /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>
        </>
    )
}
