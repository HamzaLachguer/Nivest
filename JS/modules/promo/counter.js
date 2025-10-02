import { state } from "../utils/constants.js";

export function counter() {
  const currentDate = new Date().getTime();
  const interval = state.targetDate - currentDate;

  const days = Math.floor(interval / (1000 * 60 * 60 * 24));
  const hours = Math.floor(interval / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(interval / (1000 * 60)) % 60;
  const seconds = Math.floor(interval / 1000) % 60;

  document.querySelector("#days").innerHTML = String(days).padStart(2, "0");
  document.querySelector("#hours").innerHTML = String(hours).padStart(2, "0");
  document.querySelector("#minutes").innerHTML = String(minutes).padStart(2, "0");
  document.querySelector("#seconds").innerHTML = String(seconds).padStart(2, "0");

  if (interval < 0) {
    clearInterval(state.interval)
    ["#days", "#hours", "#minutes", "#seconds"].forEach(sel => {
      document.querySelector(sel).innerHTML = "00"
    });
  }
}