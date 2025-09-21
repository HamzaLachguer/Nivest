// Impoting ...
//
import { initHeader, getElement, updateClass, updateAriaAttribute} from "./header.js";



// Cach DOM elements & Declaring variables
//
const DOM_ELEMENTS = {
  popularProductGrid: getElement("#popular-product-grid"),
  newProductGrid: getElement("#new-product-grid"),

  addToFavoritePoppup: getElement("#favorite-poppup"),

  copyPromoBtn: getElement("#copy-promo-code"),
  promoCode: getElement("#promo-code").textContent,

  days: getElement("#days"),
  hours: getElement("#hours"),
  minutes: getElement("#minutes"),
  seconds: getElement("#seconds"),

  slideTogglers: getElement("#slide-toggle"),
  slideContent: getElement("#slide-content"),

  infinitScrollBar: getElement("#scroll-bar"),
  scrollBarContent: getElement("#scroll-content"),

  faqGrid: getElement("#faq-grid-container"),
}

let stats = {
  favoritesList: new Set(),

  targetDate: new Date("November 1 2025 00:00:00").getTime(),
  interval: null,

  slideIndex: 0,
}


const URL = "./productsData.json";

// Fetch the product grid
async function loadData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Could not fetch the api");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error)
  }
}



// Return product card
function renderProductCard(title, images, price, tag) {
  
  return `
    <div class="h-full w-full overflow-hidden">
      <img src=${images[0]} alt=" image" class="h-full w-ful object-cover object-center" loading="lazy">
    </div>

    <div class="font-medium flex flex-col gap-1 text-sm">
      <h3>${title}</h3>
      <h3>${priceForm(price, tag)}</h3>
    </div>

    <div class="p-3 flex items-center justify-between absolute top-0 left-0 w-full">
      <span class="capitalize font-medium ${bgColor(tag)} px-2 py-1 text-white text-sm">${tag}</span>
      <button id="add-to-favorites" aria-label="add product to favorites" class="h-8 w-8 rounded-3xl bg-white grid place-items-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </button>
    </div>
  `
}

function bgColor(tag) {
  if (tag === "new") return "bg-blue";
  if (tag === "popular") return "bg-dark";

  return "bg-red";
}

function priceForm(price, tag) {
  if (tag === "new" || tag === "popular") return `$${price}`;

  return ` <span class="text-red">$${price}</span>
          <span class="text-dark-7a line-through">$${price}</span>
        `
}



// Render product grid
function renderProductGrid(grid, container, length) {
  grid.map((product, index) => {
    if (!product) return;
    const {id, title, images, price, tag} = product;

    if (index > length) return;
    const productCard = document.createElement("li");
    productCard.className = "relative flex flex-col gap-3 cursor-pointer";
    productCard.setAttribute("data-product-id", id);
    productCard.innerHTML = renderProductCard(title, images, price, tag);

    container.append(productCard);

    productCard.addEventListener('click', (e) => {
      const productId = productCard.dataset.productId;
      const addToFavoritesBtn = e.target.closest("#add-to-favorites");

      if (addToFavoritesBtn) {
        // addToFavoritesBtn.querySelector("svg").classList.toggle("fill-red");
        showAddPoppup(productId, addToFavoritesBtn)
      }
      
      else console.log(productId)
    })
  });
}

// add to favorites popup
//
function showAddPoppup(productId, addToFavoritesBtn) {
  addToFavoritesBtn.querySelector("svg").classList.toggle("fill-red");
  
  if (stats.favoritesList.has(productId)) {
    stats.favoritesList.delete(productId);
    console.log(`${productId} removed from favorites`)
    return;
  }
  
  stats.favoritesList.add(productId);
  console.log(`add ${productId} to favorite`)
  updateClass(DOM_ELEMENTS.addToFavoritePoppup, "hidden", "flex");
}

function hideAddPoppup() {
  updateClass(DOM_ELEMENTS.addToFavoritePoppup, "flex", "hidden")
}

DOM_ELEMENTS.addToFavoritePoppup.addEventListener('click', hideAddPoppup)



async function generateProductGrid() {
  const grid = await loadData(URL);

  // filter grid
  const popular = grid.filter(p => p.tag === "popular");
  const newArrivals = grid.filter(p => p.tag === "new");

  renderProductGrid(popular, DOM_ELEMENTS.popularProductGrid, 3)
  renderProductGrid(newArrivals, DOM_ELEMENTS.newProductGrid, 3)
}

