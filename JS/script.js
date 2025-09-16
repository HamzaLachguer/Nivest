// Impoting ...
//
import { initHeader } from "./header.js";





// Fetch the product grid
async function fetchJSON() {
  try {
    const response = await fetch("./productsData.json");
    if (!response.ok) {
      throw new Error("Could not fetch the api");
    }

    const data = response.json();
  } catch (error) {
    console.error(error)
  }
}


fetchJSON()

























document.addEventListener('DOMContentLoaded', initHeader);