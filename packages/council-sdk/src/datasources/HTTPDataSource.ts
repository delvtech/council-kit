import { CouncilContext } from "..";
import { CachedDataSource } from "./CachedDataSource";

/**
 * A DataSource with methods for caching requests to an HTTP API.
 */
export class HTTPDataSource<T = any> extends CachedDataSource {
  /**
   * The base URL prefixed to all method paths.
   */
  baseURL: string;

  /**
   * The default options that are used for all request methods.
   */
  defaultRequestOptions: RequestInit;

  /**
   * The default options that are used for the {@linkcode get} method.
   * This will be merged with and overwrite the `defaultRequestOptions`.
   *
   */
  defaultGetOptions: RequestInit;

  /**
   * The default options that are used for the {@linkcode post} method.
   * This will be merged with and overwrite the `defaultRequestOptions`.
   */
  defaultPostOptions: RequestInit;

  /**
   * The default options that are used for the {@linkcode put} method.
   * This will be merged with and overwrite the `defaultRequestOptions`.
   */
  defaultPutOptions: RequestInit;

  /**
   * The default options that are used for the {@linkcode delete} method.
   * This will be merged with and overwrite the `defaultRequestOptions`.
   */
  defaultDeleteOptions: RequestInit;

  /**
   * A function that processes the API's responses and returns the desired data.
   * The default implementation uses `response.json()` to parse the response as
   * JSON.
   * @param res the response from the API.
   * @returns a promise that resolves to the processed response data.
   */
  onResponse: (res: Response) => Promise<T> = (res: Response) => res.json();

  constructor(
    baseURL: string,
    context: CouncilContext,
    options?: {
      /**
       * The default options that are used for all request methods.
       */
      defaultRequestOptions?: RequestInit;

      /**
       * The default options that are used for the {@linkcode get} method.
       * This will be merged with and overwrite {@linkcode defaultRequestOptions}.
       */
      defaultGetOptions?: RequestInit;

      /**
       * The default options that are used for the {@linkcode post} method.
       * This will be merged with and overwrite {@linkcode defaultRequestOptions}.
       */
      defaultPostOptions?: RequestInit;

      /**
       * The default options that are used for the {@linkcode put} method.
       * This will be merged with and overwrite {@linkcode defaultRequestOptions}.
       */
      defaultPutOptions?: RequestInit;

      /**
       * The default options that are used for the {@linkcode delete} method.
       * This will be merged with and overwrite
       * {@linkcode defaultRequestOptions}.
       */
      defaultDeleteOptions?: RequestInit;

      /**
       * A function that processes the API's responses and returns the desired
       * data. The default implementation uses `response.json()` to parse the
       * response as JSON.
       * @param res the response from the API.
       * @returns a promise that resolves to the processed response data.
       */
      onResponse?: (res: Response) => Promise<T>;
    },
  ) {
    super(context);
    this.baseURL = baseURL;

    const {
      defaultRequestOptions = {},
      defaultGetOptions = {},
      defaultPostOptions = {},
      defaultPutOptions = {},
      defaultDeleteOptions = {},
      onResponse,
    } = options || {};

    this.defaultRequestOptions = defaultRequestOptions;
    this.defaultGetOptions = {
      ...defaultGetOptions,
      method: "GET",
    };
    this.defaultPostOptions = {
      ...defaultPostOptions,
      method: "POST",
    };
    this.defaultPutOptions = {
      ...defaultPutOptions,
      method: "PUT",
    };
    this.defaultDeleteOptions = {
      ...defaultDeleteOptions,
      method: "DELETE",
    };

    if (onResponse) {
      this.onResponse = onResponse;
    }
  }

  /**
   * Make a `POST` request to the API and cache the result with a key made from
   * the method type, the path, and the request body.
   * @param path the path to append to the {@linkcode baseURL}.
   * @param requestOptions options for the request. This will be merged with
   *   and overwrite {@linkcode defaultRequestOptions} and
   *   {@linkcode defaultPostOptions}.
   * @returns a promise that resolves to the response data processed by
   *   {@linkcode onResponse}.
   */
  post<T>(path: string, options: RequestInit): Promise<T> {
    return this.cached(
      ["post", path, options.body],
      () =>
        fetch(`${this.baseURL}${path}`, {
          ...this.defaultRequestOptions,
          ...this.defaultPostOptions,
          ...options,
        }).then(this.onResponse) as Promise<T>,
    );
  }

  /**
   * Make a `GET` request to the API and cache the result with a key made from
   * the method type and the path.
   * @param path the path to append to the {@linkcode baseURL}.
   * @param requestOptions options for the request. This will be merged with
   *   and overwrite {@linkcode defaultRequestOptions} and
   *   {@linkcode defaultGetOptions}.
   * @returns a promise that resolves to the response data processed by
   *   {@linkcode onResponse}.
   */
  get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.cached(
      ["get", path],
      () =>
        fetch(`${this.baseURL}${path}`, {
          ...this.defaultRequestOptions,
          ...this.defaultGetOptions,
          ...options,
        }).then(this.onResponse) as Promise<T>,
    );
  }

  /**
   * Make a `PUT` request to the API and cache the result with a key made from
   * the method type, the path, and the request body.
   * @param path the path to append to the {@linkcode baseURL}.
   * @param requestOptions options for the request. This will be merged with
   *   and overwrite {@linkcode defaultRequestOptions} and
   *   {@linkcode defaultPutOptions}.
   * @returns a promise that resolves to the response data processed by
   *   {@linkcode onResponse}.
   */
  put<T>(path: string, options: RequestInit): Promise<T> {
    return this.cached(
      ["put", path, options.body],
      () =>
        fetch(`${this.baseURL}${path}`, {
          ...this.defaultRequestOptions,
          ...this.defaultPutOptions,
          ...options,
        }).then(this.onResponse) as Promise<T>,
    );
  }

  /**
   * Make a `DELETE` request to the API.
   * @param path the path to append to the {@linkcode baseURL}.
   * @param requestOptions options for the request. This will be merged with
   *   and overwrite {@linkcode defaultDeleteOptions} and
   *   {@linkcode defaultPutOptions}.
   * @returns a promise that resolves to the response data processed by
   *   {@linkcode onResponse}.
   */
  delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return fetch(`${this.baseURL}${path}`, {
      ...this.defaultRequestOptions,
      ...this.defaultDeleteOptions,
      ...options,
    }).then(this.onResponse) as Promise<T>;
  }
}
