import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-700 mb-4">
            🎂 Bolos Su
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Os melhores bolos artesanais da região
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
            >
              Cadastrar
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🍰</div>
              <h3 className="text-xl font-semibold mb-2">Bolos Artesanais</h3>
              <p className="text-gray-600">Feitos com ingredientes de alta qualidade</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Receba seu bolo no conforto da sua casa</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Atendimento Personalizado</h3>
              <p className="text-gray-600">Chat direto com a confeiteira</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
