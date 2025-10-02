/* ============================== */
// Cart logic
//
/* ============================== */
import { initHeader } from "./header.js";
import { initCart } from "./modules/cart/cart-rendering.js";
import { getElement } from "./modules/utils/dom.js";
import { URL } from "./modules/utils/constants.js";
import { addToCart, clearCart } from "./modules/cart/cart-manager.js"




const DOM_ELEMENTS = {
  cartLength: getElement("#cart-length"),
  cartSumItems: getElement("#cart-sum-items"),
  cartItemsList: getElement("#cart-items-list"),
  cartTOTAL: getElement("#sub-total"),
  clearCartBtn: getElement("#clear-cart-btn"),
}

initHeader();
initCart(DOM_ELEMENTS, URL);

DOM_ELEMENTS.clearCartBtn.addEventListener('click', () => {
  clearCart();
  initCart(DOM_ELEMENTS, URL);
});