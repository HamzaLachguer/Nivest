

// get elements function
function getElement(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`)
  };

  return element;
}

// Cach DOM elements
const elements = {
  header: getElement("header"),

  /* ------------------- */
  showPromoBtn: getElement("#show-promo-btn"),
  showPromoBtnLs: getElement("#show-promo-btn-ls"),
  hidePromoBtn: getElement("#hide-promo-btn"),
  promoContainer: getElement("#promo-container"),

  /*  ----------------------  */
  showSelectorBtn: getElement("#show-country-selector"),
  showSelectorBtnMobile: getElement("#show-country-selector-mobile"),
  hideSelectorBtn: getElement("#hide-selector-btn"),
  countrySelectorContainer: getElement("#country-selector-container"),

  /* ----------------------- */
  openNavigationMenuBtn: getElement("#open-nav-menu"),
  closeNavigationMenuBtn: getElement("#close-nav-menu"),
  navigationMenuContainer: getElement("#navigation-menu"),

  /* ----------------------- */
  openSearchContainer: getElement("#open-search"),
  openSearchContainerMobile: getElement("#open-search-mobile"),
  closeSearchContainer: getElement("#close-search"),
  searchContainer: getElement("#search-product-container"),
  emptySearch: getElement("#empty-search"),
}


// Mnipulating classes
function updateClass(element, remove, add) {
  if (!element) return;

  element.classList.remove(remove);
  element.classList.add(add);
}

// Mnipulating aria-attributes
function updateAriaAttribute(element, aria, value) {
  if (!element) return;

  element.setAttribute(aria, value);
}



// Hide header on scroll
function initHeaderVisibility() {
  let lastPosition = window.scrollY || window.pageYOffset;
  let isHidden = false;

  window.addEventListener('scroll', () => {
    let newPosition = window.scrollY || window.pageYOffset;

    if (lastPosition < newPosition && !isHidden) {
      hideHeader();
      isHidden = true;
    } else if (lastPosition > newPosition && isHidden) {
      showHeader();
      isHidden = false;
    }
    
    lastPosition = newPosition;
  })
}

function showHeader() {
  elements.header.classList.add("fixed", "top-0", "w-full", "animate-fade-down");
  elements.header.classList.remove("animate-fade-up2");

  //
  updateAriaAttribute(elements.header, "aria-hidden", "false")
}

function hideHeader() {
  elements.header.classList.add("animate-fade-up2");

  setTimeout(() => {
    elements.header.classList.remove("fixed", "top-0", "w-full", "animate-fade-down");
  }, 500)

  //
  updateAriaAttribute(elements.header, "aria-hidden", "true")
}


// Show promo Modal
function showPromoModal() {
  updateClass(elements.promoContainer, "hidden", "grid");
  document.body.classList.add("overflow-hidden");

  /* update aria-attributes */
  updateAriaAttribute(elements.showPromoBtn, "aria-expanded", "true");
  updateAriaAttribute(elements.hidePromoBtn, "aria-expanded", "true");
  updateAriaAttribute(elements.promoContainer, "aria-hidden", "false");
}

// hide promo Modal
function hidePromoModal() {
  updateClass(elements.promoContainer, "grid", "hidden");
  document.body.classList.remove("overflow-hidden");

  /* update aria-attributes */
  updateAriaAttribute(elements.showPromoBtn, "aria-expanded", "false");
  updateAriaAttribute(elements.hidePromoBtn, "aria-expanded", "false");
  updateAriaAttribute(elements.promoContainer, "aria-hidden", "true");
}


function initPromoModal() {
  elements.showPromoBtn.addEventListener('click', showPromoModal);
  elements.showPromoBtnLs.addEventListener('click', showPromoModal);
  
  elements.hidePromoBtn.addEventListener('click', hidePromoModal);
  elements.promoContainer.addEventListener('click', (e) => {
    if (e.target.closest("#promo-modal-form")) return;
  
    hidePromoModal();
  })
}



// Change country and currency
function showSelector() {
  updateClass(elements.countrySelectorContainer, "hidden", "grid");
  document.body.classList.add("overflow-hidden");
  
  /* update aria-attributes */
  updateAriaAttribute(elements.showSelectorBtn, "aria-expanded", "true");
  updateAriaAttribute(elements.hideSelectorBtn, "aria-expanded", "true");
  updateAriaAttribute(elements.countrySelectorContainer, "aria-hidden", "false");
}

// 
function hideSelector() {
  updateClass(elements.countrySelectorContainer, "grid", "hidden");
  if (!elements.navigationMenuContainer.classList.contains("flex")) {
    document.body.classList.remove("overflow-hidden");
  } 

  /* update aria-attributes */
  updateAriaAttribute(elements.showSelectorBtn, "aria-expanded", "false");
  updateAriaAttribute(elements.hideSelectorBtn, "aria-expanded", "false");
  updateAriaAttribute(elements.countrySelectorContainer, "aria-hidden", "true");
}


function initCountrySelector() {
  elements.showSelectorBtn.addEventListener('click', showSelector);
  elements.showSelectorBtnMobile.addEventListener('click', showSelector);
  
  elements.hideSelectorBtn.addEventListener('click', hideSelector);

  elements.countrySelectorContainer.addEventListener('click', (e) => {
    if (e.target.closest("#promo-modal-form")) return;

    hideSelector();
  })
}




// Navigation menu 
//
function openNavigationMenu() {
  updateClass(elements.navigationMenuContainer, "hidden", "flex");
  document.body.classList.add("overflow-hidden");

  //
  updateAriaAttribute(elements.openNavigationMenuBtn, "aria-expanded", "true");
  updateAriaAttribute(elements.closeNavigationMenuBtn, "aria-expanded", "true");
  updateAriaAttribute(elements.navigationMenuContainer, "aria-hidden", "false");
}

//
function closeNavigationMenu() {
  updateClass(elements.navigationMenuContainer, "flex", "hidden");
  document.body.classList.remove("overflow-hidden");

  //
  updateAriaAttribute(elements.openNavigationMenuBtn, "aria-expanded", "false");
  updateAriaAttribute(elements.closeNavigationMenuBtn, "aria-expanded", "false");
  updateAriaAttribute(elements.navigationMenuContainer, "aria-hidden", "true");
}

//
function initNavigation() {
  elements.openNavigationMenuBtn.addEventListener('click', openNavigationMenu);

  elements.navigationMenuContainer.addEventListener('click', (e) => {
    if (e.target.closest("#nav-menu-container")) return;

    closeNavigationMenu();
  });
  elements.closeNavigationMenuBtn.addEventListener('click', closeNavigationMenu);
}



// Search product
//
function openSearch() {
  updateClass(elements.searchContainer, "hidden", "flex");
  closeNavigationMenu();
  document.body.classList.add("overflow-hidden");

  //
  updateAriaAttribute(elements.openSearchContainer, "aria-expanded", "true");
  updateAriaAttribute(elements.closeSearchContainer, "aria-expanded", "true");
  updateAriaAttribute(elements.searchContainer, "aria-hidden", "false");
}

function closeSearch() {
  updateClass(elements.searchContainer, "flex", "hidden");
  document.body.classList.remove("overflow-hidden");


  //
  updateAriaAttribute(elements.openSearchContainer, "aria-expanded", "false");
  updateAriaAttribute(elements.closeSearchContainer, "aria-expanded", "false");
  updateAriaAttribute(elements.searchContainer, "aria-hidden", "true");
}

function emptySearch() {}

function initSearch() {
  elements.openSearchContainer?.addEventListener('click', openSearch);
  elements.openSearchContainerMobile?.addEventListener('click', openSearch);

  elements.searchContainer.addEventListener('click', (e) => {
    if (e.target.closest("#search-container")) return;

    closeSearch();
  });
  elements.closeSearchContainer?.addEventListener('click', closeSearch);
}



function initHeader() {
  initPromoModal();
  initHeaderVisibility();
  initCountrySelector();
  initNavigation();
  initSearch();
}
initHeader();


