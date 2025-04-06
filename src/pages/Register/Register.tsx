import { useState } from "react";
import reactLogo from "../../assets/evoe-logo.png";
import { Eye, EyeClosed } from 'lucide-react';
import clsx from "clsx"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { userService } from "@/services/user.service";
import '../../index.css'
function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const getPasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 1) return { label: "Senha fraca", color: "bg-red-500", percent: "33%" }
    if (score === 2 || score === 3) return { label: "Senha média", color: "bg-yellow-500", percent: "66%" }
    return { label: "Senha forte", color: "bg-green-500", percent: "100%" }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }
  const handleSubmit = async () => {
    const { name, email, bio, password, confirmPassword, phone } = form

    if (!name || !email || !bio || !password || !confirmPassword) {
      toast.error("Todos os campos são obrigatórios.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.")
      return
    }

    try {
      const payload = {
        name,
        email,
        bio,
        password,
        phone,
        role: "usuario",
      }

      await userService.register(payload)
      toast.success("Usuário cadastrado com sucesso!")
      window.location.href = "/login"
    } catch (err) {
      console.error(err)
      toast.error("Erro ao cadastrar usuário.")
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      <div className="flex items-center justify-center md:bg-white">
        <img src={reactLogo} alt="Logo da empresa" className="max-w-[300px]" />
      </div>

      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-xl rounded-2xl bg-gray-50 ">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold font-syne">
              Criar conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio rápida</Label>
              <Input id="bio" name="bio" value={form.bio} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                >
                  {showPassword ? <Eye className="w-5 cursor-pointer" /> : <EyeClosed className="w-5 cursor-pointer" />}
                </button>
              </div>

              {/* Barra de força */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className={clsx("h-2 transition-all duration-300", getPasswordStrength(form.password).color)}
                      style={{ width: getPasswordStrength(form.password).percent }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    {getPasswordStrength(form.password).label}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                >
                  {showConfirmPassword ? <Eye className="w-5 cursor-pointer" /> : <EyeClosed className="w-5 cursor-pointer" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full font-bold mt-4 cursor-pointer"
            >
              Cadastrar
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-4">
              Já tem uma conta?{" "}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Entrar
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegisterForm
