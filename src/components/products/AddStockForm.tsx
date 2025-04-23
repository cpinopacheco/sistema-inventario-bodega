"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useProducts, type Product } from "../../context/ProductContext";

interface AddStockFormProps {
  product: Product;
  onClose: () => void;
  isVisible: boolean;
}

const AddStockForm = ({ product, onClose, isVisible }: AddStockFormProps) => {
  const { updateStock } = useProducts();
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState("");

  // Manejar cierre con tecla Escape
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      window.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isVisible, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    // Actualizar el stock sumando la cantidad ingresada
    updateStock(product.id, quantity);
    onClose();
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-neutral-dark bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        // Cerrar al hacer clic en el overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        className="bg-neutral-white rounded-lg shadow-xl w-full max-w-md"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-light">
          <h2 className="text-xl font-semibold text-primary">Agregar Stock</h2>
          <button
            onClick={onClose}
            className="text-neutral-medium hover:text-neutral-dark focus:outline-none"
            aria-label="Cerrar"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div className="bg-primary-lightest p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary">
                  Producto:
                </span>
                <span className="text-sm text-neutral-dark">
                  {product.name}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-primary">
                  Stock Actual:
                </span>
                <span className="text-sm text-neutral-dark">
                  {product.stock} unidades
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-primary">
                  Stock Mínimo:
                </span>
                <span className="text-sm text-neutral-dark">
                  {product.minStock} unidades
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-neutral-dark"
              >
                Cantidad a agregar <span className="text-state-error">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                  setError("");
                }}
                min="1"
                className={`mt-1 block w-full rounded-md border-neutral-light shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                  error ? "border-state-error" : ""
                }`}
                required
              />
              {error && (
                <p className="mt-1 text-sm text-state-error">{error}</p>
              )}
            </div>

            <div className="bg-accent-light p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary">
                  Nuevo Stock Total:
                </span>
                <span className="text-sm font-bold text-primary">
                  {product.stock + quantity} unidades
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-neutral-light rounded-md shadow-sm text-sm font-medium text-neutral-dark bg-neutral-white hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaTimes className="mr-2 -ml-1 h-4 w-4" />
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-neutral-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaPlus className="mr-2 -ml-1 h-4 w-4" />
              Agregar Stock
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddStockForm;
