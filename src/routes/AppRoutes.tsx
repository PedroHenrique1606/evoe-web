import { useAuth } from "@/context/authContext"
import { Dashboard } from "@/pages/Dashboard/Dashboard"
import LoginForm from "@/pages/Login/Login"
import Main from "@/pages/Main/Main"
import RedefinedPassword from "@/pages/RedefinedPassword/RedefinedPassword"
import RegisterForm from "@/pages/Register/Register"
import SettingsPage from "@/pages/Settings/Settings"
import UserFormPage from "@/pages/UserForm/UserForm"
import { Routes, Route, Navigate } from "react-router-dom"

export default function AppRoutes() {
  const { access_token: token } = useAuth()

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/registrar" element={<RegisterForm />} />
      <Route path="/esqueceu-senha" element={<RedefinedPassword />} />

      {/* Rotas protegidas */}
      {token && (
        <Route element={<Main />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuario" element={<UserFormPage />} />
          <Route path="/usuario/:id" element={<UserFormPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      )}

      {/* Fallback para rotas inválidas quando não autenticado */}
      {!token && (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  )
}
