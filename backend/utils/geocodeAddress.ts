import NodeGeocoder from "node-geocoder";
import { ILocation } from "../models/room";

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
  httpAdapter: "https",
  fetch: globalThis.fetch.bind(globalThis),
});

/** Expand common informal Nepal address shorthand before geocoding. */
function buildAddressVariants(address: string): string[] {
  const trimmed = address.trim();
  if (!trimmed) return [];

  const expanded = trimmed
    .replace(/\bktm\b/gi, "Kathmandu")
    .replace(/\bdurbarmarg\b/gi, "Durbar Marg")
    .replace(/\bdurbar\s*marg\b/gi, "Durbar Marg")
    .replace(/\bpokhara\b/gi, "Pokhara");

  const variants = new Set<string>([trimmed, expanded]);

  if (!/nepal/i.test(expanded)) {
    variants.add(`${expanded}, Kathmandu, Nepal`);
    variants.add(`${expanded}, Nepal`);
  }

  return [...variants];
}

type GeocodeResult = Awaited<ReturnType<typeof geocoder.geocode>>[number];

export function locationFromGeocodeResult(loc: GeocodeResult): ILocation {
  return {
    type: "Point",
    coordinates: [loc.longitude!, loc.latitude!],
    formattedAddress: loc.formattedAddress,
    city: loc.city,
    state: loc.state,
    zipCode: loc.zipcode,
    country: loc.country,
  };
}

/** Try multiple address variants until OpenStreetMap returns a match. */
export async function geocodeAddress(
  address?: string
): Promise<GeocodeResult | null> {
  if (!address?.trim()) return null;

  for (const variant of buildAddressVariants(address)) {
    try {
      const results = await geocoder.geocode(variant);
      if (results.length > 0 && results[0].latitude && results[0].longitude) {
        return results[0];
      }
    } catch (err) {
      console.error(`Geocoding failed for "${variant}":`, err);
    }
  }

  return null;
}

export default geocoder;
