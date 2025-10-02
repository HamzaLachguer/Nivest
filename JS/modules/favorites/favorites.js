
/* ============================== */
// Imports
//
/* ============================== */
import { updateClass, updateAriaAttribute } from "../utils/dom.js";
import { saveToStorage, loadFromStorage } from "../utils/storage.js";
import { state } from "../utils/constants.js";



let savedFavorites = loadFromStorage("favorites") || [];
state.favoritesList = new Set(savedFavorites);


function saveFavorites() {
  saveToStorage("favorites", [...state.favoritesList])
}


function addFavorite(pdtId, btn) {
  btn.querySelector("svg").classList.add("fill-red");
  state.favoritesList.add(pdtId);
  saveFavorites();
  showPopup();
}


function removeFavorite(pdtId, btn) {
  btn.querySelector("svg").classList.remove("fill-red");
  state.favoritesList.delete(pdtId);
  saveFavorites();
}


function showPopup() {
  const popup = document.querySelector("#favorite-poppup")

  updateClass(popup, "hidden", "flex");
  updateAriaAttribute(popup, "aria-hidden", "false");
}


export function hidePopup() {
  const popup = document.querySelector("#favorite-poppup")

  popup.addEventListener('click', (e) => {
    if (e.target.closest("#favorite-container")) return;
    
    updateClass(popup, "flex", "hidden");
    updateAriaAttribute(popup, "aria-hidden", "true");
  })
}


export function toggleFavorites(pdtId, btn) {
  if (state.favoritesList.has(pdtId)) { 
    removeFavorite(pdtId, btn);
  }

  else addFavorite(pdtId, btn)
}