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



// const productList = [ 
//   {
//     "id": "pdt-001",
//     "imgs": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9b4586a5-62a6-4f9e-806b-3350ed82451a/NIKE+WAFFLE+DEBUT.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/068b1e97-2981-4254-bdf5-6cb759c6e319/NIKE+WAFFLE+DEBUT.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d1b07793-6d84-4ed3-a9ca-70f719da0552/NIKE+WAFFLE+DEBUT.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c2681f83-1fef-4a9f-968b-0cb1b797008d/NIKE+WAFFLE+DEBUT.png",
//     ],
//     "title": "Nike Waffle Debut",
//     "price": 56.97,
//     "desc": "Retro gets modernized in the Nike Waffle Debut. Remember that smooth suede and nylon trend? It's back, along with the modernized 'wedge' midsole that feels incredibly plush.",
//     "keywords": ['retro', 'shoe', 'nike', 'nike waffle debut', 'waffle'],
//     "tag": "popular",
//     "category": "men",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 30
//   },   {
//     "id": "pdt-002",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4e46751d-5e0f-4fc1-96c5-f373895536bb/NIKE+AIR+WINFLO+11.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/02c257ec-65ad-41b9-8665-00a6e073ee8f/NIKE+AIR+WINFLO+11.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/37d619b1-11be-42d3-a254-63c8f3f10546/NIKE+AIR+WINFLO+11.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d12f3a8a-1061-44fc-b8a2-1a90bda5afbc/NIKE+AIR+WINFLO+11.png",
//     ],
//     "title": "Nike Winflo 11",
//     "price": 63.97,
//     "description": "Responsive cushioning provides a balanced ride for everyday runs. Experience energy return with a combination of Cushlon 3.0 foam and a full-length Nike Air unit in the midsole.",
//     "keywords": ['Nike Winflo 11', 'shoe', 'men', 'runnig'],
//     "tag": 39,
//     "category": "men",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 30
//   },   {
//     "id": "pdt-003",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3cfa0374-d35c-4083-a466-35c5ce5e8eaa/AIR+ZOOM+PEGASUS+41.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d53a8f06-85e1-4f2a-a79a-edd5887adc56/AIR+ZOOM+PEGASUS+41.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f86c4ed9-afe1-40d7-9659-a00707798c83/AIR+ZOOM+PEGASUS+41.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0d3f27c4-8055-4394-905b-b25f89bad5c1/AIR+ZOOM+PEGASUS+41.png",
//     ],
//     "title": "Nike Pegasus 41",
//     "price": 145,
//     "description": "Responsive cushioning in the Pegasus provides an energized ride for everyday road running. Experience lighter-weight energy return with dual Air Zoom units and a ReactX foam midsole.",
//     "keywords": [],
//     "tag": "new",
//     "category": "men",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 30
//   },   {
//     "id": "pdt-004",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5a3b01f3-40b1-4eeb-bff1-b6d4a0d21dfc/NIKE+COSMIC+RUNNER+%28GS%29.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ac472191-caf5-4aa8-95cb-ebf089ee2a0b/NIKE+COSMIC+RUNNER+%28GS%29.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f98da7b3-a956-4e33-b280-fd479281de92/NIKE+COSMIC+RUNNER+%28GS%29.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0b99516a-0794-4187-97cb-2e6527c76269/NIKE+COSMIC+RUNNER+%28GS%29.png",
//     ],
//     "title": "Nike Cosmic Runner",
//     "price": 33.97,
//     "description": "The world is your racetrack and slowing down isn't in your vocabulary. Loaded with stable cushioning and durability, the Nike Cosmic Runner helps support your every stride, so you can leave the competition in the dust.",
//     "keywords": ['Nike Cosmic Runner', 'cosmic', 'nike', 'runner'],
//     "tag": 38,
//     "category": "men",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 30
//   },   {
//     "id": "pdt-005",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/6128aa0e-1ba8-4be6-b773-8d42a6a3295a/W+NIKE+CORTEZ.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/05c90f01-471c-452b-b412-88235e627853/W+NIKE+CORTEZ.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/db44366f-d75c-4c5a-afb5-2f9be50def27/W+NIKE+CORTEZ.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/eda5850d-a50f-41b3-a18d-0346f1f14a97/W+NIKE+CORTEZ.png",
//     ],
//     "title": "Nike Cortez",
//     "price": 100,
//     "description": "You spoke. We listened. Based on your feedback, we've revamped the original Cortez while maintaining the retro appeal you know and love.",
//     "keywords": ['Nike Cortez', 'cortez', 'nike', 'retro'],
//     "tag": "popular",
//     "category": "women",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 30
//   },   {
//     "id": "pdt-006",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/eeacb75f-4f1f-4c1a-abef-b5025adc6f50/W+NIKE+PACIFIC.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ad6ae58a-0dfc-413d-8a1e-221c85d38a49/W+NIKE+PACIFIC.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9e928238-94fa-47b4-9b17-d726054b7648/W+NIKE+PACIFIC.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/49db6710-9914-4871-98b2-e03ab5982936/W+NIKE+PACIFIC.png",
//     ],
//     "title": "Nike Pacific",
//     "price": 75.25,
//     "description": "The Nike Pacific takes inspiration from old-school styles to give you a new kind of low-profile look.",
//     "keywords": ['Nike Pacific', 'pacific', 'shoe', 'sport', 'run'],
//     "tag": "new",
//     "category": "women",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 30
//   },   {
//     "id": "pdt-007",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/423dada2-c79a-4b55-862c-1035928bba20/WMNS+NIKE+AIR+MAX+SC.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/33b54a20-e01a-4d1d-83c2-2bd150bf6f82/WMNS+NIKE+AIR+MAX+SC.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2dc9e4d2-9169-4b32-abb9-567245a3c85d/WMNS+NIKE+AIR+MAX+SC.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9652bd56-50bf-41da-a1a0-06772bcdc36c/WMNS+NIKE+AIR+MAX+SC.png",
//     ],
//     "title": "Nike Air Max SC",
//     "price": 93.45,
//     "description": "With easygoing lines and heritage track style, the Air Max SC is the perfect finish to any outfit.",
//     "keywords": [],
//     "tag": 20,
//     "category": "women",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 30
//   },   {
//     "id": "pdt-008",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/6c1291d6-032b-4b2e-9335-02ce8e442103/AIR+MAX+VERSE+MICHIGAN+STATE.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8363db44-4ceb-4392-8f47-b7b28d5bb960/AIR+MAX+VERSE+MICHIGAN+STATE.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/981e290a-c249-4180-a282-ee9dfd99ab30/AIR+MAX+VERSE+MICHIGAN+STATE.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/25735281-b329-4e5b-a6c2-3f82c2bb5ba9/AIR+MAX+VERSE+MICHIGAN+STATE.png",
//     ],
//     "title": "Nike College Air Max Verse (Michigan State)",
//     "price": 125,
//     "description": "Max Air, max versatility. The Air Max Verse brings depth and texture to your look thanks to clean lines, mixed materials and rubberized details.",
//     "keywords": [],
//     "tag": "new",
//     "category": "men",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 19
//   },   {
//     "id": "pdt-009",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b3bddda6-c1f4-4a29-8d19-eae50f8e4747/NIKE+ZOOM+VOMERO+ROAM.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/658ece5a-48da-4cd2-8a57-0c0b422c160d/NIKE+ZOOM+VOMERO+ROAM.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d3f39291-80b3-4f61-9d72-d990d1935e70/NIKE+ZOOM+VOMERO+ROAM.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f5835b4d-a183-4541-879c-7d96361ff4b6/NIKE+ZOOM+VOMERO+ROAM.png",
//     ],
//     "title": "Nike Zoom Vomero Roam",
//     "price": 150,
//     "description": "Designed for city conditions, this winterized version of the Vomero is made for wet weather. Durable materials and a rubber mudguard work together to help safeguard your shoes from dirt and puddles.",
//     "keywords": ['zoom', 'vomero', 'roam', 'shoe', 'nike', 'run'],
//     "tag": "new",
//     "category": "men",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 19
//   },   {
//     "id": "pdt-0010",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0e5256c9-7863-433f-b367-6eaca723a8b1/W+NIKE+ZOOM+VOMERO+5.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/cc0493a2-b8ba-4e2c-a9bf-80be236c7fc7/W+NIKE+ZOOM+VOMERO+5.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/593cca2b-31c4-41de-96d8-f34dcd47d01f/W+NIKE+ZOOM+VOMERO+5.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e948a49b-68be-4114-8d49-62b2d29c0ec5/W+NIKE+ZOOM+VOMERO+5.png",
//     ],
//     "title": "Nike Zoom Vomero 5",
//     "price": 140,
//     "description": "Carve a new lane for yourself in the Vomero 5—your go-to for durability, depth and easy styling. The sleek design includes leather, textiles and plastic accents that nod to the Y2K aesthetic.",
//     "keywords": ['nike', 'zoom', 'vomero', 'shoe'],
//     "tag": "new",
//     "category": "women",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 19
//   },   {
//     "id": "pdt-0011",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/nah7irsjisfbs3uy5fez/AIR+MAX+UPTEMPO+%2795.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/i61of6zbsqzxvus6unrv/AIR+MAX+UPTEMPO+%2795.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/hrjjwlq5qg5nixtvzmgg/AIR+MAX+UPTEMPO+%2795.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/owsynpbybbbj2v0dr5rp/AIR+MAX+UPTEMPO+%2795.png",
//     ],
//     "title": "Nike Air Max Uptempo '95",
//     "price": 200,
//     "description": "The Nike Air Max Uptempo '95 leaves 1 court to hold court on another, stepping out with a retro basketball style that's upgraded for today with a clean look and hiking-boot-inspired details.",
//     "keywords": ['air', 'nike', 'max', 'air max', 'uptempo'],
//     "tag": "new",
//     "category": "men",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 19
//   },   {
//     "id": "pdt-0012",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9c310a64-1837-44a1-b111-132a7dfe1353/NIKE+VOMERO+18.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2a9c0032-1e63-4f01-a0a6-912ec88da418/NIKE+VOMERO+18.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1f90a961-165c-441e-b17c-e79bb8a52885/NIKE+VOMERO+18.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/dabfb934-b0be-4457-93bc-73ed2d44ae3d/NIKE+VOMERO+18.png"
//     ],
//     "title": "Nike Vomero 18",
//     "price": 300,
//     "description": "Maximum cushioning in the Vomero provides a comfortable ride for everyday runs. Our softest, most cushioned ride has lightweight ZoomX foam stacked on top of responsive ReactX foam in the midsole.",
//     "keywords": ['zoom', 'vomero', 'nike', 'run'],
//     "tag": "new",
//     "category": "men",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 14
//   },   {
//     "id": "pdt-0013",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f2997253-85d2-4971-8bd5-327e4454465f/M+ZOOM+GP+CHALLENGE+1+HC.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d7c96e1b-667c-43c8-afdb-bf3d92af9551/M+ZOOM+GP+CHALLENGE+1+HC.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a444c4d5-0e36-40fd-8aa7-40e1c273fb7b/M+ZOOM+GP+CHALLENGE+1+HC.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b317bfb1-f45f-4c8c-be5f-db550e171074/M+ZOOM+GP+CHALLENGE+1+HC.png",
//     ],
//     "title": "Nike Zoom GP Challenge 1",
//     "price": 120,
//     "description": "Made for the best and those who aspire to be, the GP Challenge 1 helps you serve and swing with confidence.",
//     "keywords": ['nike', 'zoom', 'gp', 'nike zoom gp challenge 1'],
//     "tag": "popular",
//     "category": "men",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 19
//   },   {
//     "id": "pdt-0014",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f7f1b77c-ce9b-454f-82aa-06ee24d806ad/NIKE+ZOOMX+ZEGAMA+TRAIL+2.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d8785abf-2e36-4a25-835a-af229f87a5ee/NIKE+ZOOMX+ZEGAMA+TRAIL+2.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4f7f6a59-6212-4d80-b070-552528d98f38/NIKE+ZOOMX+ZEGAMA+TRAIL+2.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ab694250-744e-4153-9bcd-e3eec00aa152/NIKE+ZOOMX+ZEGAMA+TRAIL+2.png",
//     ],
//     "title": "Nike Zegama 2",
//     "price": 140,
//     "description": "Equipped with an ultra-responsive ZoomX foam midsole, the Zegama 2 is designed to conquer steep ridges, jagged rocks and races from trailhead to tip. Optimal cushioning complements a rugged outsole made for your trail running journey.",
//     "keywords": ['nike', 'zegama', 'run', 'nike zegama'],
//     "tag": 10,
//     "category": "men",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 19
//   },   {
//     "id": "pdt-0015",
//     "images": [
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/419e92ee-fa59-4793-aacc-f404bd118524/WMNS+JORDAN+HEIR+SERIES.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5fca3e4d-e806-4dc8-9545-4fff0be3ecd3/WMNS+JORDAN+HEIR+SERIES.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/61c97dae-d9b7-45ea-a6c2-3fe572d92565/WMNS+JORDAN+HEIR+SERIES.png",
//       "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/8f14f9db-588c-4955-9535-344a5b17f968/WMNS+JORDAN+HEIR+SERIES.png",
//     ],
//     "title": "Jordan Heir Series 'Treat Yourself'",
//     "price": "120",
//     "description": "You're not here to make friends—you're here to dominate the competition. But there's no reason you can't do it in style.",
//     "keywords": [],
//     "tag": "popular",
//     "category": "women",
//     "sizes": ["6", "7", "8", "9", "10"],
//     "inStock": true,
//     "inventoryCount": 19
//   },
// ]


