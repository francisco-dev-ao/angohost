
import { Skeleton } from "@/components/ui/skeleton";

const CartLoading = () => {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="w-full h-64" />
          <Skeleton className="w-full h-96" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </div>
  );
};

export default CartLoading;
