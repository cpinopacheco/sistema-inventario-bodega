"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaTrash,
  FaTimes,
  FaCheck,
  FaFileExcel,
  FaClipboardList,
  FaUser,
  FaBuilding,
} from "react-icons/fa";
import { useWithdrawal } from "../context/WithdrawalContext";
import { Tooltip } from "../components/ui/Tooltip";
import { ExportToExcel } from "../utils/ExcelExport";
import { useNavigate } from "react-router-dom";

const Withdrawals = () => {
  const {
    cart,
    withdrawals,
    removeFromCart,
    updateCartItemQuantity,
    confirmWithdrawal,
  } = useWithdrawal();
  const [notes, setNotes] = useState("");
  const [withdrawerName, setWithdrawerName] = useState("");
  const [withdrawerSection, setWithdrawerSection] = useState("");
  const [showWithdrawalHistory, setShowWithdrawalHistory] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

  // Calcular el total de items en el carrito
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Manejar cambio de cantidad
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity);
  };

  // Manejar confirmación de retiro
  const handleConfirmWithdrawal = () => {
    confirmWithdrawal(withdrawerName, withdrawerSection, notes);
    setNotes("");
    setWithdrawerName("");
    setWithdrawerSection("");
  };

  // Manejar exportación a Excel
  const handleExportToExcel = (withdrawalId: number) => {
    const withdrawal = withdrawals.find((w) => w.id === withdrawalId);
    if (!withdrawal) return;

    const withdrawalData = withdrawal.items.map((item) => ({
      Producto: item.product.name,
      Categoría: item.product.category,
      Cantidad: item.quantity,
      "Fecha de retiro": new Date(withdrawal.createdAt).toLocaleDateString(),
      "Hora de retiro": new Date(withdrawal.createdAt).toLocaleTimeString(),
      "Usuario que registra": withdrawal.userName,
      "Sección que registra": withdrawal.userSection,
      "Persona que retira": withdrawal.withdrawerName,
      "Sección que retira": withdrawal.withdrawerSection,
      Notas: withdrawal.notes || "N/A",
    }));

    ExportToExcel(
      withdrawalData,
      `Retiro-${withdrawalId}-${new Date(
        withdrawal.createdAt
      ).toLocaleDateString()}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-dark">
          Gestión de Retiros
        </h1>
        <button
          onClick={() => setShowWithdrawalHistory(!showWithdrawalHistory)}
          className={`px-4 py-2 rounded-md ${
            showWithdrawalHistory
              ? "bg-primary-lightest text-primary hover:bg-primary-lightest hover:bg-opacity-80"
              : "bg-primary text-neutral-white hover:bg-primary-light"
          } transition-colors`}
        >
          {showWithdrawalHistory
            ? "Volver a Retiros"
            : "Ver Historial de Retiros"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showWithdrawalHistory ? (
          <motion.div
            key="cart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-neutral-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary flex items-center">
                  <FaShoppingCart className="mr-2 text-primary" />
                  Carrito de Retiro
                </h2>
                <span className="px-3 py-1 bg-primary-lightest text-primary rounded-full text-sm font-medium">
                  {cartTotalItems} {cartTotalItems === 1 ? "ítem" : "ítems"}
                </span>
              </div>

              {cart.length > 0 ? (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-light">
                      <thead className="bg-primary-lightest">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-primary uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-neutral-white divide-y divide-neutral-light">
                        {cart.map((item) => (
                          <tr
                            key={item.productId}
                            className="hover:bg-primary-lightest hover:bg-opacity-30"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-0">
                                  <div className="text-sm font-medium text-neutral-dark">
                                    {item.product.name}
                                  </div>
                                  <div className="text-sm text-neutral-medium">
                                    {item.product.category}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.productId,
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
                                  className="w-8 h-8 flex items-center justify-center bg-neutral-light rounded-l-md hover:bg-primary hover:text-neutral-white transition-colors"
                                  aria-label="Disminuir cantidad"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.productId,
                                      Number.parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-16 h-8 text-center border-t border-b border-neutral-light [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-primary focus:ring-primary"
                                  style={{ textAlign: "center" }}
                                />
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }
                                  className="w-8 h-8 flex items-center justify-center bg-neutral-light rounded-r-md hover:bg-primary hover:text-neutral-white transition-colors"
                                  aria-label="Aumentar cantidad"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Tooltip
                                content="Eliminar del carrito"
                                position="top"
                              >
                                <button
                                  onClick={() => removeFromCart(item.productId)}
                                  className="text-state-error hover:bg-state-error hover:text-neutral-white p-2 rounded-full transition-colors flex items-center justify-center w-8 h-8"
                                >
                                  <FaTrash size={16} />
                                </button>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-light pt-4">
                    <div>
                      <label
                        htmlFor="withdrawerName"
                        className="block text-sm font-medium text-neutral-dark mb-2"
                      >
                        <FaUser className="inline mr-1 text-primary" /> Nombre
                        de quien retira{" "}
                        <span className="text-state-error">*</span>
                      </label>
                      <input
                        id="withdrawerName"
                        type="text"
                        value={withdrawerName}
                        onChange={(e) => setWithdrawerName(e.target.value)}
                        className="w-full rounded-md border-neutral-light shadow-sm focus:border-primary focus:ring-primary"
                        placeholder="Ingrese el nombre de la persona que retira"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="withdrawerSection"
                        className="block text-sm font-medium text-neutral-dark mb-2"
                      >
                        <FaBuilding className="inline mr-1 text-primary" />{" "}
                        Sección <span className="text-state-error">*</span>
                      </label>
                      <input
                        id="withdrawerSection"
                        type="text"
                        value={withdrawerSection}
                        onChange={(e) => setWithdrawerSection(e.target.value)}
                        className="w-full rounded-md border-neutral-light shadow-sm focus:border-primary focus:ring-primary"
                        placeholder="Ingrese la sección o departamento"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-neutral-light pt-4">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-neutral-dark mb-2"
                    >
                      Notas adicionales (opcional)
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border-neutral-light shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="Añade notas adicionales sobre este retiro..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleConfirmWithdrawal}
                      disabled={
                        !withdrawerName.trim() || !withdrawerSection.trim()
                      }
                      className="inline-flex items-center px-4 py-2 bg-state-success text-neutral-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaCheck className="mr-2" />
                      Confirmar Retiro
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaShoppingCart className="mx-auto text-neutral-medium text-5xl mb-4" />
                  <h3 className="text-lg font-medium text-neutral-dark mb-1">
                    El carrito está vacío
                  </h3>
                  <p className="text-neutral-medium mb-4">
                    Agrega productos desde la sección de Productos para iniciar
                    un retiro
                  </p>
                  <button
                    onClick={() => navigate("/products")}
                    className="inline-flex items-center px-4 py-2 bg-primary text-neutral-white rounded-md hover:bg-primary-light transition-colors"
                  >
                    Ir a Productos
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-neutral-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-primary-lightest px-6 py-4 border-b border-primary-lightest">
                <h2 className="text-xl font-semibold text-primary">
                  Historial de Retiros
                </h2>
              </div>

              {withdrawals.length > 0 ? (
                <div className="divide-y divide-neutral-light">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-neutral-dark">
                          Retiro #{withdrawal.id} - {withdrawal.withdrawerName}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <Tooltip content="Exportar a Excel" position="top">
                            <button
                              onClick={() => handleExportToExcel(withdrawal.id)}
                              className="flex items-center justify-center w-9 h-9 text-state-success hover:bg-state-success hover:text-neutral-white rounded-full transition-colors p-2"
                              aria-label="Exportar a Excel"
                            >
                              <FaFileExcel size={18} />
                            </button>
                          </Tooltip>
                          <Tooltip
                            content={
                              selectedWithdrawal === withdrawal.id
                                ? "Ocultar detalles"
                                : "Ver detalles"
                            }
                            position="top"
                          >
                            <button
                              onClick={() =>
                                setSelectedWithdrawal(
                                  selectedWithdrawal === withdrawal.id
                                    ? null
                                    : withdrawal.id
                                )
                              }
                              className="flex items-center justify-center w-9 h-9 text-primary hover:bg-primary hover:text-neutral-white rounded-full transition-colors p-2"
                              aria-label={
                                selectedWithdrawal === withdrawal.id
                                  ? "Ocultar detalles"
                                  : "Ver detalles"
                              }
                            >
                              {selectedWithdrawal === withdrawal.id ? (
                                <FaTimes size={18} />
                              ) : (
                                <FaClipboardList size={18} />
                              )}
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-medium mb-2">
                        <div>
                          <strong>Fecha:</strong>{" "}
                          {new Date(withdrawal.createdAt).toLocaleDateString()}{" "}
                          {new Date(withdrawal.createdAt).toLocaleTimeString()}
                        </div>
                        <div>
                          <strong>Retirado por:</strong>{" "}
                          {withdrawal.withdrawerName} -{" "}
                          <strong>Sección:</strong>{" "}
                          {withdrawal.withdrawerSection}
                        </div>
                        <div>
                          <strong>Registrado por:</strong> {withdrawal.userName}{" "}
                          - <strong>Items:</strong> {withdrawal.totalItems}
                        </div>
                      </div>

                      {withdrawal.notes && (
                        <div className="text-sm text-neutral-medium mb-2 italic">
                          "{withdrawal.notes}"
                        </div>
                      )}

                      <AnimatePresence>
                        {selectedWithdrawal === withdrawal.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 overflow-hidden"
                          >
                            <h4 className="text-sm font-medium text-primary mb-2">
                              Detalle de productos:
                            </h4>
                            <div className="bg-primary-lightest rounded-md overflow-x-auto">
                              <table className="min-w-full divide-y divide-neutral-light">
                                <thead className="bg-primary-lightest">
                                  <tr>
                                    <th className="px-6 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">
                                      Producto
                                    </th>
                                    <th className="px-6 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">
                                      Categoría
                                    </th>
                                    <th className="px-6 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">
                                      Cantidad
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-neutral-white divide-y divide-neutral-light">
                                  {withdrawal.items.map((item) => (
                                    <tr
                                      key={item.productId}
                                      className="hover:bg-primary-lightest"
                                    >
                                      <td className="px-6 py-2 whitespace-nowrap text-sm text-neutral-dark">
                                        {item.product.name}
                                      </td>
                                      <td className="px-6 py-2 whitespace-nowrap text-sm text-neutral-medium">
                                        {item.product.category}
                                      </td>
                                      <td className="px-6 py-2 whitespace-nowrap text-sm text-neutral-dark text-right">
                                        {item.quantity}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaClipboardList className="mx-auto text-neutral-medium text-5xl mb-4" />
                  <h3 className="text-lg font-medium text-neutral-dark mb-1">
                    No hay retiros registrados
                  </h3>
                  <p className="text-neutral-medium">
                    Aún no se han realizado retiros de productos del inventario
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Withdrawals;
