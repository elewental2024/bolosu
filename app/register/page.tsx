"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Smartphone, CreditCard, UserPlus } from "lucide-react";
import { formatCPF, formatWhatsApp, validateCPF } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cpf, setCpf] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateCPF(cpf)) {
      setError("CPF inválido");
      return;
    }

    // Validate PIN
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN deve conter exatamente 4 números");
      return;
    }

    if (pin !== pinConfirm) {
      setError("PINs não conferem");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, whatsapp, cpf, pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to products
      router.push("/produtos");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-4 text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mx-auto"
            >
              <div className="text-6xl">🎂</div>
            </motion.div>
            <CardTitle className="text-3xl">Criar Conta</CardTitle>
            <CardDescription className="text-base">
              Cadastre-se para fazer seus pedidos de bolos deliciosos
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-start gap-2"
              >
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  type="text"
                  id="name"
                  icon={<User className="w-5 h-5" />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maria Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  type="tel"
                  id="whatsapp"
                  icon={<Smartphone className="w-5 h-5" />}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                  placeholder="(11) 99999-9999"
                  required
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  type="text"
                  id="cpf"
                  icon={<CreditCard className="w-5 h-5" />}
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  required
                  maxLength={14}
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">Crie um PIN de 4 dígitos*</Label>
                  <p className="text-sm text-gray-600">
                    Use para acessar sua conta de forma segura
                  </p>
                  <Input
                    type="password"
                    id="pin"
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPin(value.slice(0, 4));
                    }}
                    placeholder="••••"
                    required
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pinConfirm">Confirme o PIN*</Label>
                  <Input
                    type="password"
                    id="pinConfirm"
                    value={pinConfirm}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPinConfirm(value.slice(0, 4));
                    }}
                    placeholder="••••"
                    required
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Cadastrar
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="text-pink-600 hover:text-pink-700 font-semibold hover:underline"
                >
                  Faça login
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Voltar para a página inicial
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