generateProductGrid()


// copy promo code
//
DOM_ELEMENTS.copyPromoBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(DOM_ELEMENTS.promoCode)
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
})


// Counter
//
function counter() {
  const currentDate = new Date().getTime();
  const interval = stats.targetDate - currentDate;

  const days = Math.floor(interval / (1000 * 60 * 60 * 24));
  const hours = Math.floor(interval / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(interval / (1000 * 60)) % 60;
  const seconds = Math.floor(interval / 1000) % 60;

  DOM_ELEMENTS.days.innerHTML = String(days).padStart(2, "0");
  DOM_ELEMENTS.hours.innerHTML = String(hours).padStart(2, "0");
  DOM_ELEMENTS.minutes.innerHTML = String(minutes).padStart(2, "0");
  DOM_ELEMENTS.seconds.innerHTML = String(seconds).padStart(2, "0");

  if (interval < 0) {
    clearInterval(stats.interval)
    DOM_ELEMENTS.days.innerHTML = "00"
    DOM_ELEMENTS.hours.innerHTML = "00"
    DOM_ELEMENTS.minutes.innerHTML = "00"
    DOM_ELEMENTS.seconds.innerHTML = "00"
  }
}

stats.interval = setInterval(counter, 1000);


/* Testimenials */
//
const testimenials = [
  {
    review: "These aren’t just sneakers. They’re motivation. I put them on and I move — simple as that. They feel built for momentum, not just comfort. Every step feels like purpose.",
    name: "Marcus Petrov",
    country: "Netherlands",
    imgSrc: "https://framerusercontent.com/images/utC4J2FwNnDujUCNIcD0nEcHNw.png?scale-down-to=512"
  },  {
    review: "Finally found kicks that don’t just look sharp — they actually keep up. On the court, in the city, wherever. I’ve put them through heat, rain, and long days. Never missed a beat in entire life.",
    name: "Alina Reyes",
    country: "Spain",
    imgSrc: "https://framerusercontent.com/images/696Q9tY9SbzS5TpEg234BbCxXVQ.png?scale-down-to=512"
  },  {
    review: "Comfort? Check. Grip? Solid. Style? You already know. I’ve worn them daily and they still feel brand new. These shoes aren’t just part of my outfit — they’re part of my rhythm.",
    name: "Jamal Okoro",
    country: "England",
    imgSrc: "https://framerusercontent.com/images/aLQJz65d0ZahdyQjRJ7fH3ogNKY.png?scale-down-to=512"
  }
]

// update slider
function updateSlider(index) {
  const testimenial = testimenials[index];
  const {review, name, country, imgSrc} = testimenial;

  return DOM_ELEMENTS.slideContent.innerHTML = `
  <div class="flex flex-col gap-6 items-center">
    <div>
      <svg fill="#D2FF1F" height="16" width="18" id="svg-453449676_583" viewBox="0 0 24 20"><path d="M0 20v-6.694c0-1.653.161-3.223.483-4.711a17.84 17.84 0 0 1 1.772-4.38C3.115 2.782 4.215 1.377 5.557 0l3.624 2.893C8.161 3.994 7.33 5.04 6.685 6.033a11.92 11.92 0 0 0-1.289 2.975 13.282 13.282 0 0 0-.322 2.976l-2.255-1.819h6.765V20H0Zm14.416 0v-6.694c0-1.653.161-3.223.483-4.711a17.845 17.845 0 0 1 1.772-4.38c.86-1.433 1.96-2.838 3.302-4.215l3.624 2.893c-1.02 1.101-1.852 2.148-2.496 3.14-.59.992-1.02 1.984-1.289 2.975a13.28 13.28 0 0 0-.322 2.976l-2.255-1.819H24V20h-9.584Z" fill="#D2FF1F"></path></svg>
    </div>

    <p class="text-center text-2xl lg:text-4xl uppercase font-semibold text-white leading-none">${review}</p>
  </div>

  <div class="flex flex-col gap-6 items-center">
    <div class="overflow-hidden h-14 w-14 rounded-full">
      <img class="h-full w-full object-cover object-center" src=${imgSrc} alt="" loading="lazy">
    </div>

    <div class="flex flex-col items-center gap-1">
      <span class="text-sm text-white capitalize">${name}</span>
      <span class="text-sm text-white-99 capitalize">Customer from ${country}</span>
    </div>
  </div>
  `
}

updateSlider(stats.slideIndex)

// generate togglers
//
testimenials.forEach((_, index) => {
  const btn = document.createElement("button");
  btn.setAttribute("data-slide-index", index);
  btn.className = "bg-white-99 h-1 w-10 lg:w-20 transition-150";

  if (index === stats.slideIndex) {
    btn.className = "bg-white h-1 w-20 lg:w-40 transition-150";
  }
  DOM_ELEMENTS.slideTogglers.append(btn);

  btn.addEventListener('click', () => {
    const slideIndex = btn.dataset.slideIndex;
    stats.slideIndex = slideIndex;
    
    setActiveToggler(btn);
    updateSlider(stats.slideIndex);
  })
})

function setActiveToggler(btn) {
  Array.from(DOM_ELEMENTS.slideTogglers.querySelectorAll("button"))
    .forEach(b => {
      b.className = "bg-white-99 h-1 w-10 lg:w-20 transition-150";
    })

    btn.className = "bg-white h-1 w-20 lg:w-40 transition-150";
}

// Infinite scroll
//
const socialMediaPosts = [
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/Un1nDdOiuQM2UcVDJO9DeOsAhw.png",
  },
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/NcSd7d619YqUizwo5PL6ocKBLbo.png",
  },
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/ADK5HmWPOgvzSZh2XUc7GJwDQMY.png",
  },
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/Un1nDdOiuQM2UcVDJO9DeOsAhw.png",
  },
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/NcSd7d619YqUizwo5PL6ocKBLbo.png",
  },
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/ADK5HmWPOgvzSZh2XUc7GJwDQMY.png",
  },
]

