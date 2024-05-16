export async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load JSON from ${path}: ${response.statusText}`);
  }
  return await response.json();
}

export function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from ${path}`));
    img.src = path;
  });
}
