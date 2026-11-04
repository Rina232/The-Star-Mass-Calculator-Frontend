import { DEFAULT_IMAGE_URL, DEFAULT_VIDEO_URL } from "../constants";

export const resolveImageUrl = (url: string | null | undefined): string =>
    url && url.trim() ? url : DEFAULT_IMAGE_URL;

export const resolveVideoUrl = (url: string | null | undefined): string =>
    url && url.trim() ? url : DEFAULT_VIDEO_URL;
