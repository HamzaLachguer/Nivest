export function initPromoCopy(btn, code) {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  })
}