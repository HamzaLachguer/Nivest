/* ============================== */
// Importing 
//
/* ============================== */
import { initHeader, openCart } from "./header.js";
import {getElement, updateClass, updateAriaAttribute, findPdt, loadData} from './helperFunc.js';
import {cart, cartQuantity, cartMatchingPdt, removeCartItem} from './cart.js';


/* ============================== */
// DOM elements caching
//
/* ============================== */
const DOM_ELEMENTS = {
  sliderContainer: getElement("#slider-container"),
  productImgs: getElement("#product-imgs"),
  sliderControls: getElement("#slider-controls"),

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
const productId = localStorage.getItem("product-id");

const state = {
  currentSlide: 0,
}

const URL = './productsData.json';

const TAG_COLORS = {
  new: "bg-blue",
  sale: "bg-red",
  popular: "bg-dark"
}

let cartEntry ={
  id: productId,
  quantity: 1,
  size: 6,
}


/* ============================== */
// Matching Product
//
/* ============================== */
let matchingProduct = await findPdt(productId, URL);

console.log(matchingProduct)

  
/* ============================== */
// Product images slider
//
/* ============================== */
function renderPdtImg(product, index) {
  const {id, images, title} = product;

  const li = document.createElement("li");
  li.className = "flex-none h-full w-full overflow-hidden";

  const img = document.createElement("img");
  img.className = "h-full w-full object-cover object-center"
  img.src = images[index];
  img.alt = title;
  img.loading = "lazy";

  li.appendChild(img);
  DOM_ELEMENTS.productImgs.appendChild(li);
}

matchingProduct.images.forEach(((_, index) => {
  renderPdtImg(matchingProduct, index);
  renderSliderConrols(index)
}))

function renderSliderConrols(index) {
  const control = document.createElement("button");
  control.className = "h-1 md:h-2 w-1 md:w-2 rounded-lg bg-dark transition-300";
  control.setAttribute("aria-label", `slide index: ${index}`);
  control.setAttribute("data-slide-index", index);

  if (control.dataset.slideIndex == state.currentSlide) {
    control.className = "h-1 md:h-2 w-5 md:w-7 rounded-lg bg-dark transition-300"
  }

  DOM_ELEMENTS.sliderControls.appendChild(control);

  control.addEventListener('click', () => {
    slide(control);
  })
}

function updateSlider(slideIndex) {
  DOM_ELEMENTS.productImgs.style.transform = `translateX(${-slideIndex * 100}%)`
}

function setActiveControler(control) {
  DOM_ELEMENTS.sliderControls.querySelectorAll("button")
    .forEach(btn => {
      btn.className = "h-1 md:h-2 w-1 md:w-2 rounded-lg bg-dark transition-300";
    })

  control.className = "h-1 md:h-2 w-5 md:w-7 rounded-lg bg-dark transition-300";
}

function slide(control) {
  state.currentSlide = control.dataset.slideIndex;

  setActiveControler(control);
  updateSlider(state.currentSlide);
}


/* ============================== */
// Product info
//
/* ============================== */
function initPdtInfo() {
  initTag(matchingProduct.tag);
  initPrice();
  initSizeChart();
  initPdtDescription();
  DOM_ELEMENTS.pdtTitle.textContent = matchingProduct.title;
  DOM_ELEMENTS.pdtDesc.textContent = matchingProduct.description;
}

function initTag(tag) {
  DOM_ELEMENTS.pdtTag.textContent = tag;
  DOM_ELEMENTS.pdtTag.className = `${TAG_COLORS[tag]} py-1 px-2 uppercase font-medium text-white w-fit tracking-tight mb-2`;
}

function initPrice() {
  if (matchingProduct.tag === "sale") {
    return DOM_ELEMENTS.pdtPrice.innerHTML = `
      <span class="text-red">$${matchingProduct.price - Math.floor(matchingProduct.price * (matchingProduct.discount / 100))}</span>
      <span class="text-dark-7a line-through">$${matchingProduct.price}</span>
    `;
  }

  DOM_ELEMENTS.pdtPrice.textContent = `$${matchingProduct.price}`
}

function initSizeChart() {
  matchingProduct.sizes.forEach((s, index) => {
    const li = document.createElement("li");

    li.className = "cursor-pointer py-2 px-4 grid place-items-center bg-[#f0f0f0]  text-sm font-medium";
    li.setAttribute("data-size", s)
    li.textContent = s;

    if (index == 0) {
      li.className = "cursor-pointer py-2 px-4 grid place-items-center bg-white border border-solid border-dark text-sm font-medium";
    }
    DOM_ELEMENTS.sizeChart.appendChild(li);

    li.addEventListener('click', () => {
      DOM_ELEMENTS.sizeChart.querySelectorAll("li")
        .forEach(el => el.className = "cursor-pointer py-2 px-4 grid place-items-center bg-[#f0f0f0]  text-sm font-medium")
      
        li.className = "cursor-pointer py-2 px-4 grid place-items-center bg-white border border-solid border-dark text-sm font-medium";
        DOM_ELEMENTS.selectedSize.textContent = li.dataset.size;
        cartEntry.size = +li.dataset.size;
    })
  })
}

function initPdtDescription() {
  DOM_ELEMENTS.pdtFullDesc.textContent = matchingProduct.description;

  DOM_ELEMENTS.toggleDescription.addEventListener('click', () => {
    DOM_ELEMENTS.toggleDescription.querySelector("#drop-icon")
      .classList.toggle("rotate-180");

    DOM_ELEMENTS.pdtFullDesc.classList.toggle("h-0");
    DOM_ELEMENTS.pdtFullDesc.classList.toggle("pb-3");
  })
}



/* ============================== */
// Add to cart logic
//
/* ============================== */
function addToCart() {
  DOM_ELEMENTS.addToCartBtn.addEventListener('click', () => {
  
    const existingPdt = cartMatchingPdt(cartEntry);
    if (existingPdt) {
      existingPdt.quantity += 1;
    } else {
      cart.push({...cartEntry});
    }
  
    localStorage.setItem("cartItemsGrid", JSON.stringify(cart));

    // DOM_ELEMENTS.cartLength.textContent = cartQuantity();
    // DOM_ELEMENTS.cartSumItems.textContent = cartQuantity();
    updateCart();
    openCart();
  })
}

addToCart();


let cartItems = [];

(async () => {
  cartItems = await getCartItems() || [];
  initCartRendering();
})

async function updateCart() {
  localStorage.setItem("cartItemsGrid", JSON.stringify(cart))
  cartItems = await getCartItems();
  initCartRendering();

  DOM_ELEMENTS.cartLength.textContent = cartQuantity();
  DOM_ELEMENTS.cartSumItems.textContent = cartQuantity();
}

async function getCartItems() {
  let array = [];
  const d = await loadData(URL)
  cart.map(item => {
    const pdt = d.find(p => p.id === item.id);

    if (pdt) array.push({
      id: item.id,
      price: pdt.price,
      img: pdt.images[0],
      title: pdt.title,
      quantity: item.quantity,
      size: item.size,
    });
  });

  return array;
}

function cartSubTotal() {
  return cartItems.reduce((t, n) => t + (n.price * n.quantity), 0)
}

function renderCartItem(item) {
  const {id, title, price, img, quantity, size} = item;
  const li = document.createElement("li");
  li.className = "item-card w-full flex gap-6 bg-white cursor-pointer";
  li.setAttribute("data-item-id", id);

  li.innerHTML = `
  <div class="h-[120px] w-[120px] overflow-hidden bg-[#03060714] flex-shrink-0">
    <img class="object-center object-cover h-full w-full" src=${img} alt="product ${title}" loading="lazy">
  </div>

  <div class="flex flex-col justify-between w-full">
    <div class="flex items-end justify-between w-full">
      <div class="uppercase font-medium flex flex-col gap-1">
        <h4 class="font-semibold">${title}</h4>
        <h4 class="flex gap-2">size: <span class="text-dark-7a">${size}</span></h4>
      </div>

      <div class="font-semibold">$${price}</div>
    </div>

    <div class="flex justify-between items-center">
      <div class="flex gap-0">
        <button aria-controls="product-quantity" aria-label="decrement product quantity button" class="decrement-quantity-btn grid place-items-center h-8 w-8 hover:bg-[#03060714] transition-150">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>

        <div class="product-quantity font-semibold h-8 w-8 grid place-items-center">${quantity}</div>

        <button aria-controls="product-quantity" aria-label="increment product quantity button" class="increment-quantity-btn grid place-items-center h-8 w-8 hover:bg-[#03060714] transition-150">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
      </div>

      <button aria-label="remove product from cart" class="remove-product grid place-items-center h-8 w-8 hover:bg-[#03060714] transition-150">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 3H15M3 6H21M19 6L18.2987 16.5193C18.1935 18.0975 18.1409 18.8867 17.8 19.485C17.4999 20.0118 17.0472 20.4353 16.5017 20.6997C15.882 21 15.0911 21 13.5093 21H10.4907C8.90891 21 8.11803 21 7.49834 20.6997C6.95276 20.4353 6.50009 20.0118 6.19998 19.485C5.85911 18.8867 5.8065 18.0975 5.70129 16.5193L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </button>
    </div>
  </div>
  `;

  li.addEventListener('click', async (e) => {
    const element = e.target;
    if (!element) return;

    const itemId = li.dataset.itemId;
    const itemSize = item.size;
    const itemQuantity = item.quantity;
    
    if (element.closest(".remove-product")) {
      removeCartItem(itemId, itemSize);
      cartItems = await getCartItems();
      initCartRendering();
      console.log(itemSize)
    }

    if (element.closest(".increment-quantity-btn")) {
      const CartItem = cart.find(i => i.id === itemId && i.size === itemSize);
      CartItem.quantity ++;
      updateCart();
    }

    if (element.closest(".decrement-quantity-btn") && itemQuantity > 1) {
      const CartItem = cart.find(i => i.id === itemId && i.size === itemSize);
      CartItem.quantity --;
      updateCart();
    }


    localStorage.setItem("product-id", itemId);
    window.location.href = "./pdtPage.html";
  })

  DOM_ELEMENTS.cartItemsList.appendChild(li);
}



function renderCart() {
  DOM_ELEMENTS.cartItemsList.innerHTML = "";

  cartItems.map(item => {
    return renderCartItem(item)
  })
}


function clearCart() {
  cart.length = 0;
  updateCart();
}

DOM_ELEMENTS.clearCartBtn.addEventListener('click', clearCart)


function initCartRendering() {
  renderCart();
  
  DOM_ELEMENTS.cartSumItems.textContent = cartQuantity();
  DOM_ELEMENTS.cartTOTAL.textContent = `$${cartSubTotal()}`;
}

updateCart();
initPdtInfo();
initHeader();

/* ============================== */
// Similar product
//
/* ============================== */




document.addEventListener('DOMContentLoaded', () => {
});
//cartSubTotal();