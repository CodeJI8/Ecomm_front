import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tokenStorage, updateCart } from "../api";
import { CartContext } from "./cartContext";
import useAuth from "../hooks/useAuth";

const CART_KEY = "ecomm-cart";

function readCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to read the saved cart.", error);
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Unable to save the cart.", error);
  }
}

function getCartUpdates(items) {
  return items.map((item) => ({
    productId: Number(item.id),
    quantity: item.quantity,
  }));
}

function hasValidCartUpdates(updates) {
  return updates.every(({ productId, quantity }) => (
    Number.isSafeInteger(productId)
    && productId > 0
    && Number.isSafeInteger(quantity)
    && quantity > 0
  ));
}

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState(readCart);
  const [cartError, setCartError] = useState(null);
  const itemsRef = useRef(items);
  const operationQueue = useRef(Promise.resolve());

  const enqueue = useCallback((operation) => {
    const result = operationQueue.current.then(operation);
    operationQueue.current = result.catch(() => {});
    return result;
  }, []);

  const saveItems = useCallback((nextItems) => {
    itemsRef.current = nextItems;
    setItems(nextItems);
    writeCart(nextItems);
  }, []);

  const syncCart = useCallback(async (updates) => {
    setCartError(null);
    if (!tokenStorage.get()) return true;

    try {
      await updateCart(updates);
      return true;
    } catch (error) {
      setCartError(error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    enqueue(async () => {
      const updates = getCartUpdates(itemsRef.current);
      if (updates.length === 0) return;
      if (!hasValidCartUpdates(updates)) {
        setCartError({ message: "A saved cart item cannot be synced with the store." });
        return;
      }
      await syncCart(updates);
    });
  }, [enqueue, syncCart, token]);

  const syncCartToServer = useCallback(() => enqueue(async () => {
    const updates = getCartUpdates(itemsRef.current);
    if (!tokenStorage.get()) {
      setCartError({ message: "Sign in before syncing your cart with the store." });
      return false;
    }
    if (!hasValidCartUpdates(updates)) {
      setCartError({ message: "A cart item cannot be synced with the store." });
      return false;
    }
    return syncCart(updates);
  }), [enqueue, syncCart]);

  const addItem = useCallback((product, quantity = 1) => enqueue(async () => {
    const id = product.id ?? product._id;
    const currentItems = itemsRef.current;
    const existing = currentItems.find((item) => item.id === id);
    const nextQuantity = existing ? existing.quantity + quantity : quantity;
    const productId = Number(id);
    if (
      tokenStorage.get()
      && (!Number.isSafeInteger(productId) || productId < 1)
    ) {
      setCartError({ message: "This product cannot be added to your cart." });
      return false;
    }
    if (!(await syncCart([{ productId, quantity: nextQuantity }]))) return false;

    const nextItems = existing
      ? currentItems.map((item) => item.id === id ? { ...item, quantity: nextQuantity } : item)
      : [...currentItems, { ...product, id, quantity }];
    saveItems(nextItems);
    return true;
  }), [enqueue, saveItems, syncCart]);

  const updateQuantity = useCallback((id, quantity) => enqueue(async () => {
    const productId = Number(id);
    if (
      tokenStorage.get()
      && (!Number.isSafeInteger(productId) || productId < 1)
    ) {
      setCartError({ message: "This product cannot be updated in your cart." });
      return false;
    }
    if (!(await syncCart([{ productId, quantity }]))) return false;

    const currentItems = itemsRef.current;
    const nextItems = quantity < 1
      ? currentItems.filter((item) => item.id !== id)
      : currentItems.map((item) => item.id === id ? { ...item, quantity } : item);
    saveItems(nextItems);
    return true;
  }), [enqueue, saveItems, syncCart]);

  const removeItem = useCallback((id) => updateQuantity(id, 0), [updateQuantity]);
  const clearCart = useCallback(() => enqueue(async () => {
    const removals = itemsRef.current.map((item) => ({
      productId: Number(item.id),
      quantity: 0,
    }));
    if (removals.length > 0 && !(await syncCart(removals))) return false;
    saveItems([]);
    return true;
  }), [enqueue, saveItems, syncCart]);
  const clearLocalCart = useCallback(() => enqueue(async () => {
    saveItems([]);
    return true;
  }), [enqueue, saveItems]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const value = useMemo(() => ({
    items, count, total, cartError, addItem, updateQuantity, removeItem, clearCart, clearLocalCart, syncCartToServer, 
    
  }

), [items, count, total, cartError, addItem, updateQuantity, removeItem, clearCart, clearLocalCart, syncCartToServer]);

  return (
    <CartContext.Provider value={value}>
      {cartError && <p className="cart-error" role="alert">{cartError.message}</p>}
      {children}
    </CartContext.Provider>
  );
}
