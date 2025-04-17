import { useState } from "react";
import reactLogo from "../../assets/Petrus-logo.png";
import { Eye, EyeClosed } from "lucide-react";
import {
    Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import clsx from "clsx";

export default function RedefinedPassword() {
    const [step, setStep] = useState<"email" | "code" | "reset">("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(Array(6).fill(""));
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const getPasswordStrength = (password: string) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1) return { label: "Senha fraca", color: "bg-red-500", percent: "33%" };
        if (score === 2 || score === 3) return { label: "Senha média", color: "bg-yellow-500", percent: "66%" };
        return { label: "Senha forte", color: "bg-green-500", percent: "100%" };
    };

    const handleRequestCode = async () => {
        try {
            await authService.requestResetCode({ email });
            localStorage.setItem("reset_email", email);
            toast.success("Código enviado! Verifique seu email.");
            setStep("code");
        } catch {
            toast.error("Erro ao solicitar código. Verifique o e-mail.");
        }
    };

    const handleValidateCode = async () => {
        try {
            const enteredCode = code.join("");
            await authService.validateResetCode({ email: localStorage.getItem("reset_email")!, code: enteredCode });
            toast.success("Código validado com sucesso!");
            setStep("reset");
        } catch {
            toast.error("Código inválido.");
        }
    };

    const handleResetPassword = async () => {
        try {
            await authService.resetPassword({
                email: localStorage.getItem("reset_email")!,
                newPassword,
            });
            toast.success("Senha redefinida com sucesso!");
            navigate("/login");
        } catch {
            toast.error("Erro ao redefinir senha.");
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
            <div className="flex items-center justify-center md:bg-white">
                <img src={reactLogo} alt="Logo da empresa" className="max-w-[300px]" />
            </div>

            <div className="flex items-center justify-center p-8">
                <Card className="w-full max-w-md shadow-xl rounded-2xl bg-gray-50">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold font-syne">
                            {step === "email" && "Redefinir senha"}
                            {step === "code" && "Digite o código"}
                            {step === "reset" && "Nova senha"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {step === "email" && (
                            <>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleRequestCode} className="w-full font-bold mt-2">
                                    Enviar código
                                </Button>
                            </>
                        )}

                        {step === "code" && (
                            <>
                                <Label>Código recebido</Label>
                                <div className="flex justify-between gap-2">
                                    {code.map((value, index) => (
                                        <Input
                                            key={index}
                                            maxLength={1}
                                            className="text-center"
                                            value={value}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                if (val) {
                                                    const newCode = [...code];
                                                    newCode[index] = val;
                                                    setCode(newCode);
                                                    const next = document.getElementById(`code-${index + 1}`);
                                                    if (next) next.focus();
                                                }
                                            }}
                                            id={`code-${index}`}
                                        />
                                    ))}
                                </div>
                                <Button onClick={handleValidateCode} className="w-full font-bold mt-2">
                                    Validar código
                                </Button>
                            </>
                        )}

                        {step === "reset" && (
                            <>
                                <div className="space-y-2">
                                    <Label>Nova senha</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? <Eye className="w-5" /> : <EyeClosed className="w-5" />}
                                        </button>
                                    </div>
                                </div>
                                {newPassword && (
                                    <div className="space-y-1">
                                        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                                            <div
                                                className={clsx(
                                                    "h-2 transition-all duration-300",
                                                    getPasswordStrength(newPassword).color
                                                )}
                                                style={{ width: getPasswordStrength(newPassword).percent }}
                                            />
                                        </div>
                                        <p className="text-xs italic text-muted-foreground">
                                            {getPasswordStrength(newPassword).label}
                                        </p>
                                    </div>
                                )}
                                <Button onClick={handleResetPassword} className="w-full font-bold mt-2">
                                    Redefinir senha
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
