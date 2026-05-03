export default function imageLoader({ src, width, quality }) {
  // If the image is already a full URL and from Unsplash, we can append parameters
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', (quality || 75).toString());
    url.searchParams.set('auto', 'format'); // Automatically serves WebP/AVIF if supported
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }

  // Fallback for other images or internal assets
  return src;
}
