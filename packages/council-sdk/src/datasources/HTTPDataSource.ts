import { CachedDataSource } from "./CachedDataSource";

export class HTTPDataSource<T = any> extends CachedDataSource {
  baseURL: string;
  defaultRequestOptions: RequestInit;
  defaultGetOptions: RequestInit;
  defaultPostOptions: RequestInit;
  defaultPutOptions: RequestInit;
  defaultDeleteOptions: RequestInit;
  onResponse: (res: Response) => Promise<T>;

  constructor(
    baseURL: string,
    options?: {
      defaultRequestOptions?: RequestInit;
      defaultGetOptions?: RequestInit;
      defaultPostOptions?: RequestInit;
      defaultPutOptions?: RequestInit;
      defaultDeleteOptions?: RequestInit;
      onResponse?: (res: Response) => Promise<T>;
    },
  ) {
    super();
    this.baseURL = baseURL;
    this.defaultRequestOptions = options?.defaultRequestOptions ?? {};
    this.defaultGetOptions = options?.defaultGetOptions ?? { method: "GET" };
    this.defaultPostOptions = options?.defaultPostOptions ?? { method: "POST" };
    this.defaultPutOptions = options?.defaultPutOptions ?? { method: "PUT" };
    this.defaultDeleteOptions = options?.defaultDeleteOptions ?? {
      method: "DELETE",
    };
    this.onResponse = options?.onResponse ?? ((res: Response) => res.json());
  }

  // Create
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

  // Read
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

  // Update
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

  // Delete
  delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.cached(
      ["delete", path],
      () =>
        fetch(`${this.baseURL}${path}`, {
          ...this.defaultRequestOptions,
          ...this.defaultDeleteOptions,
          ...options,
        }).then(this.onResponse) as Promise<T>,
    );
  }
}
