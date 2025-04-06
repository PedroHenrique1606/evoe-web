import { Sidebar } from "@/components/Sidebar/Sidebar"
import { Outlet } from "react-router-dom"

export default function Main() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar fixa no desktop, retrátil no mobile */}
            <Sidebar />

            {/* Conteúdo principal com margem esquerda para a sidebar */}
            <div className="flex-1 bg-gray-50 p-6 ">
                <Outlet />
            </div>
        </div>
    )
}
