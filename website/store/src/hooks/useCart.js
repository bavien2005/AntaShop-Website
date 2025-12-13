import { useEffect, useState, useCallback } from "react";
import { cartService } from "../services/api";
import { getSessionId } from "../utils/session";
import { useAuth } from "../contexts/AuthContext";

export function useCart() {
  const { user, isAuthenticated } = useAuth();

  const [cart, setCart] = useState({ id: null, items: [] });
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => getSessionId());
  const [hasMerged, setHasMerged] = useState(false);

  // ================== FETCH CART ==================
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      let res;
      if (isAuthenticated && user?.id) {
        res = await cartService.getCurrentCart(user.id, null);
      } else {
        res = await cartService.getCurrentCart(null, sessionId);
      }

      setCart(res || { id: null, items: [] });
    } catch (err) {
      console.error("❌ fetchCart error:", err);
      setCart({ id: null, items: [] });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, sessionId]);

  // fetch khi mount / khi user / session đổi
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ================== RESET MERGE FLAG KHI LOGIN ==================
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setHasMerged(false); // 🔥 rất quan trọng
    }
  }, [isAuthenticated, user?.id]);

  // ================== MERGE GUEST → USER (1 LẦN) ==================
  useEffect(() => {
    if (!isAuthenticated || !user?.id || hasMerged) return;

    const mergeCart = async () => {
      try {
        const guestCart = await cartService.getCurrentCart(null, sessionId);
        if (!guestCart?.items?.length) {
          setHasMerged(true);
          return;
        }

        await cartService.mergeCart(sessionId, user.id);
        setHasMerged(true);
        await fetchCart();
      } catch (err) {
        console.error("❌ mergeCart error:", err);
      }
    };

    mergeCart();
  }, [isAuthenticated, user?.id, sessionId, hasMerged, fetchCart]);

  // ================== CRUD ==================
  const addItem = async (product) => {
    const payload = {
      userId: isAuthenticated ? user.id : null,
      sessionId: isAuthenticated ? null : sessionId,
      productId: Number(product.id),
      variantId: product.variantId || null,
      productName: product.name,
      unitPrice: Number(product.price),
      quantity: product.quantity || 1,
    };

    const updated = await cartService.addToCart(payload);
    setCart(updated);
    return updated;
  };

  const removeItem = async (cartItemId) => {
    await cartService.removeItem(cartItemId);
    await fetchCart();
  };

  const updateQuantity = async (productId, variantId, quantity) => {
    if (!cart?.id) return;

    const updated = await cartService.updateQuantity(
      cart.id,
      Number(productId),
      variantId,
      Number(quantity)
    );
    setCart(updated);
  };

  // ================== RESET KHI LOGOUT ==================
  useEffect(() => {
    const onLogout = () => {
      console.debug("[useCart] auth:logout → reset FE cart");
      setCart({ id: null, items: [] });
      setHasMerged(false);
      setSessionId(getSessionId());
    };

    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  // ================== EXPOSE ==================
  return {
    cart,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    refreshCart: fetchCart,

    // 👇 dùng cho badge giỏ hàng
    get items() {
      return cart?.items || [];
    },

    // 👉 nếu muốn badge = tổng quantity
    get totalItems() {
      return (cart?.items || []).reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
    },

    // 👉 nếu muốn badge = số dòng sản phẩm
    // get totalItems() {
    //   return cart?.items?.length || 0;
    // },

    get totalPrice() {
      return (cart?.items || []).reduce(
        (sum, item) =>
          sum + (item.unitPrice || 0) * (item.quantity || 0),
        0
      );
    },
  };
}
