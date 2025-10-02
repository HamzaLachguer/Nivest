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