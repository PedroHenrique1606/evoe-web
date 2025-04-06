"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthUser } from "@/context/authContext"
import { getUserService, userService } from "@/services/user.service"
import { useFormatService } from "@/services/format.service"
import toast from "react-hot-toast"
import clsx from "clsx"
import { Eye, EyeClosed, Sparkles } from "lucide-react"

const philosopherQuotes = [
    "“Conhece-te a ti mesmo.” – Sócrates",
    "“Penso, logo existo.” – Descartes",
    "“O homem é a medida de todas as coisas.” – Protágoras",
    "“A vida não examinada não vale a pena ser vivida.” – Sócrates",
    "“A felicidade é o significado e o propósito da vida.” – Aristóteles",
    "“Tudo flui, nada permanece.” – Heráclito",
    "“Liberdade é a consciência da necessidade.” – Hegel",
]

export default function SettingsPage() {
    const userLogged = useAuthUser()
    const { maskPhone } = useFormatService()

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [quote, setQuote] = useState("")

    useEffect(() => {
        if (userLogged?.id) {
            getUserService.getById(userLogged.id)
                .then((res) => {
                    setForm({
                        name: res.name,
                        email: res.email || "",
                        phone: res.phone || "",
                        bio: res.bio || "",
                        password: ""
                    })
                })
                .catch(() => toast.error("Erro ao carregar informações do perfil."))
        }

        setQuote(philosopherQuotes[Math.floor(Math.random() * philosopherQuotes.length)])
    }, [userLogged?.id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const newValue = name === "phone" ? maskPhone(value.replace(/\D/g, "")) : value
        setForm((prev) => ({ ...prev, [name]: newValue }))
    }

    const handlePasswordChange = async () => {
        if (!form.password) return toast.error("Digite uma nova senha.")
        try {
            await userService.updatePassword(userLogged!.id, form.password)
            toast.success("Senha atualizada com sucesso!")
            setForm(prev => ({ ...prev, password: "" }))
        } catch {
            toast.error("Erro ao atualizar a senha.")
        }
    }

    const handleSaveProfile = async () => {
        try {
            await userService.update(userLogged!.id, {
                name: form.name,
                email: form.email,
                phone: form.phone,
                bio: form.bio,
                role: userLogged!.role,
            })
            toast.success("Perfil atualizado com sucesso!")
        } catch {
            toast.error("Erro ao atualizar perfil.")
        }
    }

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

    return (
        <div className="flex justify-center pt-10 px-4">
            <Card className="w-full max-w-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold font-syne">Configurações da Conta</CardTitle>
                    <p className="text-sm text-muted-foreground">Gerencie seu perfil e sua senha</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input name="name" value={form.name} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input name="email" value={form.email} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Input name="bio" value={form.bio} onChange={handleChange} />
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full font-semibold">
                        Salvar alterações no perfil
                    </Button>

                    <div className="space-y-2 pt-4">
                        <Label>Nova senha</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? <Eye className="w-5" /> : <EyeClosed className="w-5" />}
                            </button>
                        </div>
                    </div>

                    {form.password && (
                        <div className="space-y-1">
                            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                                <div
                                    className={clsx("h-2 transition-all duration-300", getPasswordStrength(form.password).color)}
                                    style={{ width: getPasswordStrength(form.password).percent }}
                                />
                            </div>
                            <p className="text-xs italic text-muted-foreground">
                                {getPasswordStrength(form.password).label}
                            </p>
                        </div>
                    )}

                    <Button onClick={handlePasswordChange} className="w-full font-semibold">
                        Atualizar senha
                    </Button>

                    {/* Easter Egg */}
                    <div className="text-center text-xs text-muted-foreground pt-4 italic flex items-center justify-center gap-1">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        {quote}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
