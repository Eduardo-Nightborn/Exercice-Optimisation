// ProductCard Component
import { Product } from "../../types/types";
import { memo } from "react";

interface ProductCardProps {
    product: Product;
    onAddToCart: (productId: number) => void;
  }
  
  const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    console.log(`Product ${product.id} rendering...`);
    return (
      <div className="border p-4 rounded shadow">
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-gray-600">{product.category}</p>
        <p className="text-lg">${product.price}</p>
        <p className="text-sm">Stock: {product.stock}</p>
        <button
          onClick={() => onAddToCart(product.id)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    );
  };
  export default memo(ProductCard);