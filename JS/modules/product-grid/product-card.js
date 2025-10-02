/* ============================== */
// 
//
/* ============================== */
import { TAG_COLORS, state } from "../utils/constants.js";


/* ============================== */
// 
//
/* ============================== */
function getTagColor(tag) {
  return TAG_COLORS[tag];
}


function formatPrice(price, tag) {
  const plainTags = ["new", "popular"]
  if (plainTags.includes(tag)) return `$${price}`;

  return ` 
    <span class="text-red">$${price}</span>
    <span class="text-dark-7a line-through">$${price * (tag / 100)}</span>
  `
}


export function renderProductCard(product) {
  const {id, title = "untitled", images = [], price = 0, tag = ""} = product;

  const productCard = document.createElement("li");
  productCard.className = "product-card relative flex flex-col gap-3 cursor-pointer";
  productCard.setAttribute("data-product-id", id);

  productCard.innerHTML =  `
    <div class="h-full w-full overflow-hidden">
      <img src=${images[0]} alt=" image" class="h-full w-ful object-cover object-center" loading="lazy">
    </div>

    <div class="font-medium flex flex-col gap-1 text-sm">
      <h3>${title}</h3>
      <h3>${formatPrice(price, tag)}</h3>
    </div>

    <div class="p-3 flex items-center justify-between absolute top-0 left-0 w-full">
      <span class="capitalize font-medium ${getTagColor(tag)} px-2 py-1 text-white text-sm">${tag}</span>
      <button aria-label="add product to favorites" class="add-to-favorites h-8 w-8 rounded-3xl bg-white grid place-items-center">
        <svg class="${state.favoritesList.has(id) ? "fill-red" : ""}" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </button>
    </div>
  `;

  return productCard
}