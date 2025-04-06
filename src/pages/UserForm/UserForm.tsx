"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthUser } from "@/context/authContext"
import { userService, getUserService } from "@/services/user.service"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import { useFormatService } from "@/services/format.service"
import clsx from "clsx"
import { Eye, EyeClosed } from "lucide-react"

export default function UserFormPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const userLogged = useAuthUser()
    const isEditing = !!id

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
        password: "",
        role: "usuario"
    })

    const isDisabled = userLogged?.role === "apoiador"
    const { maskPhone } = useFormatService()
    const [showPassword, setShowPassword] = useState(false)

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


    useEffect(() => {
        if (isEditing) {
            getUserService.getById(id as string)
                .then((res) => {
                    setForm({
                        name: res.name || "",
                        email: res.email || "",
                        phone: res.phone || "",
                        bio: res.bio || "",
                        password: "", // nunca preenche com senha
                        role: res.role || "",
                    })
                })
                .catch(() => toast.error("Erro ao carregar dados do usuário."))
        }
    }, [id, isEditing])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        const newValue =
            name === "phone" ? maskPhone(value.replace(/\D/g, "")) : value

        setForm((prev) => ({
            ...prev,
            [name]: newValue,
        }))
    }

    const handleSubmit = async () => {
        if (isDisabled) return

        try {
            if (isEditing) {
                await userService.update(id as string, form)
                toast.success("Usuário atualizado com sucesso!")
            } else {
                if (userLogged?.role === "usuario") {
                    await userService.createByAuth(form)
                } else {
                    await userService.register({ ...form, role: "usuario" }) // fallback
                }
                toast.success("Usuário criado com sucesso!")
            }
            navigate("/dashboard")
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            const message = err.response?.data?.message || "Erro ao salvar usuário."
            toast.error(message)
        }
    }

    return (
        <div className="flex justify-center pt-10 px-4">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-syne text-center">
                        {isEditing ? "Editar Usuário" : "Criar Usuário"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isDisabled && (
                        <p className="text-sm text-red-500 font-medium text-center">
                            Sua conta é do tipo <b>apoiador</b> e não tem permissão para criar ou editar usuários.
                        </p>
                    )}

                    <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input name="name" value={form.name} onChange={handleChange} disabled={isDisabled} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input name="email" value={form.email} onChange={handleChange} disabled={isDisabled} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                            name="phone"
                            value={form.phone || ""}
                            onChange={handleChange}
                            disabled={isDisabled}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Input name="bio" value={form.bio} onChange={handleChange} disabled={isDisabled} />
                    </div>
                    {!isEditing && (
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                                >
                                    {showPassword ? <Eye className="w-5 cursor-pointer" /> : <EyeClosed className="w-5 cursor-pointer" />}
                                </button>
                            </div>
                        </div>
                    )}
                    {form.password && !isEditing &&(
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

                    <Button onClick={handleSubmit} className="w-full" disabled={isDisabled}>
                        {isEditing ? "Salvar alterações" : "Criar usuário"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
