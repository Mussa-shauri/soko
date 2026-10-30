async function search(query) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=tz&q=" +
    encodeURIComponent(query);
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.length) return null;
    return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
  } catch {
    return null;
  }
}

// Tries "place, region" first, then just the place
export async function geocode(place, region) {
  if (region) {
    const found = await search(`${place}, ${region}`);
    if (found) return found;
  }
  return search(place);
}