import React, { useState, useMemo, memo, useCallback } from "react";
import { Product } from "../../types/types";
import FilterBar from "../FilterBar";
import Statistics from "../Statistics";
import PaginationProducts from "../PaginationProducts";
import { motion } from "framer-motion";
import { fadeIn } from "../animations/animations";

// Main ProductDashboard Component
const ProductDashboard: React.FC = () => {
  // Test data
  const initialProducts = useMemo(
    () =>
      Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        name: `Product ${index + 1}`,
        price: Math.floor(Math.random() * 1000) + 1,
        category: ["Electronics", "Clothing", "Books", "Food"][
          Math.floor(Math.random() * 4)
        ],
        stock: Math.floor(Math.random() * 200),
      })),
    []
  );

  const [products] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cart, setCart] = useState<number[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");

  const handleSearch = useCallback((term: string) => setSearchTerm(term), []);
  const handleFilter = useCallback(
    (category: string) => setSelectedCategory(category),
    []
  );
  const handleSort = useCallback((sort: string) => {
    setSelectedSort(sort);
  }, []);
  const handleAddToCart = useCallback(
    (productId: number) => setCart((prev) => [...prev, productId]),
    []
  );

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
    if (selectedSort === "asc") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "desc") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedSort, products]);

  return (
    <motion.div
      variants={fadeIn("down", 0.1)}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="flex flex-col p-4 bg-white rounded shadow justify-center"
    >
      <h1 className="text-2xl font-bold mb-4">Product Dashboard</h1>
      <FilterBar
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
      />
      <Statistics products={filteredProducts} />
      <PaginationProducts
        data={filteredProducts}
        itemsPerPage={50}
        handleAddToCart={handleAddToCart}
      />
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded">
        Cart Items: {cart.length}
      </div>
    </motion.div>
  );
};

export default memo(ProductDashboard);
