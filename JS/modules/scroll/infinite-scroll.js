/* ============================== */
// 
//
/* ============================== */
import { socialMediaPosts } from "../utils/constants.js";


/* ============================== */
// 
//
/* ============================== */
export function renderInfiniteScroll() {
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

  document.querySelector("#scroll-content").append(ul, clone);
}