import React, { useState } from "react";
import ProductCard from "../ProductCard";
import { Product } from "../../types/types";
import { motion } from "framer-motion";

interface PaginationProps {
  itemsPerPage: number;
  data: Product[];
  handleAddToCart: (productId: number) => void;
}

const PaginationProducts: React.FC<PaginationProps> = ({
  itemsPerPage,
  data,
  handleAddToCart,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (number: number) => {
    setCurrentPage(number);
  };

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
        >
          {currentItems.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </motion.div>
          ))}
        </motion.div>

      <div className="flex flex-wrap justify-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer`}
        >
          Précédent
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handleClick(number)}
            className={`px-4 py-2 mx-1 my-1 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-700 ${
              currentPage === number ? "bg-blue-700" : ""
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === pageNumbers.length}
          className={`px-4 py-2 mx-1 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          Suivant
        </button>
      </div>
    </>
  );
};

export default PaginationProducts;