function renderInfiniteScroll() {
  const ul = document.createElement("ul");
  ul.className = "flex w-fit gap-5 md:gap-10 whitespace-nowrap ";


  socialMediaPosts.forEach(post => {
    const li = document.createElement("li");
    li.className = "flex items-center gap-4";
    li.innerHTML = `
      <div class="overflow-hidden h-12 md:h-16 w-[60px] md:w-20">
        <img class="h-full w-full object-center object-cover" src=${post.imgSrc} alt="instagram profile img" loading="lazy">
      </div>

      <p class="font-medium text-sm">Follow @nivest on Instagram</p>
    `;

    ul.appendChild(li);
  })

  // Duplicate for infinite loop
  const clone = ul.cloneNode(true);

  DOM_ELEMENTS.scrollBarContent.append(ul, clone)
}


renderInfiniteScroll()


// FAQ's
//
const FAQList = [
  {
    question: "What’s your return policy?",
    answer: "No stress. You’ve got 30 days to send them back — worn inside only, clean, and in original condition."
  },
  {
    question: "How long does shipping take?",
    answer: "Most orders ship in 1–2 days. Delivery hits your door within 3–7, depending on your zone."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes — global hustle, global reach. Shipping times vary based on location."
  },
  {
    question: "What if I ordered the wrong size?",
    answer: "Swap it fast, no questions. Use the return portal and grab the size that fits your stride."
  },
  {
    question: "Are your shoes true to size?",
    answer: "Yes — built to match standard fit. Wide feet? Size up half. Still unsure? Check our size guide."
  },
]

function initFAQs() {
  FAQList.forEach((Q, i) => {
    const li = document.createElement("li");
    li.className = "flex flex-col gap-3 border-b border-solid border-[#d7d7d7]";

    li.innerHTML = `
      <button class="flex items-center justify-between w-full">
        <span class="font-medium text-xs lg:text-sm">${FAQList[i].question}</span>
        <span id="drop-icon" class="h-6 w-6 grid place-items-center transition-300">
          <svg width="20" height="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </button>

      <p class="text-dark-96 lg:text-sm font-medium h-0 overflow-hidden pb-0 transition-300">${FAQList[i].answer}</p>
    `;

    DOM_ELEMENTS.faqGrid.appendChild(li);

    li.addEventListener('click', () => {
      li.querySelector("p").classList.toggle("h-0");
      li.querySelector("p").classList.toggle("overflow-hidden");
      li.querySelector("p").classList.toggle("pb-0");
      li.querySelector("p").classList.toggle("pb-4");

      li.querySelector("button #drop-icon").classList.toggle("rotate-180");
    })
  })
}

initFAQs()



document.addEventListener('DOMContentLoaded', initHeader);






