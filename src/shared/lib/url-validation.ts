const ALLOWED_IMAGE_HOSTS = [
  "via.placeholder.com",
  "placehold.co",
  "imgur.com",
  "i.imgur.com",
  "cloudinary.com",
  "res.cloudinary.com",
  "storage.googleapis.com",
];

const ALLOWED_VIDEO_HOSTS = [
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
];

export function validateMediaUrl(url: string): { valid: boolean; type: "image" | "video" | null } {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return { valid: false, type: null };

    const host = parsed.hostname;
    if (ALLOWED_VIDEO_HOSTS.some((d) => host === d || host.endsWith(`.${d}`))) {
      return { valid: true, type: "video" };
    }
    if (ALLOWED_IMAGE_HOSTS.some((d) => host === d || host.endsWith(`.${d}`))) {
      return { valid: true, type: "image" };
    }
    // Allow any https URL as image by default (backend should also validate)
    return { valid: true, type: "image" };
  } catch {
    return { valid: false, type: null };
  }
}

export function isSafeImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}
