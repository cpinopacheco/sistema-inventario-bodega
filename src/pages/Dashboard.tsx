"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaClipboardList,
  FaFileAlt,
  FaArrowUp,
} from "react-icons/fa";
import { useProducts } from "../context/ProductContext";
import { useWithdrawal } from "../context/WithdrawalContext";

const Dashboard = () => {
  const { products, getLowStockProducts } = useProducts();
  const { withdrawals } = useWithdrawal();

  const lowStockProducts = getLowStockProducts();
  const totalProducts = products.length;
  const totalCategories = [
    ...new Set(products.map((product) => product.category)),
  ].length;
  const totalWithdrawals = withdrawals.length;

  // Calcular los productos más retirados
  const productWithdrawalStats: Record<number, number> = {};
  withdrawals.forEach((withdrawal) => {
    withdrawal.items.forEach((item) => {
      productWithdrawalStats[item.productId] =
        (productWithdrawalStats[item.productId] || 0) + item.quantity;
    });
  });

  // Obtener los productos más retirados
  const topWithdrawnProducts = Object.entries(productWithdrawalStats)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 4)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p.id === Number(productId));
      return {
        id: productId,
        name: product?.name || "Producto desconocido",
        quantity,
      };
    });

  // Animación para tarjetas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Productos recientes
  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // Retiros recientes
  const recentWithdrawals = [...withdrawals]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-dark">Dashboard</h1>
        <p className="text-sm text-neutral-medium">
          Última actualización: {new Date().toLocaleDateString()}{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total de productos */}
        <motion.div
          variants={itemVariants}
          className="bg-neutral-white rounded-lg shadow-md p-6 flex items-center"
        >
          <div className="rounded-full bg-primary-lightest p-3 mr-4">
            <FaBoxes className="text-primary text-xl" />
          </div>
          <div>
            <p className="text-sm text-neutral-medium">Total Productos</p>
            <p className="text-2xl font-bold text-neutral-dark">
              {totalProducts}
            </p>
          </div>
        </motion.div>

        {/* Productos con stock bajo */}
        <motion.div
          variants={itemVariants}
          className="bg-neutral-white rounded-lg shadow-md p-6 flex items-center"
        >
          <div className="rounded-full bg-state-error bg-opacity-10 p-3 mr-4">
            <FaExclamationTriangle className="text-state-error text-xl" />
          </div>
          <div>
            <p className="text-sm text-neutral-medium">Stock Bajo</p>
            <p className="text-2xl font-bold text-state-error">
              {lowStockProducts.length}
            </p>
          </div>
        </motion.div>

        {/* Total de categorías */}
        <motion.div
          variants={itemVariants}
          className="bg-neutral-white rounded-lg shadow-md p-6 flex items-center"
        >
          <div className="rounded-full bg-primary-lightest p-3 mr-4">
            <FaClipboardList className="text-primary-lighter text-xl" />
          </div>
          <div>
            <p className="text-sm text-neutral-medium">Categorías</p>
            <p className="text-2xl font-bold text-primary-lighter">
              {totalCategories}
            </p>
          </div>
        </motion.div>

        {/* Total de retiros */}
        <motion.div
          variants={itemVariants}
          className="bg-neutral-white rounded-lg shadow-md p-6 flex items-center"
        >
          <div className="rounded-full bg-accent bg-opacity-10 p-3 mr-4">
            <FaFileAlt className="text-accent text-xl" />
          </div>
          <div>
            <p className="text-sm text-neutral-medium">Retiros</p>
            <p className="text-2xl font-bold text-accent">{totalWithdrawals}</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos recientes */}
        <motion.div
          variants={itemVariants}
          className="bg-neutral-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="bg-primary-lightest px-6 py-4 border-b border-primary-lightest flex justify-between items-center">
            <h2 className="text-lg font-semibold text-primary">
              Productos Recientes
            </h2>
            <Link
              to="/products"
              className="text-primary hover:text-primary-light text-sm font-medium"
            >
              Ver todos
            </Link>
          </div>
          <div className="p-4">
            {recentProducts.length > 0 ? (
              <div className="divide-y divide-neutral-light">
                {recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="ml-0">
                        <p className="text-sm font-medium text-neutral-dark">
                          {product.name}
                        </p>
                        <p className="text-xs text-neutral-medium">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {product.stock} unidades
                      </p>
                      <p
                        className={`text-xs ${
                          product.stock <= product.minStock
                            ? "text-state-error"
                            : "text-state-success"
                        }`}
                      >
                        {product.stock <= product.minStock
                          ? "Stock bajo"
                          : "En stock"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-medium text-center py-4">
                No hay productos registrados aún
              </p>
            )}
          </div>
        </motion.div>

        {/* Retiros recientes */}
        <motion.div
          variants={itemVariants}
          className="bg-neutral-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="bg-accent-light px-6 py-4 border-b border-accent-light flex justify-between items-center">
            <h2 className="text-lg font-semibold text-primary">
              Retiros Recientes
            </h2>
            <Link
              to="/withdrawals"
              className="text-primary hover:text-primary-light text-sm font-medium"
            >
              Ver todos
            </Link>
          </div>
          <div className="p-4">
            {recentWithdrawals.length > 0 ? (
              <div className="divide-y divide-neutral-light">
                {recentWithdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-neutral-dark">
                          Retiro #{withdrawal.id} - {withdrawal.userName}
                        </p>
                        <p className="text-xs text-neutral-medium">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}{" "}
                          - {withdrawal.userSection}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {withdrawal.totalItems} items
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-medium text-center py-4">
                No hay retiros registrados aún
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Estadísticas */}
      <motion.div
        variants={itemVariants}
        className="bg-neutral-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-primary-lightest px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-primary">
            Resumen de Inventario
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-3 text-primary">
                Principales Categorías
              </h3>
              <div className="space-y-2">
                {Object.entries(
                  products.reduce((acc, product) => {
                    acc[product.category] = (acc[product.category] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([category, count]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <p className="text-sm text-neutral-dark">{category}</p>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2 text-neutral-medium">
                          {count}
                        </span>
                        <div className="bg-neutral-light h-2 w-36 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{
                              width: `${(count / totalProducts) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium mb-3 text-primary">
                Productos con mayor retiro
              </h3>
              <div className="space-y-2">
                {topWithdrawnProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm truncate max-w-[180px] text-neutral-dark">
                      {product.name}
                    </p>
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent bg-opacity-10 text-accent flex items-center">
                        <FaArrowUp className="mr-1" />
                        {product.quantity} unidades
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
