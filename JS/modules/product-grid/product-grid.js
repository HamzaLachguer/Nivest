/* ============================== */
// 
//
/* ============================== */
import { loadData } from "../utils/helpers.js";
import { renderProductCard } from "../product-grid/product-card.js";
import { URL } from "../utils/constants.js";


/* ============================== */
// 
//
/* ============================== */
export async function generateProductGrid() {
  const grid = await loadData(URL);

  const popular = grid.filter(p => p.tag === "popular");
  const newArrivals = grid.filter(p => p.tag === "new");

  renderProductGrid(popular, "#popular-product-grid", 3);
  renderProductGrid(newArrivals, "#new-product-grid", 3);
}


function renderProductGrid(grid, selector, length) {
  const container = document.querySelector(selector);
  grid.slice(0, length).forEach((product) => {
    container.appendChild(renderProductCard(product));
  })
}