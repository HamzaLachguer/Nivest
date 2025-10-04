import { initHeader } from "./header.js";
import { initCart } from "./modules/cart/cart-rendering.js";
import { addToCart, clearCart } from "./modules/cart/cart-manager.js";
import { getElement } from "./modules/utils/dom.js";
import { URL } from "./modules/utils/constants.js";
import { loadData } from "./modules/utils/helpers.js";
import { renderProductGrid } from "./modules/product-grid/product-grid.js";

import { saveToStorage } from "./modules/utils/storage.js";
import { toggleFavorites, hidePopup } from "./modules/favorites/favorites.js";




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
let filterOptionOpen = false


DOM_ELEMENTS.filterHeader.addEventListener('click', () => {
  if (window.pageXOffset >= largeScreen) return

  if (!filterOptionOpen) {
    showFilterOptions();
    return filterOptionOpen = !filterOptionOpen;
  }

  if (filterOptionOpen) {
    hideFilterOptions();
    return filterOptionOpen = !filterOptionOpen;
  }
})


function showFilterOptions() {
  DOM_ELEMENTS.filterOptions.classList.remove("h-0", "py-0");
  DOM_ELEMENTS.filterOptions.classList.add("h-fit", "py-5");

  DOM_ELEMENTS.filterHeader.querySelector("#rotate")
    .classList.remove("rotate-90");
}


function hideFilterOptions() {
  DOM_ELEMENTS.filterOptions.classList.add("h-0", "py-0");
  DOM_ELEMENTS.filterOptions.classList.remove("h-fit", "py-5");

  DOM_ELEMENTS.filterHeader.querySelector("#rotate")
    .classList.add("rotate-90");
}

/* ============================== */
// Product grid
//
/* ============================== */
async function productGrid() {

  const data = await loadData(URL);
  renderProductGrid(data, "#filter-product-grid", data.length)
}

productGrid();
hidePopup();


document.addEventListener('click', (e) => {
  const productCard = e.target.closest(".product-card");
  const favoriteBtn = e.target.closest(".add-to-favorites");
  
  if (!productCard) return;

  const productId = productCard.dataset.productId;
  
  if (favoriteBtn) {
    toggleFavorites(productId, favoriteBtn);
    return;
  }

    // save product to locale storage in order to generate product page.
    saveToStorage("product-id", productId);
    window.location.href = "./pdtPage.html";
})

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