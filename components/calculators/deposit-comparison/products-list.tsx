"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductFormCard } from "./product-form-card";
import {
  createDefaultProduct,
  MAX_PRODUCTS,
  MIN_PRODUCTS,
  type DepositProduct,
} from "@/lib/calculators/deposit-comparison";

interface ProductsListProps {
  products: DepositProduct[];
  onChange: (products: DepositProduct[]) => void;
}

export function ProductsList({ products, onChange }: ProductsListProps) {
  const handleUpdate = (id: string, updated: DepositProduct) => {
    onChange(products.map((p) => (p.id === id ? updated : p)));
  };

  const handleRemove = (id: string) => {
    onChange(products.filter((p) => p.id !== id));
  };

  const handleAdd = () => {
    if (products.length >= MAX_PRODUCTS) return;
    onChange([
      ...products,
      createDefaultProduct(`Producto ${products.length + 1}`),
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {products.map((product, index) => (
          <ProductFormCard
            key={product.id}
            product={product}
            index={index}
            canRemove={products.length > MIN_PRODUCTS}
            onChange={(updated) => handleUpdate(product.id, updated)}
            onRemove={() => handleRemove(product.id)}
          />
        ))}
      </div>

      {products.length < MAX_PRODUCTS && (
        <Button
          variant="outline"
          onClick={handleAdd}
          className="w-full gap-2 border-dashed"
        >
          <PlusCircle className="h-4 w-4" />
          Añadir producto
        </Button>
      )}
    </div>
  );
}
