/* ============================== */
// Importing 
//
/* ============================== */
import { initHeader } from "./header.js";
import {getElement, updateClass, updateAriaAttribute} from './helperFunc.js';
import {cart} from './cart.js';


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

let productDetails ={
  id: productId,
  quantity: 1,
  size: 6,
}


/* ============================== */
// Matching Product
//
/* ============================== */
async function loadData(url) {
  const response = await fetch(url);
  try {
    if (!response.ok) {
      console.warn("Could not fetch api");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error)
  }
}

async function findPdt() {
  const data = await loadData(URL);

  return data.find(p => p.id === productId);
}

let matchingProduct = await findPdt();

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
        productDetails.size = li.dataset.size;
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
DOM_ELEMENTS.addToCartBtn.addEventListener('click', () => {
  cart.push(productDetails);
  localStorage.setItem("cartItemss", JSON.stringify(cart));
  console.log(cart)
})


/* ============================== */
// Similar product
//
/* ============================== */





initPdtInfo();
initHeader();

document.addEventListener('DOMContentLoaded', () => {
});