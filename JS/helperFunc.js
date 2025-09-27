// get elements function
export function getElement(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`)
  };

  return element;
}


// Mnipulating classes
export function updateClass(element, remove, add) {
  if (!element) return;

  element.classList.remove(remove);
  element.classList.add(add);
}


// Mnipulating aria-attributes
export function updateAriaAttribute(element, aria, value) {
  if (!element) return;

  element.setAttribute(aria, value);
}

export async function loadData(url) {
  const response = await fetch(url);
  try {
    if (!response.ok) {
      console.warn("Could not fetch api");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function findPdt(id, url) {
  const data = await loadData(url);

  return data.find(p => p.id === id);
}

