export function getElement(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`)
  };

  return element;
}

export function updateClass(element, remove, add) {
  if (!element) return;

  element.classList.remove(remove);
  element.classList.add(add);
}


export function updateAriaAttribute(element, aria, value) {
  if (!element) return;

  element.setAttribute(aria, value);
}