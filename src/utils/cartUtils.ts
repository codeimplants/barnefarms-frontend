
export const addDecimals = (num: number): string => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// Cart item type
interface CartItem {
  price: number;
  qty: number;
}

// Cart state type
interface CartState {
  cartItems: CartItem[];
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
}

// Update cart function
export const updateCart = (state: CartState): CartState => {
  // Calculate the items price in whole number (pennies) to avoid issues with floating point number calculations
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + (item.price * item.qty),
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // Calculate the shipping price
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  state.shippingPrice = addDecimals(shippingPrice);

  // Calculate the tax price
  const taxPrice = 0.15 * itemsPrice;
  state.taxPrice = addDecimals(taxPrice);

  // Calculate the total price
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  state.totalPrice = addDecimals(totalPrice);

  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
