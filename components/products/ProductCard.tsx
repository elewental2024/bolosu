import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Instagram } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    instagramUrl: string;
  };
  onAddToCart: () => void;
  isNew?: boolean;
  isPopular?: boolean;
}

export function ProductCard({ product, onAddToCart, isNew, isPopular }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl">🎂</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && <Badge variant="new">Novo</Badge>}
          {isPopular && <Badge variant="popular">Popular</Badge>}
        </div>

        {/* Instagram Link */}
        <a
          href={product.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <Instagram className="h-4 w-4 text-primary" />
        </a>
      </div>

      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          <span className="text-sm text-gray-500">por unidade</span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          onClick={onAddToCart}
          className="w-full gap-2"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}
