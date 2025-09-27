export let cart = JSON.parse(localStorage.getItem("cartItemsGrid")|| "[]") ;



import {  } from "./helperFunc.js";


const URL = './productsData.json';


export function cartQuantity() {
  return cart.reduce((a, b) => a + b.quantity, 0)
}

export function cartMatchingPdt(cartEntry) {
  return cart.find(p => p.id === cartEntry.id && p.size === cartEntry.size);
}

export function removeCartItem(itemId, itemSize) {
  cart = cart.filter(i => !(i.id === itemId && i.size === itemSize));
  localStorage.setItem("cartItemsGrid", JSON.stringify(cart));
}