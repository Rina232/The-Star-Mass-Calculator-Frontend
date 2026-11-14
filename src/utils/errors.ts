import axios from "axios";

export const isBackendUnavailable = (error: unknown): boolean =>
    axios.isAxiosError(error) && (!error.response || error.response.status >= 500);

export const isNotFound = (error: unknown): boolean =>
    axios.isAxiosError(error) && error.response?.status === 404;

export const getErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (Array.isArray(message)) {
            return message.join(", ");
        }
        if (typeof message === "string") {
            return message;
        }
    }
    return fallback;
};
