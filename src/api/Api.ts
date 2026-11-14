import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from "axios";

export interface StarClassResponseDto {
    id: number;
    title: string;
    description: string | null;
    status: "draft" | "published" | "deleted";
    imageUrl: string;
    videoUrl: string;
    mass: number | null;
    luminosity: number | null;
    likeCount: number;
    isMine?: 0 | 1;
    isLiked?: 0 | 1;
    createdAt: string;
    publishedAt: string | null;
}

export interface PublishStarClassDto {
    description: string;
    mass: number;
    luminosity: number;
}

export interface LikeStarClassDto {
    like: 0 | 1;
}

export interface RegisterUserDto {
    username: string;
    password: string;
}

export interface LoginUserDto {
    username: string;
    password: string;
}

export interface UserResponseDto {
    id: number;
    username: string;
}

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    path: string;
    type?: ContentType;
    query?: QueryParamsType;
    format?: ResponseType;
    body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {}

export const ContentType = {
    Json: "application/json",
    FormData: "multipart/form-data",
    UrlEncoded: "application/x-www-form-urlencoded",
    Text: "text/plain",
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export class HttpClient {
    public instance: AxiosInstance;

    constructor(axiosConfig: ApiConfig = {}) {
        this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    }

    private createFormData(input: Record<string, unknown>): FormData {
        const formData = new FormData();
        Object.keys(input).forEach((key) => {
            const value = input[key];
            if (value === undefined || value === null) {
                return;
            }
            formData.append(key, value instanceof Blob ? value : String(value));
        });
        return formData;
    }

    public request = async <T = any>({
        type,
        query,
        format,
        body,
        path,
        ...params
    }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const headers: Record<string, string> = {};
        if (type && type !== ContentType.FormData) {
            headers["Content-Type"] = type;
        }
        const data =
            type === ContentType.FormData && body && typeof body === "object"
                ? this.createFormData(body as Record<string, unknown>)
                : body;

        return this.instance.request<T>({
            ...params,
            headers: { ...(params.headers as Record<string, string> | undefined), ...headers },
            params: query,
            responseType: format,
            data,
            url: path,
        });
    };
}

export class Api extends HttpClient {
    starClasses = {
        getPublishedStarClasses: (query?: { minMass?: number; maxMass?: number }, params: RequestParams = {}) =>
            this.request<StarClassResponseDto[]>({
                path: "/api/star-classes",
                method: "GET",
                query,
                format: "json",
                ...params,
            }),

        getFeedStarClass: (query?: { id?: number; next?: boolean }, params: RequestParams = {}) =>
            this.request<StarClassResponseDto>({
                path: "/api/star-classes/feed",
                method: "GET",
                query,
                format: "json",
                ...params,
            }),

        createDraftStarClass: (
            data: { title: string; image?: File; video?: File },
            params: RequestParams = {},
        ) =>
            this.request<StarClassResponseDto>({
                path: "/api/star-classes",
                method: "POST",
                body: data,
                type: ContentType.FormData,
                format: "json",
                ...params,
            }),

        getDraftStarClass: (params: RequestParams = {}) =>
            this.request<StarClassResponseDto>({
                path: "/api/star-classes/draft",
                method: "GET",
                format: "json",
                ...params,
            }),

        publishDraftStarClass: (data: PublishStarClassDto, params: RequestParams = {}) =>
            this.request<StarClassResponseDto>({
                path: "/api/star-classes/draft/publish",
                method: "PUT",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        deleteStarClass: (id: number, params: RequestParams = {}) =>
            this.request<void>({
                path: `/api/star-classes/${id}`,
                method: "DELETE",
                ...params,
            }),

        setStarClassLike: (id: number, data: LikeStarClassDto, params: RequestParams = {}) =>
            this.request<StarClassResponseDto>({
                path: `/api/star-classes/${id}/like`,
                method: "POST",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),
    };

    users = {
        register: (data: RegisterUserDto, params: RequestParams = {}) =>
            this.request<UserResponseDto>({
                path: "/api/users/register",
                method: "POST",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        login: (data: LoginUserDto, params: RequestParams = {}) =>
            this.request<UserResponseDto>({
                path: "/api/users/login",
                method: "POST",
                body: data,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        logout: (params: RequestParams = {}) =>
            this.request<void>({
                path: "/api/users/logout",
                method: "POST",
                ...params,
            }),
    };
}
