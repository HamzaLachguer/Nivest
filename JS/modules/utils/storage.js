export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key))
    return data || null;
  } catch (err) {
    console.warn(`Invalid data in storage for key: ${key}`)
    return null;
  }
}