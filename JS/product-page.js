/* ============================== */
// Importing 
//
/* ============================== */
import { initHeader, openCart } from "./header.js";
import { loadFromStorage } from "./modules/utils/storage.js";
import { URL, TAG_COLORS } from "./modules/utils/constants.js";
import { findPdt } from "./modules/utils/helpers.js";
import { initProductImgSlider, initProductInfo } from "./modules/product/product-info.js";
import { getElement } from "./modules/utils/dom.js";
import { addToCart, clearCart } from "./modules/cart/cart-manager.js"
import { initCart } from "./modules/cart/cart-rendering.js";


/* ============================== */
// DOM elements caching
//
/* ============================== */
const DOM_ELEMENTS = {
  sliderContainer: getElement("#slider-container"), //
  productImgs: getElement("#product-imgs"), //
  sliderControls: getElement("#slider-controls"), //

  pdtTag: getElement("#product-tag"),
  pdtTitle: getElement("#product-title"),
  pdtDesc: getElement("#product-description"),
  pdtPrice: getElement("#product-price"),
  
  sizeChart: getElement("#size-chart"),
  selectedSize: getElement("#selected-size"),
  
  addToCartBtn: getElement("#add-to-cart-btn"),
  
  toggleDescription: getElement("#toggle-description"),
  pdtFullDesc: getElement("#description"),

  cartLength: getElement("#cart-length"),
  cartSumItems: getElement("#cart-sum-items"),
  cartItemsList: getElement("#cart-items-list"),
  cartTOTAL: getElement("#sub-total"),
  clearCartBtn: getElement("#clear-cart-btn"),
}


/* ============================== */
// Constants & Configs
//
/* ============================== */
const productId = loadFromStorage("product-id");

const state = { currentSlide: 0 };

let cartEntry = {
  id: productId,
  quantity: 1,
  size: 6,
}

/* ============================== */
//  
//
/* ============================== */
async function initPage() {
  const matchingProduct = await findPdt(productId, URL);
  console.log(matchingProduct)

  initProductImgSlider(DOM_ELEMENTS, matchingProduct, state);
  initProductInfo(DOM_ELEMENTS, matchingProduct, cartEntry, TAG_COLORS);
  initHeader();
};

initPage();




/* ============================== */
//  CART
//
/* ============================== */
// PRODUCT-PAGE .js



initCart(DOM_ELEMENTS, URL);

DOM_ELEMENTS.clearCartBtn.addEventListener('click', () => {
  clearCart();
  initCart(DOM_ELEMENTS, URL)
})

DOM_ELEMENTS.addToCartBtn.addEventListener('click', () => {
  addToCart(cartEntry);
  openCart();
  initCart(DOM_ELEMENTS, URL);
})