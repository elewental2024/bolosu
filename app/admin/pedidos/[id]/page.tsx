"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  whatsapp: string;
  cpf: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Order {
  id: string;
  userId: string;
  user: User;
  status: string;
  deliveryAddress: string;
  deliveryDate: string;
  observations?: string;
  deliveryFee?: number;
  totalPrice?: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: "pending", label: "Pendente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "preparing", label: "Preparando" },
  { value: "ready", label: "Pronto" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Pronto",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      router.push("/login");
      return;
    }
    fetchOrder();
  }, [router, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      const data = await response.json();
      setOrder(data);
      setStatus(data.status);
      setDeliveryFee(data.deliveryFee?.toString() || "0");
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("Erro ao carregar pedido");
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const fee = parseFloat(deliveryFee) || 0;
    return subtotal + fee;
  };

  const handleSave = async () => {
    if (!order) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          deliveryFee: parseFloat(deliveryFee) || 0,
          totalPrice: calculateTotal(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      alert("Pedido atualizado com sucesso!");
      fetchOrder();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Erro ao atualizar pedido");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Pedido não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Voltar ao Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Detalhes do Pedido
            </h1>
            <p className="text-sm text-gray-500 mt-1">ID: {order.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/admin/chat/${order.id}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              💬 Chat
            </Link>
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                statusColors[order.status]
              }`}
            >
              {statusLabels[order.status]}
            </span>
          </div>
        </div>

        {/* Client Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Informações do Cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium text-gray-900">{order.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">WhatsApp</p>
              <p className="font-medium text-gray-900">{order.user.whatsapp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CPF</p>
              <p className="font-medium text-gray-900">{order.user.cpf}</p>
            </div>
          </div>
        </div>

        {/* Delivery Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Informações de Entrega
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Endereço de Entrega</p>
              <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data de Entrega</p>
              <p className="font-medium text-gray-900">
                {new Date(order.deliveryDate).toLocaleDateString("pt-BR")}
              </p>
            </div>
            {order.observations && (
              <div>
                <p className="text-sm text-gray-500">Observações</p>
                <p className="font-medium text-gray-900">{order.observations}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Itens do Pedido
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Unit.
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {item.product.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 text-right">
                      R$ {item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3 text-sm font-medium text-gray-900 text-right"
                  >
                    Subtotal
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                    R$ {calculateSubtotal().toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Update Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Atualizar Pedido
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de Entrega (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">
                  Preço Total
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  R$ {calculateTotal().toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Subtotal (R$ {calculateSubtotal().toFixed(2)}) + Taxa de Entrega
                (R$ {parseFloat(deliveryFee || "0").toFixed(2)})
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Informações do Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Criado em</p>
              <p className="font-medium text-gray-900">
                {new Date(order.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Última atualização</p>
              <p className="font-medium text-gray-900">
                {new Date(order.updatedAt).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
