//CART MANAGER

import { cart, cartMatchingPdt } from "./cart.js";
import { loadData } from "../utils/helpers.js";
import { saveToStorage } from "../utils/storage.js";


export function addToCart(cartEntry) {
    const existingPdt = cartMatchingPdt(cartEntry);
    if (existingPdt) {
      existingPdt.quantity += 1;
    } else {
      cart.push({...cartEntry});
    }
  
    saveToStorage("cartItemsGrid", cart);
}

export async function getCartItems(cart, URL) {
  const pdtList = await loadData(URL);
  
  return cart.map(item => {
    const pdt = pdtList.find(p => p.id === item.id);
    if (!pdt) return null;

    return {
      id: item.id,
      price: pdt.price,
      img: pdt.images[0],
      title: pdt.title,
      quantity: item.quantity,
      size: item.size,
    };
  }).filter(Boolean);
}

export function removeCartItem(itemId, itemSize) {
  const index = cart.findIndex(i => i.id === itemId && i.size === itemSize);
  if (index !== -1) cart.splice(index, 1);
  saveToStorage("cartItemsGrid", cart);
}

export function updateCartQuantity(itemId, itemSize, delta) {
  const CartItem = cart.find(i => i.id === itemId && i.size === itemSize);
  if (!CartItem) return;

  if (delta === -1 && CartItem.quantity === 1) return;
  
  CartItem.quantity += delta;
  saveToStorage("cartItemsGrid", cart);
}

export function clearCart() {
  cart.length = 0;
  saveToStorage("cartItemsGrid", cart);
}