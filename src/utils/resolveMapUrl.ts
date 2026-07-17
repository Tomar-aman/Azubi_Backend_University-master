import logger from "./logger";

/**
 * Expands a shortened Google Maps share link (e.g. https://maps.app.goo.gl/xxx
 * or https://goo.gl/maps/xxx) into its full URL. Short links are redirects and
 * carry no coordinates, so they can't be embedded in a map; the expanded URL
 * contains "@lat,lng"/"!3d!4d" which the frontend can turn into an embed.
 *
 * Non-short URLs (and any failures) are returned unchanged, so this is always
 * safe to call before saving a mapUrl.
 */
export async function resolveMapUrl(
  url?: string | null,
): Promise<string> {
  if (!url || typeof url !== "string") return url || "";
  const trimmed = url.trim();
  const isShort = /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(trimmed);
  if (!isShort) return trimmed;
  try {
    // Follow the redirect chain; res.url is the final, expanded Maps URL.
    const res = await fetch(trimmed, { redirect: "follow", method: "GET" });
    return res?.url || trimmed;
  } catch (error) {
    logger.error("resolveMapUrl failed", error);
    return trimmed;
  }
}
