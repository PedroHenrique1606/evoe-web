import { useState } from "react";
import reactLogo from "../../assets/evoe-logo.png";
import { Eye, EyeClosed, KeyRound, UserPlus } from "lucide-react";
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
import { useAuth } from "@/context/authContext";
import { authService } from "@/services/auth.service";
import { Link } from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const data = await authService.login(email, password)

            login(data.access_token, {
                id: data.id,
                name: data.name,
                role: 'usuario',
            })

            toast.success("Login realizado com sucesso!")
            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err)
            toast.error("Email ou senha inválidos.")
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
                            Entrar no sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                                >
                                    {showPassword ? (
                                        <Eye className="w-5 cursor-pointer" />
                                    ) : (
                                        <EyeClosed className="w-5 cursor-pointer" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            onClick={handleLogin}
                            className="w-full font-bold mt-4 cursor-pointer"
                        >
                            Entrar
                        </Button>

                        <div className="mt-6 flex flex-col items-center gap-3 text-sm">
                            <Link
                                to="/registrar"
                                className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                            >
                                <UserPlus className="w-4 h-4" />
                                Criar conta
                            </Link>

                            <div className="w-10 border-t border-muted-foreground" />

                            <Link
                                to="/esqueceu-senha"
                                className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                            >
                                <KeyRound className="w-4 h-4" />
                                Redefinir senha
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default LoginForm;
