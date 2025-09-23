/* ============================== */
// Importing 
//
/* ============================== */
import { initHeader } from "./header.js";

import {getElement, updateClass, updateAriaAttribute} from './helperFunc.js'


/* ============================== */
// DOM elements caching
//
/* ============================== */
const DOM_ELEMENTS = {
  sliderContainer: getElement("#slider-container"),
  productImgs: getElement("#product-imgs"),
  sliderControls: getElement("#slider-controls"),
}


/* ============================== */
// Constants & Configs
//
/* ============================== */
const state = {
  currentSlide: 0,
}

const URL = './productsData.json';

const TAG_COLORS = {
  new: "bg-blue",
  sale: "bg-red",
  popular: "bg-dark"
}


/* ============================== */
// Matching Product
//
/* ============================== */
let matchingProduct = {
    id: "pdt-001",
    images: [
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9b4586a5-62a6-4f9e-806b-3350ed82451a/NIKE+WAFFLE+DEBUT.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/068b1e97-2981-4254-bdf5-6cb759c6e319/NIKE+WAFFLE+DEBUT.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d1b07793-6d84-4ed3-a9ca-70f719da0552/NIKE+WAFFLE+DEBUT.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c2681f83-1fef-4a9f-968b-0cb1b797008d/NIKE+WAFFLE+DEBUT.png"
    ],
    title: "Nike Waffle Debut",
    price: 56.97,
    desc: "Retro gets modernized in the Nike Waffle Debut. Remember that smooth suede and nylon trend? It's back, along with the modernized 'wedge' midsole that feels incredibly plush.",
    keywords: ["nike", "waffle"],
    tag: "popular",
    category: "men",
    sizes: ["6", "7", "8", "9", "10"],
    inStock: true,
    inventoryCount: 30
  }


  
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




/* ============================== */
// Similar product
//
/* ============================== */





document.addEventListener('DOMContentLoaded', () => {
  initHeader();
});