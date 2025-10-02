/* ============================== */
// 
//
/* ============================== */
import { testimonials, state } from "../utils/constants.js";


/* ============================== */
// 
//
/* ============================== */
export function initTestimonials() {
  testimonials.forEach((_, index) => {
    const btn = document.createElement("button");
    btn.setAttribute("data-slide-index", index);
    btn.className = "bg-white-99 h-1 w-10 lg:w-20 transition-150";

    if (index === state.slideIndex) {
      btn.className = "bg-white h-1 w-20 lg:w-40 transition-150";
    }
    document.querySelector("#slide-toggle").append(btn);

    btn.addEventListener('click', () => {
      const slideIndex = btn.dataset.slideIndex;
      state.slideIndex = slideIndex;
      
      setActiveToggler(btn);
      updateSlider(state.slideIndex);
    })
  })
}

export function updateSlider(index) {
  const testimonial = testimonials[index];
  const {review, name, country, imgSrc} = testimonial;

  return document.querySelector("#slide-content").innerHTML = `
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

function setActiveToggler(btn) {
  Array.from(document.querySelector("#slide-toggle")
    .querySelectorAll("button"))
      .forEach(b => {
        b.className = "bg-white-99 h-1 w-10 lg:w-20 transition-150";
      })

    btn.className = "bg-white h-1 w-20 lg:w-40 transition-150";
}