/* ============================== */
// Importing
//
/* ============================== */
import { initHeader } from "./header.js";
import { generateProductGrid } from "./modules/product-grid/product-grid.js";
import { hidePopup, toggleFavorites } from "./modules/favorites/favorites.js";
import { initPromoCopy } from "./modules/promo/promo.js";
import { counter } from "./modules/promo/counter.js";
import { initFAQs } from "./modules/faq/faq.js";
import { renderInfiniteScroll } from "./modules/scroll/infinite-scroll.js";
import { initTestimonials, updateSlider } from "./modules/testimonials/testimonials.js";
import { state } from "./modules/utils/constants.js";

import { saveToStorage } from "./modules/utils/storage.js";


/* ============================== */
// 
//
/* ============================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  generateProductGrid();
  hidePopup();
  initFAQs();
  renderInfiniteScroll();
  initTestimonials();
  initPromoCopy(
    document.querySelector("#copy-promo-code"),
    document.querySelector("#promo-code").textContent
  );
  state.interval = setInterval(counter, 1000);
})


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