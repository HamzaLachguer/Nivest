
/* ============================== */
// Product images slider
//
/* ============================== */
export function initProductImgSlider(DOM_ELEMENTS, product, state) {
  function renderPdtImg(product, index) {
    const {images, title} = product;

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

  function renderSliderConrols(index) {
    const control = document.createElement("button");
    control.className = "h-1 md:h-2 w-1 md:w-2 rounded-lg bg-dark transition-300";
    control.setAttribute("aria-label", `slide index: ${index}`);
    control.setAttribute("data-slide-index", index);

    if (control.dataset.slideIndex == state.currentSlide) {
      control.className = "h-1 md:h-2 w-5 md:w-7 rounded-lg bg-dark transition-300"
    }

    DOM_ELEMENTS.sliderControls.appendChild(control);

    control.addEventListener('click', () => slide(control))
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

  product.images.forEach(((_, index) => {
    renderPdtImg(product, index);
    renderSliderConrols(index);
  }))
}

/* ============================== */
// Product info
//
/* ============================== */
export function initProductInfo(DOM_ELEMENTS, product, cartEntry, TAG_COLORS) {
  initTag(product.tag);
  initPrice(product);
  DOM_ELEMENTS.pdtTitle.textContent = product.title;
  DOM_ELEMENTS.pdtDesc.textContent = product.description;
  initSizeChart(product);
  initPdtDescription(product);

  function initTag(tag) {
    DOM_ELEMENTS.pdtTag.textContent = tag;
    DOM_ELEMENTS.pdtTag.className = `${TAG_COLORS[tag]} py-1 px-2 uppercase font-medium text-white w-fit tracking-tight mb-2`;
  }

  function initPrice(product) {
    if (product.tag === "sale") {
      return DOM_ELEMENTS.pdtPrice.innerHTML = `
        <span class="text-red">$${product.price - Math.floor(product.price * (product.discount / 100))}</span>
        <span class="text-dark-7a line-through">$${product.price}</span>
      `;
    }

    DOM_ELEMENTS.pdtPrice.textContent = `$${product.price}`
  }

  function initSizeChart(product) {
    product.sizes.forEach((s, index) => {
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

  function initPdtDescription(product) {
    DOM_ELEMENTS.pdtFullDesc.textContent = product.description;

    DOM_ELEMENTS.toggleDescription.addEventListener('click', () => {
      DOM_ELEMENTS.toggleDescription.querySelector("#drop-icon")
        .classList.toggle("rotate-180");

      DOM_ELEMENTS.pdtFullDesc.classList.toggle("h-0");
      DOM_ELEMENTS.pdtFullDesc.classList.toggle("pb-3");
    })
  }
}


/* ============================== */
// Add product to cart
//
/* ============================== */
