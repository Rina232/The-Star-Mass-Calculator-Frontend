import { DEFAULT_IMAGE_URL, DEFAULT_VIDEO_URL } from "../constants";

const toProxiedMediaUrl = (url: string): string => {
    try {
        const parsed = new URL(url, window.location.origin);
        if (parsed.pathname.startsWith("/media/")) {
            return parsed.pathname;
        }
    } catch {
        return url;
    }
    return url;
};

export const resolveImageUrl = (url: string | null | undefined): string =>
    url && url.trim() ? toProxiedMediaUrl(url) : DEFAULT_IMAGE_URL;

export const resolveVideoUrl = (url: string | null | undefined): string =>
    url && url.trim() ? toProxiedMediaUrl(url) : DEFAULT_VIDEO_URL;
