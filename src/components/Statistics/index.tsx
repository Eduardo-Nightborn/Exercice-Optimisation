// Statistics Component
import { Product } from "../../types/types";
import { memo, use, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../animations/animations";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Statistics: React.FC<{ products: Product[] }> = ({ products }) => {
  console.log("Calculating statistics...");
  const [isOpen, setOpen] = useState(false);

  const getCachedStats = useCallback(() => {
    const cached = localStorage.getItem("statsCache");
    try {
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  const cachedStats = getCachedStats();

  // Use useMemo to optimize calculations
  const stats = useMemo(() => {
    if (cachedStats) {
      console.log("Using cached stats...");
      return cachedStats;
    }

    const categoryCount = products.reduce((acc: Record<string, number>, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    const calculatedStats = {
      averagePrice:
        products.reduce((acc, p) => acc + p.price, 0) / products.length,
      lowStock: products.filter((p) => p.stock < 10).length,
      categoryCount,
      priceRanges: products.reduce((acc: Record<string, number>, p) => {
        const range = Math.floor(p.price / 100) * 100;
        acc[`${range}-${range + 99}`] =
          (acc[`${range}-${range + 99}`] || 0) + 1;
        return acc;
      }, {}),
      // Format data for the chart
      chartData: Object.entries(categoryCount).map(([name, value]) => ({
        name,
        products: value,
      })),
    };
    localStorage.setItem("statsCache", JSON.stringify(calculatedStats));

    return calculatedStats;
  }, [products, cachedStats]);

  const handleOpen = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <motion.div
    variants={fadeIn("down", 0.1)}
    initial="hidden"
    animate="show"
    exit="hidden"
    className="flex flex-col p-4 bg-white rounded shadow justify-center">
      <h2 className="text-xl font-bold mb-4">Dashboard Statistics</h2>
      <div className="flex flex-wrap justify-center">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col justify-center items-center border w-50 rounded">
            <h3 className="font-semibold">Average Price</h3>
            <p>${stats.averagePrice.toFixed(2)}</p>
          </div>
          <div className="flex flex-col justify-center items-center border w-50 rounded">
            <h3 className="font-semibold">Low Stock Items</h3>
            <p>{stats.lowStock} products</p>
          </div>
        </div>
      </div>
      <div>
        {isOpen ? (
          <motion.div
            variants={fadeIn("down", 0.1)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex flex-col items-center text-center h-[500px]">
              <h3 className="font-semibold mb-2">Products by Category</h3>
              <ResponsiveContainer width="70%" height="90%">
                <BarChart
                  data={stats.chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="1 1" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="products"
                    fill="#2196F3"
                    name="Number of Products"
                  />
                </BarChart>
              </ResponsiveContainer>
          </motion.div>
        ) : null}
        <button
          onClick={handleOpen}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-50 cursor-pointer"
        >
          {isOpen == false ? "Show Graphic" : "Close Graphic"}
        </button>
      </div>
    </motion.div>
  );
};

export default memo(Statistics);
