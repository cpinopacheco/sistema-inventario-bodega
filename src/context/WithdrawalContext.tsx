"use client";

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useCallback,
} from "react";
import { useProducts, type Product } from "./ProductContext";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

// Definir tipos
interface WithdrawalItem {
  productId: number;
  quantity: number;
  product: Product;
}

export interface Withdrawal {
  id: number;
  items: WithdrawalItem[];
  totalItems: number;
  userId: number;
  userName: string;
  userSection: string;
  withdrawerName: string; // Nombre de quien retira
  withdrawerSection: string; // Sección de quien retira
  notes?: string;
  createdAt: string;
}

interface WithdrawalContextType {
  cart: WithdrawalItem[];
  withdrawals: Withdrawal[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  confirmWithdrawal: (
    withdrawerName: string,
    withdrawerSection: string,
    notes?: string
  ) => void;
  cartTotalItems: number;
}

const WithdrawalContext = createContext<WithdrawalContextType | undefined>(
  undefined
);

export const WithdrawalProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<WithdrawalItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const { updateStock, getProduct, setProducts } = useProducts();
  const { user } = useAuth();

  // Versión silenciosa de updateStock que no muestra notificaciones
  const updateStockSilently = useCallback(
    (id: number, quantity: number) => {
      setProducts((prev: Product[]) =>
        prev.map((product: Product) =>
          product.id === id
            ? {
                ...product,
                stock: product.stock + quantity,
                updatedAt: new Date().toISOString(),
              }
            : product
        )
      );
    },
    [setProducts]
  );

  // Añadir producto al carrito
  const addToCart = useCallback(
    (product: Product, quantity: number) => {
      if (quantity <= 0) {
        toast.error("La cantidad debe ser mayor a 0");
        return;
      }

      if (quantity > product.stock) {
        toast.error(`Solo hay ${product.stock} unidades disponibles`);
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.productId === product.id
        );

        if (existingItem) {
          // Si el producto ya está en el carrito, actualizar la cantidad
          const newQuantity = existingItem.quantity + quantity;

          if (newQuantity > product.stock) {
            toast.error(
              `No puede exceder el stock disponible (${product.stock})`
            );
            return prevCart;
          }

          return prevCart.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        } else {
          // Si no está en el carrito, añadirlo
          return [...prevCart, { productId: product.id, quantity, product }];
        }
      });

      toast.success(`${product.name} añadido al carrito`);
    },
    [setCart]
  );

  // Eliminar producto del carrito
  const removeFromCart = useCallback(
    (productId: number) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.productId !== productId)
      );
      toast.success("Producto eliminado del carrito");
    },
    [setCart]
  );

  // Actualizar cantidad de un producto en el carrito
  const updateCartItemQuantity = useCallback(
    (productId: number, quantity: number) => {
      const product = getProduct(productId);

      if (!product) {
        toast.error("Producto no encontrado");
        return;
      }

      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      if (quantity > product.stock) {
        toast.error(`Solo hay ${product.stock} unidades disponibles`);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    },
    [getProduct, removeFromCart, setCart]
  );

  // Limpiar el carrito
  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  // Confirmar retiro de productos
  const confirmWithdrawal = useCallback(
    (withdrawerName: string, withdrawerSection: string, notes?: string) => {
      if (!user) {
        toast.error("Debe iniciar sesión para confirmar un retiro");
        return;
      }

      if (cart.length === 0) {
        toast.error("El carrito está vacío");
        return;
      }

      if (!withdrawerName.trim()) {
        toast.error("Debe ingresar el nombre de quien retira");
        return;
      }

      if (!withdrawerSection.trim()) {
        toast.error("Debe ingresar la sección de quien retira");
        return;
      }

      // Verificar stock disponible antes de confirmar
      for (const item of cart) {
        const currentProduct = getProduct(item.productId);
        if (!currentProduct) {
          toast.error(`Producto ID ${item.productId} no encontrado`);
          return;
        }

        if (item.quantity > currentProduct.stock) {
          toast.error(`No hay suficiente stock de ${currentProduct.name}`);
          return;
        }
      }

      // Generar nuevo retiro
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const newWithdrawal: Withdrawal = {
        id: Math.max(0, ...withdrawals.map((w) => w.id)) + 1,
        items: [...cart],
        totalItems,
        userId: user.id,
        userName: user.name,
        userSection: user.section,
        withdrawerName,
        withdrawerSection,
        notes,
        createdAt: new Date().toISOString(),
      };

      // Actualizar el stock de cada producto silenciosamente (sin notificaciones)
      cart.forEach((item) => {
        updateStockSilently(item.productId, -item.quantity);
      });

      // Guardar el retiro
      setWithdrawals((prev) => [newWithdrawal, ...prev]);

      // Limpiar el carrito
      clearCart();

      toast.success("Retiro confirmado correctamente");
    },
    [cart, user, withdrawals, getProduct, updateStockSilently, clearCart]
  );

  // Calcular el total de items en el carrito
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <WithdrawalContext.Provider
      value={{
        cart,
        withdrawals,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        confirmWithdrawal,
        cartTotalItems,
      }}
    >
      {children}
    </WithdrawalContext.Provider>
  );
};

// Hook personalizado
export const useWithdrawal = () => {
  const context = useContext(WithdrawalContext);
  if (context === undefined) {
    throw new Error(
      "useWithdrawal debe usarse dentro de un WithdrawalProvider"
    );
  }
  return context;
};
