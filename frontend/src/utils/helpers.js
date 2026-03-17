/**
 * Globally accessible helper to format product and category image URLs.
 */

export const getImageUrl = (item) => {
  if (!item) return 'https://via.placeholder.com/600';

  // NEW LOGIC: If 'item' is already a string (a path), use it directly.
  // Otherwise, look for properties inside the object.
  let path = typeof item === 'string' 
    ? item 
    : (item.image_url || (item.images && item.images.length > 0 ? item.images[0].image_path : null));
  
  if (!path && item.image) path = item.image; // Category fallback

  if (!path) return 'https://via.placeholder.com/600';
  if (path.startsWith('http')) return path;

  const cleanPath = path.replace(/\\/g, '');
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const finalPath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
  
  return `${baseUrl}/${finalPath}`;
};