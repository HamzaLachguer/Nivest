import { initHeader } from "./header.js";
import { initCart } from "./modules/cart/cart-rendering.js";
import { addToCart, clearCart } from "./modules/cart/cart-manager.js";
import { getElement } from "./modules/utils/dom.js";
import { state } from "./modules/utils/constants.js";
import { URL } from "./modules/utils/constants.js";




const DOM_ELEMENTS = {
  cartLength: getElement("#cart-length"),
  cartSumItems: getElement("#cart-sum-items"),
  cartItemsList: getElement("#cart-items-list"),
  cartTOTAL: getElement("#sub-total"),
  clearCartBtn: getElement("#clear-cart-btn"),

  filterHeader: getElement("#filter-header"),
  filterOptions: getElement("#filter-options"),
}


let largeScreen = 1024;



DOM_ELEMENTS.filterHeader.addEventListener('click', () => {
  console.log('filter header')

})
function showFilterOptions() {

}


function hideFilterOptions() {}

/* ============================== */
// Cart logic & header
//
/* ============================== */
initHeader();
initCart(DOM_ELEMENTS, URL);

DOM_ELEMENTS.clearCartBtn.addEventListener('click', () => {
  clearCart();
  initCart(DOM_ELEMENTS, URL);
});