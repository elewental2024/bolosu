import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, MessageCircle, Truck, Heart, Star, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-400 to-secondary-400 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAx Ljc5IDQgNCA0IDQtMS43OSA0LTR6TTI0IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAx Ljc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0xMiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAx Ljc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 text-sm font-medium">
              <Star className="h-4 w-4 fill-current" />
              <span>Bolos Artesanais Premium</span>
              <Star className="h-4 w-4 fill-current" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              Bolos Artesanais<br />
              <span className="text-secondary-200">Feitos com Amor</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              Sabores irresistíveis e qualidade premium para tornar seus momentos ainda mais especiais
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/produtos">
                <Button size="xl" className="bg-white text-primary hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ver Cardápio
                </Button>
              </Link>
              <Link href="/register">
                <Button size="xl" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                  Fazer Cadastro
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Featured Benefits */}
      <section className="py-16 -mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-white border-none shadow-medium hover:shadow-strong transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">100% Artesanal</h3>
                <p className="text-gray-600">Receitas exclusivas e ingredientes selecionados</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-medium hover:shadow-strong transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-secondary-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Entrega Expressa</h3>
                <p className="text-gray-600">Receba seu bolo fresquinho em casa</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-medium hover:shadow-strong transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Atendimento Exclusivo</h3>
                <p className="text-gray-600">Chat direto para personalizar seu pedido</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simples, rápido e delicioso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-3">Escolha seu Bolo</h3>
                <p className="text-gray-600">
                  Navegue pelo nosso cardápio e selecione seus sabores favoritos
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-0.5 bg-primary-200"></div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-3">Finalize o Pedido</h3>
                <p className="text-gray-600">
                  Adicione o endereço de entrega e escolha a data desejada
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-0.5 bg-primary-200"></div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-3">Receba em Casa</h3>
                <p className="text-gray-600">
                  Acompanhe seu pedido e receba fresquinho no horário combinado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-600 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform rotate-45 -right-20 -top-20 w-96 h-96 bg-white rounded-full"></div>
          <div className="absolute transform -rotate-45 -left-20 -bottom-20 w-96 h-96 bg-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Pronto para Adoçar seu Dia?
          </h2>
          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
            Faça seu cadastro agora e explore nossos deliciosos sabores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" className="bg-white text-primary hover:bg-gray-50 shadow-lg">
                <CheckCircle className="mr-2 h-5 w-5" />
                Começar Agora
              </Button>
            </Link>
            <Link href="/login">
              <Button size="xl" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold text-white mb-4">🎂 Bolos Su</h3>
            <p className="mb-6">Bolos artesanais feitos com amor e carinho</p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                WhatsApp
              </a>
              <a href="mailto:contato@bolossu.com" className="hover:text-primary transition-colors">
                E-mail
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
              © 2026 Bolos Su. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
