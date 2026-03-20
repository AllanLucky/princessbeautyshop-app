import { createSlice } from "@reduxjs/toolkit";

const calculateTotals = (products) => {
  const quantity = products.reduce((acc, item) => acc + item.quantity, 0);
  const total = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return { quantity, total };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },

  reducers: {
    // ================= ADD PRODUCT =================
    addProduct: (state, action) => {
      const newProduct = action.payload;

      const existingIndex = state.products.findIndex(
        (item) => item._id === newProduct._id
      );

      if (existingIndex !== -1) {
        // ✅ Increase quantity if exists
        state.products[existingIndex].quantity += newProduct.quantity || 1;
      } else {
        // ✅ Add new product
        state.products.push({
          ...newProduct,
          quantity: newProduct.quantity || 1,
        });
      }

      const totals = calculateTotals(state.products);
      state.quantity = totals.quantity;
      state.total = totals.total;
    },

    // ================= REMOVE PRODUCT =================
    removeProduct: (state, action) => {
      const product = action.payload;

      state.products = state.products.filter(
        (item) => item._id !== product._id
      );

      const totals = calculateTotals(state.products);
      state.quantity = totals.quantity;
      state.total = totals.total;
    },

    // ================= UPDATE QUANTITY =================
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;

      const product = state.products.find((item) => item._id === _id);

      if (product) {
        if (quantity <= 0) {
          // remove if zero
          state.products = state.products.filter(
            (item) => item._id !== _id
          );
        } else {
          product.quantity = quantity;
        }
      }

      const totals = calculateTotals(state.products);
      state.quantity = totals.quantity;
      state.total = totals.total;
    },

    // ================= CLEAR CART =================
    clearCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },

    // ================= SYNC CART STOCK (🔥 IMPORTANT) =================
    syncCartStock: (state, action) => {
      const updatedProducts = action.payload; // from backend

      state.products = state.products.map((cartItem) => {
        const updated = updatedProducts.find(
          (p) => p._id === cartItem._id
        );

        if (!updated) return cartItem;

        return {
          ...cartItem,
          stock: updated.stock, // 🔥 refresh stock
        };
      });
    },
  },
});

export const {
  addProduct,
  removeProduct,
  updateQuantity,
  clearCart,
  syncCartStock,
} = cartSlice.actions;

export default cartSlice.reducer;