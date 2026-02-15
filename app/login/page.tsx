"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCPF, formatWhatsApp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, CreditCard, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp, cpf }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/produtos");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home link */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para home
        </Link>

        <Card className="border-none shadow-strong">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <span className="text-3xl">🎂</span>
            </div>
            <CardTitle className="text-3xl font-serif">Bem-vindo de volta!</CardTitle>
            <CardDescription className="text-base">
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-base">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                  placeholder="(11) 99999-9999"
                  icon={<MessageSquare className="h-4 w-4" />}
                  required
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-base">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  icon={<CreditCard className="h-4 w-4" />}
                  required
                  maxLength={14}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col space-y-4 pt-0">
            <div className="text-center text-sm text-gray-600 w-full">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:text-primary-700 font-semibold hover:underline">
                Cadastre-se agora
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Seus dados estão seguros conosco</p>
        </div>
      </div>
    </div>
  );
}
