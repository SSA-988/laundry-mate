import { createSlice } from "@reduxjs/toolkit";

export const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { item, category } = action.payload;
      const existingItemindex = state.cart.findIndex(
        (cartItem) => cartItem.item.id == item.id
      );

      if (existingItemindex !== -1) {
        state.cart[existingItemindex].quantity++;
      } else {
        state.cart.push({
          item: { ...item, quantity: 1 },
          category,
        });
      }
    },

    incrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.item.id === action.payload.id
      );
      if (itemPresent) {
        itemPresent.item.quantity++;
      }
    },
    decrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.item.id === action.payload.id
      );

      if (itemPresent.item.quantity == 1) {
        const removeItem = state.cart.filter(
          (item) => item.item.id !== action.payload.id
        );
        state.cart = removeItem;
      } else {
        itemPresent.item.quantity--;
      }
    },
    cleanCart: (state) => {
      state.cart = [];
    },
  },
});


export const {addToCart,incrementQuantity,decrementQuantity,cleanCart} = CartSlice.actions;

export default CartSlice.reducer