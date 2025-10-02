export let cart = JSON.parse(localStorage.getItem("cartItemsGrid")|| "[]");

export function cartQuantity() {
  return cart.reduce((a, b) => a + b.quantity, 0);
}

export function cartMatchingPdt(cartEntry) {
  return cart.find(p => p.id === cartEntry.id && p.size === cartEntry.size);
}
