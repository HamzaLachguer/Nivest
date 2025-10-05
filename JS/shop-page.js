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

  filterPrice: getElement("#filter-by-price"),
  filterCollection: getElement("#filter-by-collection"),
  filterGender: getElement("#filter-by-gender"),
}


let largeScreen = 1024;
let filterOptionOpen = true;
// let filterBy = new Set();

DOM_ELEMENTS.filterHeader.addEventListener('click', () => {
  if (window.innerWidth >= largeScreen) return

  filterOptionOpen = !filterOptionOpen;
  filterOptionOpen ? hideFilterOptions() : showFilterOptions();
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


// function toogleFilterId(id) {
//   filterBy.has(id) ? filterBy.remove(id) : filterBy.add(id);
// }

// let filterdList = null;




const getGridData = async () => {
  const data = await loadData(URL);
  return data;
}

let allData = await getGridData();
let data = [...allData];

let filterData = {
  categories: new Set(),
  tags: new Set(),
};

DOM_ELEMENTS.filterOptions.addEventListener('click', (e) => {
  const option = e.target.closest(".filter-btn");
  if (!option) return;

  option.querySelector("div:nth-of-type(1)").classList.toggle("active-filter");
  const filterGender = option.dataset.category;
  const filterCollection = option.dataset.tag;
  
  if (filterGender){
    if (filterGender === "all") {
      filterData.categories.clear();
      return data = [...allData];
    } 

    filterData.categories.has(filterGender)
      ? filterData.categories.delete(filterGender)
      : filterData.categories.add(filterGender);
  }

  if (filterCollection){
    filterData.tags.has(filterCollection)
    ? filterData.tags.delete(filterCollection) 
    : filterData.tags.add(filterCollection);
  }

  data = allData.filter(p => {
    const matchesCategories = filterData.categories.size === 0 || filterData.categories.has(p.category);
    const matchesTags = filterData.tags.size === 0 || filterData.tags.has(p.tag);
    return matchesCategories && matchesTags;
  })

  getElement("#filter-product-grid").innerHTML = "";
  renderProductGrid(data, "#filter-product-grid", data.length);
})

// async function initFilter() {
//   let filterGender = new Set();
//   let filterCollection = new Set();

//   DOM_ELEMENTS.filterGender.addEventListener('click', async (e) => {
//     const option = e.target.closest(".filter-btn");
//     if (!option) return;
    
//     option.querySelector("div:nth-of-type(1)").classList.toggle("active-filter");
//     const filterId = option.dataset.category;

//     if (filterId === "all") {
//       filterGender.clear();
//       data = [...allData];
//       return;
//     }

//     filterGender.has(filterId) ? filterGender.delete(filterId) : filterGender.add(filterId);

//     if (filterGender.size === 0) {
//       data = [...allData];
//     } else {
//       data = allData.filter(p => filterGender.has(p.category));
//     }

//     getElement("#filter-product-grid").innerHTML = "";
//     renderProductGrid(data, "#filter-product-grid", data.length);
//   })

//   DOM_ELEMENTS.filterCollection.addEventListener('click', async (e) => {
//     const option = e.target.closest(".filter-btn");
//     if (!option) return;
    
//     option.querySelector("div:nth-of-type(1)").classList.toggle("active-filter");
//     const filterId = option.dataset.tag;

//     filterCollection.has(filterId) ? filterCollection.delete(filterId) : filterCollection.add(filterId);
//     if (filterCollection.size === 0) {
//       data = [...allData];
//     } else {
//       data = allData.filter(p => filterCollection.has(p.tag));
//     }

//     getElement("#filter-product-grid").innerHTML = "";
//     renderProductGrid(data, "#filter-product-grid", data.length);
//   })

// }


//initFilter();
/* ============================== */
// Product grid
//
/* ============================== */




renderProductGrid(data, "#filter-product-grid", data.length);


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