/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterUserDto {
  /**
   * @minLength 3
   * @maxLength 50
   * @example "newstudent"
   */
  username: string;
  /**
   * @minLength 4
   * @maxLength 50
   * @example "test1234"
   */
  password: string;
}

export interface UserResponseDto {
  /** @example 1 */
  id: number;
  /** @example "student" */
  username: string;
}

export interface LoginUserDto {
  /** @example "student" */
  username: string;
  /** @example "111" */
  password: string;
}

export interface StarClassResponseDto {
  /** @example 1 */
  id: number;
  /** @example "Тестовый класс" */
  title: string;
  /** @example "Тестовое описание" */
  description: string | null;
  status: "draft" | "published" | "deleted";
  /** @example "http://localhost:9000/media/spektralnyy-klass-o-1758499274000-842391.jpg" */
  imageUrl: string;
  /** @example "http://localhost:9000/media/spektralnyy-klass-o-1758499275000-117452.mp4" */
  videoUrl: string;
  mass: number | null;
  luminosity: number | null;
  /** @example 3 */
  likeCount: number;
  isMine?: 0 | 1;
  isLiked?: 0 | 1;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  publishedAt: string | null;
}

export interface PublishStarClassDto {
  /**
   * @maxLength 500
   * @example "Тестовое описание"
   */
  description: string;
  /** @example 1.3 */
  mass: number;
  /** @example 6 */
  luminosity: number;
}

export interface LikeStarClassDto {
  /** @example 1 */
  like: 0 | 1;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export type ContentType =
  | "application/json"
  | "application/vnd.api+json"
  | "multipart/form-data"
  | "application/x-www-form-urlencoded"
  | "text/plain";

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === "multipart/form-data" &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === "text/plain" &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Star Classes API
 * @version 1.0
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  users = {
    /**
     * No description
     *
     * @tags Пользователь
     * @name Register
     * @summary Регистрация нового пользователя
     * @request POST:/api/users/register
     */
    register: (data: RegisterUserDto, params: RequestParams = {}) =>
      this.request<UserResponseDto, void>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: "application/json",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Пользователь
     * @name Login
     * @summary Аутентификация
     * @request POST:/api/users/login
     */
    login: (data: LoginUserDto, params: RequestParams = {}) =>
      this.request<UserResponseDto, void>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: "application/json",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Пользователь
     * @name Logout
     * @summary Деавторизация
     * @request POST:/api/users/logout
     * @secure
     */
    logout: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  starClasses = {
    /**
     * No description
     *
     * @tags Услуга
     * @name GetPublishedStarClasses
     * @summary Список опубликованных услуг с фильтром по массе
     * @request GET:/api/star-classes
     */
    getPublishedStarClasses: (
      query?: {
        /** @example 1 */
        minMass?: number;
        /** @example 25 */
        maxMass?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<StarClassResponseDto[], any>({
        path: `/api/star-classes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Услуга
     * @name CreateDraftStarClass
     * @summary Создание черновика с фото и видео
     * @request POST:/api/star-classes
     * @secure
     */
    createDraftStarClass: (
      data: {
        /** @example "Тестовый класс" */
        title: string;
        /** @format binary */
        image?: File;
        /** @format binary */
        video?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<StarClassResponseDto, void>({
        path: `/api/star-classes`,
        method: "POST",
        body: data,
        secure: true,
        type: "multipart/form-data",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Услуга
     * @name GetFeedStarClass
     * @summary Лента
     * @request GET:/api/star-classes/feed
     */
    getFeedStarClass: (
      query?: {
        /** @example 1 */
        id?: number;
        /** @example true */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<StarClassResponseDto, void>({
        path: `/api/star-classes/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Услуга
     * @name GetDraftStarClass
     * @summary Получить свой черновик
     * @request GET:/api/star-classes/draft
     * @secure
     */
    getDraftStarClass: (params: RequestParams = {}) =>
      this.request<StarClassResponseDto, void>({
        path: `/api/star-classes/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Услуга
     * @name PublishDraftStarClass
     * @summary Опубликовать свой черновик
     * @request PUT:/api/star-classes/draft/publish
     * @secure
     */
    publishDraftStarClass: (
      data: PublishStarClassDto,
      params: RequestParams = {},
    ) =>
      this.request<StarClassResponseDto, void>({
        path: `/api/star-classes/draft/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: "application/json",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Услуга
     * @name DeleteStarClass
     * @summary Soft-delete своей услуги
     * @request DELETE:/api/star-classes/{id}
     * @secure
     */
    deleteStarClass: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/star-classes/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Услуга
     * @name SetStarClassLike
     * @summary Поставить или убрать лайк
     * @request POST:/api/star-classes/{id}/like
     * @secure
     */
    setStarClassLike: (
      id: number,
      data: LikeStarClassDto,
      params: RequestParams = {},
    ) =>
      this.request<StarClassResponseDto, void>({
        path: `/api/star-classes/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: "application/json",
        format: "json",
        ...params,
      }),
  };
}
