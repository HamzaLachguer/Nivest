/* ============================== */
// 
//
/* ============================== */
import { FAQList } from "../utils/constants.js";


/* ============================== */
// 
//
/* ============================== */
export function initFAQs() {
  FAQList.forEach((_, i) => {
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

    document.querySelector("#faq-grid-container").appendChild(li);

    li.addEventListener('click', () => {
      li.querySelector("p").classList.toggle("h-0");
      li.querySelector("p").classList.toggle("overflow-hidden");
      li.querySelector("p").classList.toggle("pb-0");
      li.querySelector("p").classList.toggle("pb-4");

      li.querySelector("button #drop-icon").classList.toggle("rotate-180");
    });
  })
}