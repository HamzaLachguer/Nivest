// CART RENDERING
import { cart, cartQuantity } from "./cart.js";
import { getCartItems, removeCartItem, updateCartQuantity } from "./cart-manager.js";
import { saveToStorage } from "../utils/storage.js";



let cartItems = [];

(async () => {
  cartItems = await getCartItems(cart, URL) || [];
  initCart();
})

async function updateCart(DOM_ELEMENTS, URL) {
  cartItems = await getCartItems(cart, URL);
  renderCart(DOM_ELEMENTS);

  DOM_ELEMENTS.cartLength.textContent = cartQuantity();
  DOM_ELEMENTS.cartSumItems.textContent = cartQuantity();
  DOM_ELEMENTS.cartTOTAL.textContent = `$${cartSubTotal()}`;
}

function cartSubTotal() {
  return cartItems.reduce((t, n) => t + (n.price * n.quantity), 0)
}

function renderCartItem(item, DOM_ELEMENTS, URL) {
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
      updateCart(DOM_ELEMENTS, URL);
      return;
    }

    if (element.closest(".increment-quantity-btn")) {
      updateCartQuantity(itemId, itemSize, +1);
      updateCart(DOM_ELEMENTS, URL);
      return;
    }
    
    if (element.closest(".decrement-quantity-btn") && itemQuantity > 1) {
      updateCartQuantity(itemId, itemSize, -1);
      updateCart(DOM_ELEMENTS, URL);
      return;
    }

    else {
      saveToStorage("product-id", itemId);
      window.location.href = "./pdtPage.html";
    }
  })

  DOM_ELEMENTS.cartItemsList.appendChild(li);
}

function renderCart(DOM_ELEMENTS, URL) {
  DOM_ELEMENTS.cartItemsList.innerHTML = "";

  return cartItems.map(item => renderCartItem(item, DOM_ELEMENTS, URL));
}


export function initCart(DOM_ELEMENTS, URL) {
  updateCart(DOM_ELEMENTS, URL);
  renderCart(DOM_ELEMENTS, URL);
}