"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Package, LogOut, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function ClientNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Load user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load cart count
    const cart = localStorage.getItem("cart");
    if (cart) {
      const items = JSON.parse(cart);
      const count = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    }

    // Listen for storage changes
    const handleStorage = () => {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const items = JSON.parse(cart);
        const count = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/produtos" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🎂</span>
            <span className="text-xl font-serif font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
              Bolos Su
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/produtos">
              <Button
                variant={pathname === "/produtos" ? "primary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Produtos
              </Button>
            </Link>
            <Link href="/pedidos">
              <Button
                variant={pathname === "/pedidos" ? "primary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Package className="h-4 w-4" />
                Pedidos
              </Button>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            {cartCount > 0 && (
              <Link href="/pedidos/novo">
                <Button variant="primary" size="sm" className="relative gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Carrinho</span>
                  <Badge variant="default" className="bg-white text-primary ml-1">
                    {cartCount}
                  </Badge>
                </Button>
              </Link>
            )}

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name?.split(" ")[0] || "Usuário"}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
