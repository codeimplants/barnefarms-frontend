import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

// Define types for Cart Items and State
interface CartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  category: string;
  // Add other fields as necessary
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CartState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
}

// Initial State (gets from localStorage or default)
const initialState: CartState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart")!)
  : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "RazorPay",
      itemsPrice: "0.00",
      shippingPrice: "0.00",
      taxPrice: "0.00",
      totalPrice: "0.00",
    };

// Create the Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const {  ...item } = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        const index = state.cartItems.findIndex((x) => x._id === item._id);
        state.cartItems[index] = item;
      } else {
        state.cartItems.push(item);
      }

      updateCart(state); 
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      updateCart(state); // This mutates the state directly
    },

    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      updateCart(state); 
    },

    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      updateCart(state); 
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      updateCart(state); 
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
