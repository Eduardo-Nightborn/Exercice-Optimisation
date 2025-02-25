// FilterBar Component
import { memo } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../animations/animations";

interface FilterBarProps {
    onFilter: (category: string) => void;
    onSearch: (term: string) => void;
    onSort:(price:string) => void;
  }
  
  const FilterBar: React.FC<FilterBarProps> = ({ onFilter, onSearch , onSort }) => {
    console.log("FilterBar rendering...");
    return (
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          onChange={(e) => onFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Food">Food</option>
        </select>
        <select
        onChange={(e) => onSort(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Default</option>
        <option value="asc">Lowest to Highest</option>
        <option value="desc">Highest to Lowest</option>
      </select>
      </div>
    );
  };
  export default memo(FilterBar);