import React, { useState, useMemo } from 'react';

// Product type definition
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

// Test data
const initialProducts: Product[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  price: Math.floor(Math.random() * 1000) + 1,
  category: ['Electronics', 'Clothing', 'Books', 'Food'][Math.floor(Math.random() * 4)],
  stock: Math.floor(Math.random() * 200),
}));

// Statistics Component
const Statistics: React.FC<{ products: Product[] }> = ({ products }) => {
  console.log("Calculating statistics...");

  // Use useMemo to optimize calculations
  const stats = useMemo(() => {
    return {
      averagePrice: products.reduce((acc, p) => acc + p.price, 0) / products.length,
      lowStock: products.filter(p => p.stock < 10).length,
      categoryCount: products.reduce((acc: Record<string, number>, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {}),
      priceRanges: products.reduce((acc: Record<string, number>, p) => {
        const range = Math.floor(p.price / 100) * 100;
        acc[`${range}-${range + 99}`] = (acc[`${range}-${range + 99}`] || 0) + 1;
        return acc;
      }, {})
    };
  }, [products]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Dashboard Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Average Price</h3>
          <p>${stats.averagePrice.toFixed(2)}</p>
        </div>
        <div>
          <h3 className="font-semibold">Low Stock Items</h3>
          <p>{stats.lowStock} products</p>
        </div>
      </div>
    </div>
  );
};

// FilterBar Component
interface FilterBarProps {
  onFilter: (category: string) => void;
  onSearch: (term: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilter, onSearch }) => {
  console.log("FilterBar rendering...");
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Search products..."
        onChange={e => onSearch(e.target.value)}
        className="p-2 border rounded"
      />
      <select onChange={e => onFilter(e.target.value)} className="p-2 border rounded">
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Food">Food</option>
      </select>
    </div>
  );
};

// ProductCard Component
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
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
};

// Main ProductDashboard Component
const ProductDashboard: React.FC = () => {
  const [products] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cart, setCart] = useState<number[]>([]);

  const handleSearch = (term: string) => setSearchTerm(term);
  const handleFilter = (category: string) => setSelectedCategory(category);
  const handleAddToCart = (productId: number) => setCart(prev => [...prev, productId]);

  // Filtering logic with useMemo for optimization
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product Dashboard</h1>
      <FilterBar onSearch={handleSearch} onFilter={handleFilter} />
      <Statistics products={filteredProducts} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded">
        Cart Items: {cart.length}
      </div>
    </div>
  );
};

export default ProductDashboard;
